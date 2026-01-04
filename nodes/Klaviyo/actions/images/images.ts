/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IDataObject, IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { klaviyoApiRequest, klaviyoApiRequestAllItems, klaviyoApiUploadFile } from '../../transport/klaviyoApi';
import { buildJsonApiBody, cleanObject } from '../../utils/helpers';

export async function getImages(
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
    query['fields[image]'] = (options.fields as string[]).join(',');
  }

  if (options.sort) {
    query.sort = options.sort;
  }

  query['page[size]'] = returnAll ? 100 : Math.min(limit, 100);

  let images: IDataObject[];

  if (returnAll) {
    images = await klaviyoApiRequestAllItems.call(this, this, 'GET', '/api/images/', undefined, query);
  } else {
    images = await klaviyoApiRequestAllItems.call(this, this, 'GET', '/api/images/', undefined, query, limit);
  }

  return images.map((image) => ({ json: image }));
}

export async function getImage(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const imageId = this.getNodeParameter('imageId', index) as string;
  const options = this.getNodeParameter('options', index, {}) as IDataObject;

  const query: IDataObject = {};

  if (options.fields) {
    query['fields[image]'] = (options.fields as string[]).join(',');
  }

  const response = await klaviyoApiRequest.call(this, this, 'GET', `/api/images/${imageId}/`, undefined, query);
  return [{ json: response as IDataObject }];
}

export async function uploadImage(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const inputDataFieldName = this.getNodeParameter('binaryPropertyName', index, 'data') as string;
  const name = this.getNodeParameter('name', index, '') as string;
  const hidden = this.getNodeParameter('hidden', index, false) as boolean;

  const binaryData = this.helpers.assertBinaryData(index, inputDataFieldName);
  const buffer = await this.helpers.getBinaryDataBuffer(index, inputDataFieldName);
  
  const fileName = binaryData.fileName || 'image.png';
  const mimeType = binaryData.mimeType || 'image/png';

  const response = await klaviyoApiUploadFile.call(
    this,
    this,
    this,
    '/api/images/',
    buffer,
    fileName,
    mimeType,
    {
      name: name || fileName,
      hidden,
    }
  );

  return [{ json: response as unknown as IDataObject }];
}

export async function uploadImageFromUrl(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const imageUrl = this.getNodeParameter('imageUrl', index) as string;
  const name = this.getNodeParameter('name', index, '') as string;
  const hidden = this.getNodeParameter('hidden', index, false) as boolean;

  const attributes: IDataObject = cleanObject({
    import_from_url: imageUrl,
    name: name || undefined,
    hidden,
  });

  const body = buildJsonApiBody('image', attributes);
  const response = await klaviyoApiRequest.call(this, this, 'POST', '/api/images/', body);
  return [{ json: response as IDataObject }];
}

export async function updateImage(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const imageId = this.getNodeParameter('imageId', index) as string;
  const updateFields = this.getNodeParameter('updateFields', index, {}) as IDataObject;

  const attributes: IDataObject = cleanObject({
    name: updateFields.name,
    hidden: updateFields.hidden,
  });

  const body = buildJsonApiBody('image', attributes, imageId);
  const response = await klaviyoApiRequest.call(this, this, 'PATCH', `/api/images/${imageId}/`, body);
  return [{ json: response as IDataObject }];
}

export async function deleteImage(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const imageId = this.getNodeParameter('imageId', index) as string;
  await klaviyoApiRequest.call(this, this, 'DELETE', `/api/images/${imageId}/`);
  return [{ json: { success: true, imageId } }];
}
