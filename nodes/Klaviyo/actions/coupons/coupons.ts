/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IDataObject, IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { klaviyoApiRequest, klaviyoApiRequestAllItems, klaviyoApiBulkRequest } from '../../transport/klaviyoApi';
import { buildJsonApiBody, cleanObject } from '../../utils/helpers';

export async function getCoupons(
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
    query['fields[coupon]'] = (options.fields as string[]).join(',');
  }

  if (options.sort) {
    query.sort = options.sort;
  }

  query['page[size]'] = returnAll ? 100 : Math.min(limit, 100);

  let coupons: IDataObject[];

  if (returnAll) {
    coupons = await klaviyoApiRequestAllItems.call(this, this, 'GET', '/api/coupons/', undefined, query);
  } else {
    coupons = await klaviyoApiRequestAllItems.call(this, this, 'GET', '/api/coupons/', undefined, query, limit);
  }

  return coupons.map((coupon) => ({ json: coupon }));
}

export async function getCoupon(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const couponId = this.getNodeParameter('couponId', index) as string;
  const options = this.getNodeParameter('options', index, {}) as IDataObject;

  const query: IDataObject = {};

  if (options.fields) {
    query['fields[coupon]'] = (options.fields as string[]).join(',');
  }

  if (options.include) {
    query.include = (options.include as string[]).join(',');
  }

  const response = await klaviyoApiRequest.call(this, this, 'GET', `/api/coupons/${couponId}/`, undefined, query);
  return [{ json: response as IDataObject }];
}

export async function createCoupon(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const externalId = this.getNodeParameter('externalId', index) as string;
  const description = this.getNodeParameter('description', index, '') as string;

  const attributes: IDataObject = cleanObject({
    external_id: externalId,
    description,
  });

  const body = buildJsonApiBody('coupon', attributes);
  const response = await klaviyoApiRequest.call(this, this, 'POST', '/api/coupons/', body);
  return [{ json: response as IDataObject }];
}

export async function updateCoupon(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const couponId = this.getNodeParameter('couponId', index) as string;
  const updateFields = this.getNodeParameter('updateFields', index, {}) as IDataObject;

  const attributes: IDataObject = cleanObject({
    description: updateFields.description,
  });

  const body = buildJsonApiBody('coupon', attributes, couponId);
  const response = await klaviyoApiRequest.call(this, this, 'PATCH', `/api/coupons/${couponId}/`, body);
  return [{ json: response as IDataObject }];
}

export async function deleteCoupon(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const couponId = this.getNodeParameter('couponId', index) as string;
  await klaviyoApiRequest.call(this, this, 'DELETE', `/api/coupons/${couponId}/`);
  return [{ json: { success: true, couponId } }];
}

export async function getCouponCodes(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const couponId = this.getNodeParameter('couponId', index) as string;
  const returnAll = this.getNodeParameter('returnAll', index) as boolean;
  const limit = this.getNodeParameter('limit', index, 100) as number;
  const options = this.getNodeParameter('options', index, {}) as IDataObject;

  const query: IDataObject = {};

  query.filter = `equals(coupon.id,"${couponId}")`;

  if (options.fields) {
    query['fields[coupon-code]'] = (options.fields as string[]).join(',');
  }

  query['page[size]'] = returnAll ? 100 : Math.min(limit, 100);

  let couponCodes: IDataObject[];

  if (returnAll) {
    couponCodes = await klaviyoApiRequestAllItems.call(this, this, 'GET', '/api/coupon-codes/', undefined, query);
  } else {
    couponCodes = await klaviyoApiRequestAllItems.call(this, this, 'GET', '/api/coupon-codes/', undefined, query, limit);
  }

  return couponCodes.map((code) => ({ json: code }));
}

export async function createCouponCodes(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const couponId = this.getNodeParameter('couponId', index) as string;
  const uniqueCode = this.getNodeParameter('uniqueCode', index) as string;
  const additionalFields = this.getNodeParameter('additionalFields', index, {}) as IDataObject;

  const attributes: IDataObject = cleanObject({
    unique_code: uniqueCode,
    expires_at: additionalFields.expiresAt,
  });

  const body: IDataObject = {
    data: {
      type: 'coupon-code',
      attributes,
      relationships: {
        coupon: {
          data: {
            type: 'coupon',
            id: couponId,
          },
        },
      },
    },
  };

  const response = await klaviyoApiRequest.call(this, this, 'POST', '/api/coupon-codes/', body);
  return [{ json: response as IDataObject }];
}

export async function bulkCreateCouponCodes(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const couponId = this.getNodeParameter('couponId', index) as string;
  const codes = this.getNodeParameter('codes', index) as IDataObject[];

  const body: IDataObject = {
    data: {
      type: 'coupon-code-bulk-create-job',
      attributes: {
        coupon_codes: codes.map((code) => ({
          unique_code: code.uniqueCode,
          expires_at: code.expiresAt || null,
        })),
      },
      relationships: {
        coupon: {
          data: {
            type: 'coupon',
            id: couponId,
          },
        },
      },
    },
  };

  const response = await klaviyoApiBulkRequest.call(this, this, 'POST', '/api/coupon-code-bulk-create-jobs/', body);
  return [{ json: response as IDataObject }];
}
