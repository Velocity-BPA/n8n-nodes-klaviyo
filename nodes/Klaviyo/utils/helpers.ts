/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import { NodeApiError } from 'n8n-workflow';
import type { JsonApiDocument, JsonApiError, JsonApiResource } from '../types';

/**
 * Build a JSON:API compliant resource object
 */
export function buildJsonApiResource(
  type: string,
  attributes: IDataObject,
  id?: string,
  relationships?: IDataObject,
): JsonApiResource {
  const resource: JsonApiResource = {
    type,
    attributes,
  };

  if (id) {
    resource.id = id;
  }

  if (relationships && Object.keys(relationships).length > 0) {
    resource.relationships = relationships;
  }

  return resource;
}

/**
 * Build a JSON:API compliant request body
 */
export function buildJsonApiBody(
  type: string,
  attributes: IDataObject,
  id?: string,
  relationships?: IDataObject,
): { data: JsonApiResource } {
  return {
    data: buildJsonApiResource(type, attributes, id, relationships),
  };
}

/**
 * Build a JSON:API bulk request body
 */
export function buildJsonApiBulkBody(
  type: string,
  items: IDataObject[],
): { data: JsonApiResource[] } {
  return {
    data: items.map((item) => ({
      type,
      attributes: item,
    })),
  };
}

/**
 * Build filter query parameter from filter object
 * Klaviyo uses specific filter syntax: equals(field,value), contains(field,value), etc.
 */
export function buildFilterQuery(filters: IDataObject): string {
  const filterParts: string[] = [];

  for (const [key, value] of Object.entries(filters)) {
    if (value !== undefined && value !== null && value !== '') {
      if (typeof value === 'string') {
        filterParts.push(`equals(${key},"${value}")`);
      } else if (typeof value === 'number' || typeof value === 'boolean') {
        filterParts.push(`equals(${key},${value})`);
      } else if (Array.isArray(value)) {
        filterParts.push(`any(${key},["${value.join('","')}"])`);
      }
    }
  }

  return filterParts.join(',');
}

/**
 * Build sparse fieldset query parameter
 */
export function buildFieldsQuery(resourceType: string, fields: string[]): string {
  return `fields[${resourceType}]=${fields.join(',')}`;
}

/**
 * Build include relationships query parameter
 */
export function buildIncludeQuery(includes: string[]): string {
  return includes.join(',');
}

/**
 * Parse JSON:API response and extract data
 */
export function parseJsonApiResponse(response: JsonApiDocument): IDataObject | IDataObject[] {
  if (Array.isArray(response.data)) {
    return response.data.map((item) => ({
      id: item.id,
      type: item.type,
      ...item.attributes,
      ...(item.relationships ? { relationships: item.relationships } : {}),
    }));
  }

  return {
    id: response.data.id,
    type: response.data.type,
    ...response.data.attributes,
    ...(response.data.relationships ? { relationships: response.data.relationships } : {}),
  };
}

/**
 * Parse JSON:API response with included resources
 */
export function parseJsonApiResponseWithIncludes(
  response: JsonApiDocument,
): { data: IDataObject | IDataObject[]; included: IDataObject[] } {
  const data = parseJsonApiResponse(response);
  const included = response.included
    ? response.included.map((item) => ({
        id: item.id,
        type: item.type,
        ...item.attributes,
      }))
    : [];

  return { data, included };
}

/**
 * Extract pagination cursor from response
 */
export function extractNextCursor(response: JsonApiDocument): string | undefined {
  if (response.links?.next) {
    const url = new URL(response.links.next);
    return url.searchParams.get('page[cursor]') || undefined;
  }
  return undefined;
}

/**
 * Format Klaviyo API error message
 */
export function formatKlaviyoError(errors: JsonApiError[]): string {
  return errors
    .map((error) => {
      let message = error.title || 'Unknown error';
      if (error.detail) {
        message += `: ${error.detail}`;
      }
      if (error.source?.pointer) {
        message += ` (at ${error.source.pointer})`;
      }
      if (error.code) {
        message += ` [${error.code}]`;
      }
      return message;
    })
    .join('; ');
}

/**
 * Build query string from options
 */
export function buildQueryString(options: IDataObject): string {
  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(options)) {
    if (value !== undefined && value !== null && value !== '') {
      if (typeof value === 'object' && !Array.isArray(value)) {
        // Handle nested objects like fields[profile]
        for (const [nestedKey, nestedValue] of Object.entries(value as IDataObject)) {
          params.append(`${key}[${nestedKey}]`, String(nestedValue));
        }
      } else if (Array.isArray(value)) {
        params.append(key, value.join(','));
      } else {
        params.append(key, String(value));
      }
    }
  }

  return params.toString();
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate phone number format (E.164)
 */
export function isValidPhoneNumber(phone: string): boolean {
  const phoneRegex = /^\+[1-9]\d{1,14}$/;
  return phoneRegex.test(phone);
}

/**
 * Clean empty values from object
 */
export function cleanObject(obj: IDataObject): IDataObject {
  const cleaned: IDataObject = {};

  for (const [key, value] of Object.entries(obj)) {
    if (value !== undefined && value !== null && value !== '') {
      if (typeof value === 'object' && !Array.isArray(value)) {
        const cleanedNested = cleanObject(value as IDataObject);
        if (Object.keys(cleanedNested).length > 0) {
          cleaned[key] = cleanedNested;
        }
      } else {
        cleaned[key] = value;
      }
    }
  }

  return cleaned;
}

/**
 * Convert date string to ISO format
 */
export function toISODate(dateString: string): string {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    throw new Error(`Invalid date format: ${dateString}`);
  }
  return date.toISOString();
}

/**
 * Sleep utility for rate limiting
 */
export async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Handle rate limiting with exponential backoff
 */
export async function handleRateLimit(
  context: IExecuteFunctions,
  retryAfter: number = 1,
  maxRetries: number = 3,
  currentRetry: number = 0,
): Promise<boolean> {
  if (currentRetry >= maxRetries) {
    return false;
  }

  const waitTime = retryAfter * 1000 * Math.pow(2, currentRetry);
  context.logger.warn(`Rate limited. Waiting ${waitTime}ms before retry ${currentRetry + 1}/${maxRetries}`);
  await sleep(waitTime);
  return true;
}

/**
 * Build relationship data object for JSON:API
 */
export function buildRelationshipData(
  type: string,
  ids: string[],
): { data: Array<{ type: string; id: string }> } {
  return {
    data: ids.map((id) => ({ type, id })),
  };
}

/**
 * Extract IDs from relationship response
 */
export function extractRelationshipIds(
  relationships: IDataObject,
  relationshipName: string,
): string[] {
  const relationship = relationships[relationshipName] as IDataObject | undefined;
  if (!relationship?.data) {
    return [];
  }

  const data = relationship.data;
  if (Array.isArray(data)) {
    return (data as IDataObject[]).map((item) => String(item.id));
  }

  return [String((data as IDataObject).id)];
}

/**
 * Check if response indicates a bulk job
 */
export function isBulkJobResponse(response: JsonApiDocument): boolean {
  if (Array.isArray(response.data)) {
    return false;
  }
  return response.data.type?.includes('job') || false;
}

/**
 * Format bulk job status
 */
export function formatBulkJobStatus(job: IDataObject): IDataObject {
  return {
    jobId: job.id,
    status: job.status,
    totalCount: job.total_count,
    completedCount: job.completed_count,
    failedCount: job.failed_count,
    createdAt: job.created_at,
    completedAt: job.completed_at,
    errors: job.errors,
  };
}

/**
 * Validate required fields
 */
export function validateRequiredFields(data: IDataObject, requiredFields: string[]): void {
  const missingFields = requiredFields.filter(
    (field) => data[field] === undefined || data[field] === null || data[field] === '',
  );

  if (missingFields.length > 0) {
    throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
  }
}

/**
 * Create error with context
 */
export function createApiError(
  context: IExecuteFunctions,
  error: unknown,
  itemIndex: number = 0,
): NodeApiError {
  if (error instanceof NodeApiError) {
    return error;
  }

  const errorMessage = error instanceof Error ? error.message : String(error);
  return new NodeApiError(context.getNode(), { message: errorMessage }, { itemIndex });
}
