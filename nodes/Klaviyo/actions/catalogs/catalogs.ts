/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IDataObject, IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { klaviyoApiRequest, klaviyoApiRequestAllItems, klaviyoApiBulkRequest } from '../../transport/klaviyoApi';
import { buildJsonApiBody, cleanObject } from '../../utils/helpers';

export async function getCatalogItems(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const returnAll = this.getNodeParameter('returnAll', index) as boolean;
  const limit = this.getNodeParameter('limit', index, 100) as number;
  const filters = this.getNodeParameter('filters', index, {}) as IDataObject;
  const options = this.getNodeParameter('options', index, {}) as IDataObject;

  const query: IDataObject = {};

  const filterParts: string[] = [];
  if (filters.ids) {
    filterParts.push(`any(id,["${(filters.ids as string[]).join('","')}"])`);
  }
  if (filters.categoryId) {
    filterParts.push(`equals(category_id,"${filters.categoryId}")`);
  }
  if (filterParts.length > 0) {
    query.filter = filterParts.join(',');
  }

  if (options.fields) {
    query['fields[catalog-item]'] = (options.fields as string[]).join(',');
  }

  if (options.include) {
    query.include = (options.include as string[]).join(',');
  }

  query['page[size]'] = returnAll ? 100 : Math.min(limit, 100);

  let items: IDataObject[];

  if (returnAll) {
    items = await klaviyoApiRequestAllItems.call(this, this, 'GET', '/api/catalog-items/', undefined, query);
  } else {
    items = await klaviyoApiRequestAllItems.call(this, this, 'GET', '/api/catalog-items/', undefined, query, limit);
  }

  return items.map((item) => ({ json: item }));
}

export async function getCatalogItem(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const itemId = this.getNodeParameter('itemId', index) as string;
  const options = this.getNodeParameter('options', index, {}) as IDataObject;

  const query: IDataObject = {};

  if (options.fields) {
    query['fields[catalog-item]'] = (options.fields as string[]).join(',');
  }

  if (options.include) {
    query.include = (options.include as string[]).join(',');
  }

  const response = await klaviyoApiRequest.call(this, this, 'GET', `/api/catalog-items/${itemId}/`, undefined, query);
  return [{ json: response as IDataObject }];
}

export async function createCatalogItem(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const externalId = this.getNodeParameter('externalId', index) as string;
  const title = this.getNodeParameter('title', index) as string;
  const additionalFields = this.getNodeParameter('additionalFields', index, {}) as IDataObject;

  const attributes: IDataObject = cleanObject({
    external_id: externalId,
    title,
    description: additionalFields.description,
    url: additionalFields.url,
    image_full_url: additionalFields.imageFullUrl,
    image_thumbnail_url: additionalFields.imageThumbnailUrl,
    images: additionalFields.images,
    price: additionalFields.price,
    custom_metadata: additionalFields.customMetadata,
    published: additionalFields.published !== false,
  });

  const body: IDataObject = {
    data: {
      type: 'catalog-item',
      attributes,
    },
  };

  // Add category relationship if provided
  if (additionalFields.categoryIds) {
    (body.data as IDataObject).relationships = {
      categories: {
        data: (additionalFields.categoryIds as string[]).map((id) => ({
          type: 'catalog-category',
          id,
        })),
      },
    };
  }

  const response = await klaviyoApiRequest.call(this, this, 'POST', '/api/catalog-items/', body);
  return [{ json: response as IDataObject }];
}

export async function updateCatalogItem(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const itemId = this.getNodeParameter('itemId', index) as string;
  const updateFields = this.getNodeParameter('updateFields', index, {}) as IDataObject;

  const attributes: IDataObject = cleanObject({
    title: updateFields.title,
    description: updateFields.description,
    url: updateFields.url,
    image_full_url: updateFields.imageFullUrl,
    image_thumbnail_url: updateFields.imageThumbnailUrl,
    images: updateFields.images,
    price: updateFields.price,
    custom_metadata: updateFields.customMetadata,
    published: updateFields.published,
  });

  const body = buildJsonApiBody('catalog-item', attributes, itemId);
  const response = await klaviyoApiRequest.call(this, this, 'PATCH', `/api/catalog-items/${itemId}/`, body);
  return [{ json: response as IDataObject }];
}

export async function deleteCatalogItem(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const itemId = this.getNodeParameter('itemId', index) as string;
  await klaviyoApiRequest.call(this, this, 'DELETE', `/api/catalog-items/${itemId}/`);
  return [{ json: { success: true, itemId } }];
}

export async function getCatalogVariants(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const itemId = this.getNodeParameter('itemId', index) as string;
  const returnAll = this.getNodeParameter('returnAll', index) as boolean;
  const limit = this.getNodeParameter('limit', index, 100) as number;
  const options = this.getNodeParameter('options', index, {}) as IDataObject;

  const query: IDataObject = {};

  if (options.fields) {
    query['fields[catalog-variant]'] = (options.fields as string[]).join(',');
  }

  query['page[size]'] = returnAll ? 100 : Math.min(limit, 100);

  let variants: IDataObject[];

  if (returnAll) {
    variants = await klaviyoApiRequestAllItems.call(this, this, 'GET', `/api/catalog-items/${itemId}/variants/`, undefined, query);
  } else {
    variants = await klaviyoApiRequestAllItems.call(this, this, 'GET', `/api/catalog-items/${itemId}/variants/`, undefined, query, limit);
  }

  return variants.map((variant) => ({ json: variant }));
}

export async function createCatalogVariant(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const externalId = this.getNodeParameter('externalId', index) as string;
  const title = this.getNodeParameter('title', index) as string;
  const catalogItemId = this.getNodeParameter('catalogItemId', index) as string;
  const additionalFields = this.getNodeParameter('additionalFields', index, {}) as IDataObject;

  const attributes: IDataObject = cleanObject({
    external_id: externalId,
    title,
    description: additionalFields.description,
    sku: additionalFields.sku,
    inventory_policy: additionalFields.inventoryPolicy,
    inventory_quantity: additionalFields.inventoryQuantity,
    price: additionalFields.price,
    url: additionalFields.url,
    image_full_url: additionalFields.imageFullUrl,
    image_thumbnail_url: additionalFields.imageThumbnailUrl,
    images: additionalFields.images,
    custom_metadata: additionalFields.customMetadata,
    published: additionalFields.published !== false,
  });

  const body: IDataObject = {
    data: {
      type: 'catalog-variant',
      attributes,
      relationships: {
        item: {
          data: {
            type: 'catalog-item',
            id: catalogItemId,
          },
        },
      },
    },
  };

  const response = await klaviyoApiRequest.call(this, this, 'POST', '/api/catalog-variants/', body);
  return [{ json: response as IDataObject }];
}

export async function updateCatalogVariant(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const variantId = this.getNodeParameter('variantId', index) as string;
  const updateFields = this.getNodeParameter('updateFields', index, {}) as IDataObject;

  const attributes: IDataObject = cleanObject({
    title: updateFields.title,
    description: updateFields.description,
    sku: updateFields.sku,
    inventory_policy: updateFields.inventoryPolicy,
    inventory_quantity: updateFields.inventoryQuantity,
    price: updateFields.price,
    url: updateFields.url,
    image_full_url: updateFields.imageFullUrl,
    image_thumbnail_url: updateFields.imageThumbnailUrl,
    images: updateFields.images,
    custom_metadata: updateFields.customMetadata,
    published: updateFields.published,
  });

  const body = buildJsonApiBody('catalog-variant', attributes, variantId);
  const response = await klaviyoApiRequest.call(this, this, 'PATCH', `/api/catalog-variants/${variantId}/`, body);
  return [{ json: response as IDataObject }];
}

export async function deleteCatalogVariant(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const variantId = this.getNodeParameter('variantId', index) as string;
  await klaviyoApiRequest.call(this, this, 'DELETE', `/api/catalog-variants/${variantId}/`);
  return [{ json: { success: true, variantId } }];
}

export async function getCatalogCategories(
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
    query['fields[catalog-category]'] = (options.fields as string[]).join(',');
  }

  query['page[size]'] = returnAll ? 100 : Math.min(limit, 100);

  let categories: IDataObject[];

  if (returnAll) {
    categories = await klaviyoApiRequestAllItems.call(this, this, 'GET', '/api/catalog-categories/', undefined, query);
  } else {
    categories = await klaviyoApiRequestAllItems.call(this, this, 'GET', '/api/catalog-categories/', undefined, query, limit);
  }

  return categories.map((category) => ({ json: category }));
}

export async function createCatalogCategory(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const externalId = this.getNodeParameter('externalId', index) as string;
  const name = this.getNodeParameter('name', index) as string;
  const additionalFields = this.getNodeParameter('additionalFields', index, {}) as IDataObject;

  const attributes: IDataObject = cleanObject({
    external_id: externalId,
    name,
  });

  const body: IDataObject = {
    data: {
      type: 'catalog-category',
      attributes,
    },
  };

  // Add item relationships if provided
  if (additionalFields.itemIds) {
    (body.data as IDataObject).relationships = {
      items: {
        data: (additionalFields.itemIds as string[]).map((id) => ({
          type: 'catalog-item',
          id,
        })),
      },
    };
  }

  const response = await klaviyoApiRequest.call(this, this, 'POST', '/api/catalog-categories/', body);
  return [{ json: response as IDataObject }];
}

export async function bulkCreateCatalogItems(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const items = this.getNodeParameter('items', index) as IDataObject[];

  const body = {
    data: {
      type: 'catalog-item-bulk-create-job',
      attributes: {
        items: {
          data: items.map((item) => ({
            type: 'catalog-item',
            attributes: cleanObject({
              external_id: item.externalId,
              title: item.title,
              description: item.description,
              url: item.url,
              image_full_url: item.imageFullUrl,
              price: item.price,
              custom_metadata: item.customMetadata,
              published: item.published !== false,
            }),
          })),
        },
      },
    },
  };

  const response = await klaviyoApiBulkRequest.call(this, this, 'POST', '/api/catalog-item-bulk-create-jobs/', body);
  return [{ json: response }];
}

export async function bulkUpdateCatalogItems(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const items = this.getNodeParameter('items', index) as IDataObject[];

  const body = {
    data: {
      type: 'catalog-item-bulk-update-job',
      attributes: {
        items: {
          data: items.map((item) => ({
            type: 'catalog-item',
            id: item.id,
            attributes: cleanObject({
              title: item.title,
              description: item.description,
              url: item.url,
              image_full_url: item.imageFullUrl,
              price: item.price,
              custom_metadata: item.customMetadata,
              published: item.published,
            }),
          })),
        },
      },
    },
  };

  const response = await klaviyoApiBulkRequest.call(this, this, 'POST', '/api/catalog-item-bulk-update-jobs/', body);
  return [{ json: response }];
}

export async function bulkDeleteCatalogItems(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const itemIds = this.getNodeParameter('itemIds', index) as string[];

  const body = {
    data: {
      type: 'catalog-item-bulk-delete-job',
      attributes: {
        items: {
          data: itemIds.map((id) => ({
            type: 'catalog-item',
            id,
          })),
        },
      },
    },
  };

  const response = await klaviyoApiBulkRequest.call(this, this, 'POST', '/api/catalog-item-bulk-delete-jobs/', body);
  return [{ json: response }];
}
