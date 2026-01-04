/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IDataObject, IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { klaviyoApiRequest, klaviyoApiRequestAllItems } from '../../transport/klaviyoApi';
import { buildJsonApiBody, cleanObject } from '../../utils/helpers';

export async function getTags(
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
    query['fields[tag]'] = (options.fields as string[]).join(',');
  }

  if (options.sort) {
    query.sort = options.sort;
  }

  query['page[size]'] = returnAll ? 100 : Math.min(limit, 100);

  let tags: IDataObject[];

  if (returnAll) {
    tags = await klaviyoApiRequestAllItems.call(this, this, 'GET', '/api/tags/', undefined, query);
  } else {
    tags = await klaviyoApiRequestAllItems.call(this, this, 'GET', '/api/tags/', undefined, query, limit);
  }

  return tags.map((tag) => ({ json: tag }));
}

export async function getTag(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const tagId = this.getNodeParameter('tagId', index) as string;
  const options = this.getNodeParameter('options', index, {}) as IDataObject;

  const query: IDataObject = {};

  if (options.fields) {
    query['fields[tag]'] = (options.fields as string[]).join(',');
  }

  const response = await klaviyoApiRequest.call(this, this, 'GET', `/api/tags/${tagId}/`, undefined, query);
  return [{ json: response as IDataObject }];
}

export async function createTag(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const name = this.getNodeParameter('name', index) as string;
  const tagGroupId = this.getNodeParameter('tagGroupId', index, '') as string;

  const attributes: IDataObject = {
    name,
  };

  const body: IDataObject = {
    data: {
      type: 'tag',
      attributes,
    },
  };

  if (tagGroupId) {
    (body.data as IDataObject).relationships = {
      'tag-group': {
        data: {
          type: 'tag-group',
          id: tagGroupId,
        },
      },
    };
  }

  const response = await klaviyoApiRequest.call(this, this, 'POST', '/api/tags/', body);
  return [{ json: response as IDataObject }];
}

export async function updateTag(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const tagId = this.getNodeParameter('tagId', index) as string;
  const updateFields = this.getNodeParameter('updateFields', index, {}) as IDataObject;

  const attributes: IDataObject = cleanObject({
    name: updateFields.name,
  });

  const body = buildJsonApiBody('tag', attributes, tagId);
  const response = await klaviyoApiRequest.call(this, this, 'PATCH', `/api/tags/${tagId}/`, body);
  return [{ json: response as IDataObject }];
}

export async function deleteTag(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const tagId = this.getNodeParameter('tagId', index) as string;
  await klaviyoApiRequest.call(this, this, 'DELETE', `/api/tags/${tagId}/`);
  return [{ json: { success: true, tagId } }];
}

export async function getTagGroups(
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
    query['fields[tag-group]'] = (options.fields as string[]).join(',');
  }

  query['page[size]'] = returnAll ? 100 : Math.min(limit, 100);

  let tagGroups: IDataObject[];

  if (returnAll) {
    tagGroups = await klaviyoApiRequestAllItems.call(this, this, 'GET', '/api/tag-groups/', undefined, query);
  } else {
    tagGroups = await klaviyoApiRequestAllItems.call(this, this, 'GET', '/api/tag-groups/', undefined, query, limit);
  }

  return tagGroups.map((tagGroup) => ({ json: tagGroup }));
}

export async function createTagGroup(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const name = this.getNodeParameter('name', index) as string;
  const additionalFields = this.getNodeParameter('additionalFields', index, {}) as IDataObject;

  const attributes: IDataObject = cleanObject({
    name,
    exclusive: additionalFields.exclusive || false,
    default: additionalFields.default || false,
  });

  const body = buildJsonApiBody('tag-group', attributes);
  const response = await klaviyoApiRequest.call(this, this, 'POST', '/api/tag-groups/', body);
  return [{ json: response as IDataObject }];
}

export async function getTagRelationships(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const tagId = this.getNodeParameter('tagId', index) as string;
  const relationshipType = this.getNodeParameter('relationshipType', index) as string;

  const response = await klaviyoApiRequest.call(this, this, 'GET', `/api/tags/${tagId}/relationships/${relationshipType}/`);
  return [{ json: response as IDataObject }];
}

export async function tagResources(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const tagId = this.getNodeParameter('tagId', index) as string;
  const resourceType = this.getNodeParameter('resourceType', index) as string;
  const resourceIds = this.getNodeParameter('resourceIds', index) as string[];

  const body = {
    data: resourceIds.map((id) => ({
      type: resourceType,
      id,
    })),
  };

  await klaviyoApiRequest.call(this, this, 'POST', `/api/tags/${tagId}/relationships/${resourceType}/`, body);
  return [{ json: { success: true, tagId, resourcesTagged: resourceIds.length } }];
}

export async function untagResources(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const tagId = this.getNodeParameter('tagId', index) as string;
  const resourceType = this.getNodeParameter('resourceType', index) as string;
  const resourceIds = this.getNodeParameter('resourceIds', index) as string[];

  const body = {
    data: resourceIds.map((id) => ({
      type: resourceType,
      id,
    })),
  };

  await klaviyoApiRequest.call(this, this, 'DELETE', `/api/tags/${tagId}/relationships/${resourceType}/`, body);
  return [{ json: { success: true, tagId, resourcesUntagged: resourceIds.length } }];
}
