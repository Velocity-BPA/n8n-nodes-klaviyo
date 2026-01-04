/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IDataObject, IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { klaviyoApiRequest, klaviyoApiRequestAllItems } from '../../transport/klaviyoApi';
import { buildJsonApiBody, cleanObject } from '../../utils/helpers';

export async function getWebhooks(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const returnAll = this.getNodeParameter('returnAll', index) as boolean;
  const limit = this.getNodeParameter('limit', index, 100) as number;
  const options = this.getNodeParameter('options', index, {}) as IDataObject;

  const query: IDataObject = {};

  if (options.filter) {
    query.filter = options.filter;
  }

  if (options.fields) {
    query['fields[webhook]'] = (options.fields as string[]).join(',');
  }

  query['page[size]'] = returnAll ? 100 : Math.min(limit, 100);

  let webhooks: IDataObject[];

  if (returnAll) {
    webhooks = await klaviyoApiRequestAllItems.call(this, this, 'GET', '/api/webhooks/', undefined, query);
  } else {
    webhooks = await klaviyoApiRequestAllItems.call(this, this, 'GET', '/api/webhooks/', undefined, query, limit);
  }

  return webhooks.map((webhook) => ({ json: webhook }));
}

export async function getWebhook(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const webhookId = this.getNodeParameter('webhookId', index) as string;
  const options = this.getNodeParameter('options', index, {}) as IDataObject;

  const query: IDataObject = {};

  if (options.fields) {
    query['fields[webhook]'] = (options.fields as string[]).join(',');
  }

  if (options.include) {
    query.include = (options.include as string[]).join(',');
  }

  const response = await klaviyoApiRequest.call(this, this, 'GET', `/api/webhooks/${webhookId}/`, undefined, query);
  return [{ json: response as IDataObject }];
}

export async function createWebhook(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const name = this.getNodeParameter('name', index) as string;
  const endpointUrl = this.getNodeParameter('endpointUrl', index) as string;
  const topics = this.getNodeParameter('topics', index) as string[];
  const additionalFields = this.getNodeParameter('additionalFields', index, {}) as IDataObject;

  const attributes: IDataObject = cleanObject({
    name,
    endpoint_url: endpointUrl,
    enabled_delivery_topics: topics,
    secret_key: additionalFields.secretKey,
    description: additionalFields.description,
  });

  const body = buildJsonApiBody('webhook', attributes);
  const response = await klaviyoApiRequest.call(this, this, 'POST', '/api/webhooks/', body);
  return [{ json: response as IDataObject }];
}

export async function updateWebhook(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const webhookId = this.getNodeParameter('webhookId', index) as string;
  const updateFields = this.getNodeParameter('updateFields', index, {}) as IDataObject;

  const attributes: IDataObject = cleanObject({
    name: updateFields.name,
    endpoint_url: updateFields.endpointUrl,
    enabled_delivery_topics: updateFields.topics,
    description: updateFields.description,
  });

  const body = buildJsonApiBody('webhook', attributes, webhookId);
  const response = await klaviyoApiRequest.call(this, this, 'PATCH', `/api/webhooks/${webhookId}/`, body);
  return [{ json: response as IDataObject }];
}

export async function deleteWebhook(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const webhookId = this.getNodeParameter('webhookId', index) as string;
  await klaviyoApiRequest.call(this, this, 'DELETE', `/api/webhooks/${webhookId}/`);
  return [{ json: { success: true, webhookId } }];
}

export async function getWebhookTopics(
  this: IExecuteFunctions,
  _index: number,
): Promise<INodeExecutionData[]> {
  const response = await klaviyoApiRequest.call(this, this, 'GET', '/api/webhook-topics/');
  return [{ json: response as IDataObject }];
}
