/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IDataObject, IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { klaviyoApiRequest, klaviyoApiRequestAllItems } from '../../transport/klaviyoApi';
import { buildJsonApiBody, cleanObject } from '../../utils/helpers';

export async function getSegments(
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
    query['fields[segment]'] = (options.fields as string[]).join(',');
  }

  query['page[size]'] = returnAll ? 100 : Math.min(limit, 100);

  let segments: IDataObject[];

  if (returnAll) {
    segments = await klaviyoApiRequestAllItems.call(this, this, 'GET', '/api/segments/', undefined, query);
  } else {
    segments = await klaviyoApiRequestAllItems.call(this, this, 'GET', '/api/segments/', undefined, query, limit);
  }

  return segments.map((segment) => ({ json: segment }));
}

export async function getSegment(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const segmentId = this.getNodeParameter('segmentId', index) as string;
  const options = this.getNodeParameter('options', index, {}) as IDataObject;

  const query: IDataObject = {};

  if (options.fields) {
    query['fields[segment]'] = (options.fields as string[]).join(',');
  }

  if (options.include) {
    query.include = (options.include as string[]).join(',');
  }

  const response = await klaviyoApiRequest.call(this, this, 'GET', `/api/segments/${segmentId}/`, undefined, query);
  return [{ json: response as IDataObject }];
}

export async function createSegment(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const name = this.getNodeParameter('name', index) as string;
  const definition = this.getNodeParameter('definition', index, {}) as IDataObject;
  const additionalFields = this.getNodeParameter('additionalFields', index, {}) as IDataObject;

  const attributes: IDataObject = cleanObject({
    name,
    definition: Object.keys(definition).length > 0 ? definition : undefined,
    is_starred: additionalFields.isStarred,
  });

  const body = buildJsonApiBody('segment', attributes);
  const response = await klaviyoApiRequest.call(this, this, 'POST', '/api/segments/', body);
  return [{ json: response as IDataObject }];
}

export async function updateSegment(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const segmentId = this.getNodeParameter('segmentId', index) as string;
  const updateFields = this.getNodeParameter('updateFields', index, {}) as IDataObject;

  const attributes: IDataObject = cleanObject({
    name: updateFields.name,
    definition: updateFields.definition,
    is_starred: updateFields.isStarred,
  });

  const body = buildJsonApiBody('segment', attributes, segmentId);
  const response = await klaviyoApiRequest.call(this, this, 'PATCH', `/api/segments/${segmentId}/`, body);
  return [{ json: response as IDataObject }];
}

export async function deleteSegment(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const segmentId = this.getNodeParameter('segmentId', index) as string;
  await klaviyoApiRequest.call(this, this, 'DELETE', `/api/segments/${segmentId}/`);
  return [{ json: { success: true, segmentId } }];
}

export async function getSegmentProfiles(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const segmentId = this.getNodeParameter('segmentId', index) as string;
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
    profiles = await klaviyoApiRequestAllItems.call(this, this, 'GET', `/api/segments/${segmentId}/profiles/`, undefined, query);
  } else {
    profiles = await klaviyoApiRequestAllItems.call(this, this, 'GET', `/api/segments/${segmentId}/profiles/`, undefined, query, limit);
  }

  return profiles.map((profile) => ({ json: profile }));
}

export async function getSegmentRelationships(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const segmentId = this.getNodeParameter('segmentId', index) as string;
  const relationshipType = this.getNodeParameter('relationshipType', index, 'profiles') as string;

  const response = await klaviyoApiRequest.call(this, this, 'GET', `/api/segments/${segmentId}/relationships/${relationshipType}/`);
  return [{ json: response as IDataObject }];
}
