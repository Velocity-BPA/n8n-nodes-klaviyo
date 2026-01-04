/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IDataObject, IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { klaviyoApiRequest, klaviyoApiRequestAllItems } from '../../transport/klaviyoApi';
import { buildJsonApiBody, cleanObject } from '../../utils/helpers';

export async function getFlows(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const returnAll = this.getNodeParameter('returnAll', index) as boolean;
  const limit = this.getNodeParameter('limit', index, 100) as number;
  const filters = this.getNodeParameter('filters', index, {}) as IDataObject;
  const options = this.getNodeParameter('options', index, {}) as IDataObject;

  const query: IDataObject = {};

  const filterParts: string[] = [];
  if (filters.status) {
    filterParts.push(`equals(status,"${filters.status}")`);
  }
  if (filters.archived !== undefined) {
    filterParts.push(`equals(archived,${filters.archived})`);
  }
  if (filterParts.length > 0) {
    query.filter = filterParts.join(',');
  }

  if (options.fields) {
    query['fields[flow]'] = (options.fields as string[]).join(',');
  }

  if (options.include) {
    query.include = (options.include as string[]).join(',');
  }

  if (options.sort) {
    query.sort = options.sort;
  }

  query['page[size]'] = returnAll ? 100 : Math.min(limit, 100);

  let flows: IDataObject[];

  if (returnAll) {
    flows = await klaviyoApiRequestAllItems.call(this, this, 'GET', '/api/flows/', undefined, query);
  } else {
    flows = await klaviyoApiRequestAllItems.call(this, this, 'GET', '/api/flows/', undefined, query, limit);
  }

  return flows.map((flow) => ({ json: flow }));
}

export async function getFlow(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const flowId = this.getNodeParameter('flowId', index) as string;
  const options = this.getNodeParameter('options', index, {}) as IDataObject;

  const query: IDataObject = {};

  if (options.fields) {
    query['fields[flow]'] = (options.fields as string[]).join(',');
  }

  if (options.include) {
    query.include = (options.include as string[]).join(',');
  }

  const response = await klaviyoApiRequest.call(this, this, 'GET', `/api/flows/${flowId}/`, undefined, query);
  return [{ json: response as IDataObject }];
}

export async function updateFlowStatus(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const flowId = this.getNodeParameter('flowId', index) as string;
  const status = this.getNodeParameter('status', index) as string;

  const attributes: IDataObject = {
    status,
  };

  const body = buildJsonApiBody('flow', attributes, flowId);
  const response = await klaviyoApiRequest.call(this, this, 'PATCH', `/api/flows/${flowId}/`, body);
  return [{ json: response as IDataObject }];
}

export async function getFlowActions(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const flowId = this.getNodeParameter('flowId', index) as string;
  const returnAll = this.getNodeParameter('returnAll', index) as boolean;
  const limit = this.getNodeParameter('limit', index, 100) as number;
  const options = this.getNodeParameter('options', index, {}) as IDataObject;

  const query: IDataObject = {};

  if (options.filter) {
    query.filter = options.filter;
  }

  if (options.fields) {
    query['fields[flow-action]'] = (options.fields as string[]).join(',');
  }

  query['page[size]'] = returnAll ? 100 : Math.min(limit, 100);

  let actions: IDataObject[];

  if (returnAll) {
    actions = await klaviyoApiRequestAllItems.call(this, this, 'GET', `/api/flows/${flowId}/flow-actions/`, undefined, query);
  } else {
    actions = await klaviyoApiRequestAllItems.call(this, this, 'GET', `/api/flows/${flowId}/flow-actions/`, undefined, query, limit);
  }

  return actions.map((action) => ({ json: action }));
}

export async function getFlowAction(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const actionId = this.getNodeParameter('actionId', index) as string;
  const options = this.getNodeParameter('options', index, {}) as IDataObject;

  const query: IDataObject = {};

  if (options.fields) {
    query['fields[flow-action]'] = (options.fields as string[]).join(',');
  }

  if (options.include) {
    query.include = (options.include as string[]).join(',');
  }

  const response = await klaviyoApiRequest.call(this, this, 'GET', `/api/flow-actions/${actionId}/`, undefined, query);
  return [{ json: response as IDataObject }];
}

export async function updateFlowAction(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const actionId = this.getNodeParameter('actionId', index) as string;
  const updateFields = this.getNodeParameter('updateFields', index, {}) as IDataObject;

  const attributes: IDataObject = cleanObject({
    status: updateFields.status,
    settings: updateFields.settings,
  });

  const body = buildJsonApiBody('flow-action', attributes, actionId);
  const response = await klaviyoApiRequest.call(this, this, 'PATCH', `/api/flow-actions/${actionId}/`, body);
  return [{ json: response as IDataObject }];
}

export async function getFlowMessages(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const flowId = this.getNodeParameter('flowId', index) as string;
  const returnAll = this.getNodeParameter('returnAll', index) as boolean;
  const limit = this.getNodeParameter('limit', index, 100) as number;
  const options = this.getNodeParameter('options', index, {}) as IDataObject;

  const query: IDataObject = {};

  if (options.fields) {
    query['fields[flow-message]'] = (options.fields as string[]).join(',');
  }

  query['page[size]'] = returnAll ? 100 : Math.min(limit, 100);

  let messages: IDataObject[];

  if (returnAll) {
    messages = await klaviyoApiRequestAllItems.call(this, this, 'GET', `/api/flows/${flowId}/flow-messages/`, undefined, query);
  } else {
    messages = await klaviyoApiRequestAllItems.call(this, this, 'GET', `/api/flows/${flowId}/flow-messages/`, undefined, query, limit);
  }

  return messages.map((message) => ({ json: message }));
}

export async function getFlowMessage(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const messageId = this.getNodeParameter('messageId', index) as string;
  const options = this.getNodeParameter('options', index, {}) as IDataObject;

  const query: IDataObject = {};

  if (options.fields) {
    query['fields[flow-message]'] = (options.fields as string[]).join(',');
  }

  if (options.include) {
    query.include = (options.include as string[]).join(',');
  }

  const response = await klaviyoApiRequest.call(this, this, 'GET', `/api/flow-messages/${messageId}/`, undefined, query);
  return [{ json: response as IDataObject }];
}

export async function updateFlowMessage(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const messageId = this.getNodeParameter('messageId', index) as string;
  const updateFields = this.getNodeParameter('updateFields', index, {}) as IDataObject;

  const attributes: IDataObject = cleanObject({
    name: updateFields.name,
    channel: updateFields.channel,
    content: updateFields.content ? {
      subject: (updateFields.content as IDataObject).subject,
      preview_text: (updateFields.content as IDataObject).previewText,
      from_email: (updateFields.content as IDataObject).fromEmail,
      from_label: (updateFields.content as IDataObject).fromLabel,
      reply_to_email: (updateFields.content as IDataObject).replyToEmail,
      cc_email: (updateFields.content as IDataObject).ccEmail,
      bcc_email: (updateFields.content as IDataObject).bccEmail,
    } : undefined,
  });

  const body = buildJsonApiBody('flow-message', attributes, messageId);
  const response = await klaviyoApiRequest.call(this, this, 'PATCH', `/api/flow-messages/${messageId}/`, body);
  return [{ json: response as IDataObject }];
}
