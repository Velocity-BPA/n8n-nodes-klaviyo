/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IDataObject, IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { klaviyoApiRequest, klaviyoApiRequestAllItems } from '../../transport/klaviyoApi';
import { buildJsonApiBody, cleanObject } from '../../utils/helpers';

export async function getLists(
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
    query['fields[list]'] = (options.fields as string[]).join(',');
  }

  query['page[size]'] = returnAll ? 100 : Math.min(limit, 100);

  let lists: IDataObject[];

  if (returnAll) {
    lists = await klaviyoApiRequestAllItems.call(this, this, 'GET', '/api/lists/', undefined, query);
  } else {
    lists = await klaviyoApiRequestAllItems.call(this, this, 'GET', '/api/lists/', undefined, query, limit);
  }

  return lists.map((list) => ({ json: list }));
}

export async function getList(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const listId = this.getNodeParameter('listId', index) as string;
  const options = this.getNodeParameter('options', index, {}) as IDataObject;

  const query: IDataObject = {};

  if (options.fields) {
    query['fields[list]'] = (options.fields as string[]).join(',');
  }

  if (options.include) {
    query.include = (options.include as string[]).join(',');
  }

  const response = await klaviyoApiRequest.call(this, this, 'GET', `/api/lists/${listId}/`, undefined, query);
  return [{ json: response as IDataObject }];
}

export async function createList(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const name = this.getNodeParameter('name', index) as string;
  const additionalFields = this.getNodeParameter('additionalFields', index, {}) as IDataObject;

  const attributes: IDataObject = cleanObject({
    name,
    opt_in_process: additionalFields.optInProcess,
  });

  const body = buildJsonApiBody('list', attributes);
  const response = await klaviyoApiRequest.call(this, this, 'POST', '/api/lists/', body);
  return [{ json: response as IDataObject }];
}

export async function updateList(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const listId = this.getNodeParameter('listId', index) as string;
  const updateFields = this.getNodeParameter('updateFields', index, {}) as IDataObject;

  const attributes: IDataObject = cleanObject({
    name: updateFields.name,
    opt_in_process: updateFields.optInProcess,
  });

  const body = buildJsonApiBody('list', attributes, listId);
  const response = await klaviyoApiRequest.call(this, this, 'PATCH', `/api/lists/${listId}/`, body);
  return [{ json: response as IDataObject }];
}

export async function deleteList(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const listId = this.getNodeParameter('listId', index) as string;
  await klaviyoApiRequest.call(this, this, 'DELETE', `/api/lists/${listId}/`);
  return [{ json: { success: true, listId } }];
}

export async function getListProfiles(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const listId = this.getNodeParameter('listId', index) as string;
  const returnAll = this.getNodeParameter('returnAll', index) as boolean;
  const limit = this.getNodeParameter('limit', index, 100) as number;
  const options = this.getNodeParameter('options', index, {}) as IDataObject;

  const query: IDataObject = {};

  if (options.filter) {
    query.filter = options.filter;
  }

  if (options.fields) {
    query['fields[profile]'] = (options.fields as string[]).join(',');
  }

  query['page[size]'] = returnAll ? 100 : Math.min(limit, 100);

  let profiles: IDataObject[];

  if (returnAll) {
    profiles = await klaviyoApiRequestAllItems.call(this, this, 'GET', `/api/lists/${listId}/profiles/`, undefined, query);
  } else {
    profiles = await klaviyoApiRequestAllItems.call(this, this, 'GET', `/api/lists/${listId}/profiles/`, undefined, query, limit);
  }

  return profiles.map((profile) => ({ json: profile }));
}

export async function addProfilesToList(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const listId = this.getNodeParameter('listId', index) as string;
  const profileIds = this.getNodeParameter('profileIds', index) as string[];

  const body = {
    data: profileIds.map((id) => ({ type: 'profile', id })),
  };

  await klaviyoApiRequest.call(this, this, 'POST', `/api/lists/${listId}/relationships/profiles/`, body);
  return [{ json: { success: true, listId, profilesAdded: profileIds.length } }];
}

export async function removeProfilesFromList(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const listId = this.getNodeParameter('listId', index) as string;
  const profileIds = this.getNodeParameter('profileIds', index) as string[];

  const body = {
    data: profileIds.map((id) => ({ type: 'profile', id })),
  };

  await klaviyoApiRequest.call(this, this, 'DELETE', `/api/lists/${listId}/relationships/profiles/`, body);
  return [{ json: { success: true, listId, profilesRemoved: profileIds.length } }];
}

export async function getListRelationships(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const listId = this.getNodeParameter('listId', index) as string;
  const relationshipType = this.getNodeParameter('relationshipType', index, 'profiles') as string;

  const response = await klaviyoApiRequest.call(this, this, 'GET', `/api/lists/${listId}/relationships/${relationshipType}/`);
  return [{ json: response as IDataObject }];
}

export async function getListTags(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const listId = this.getNodeParameter('listId', index) as string;

  const response = await klaviyoApiRequest.call(this, this, 'GET', `/api/lists/${listId}/tags/`);
  return [{ json: response as IDataObject }];
}
