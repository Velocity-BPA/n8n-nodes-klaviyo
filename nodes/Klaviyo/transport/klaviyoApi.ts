/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type {
  IDataObject,
  IExecuteFunctions,
  IHookFunctions,
  IHttpRequestMethods,
  IHttpRequestOptions,
  ILoadOptionsFunctions,
  IWebhookFunctions,
  JsonObject,
} from 'n8n-workflow';
import { NodeApiError } from 'n8n-workflow';
import type { JsonApiDocument, JsonApiErrorResponse } from '../types';
import { formatKlaviyoError, extractNextCursor, parseJsonApiResponse, sleep } from '../utils/helpers';

const KLAVIYO_API_BASE = 'https://a.klaviyo.com';
const MAX_RETRIES = 3;
const INITIAL_RETRY_DELAY = 1000;

type ContextType = IExecuteFunctions | ILoadOptionsFunctions | IHookFunctions | IWebhookFunctions;

/**
 * Emit runtime licensing notice (once per session)
 */
let licensingNoticeEmitted = false;

function emitLicensingNotice(context: ContextType): void {
  if (!licensingNoticeEmitted) {
    context.logger.warn(
      '[Velocity BPA Licensing Notice] This n8n node is licensed under the Business Source License 1.1 (BSL 1.1). ' +
      'Use of this node by for-profit organizations in production environments requires a commercial license from Velocity BPA. ' +
      'For licensing information, visit https://velobpa.com/licensing or contact licensing@velobpa.com.'
    );
    licensingNoticeEmitted = true;
  }
}

/**
 * Make an authenticated request to the Klaviyo API
 */
export async function klaviyoApiRequest(
  context: ContextType,
  method: IHttpRequestMethods,
  endpoint: string,
  body?: IDataObject,
  query?: IDataObject,
  retryCount: number = 0,
): Promise<JsonApiDocument | IDataObject> {
  emitLicensingNotice(context);

  const credentials = await context.getCredentials('klaviyoApi');
  const baseUrl = (credentials.baseUrl as string) || KLAVIYO_API_BASE;
  const apiRevision = (credentials.apiRevision as string) || '2024-10-15';

  const options: IHttpRequestOptions = {
    method,
    url: `${baseUrl}${endpoint}`,
    headers: {
      Authorization: `Klaviyo-API-Key ${credentials.privateApiKey}`,
      revision: apiRevision,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    json: true,
  };

  if (body && Object.keys(body).length > 0) {
    options.body = body;
  }

  if (query && Object.keys(query).length > 0) {
    options.qs = query;
  }

  try {
    const response = await context.helpers.httpRequest(options);
    return response as JsonApiDocument;
  } catch (error: unknown) {
    // Handle rate limiting
    if (isRateLimitError(error) && retryCount < MAX_RETRIES) {
      const retryAfter = getRetryAfter(error);
      const delay = retryAfter || INITIAL_RETRY_DELAY * Math.pow(2, retryCount);
      context.logger.warn(`Rate limited. Retrying in ${delay}ms (attempt ${retryCount + 1}/${MAX_RETRIES})`);
      await sleep(delay);
      return klaviyoApiRequest(context, method, endpoint, body, query, retryCount + 1);
    }

    // Handle JSON:API errors
    if (isJsonApiError(error)) {
      const errorResponse = getErrorResponseBody(error) as JsonApiErrorResponse;
      const errorMessage = formatKlaviyoError(errorResponse.errors);
      throw new NodeApiError(context.getNode(), { message: errorMessage } as JsonObject);
    }

    throw error;
  }
}

/**
 * Make a paginated request and return all results
 */
export async function klaviyoApiRequestAllItems(
  context: IExecuteFunctions,
  method: IHttpRequestMethods,
  endpoint: string,
  body?: IDataObject,
  query?: IDataObject,
  limit?: number,
): Promise<IDataObject[]> {
  const allItems: IDataObject[] = [];
  let cursor: string | undefined;
  const requestQuery = { ...query };

  do {
    if (cursor) {
      requestQuery['page[cursor]'] = cursor;
    }

    const response = (await klaviyoApiRequest(
      context,
      method,
      endpoint,
      body,
      requestQuery,
    )) as JsonApiDocument;

    const items = parseJsonApiResponse(response);
    if (Array.isArray(items)) {
      allItems.push(...items);
    } else {
      allItems.push(items);
    }

    cursor = extractNextCursor(response);

    // Check if we've reached the limit
    if (limit && allItems.length >= limit) {
      return allItems.slice(0, limit);
    }
  } while (cursor);

  return allItems;
}

/**
 * Make a request for a bulk operation job
 */
export async function klaviyoApiBulkRequest(
  context: IExecuteFunctions,
  method: IHttpRequestMethods,
  endpoint: string,
  body: IDataObject,
): Promise<IDataObject> {
  const response = (await klaviyoApiRequest(context, method, endpoint, body)) as JsonApiDocument;
  
  if (!Array.isArray(response.data)) {
    return {
      jobId: response.data.id,
      type: response.data.type,
      status: response.data.attributes?.status,
      ...response.data.attributes,
    };
  }

  return response as unknown as IDataObject;
}

/**
 * Poll for bulk job completion
 */
export async function pollBulkJobStatus(
  context: IExecuteFunctions,
  jobEndpoint: string,
  maxAttempts: number = 30,
  pollInterval: number = 2000,
): Promise<IDataObject> {
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const response = (await klaviyoApiRequest(
      context,
      'GET',
      jobEndpoint,
    )) as JsonApiDocument;

    if (!Array.isArray(response.data)) {
      const status = response.data.attributes?.status as string;
      
      if (status === 'complete' || status === 'completed') {
        return {
          jobId: response.data.id,
          status,
          ...response.data.attributes,
        };
      }

      if (status === 'failed' || status === 'cancelled') {
        throw new NodeApiError(context.getNode(), {
          message: `Bulk job ${status}: ${JSON.stringify(response.data.attributes?.errors || 'Unknown error')}`,
        } as JsonObject);
      }
    }

    await sleep(pollInterval);
  }

  throw new NodeApiError(context.getNode(), {
    message: 'Bulk job polling timeout exceeded',
  } as JsonObject);
}

/**
 * Check if error is a rate limit error
 */
function isRateLimitError(error: unknown): boolean {
  if (error && typeof error === 'object') {
    const statusCode = (error as { statusCode?: number }).statusCode;
    return statusCode === 429;
  }
  return false;
}

/**
 * Get retry-after value from error response
 */
function getRetryAfter(error: unknown): number | undefined {
  if (error && typeof error === 'object') {
    const headers = (error as { response?: { headers?: { 'retry-after'?: string } } }).response?.headers;
    if (headers?.['retry-after']) {
      return parseInt(headers['retry-after'], 10) * 1000;
    }
  }
  return undefined;
}

/**
 * Check if error response is a JSON:API error
 */
function isJsonApiError(error: unknown): boolean {
  const body = getErrorResponseBody(error);
  return body !== null && typeof body === 'object' && 'errors' in (body as object);
}

/**
 * Extract error response body
 */
function getErrorResponseBody(error: unknown): unknown {
  if (error && typeof error === 'object') {
    const response = (error as { response?: { body?: unknown } }).response;
    return response?.body;
  }
  return null;
}

/**
 * Upload file to Klaviyo (for images)
 */
export async function klaviyoApiUploadFile(
  context: IExecuteFunctions,
  _contextDuplicate: IExecuteFunctions, // Accept duplicate context for consistency with other functions
  endpoint: string,
  fileBuffer: Buffer,
  fileName: string,
  mimeType: string,
  metadata?: IDataObject,
): Promise<JsonApiDocument> {
  emitLicensingNotice(context);

  const credentials = await context.getCredentials('klaviyoApi');
  const baseUrl = (credentials.baseUrl as string) || KLAVIYO_API_BASE;
  const apiRevision = (credentials.apiRevision as string) || '2024-10-15';

  // Build multipart form data
  const formData: IDataObject = {
    file: {
      value: fileBuffer,
      options: {
        filename: fileName,
        contentType: mimeType,
      },
    },
  };

  // Add metadata if provided
  if (metadata) {
    if (metadata.name) {
      formData.name = metadata.name;
    }
    if (metadata.hidden !== undefined) {
      formData.hidden = metadata.hidden;
    }
  }

  const options: IHttpRequestOptions = {
    method: 'POST',
    url: `${baseUrl}${endpoint}`,
    headers: {
      Authorization: `Klaviyo-API-Key ${credentials.privateApiKey}`,
      revision: apiRevision,
      Accept: 'application/json',
    },
    body: formData,
    json: true,
  };

  try {
    const response = await context.helpers.httpRequest(options);
    return response as JsonApiDocument;
  } catch (error: unknown) {
    if (isJsonApiError(error)) {
      const errorResponse = getErrorResponseBody(error) as JsonApiErrorResponse;
      const errorMessage = formatKlaviyoError(errorResponse.errors);
      throw new NodeApiError(context.getNode(), { message: errorMessage } as JsonObject);
    }
    throw error;
  }
}
