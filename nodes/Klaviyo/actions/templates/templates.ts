/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IDataObject, IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { klaviyoApiRequest, klaviyoApiRequestAllItems } from '../../transport/klaviyoApi';
import { buildJsonApiBody, cleanObject } from '../../utils/helpers';

export async function getTemplates(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const returnAll = this.getNodeParameter('returnAll', index) as boolean;
  const limit = this.getNodeParameter('limit', index, 100) as number;
  const filters = this.getNodeParameter('filters', index, {}) as IDataObject;
  const options = this.getNodeParameter('options', index, {}) as IDataObject;

  const query: IDataObject = {};

  const filterParts: string[] = [];
  if (filters.editorType) {
    filterParts.push(`equals(editor_type,"${filters.editorType}")`);
  }
  if (filterParts.length > 0) {
    query.filter = filterParts.join(',');
  }

  if (options.fields) {
    query['fields[template]'] = (options.fields as string[]).join(',');
  }

  if (options.sort) {
    query.sort = options.sort;
  }

  query['page[size]'] = returnAll ? 100 : Math.min(limit, 100);

  let templates: IDataObject[];

  if (returnAll) {
    templates = await klaviyoApiRequestAllItems.call(this, this, 'GET', '/api/templates/', undefined, query);
  } else {
    templates = await klaviyoApiRequestAllItems.call(this, this, 'GET', '/api/templates/', undefined, query, limit);
  }

  return templates.map((template) => ({ json: template }));
}

export async function getTemplate(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const templateId = this.getNodeParameter('templateId', index) as string;
  const options = this.getNodeParameter('options', index, {}) as IDataObject;

  const query: IDataObject = {};

  if (options.fields) {
    query['fields[template]'] = (options.fields as string[]).join(',');
  }

  const response = await klaviyoApiRequest.call(this, this, 'GET', `/api/templates/${templateId}/`, undefined, query);
  return [{ json: response as IDataObject }];
}

export async function createTemplate(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const name = this.getNodeParameter('name', index) as string;
  const editorType = this.getNodeParameter('editorType', index, 'CODE') as string;
  const additionalFields = this.getNodeParameter('additionalFields', index, {}) as IDataObject;

  const attributes: IDataObject = cleanObject({
    name,
    editor_type: editorType,
    html: additionalFields.html,
    text: additionalFields.text,
  });

  const body = buildJsonApiBody('template', attributes);
  const response = await klaviyoApiRequest.call(this, this, 'POST', '/api/templates/', body);
  return [{ json: response as IDataObject }];
}

export async function updateTemplate(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const templateId = this.getNodeParameter('templateId', index) as string;
  const updateFields = this.getNodeParameter('updateFields', index, {}) as IDataObject;

  const attributes: IDataObject = cleanObject({
    name: updateFields.name,
    html: updateFields.html,
    text: updateFields.text,
  });

  const body = buildJsonApiBody('template', attributes, templateId);
  const response = await klaviyoApiRequest.call(this, this, 'PATCH', `/api/templates/${templateId}/`, body);
  return [{ json: response as IDataObject }];
}

export async function deleteTemplate(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const templateId = this.getNodeParameter('templateId', index) as string;
  await klaviyoApiRequest.call(this, this, 'DELETE', `/api/templates/${templateId}/`);
  return [{ json: { success: true, templateId } }];
}

export async function cloneTemplate(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const templateId = this.getNodeParameter('templateId', index) as string;
  const newName = this.getNodeParameter('newName', index) as string;

  const body = {
    data: {
      type: 'template',
      id: templateId,
      attributes: {
        name: newName,
      },
    },
  };

  const response = await klaviyoApiRequest.call(this, this, 'POST', '/api/template-clone/', body);
  return [{ json: response as IDataObject }];
}

export async function renderTemplate(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const templateId = this.getNodeParameter('templateId', index) as string;
  const context = this.getNodeParameter('context', index, {}) as IDataObject;

  const body = {
    data: {
      type: 'template-render',
      attributes: {
        id: templateId,
        context,
        return_fields: ['html', 'text'],
      },
    },
  };

  const response = await klaviyoApiRequest.call(this, this, 'POST', '/api/template-render/', body);
  return [{ json: response as IDataObject }];
}
