/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IDataObject, IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { klaviyoApiRequest, klaviyoApiRequestAllItems } from '../../transport/klaviyoApi';

export async function requestProfileDeletion(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const identifier = this.getNodeParameter('identifier', index) as string;
  const identifierType = this.getNodeParameter('identifierType', index, 'email') as string;

  const profile: IDataObject = {};

  switch (identifierType) {
    case 'email':
      profile.email = identifier;
      break;
    case 'phone_number':
      profile.phone_number = identifier;
      break;
    case 'profile_id':
      profile.id = identifier;
      break;
    default:
      profile.email = identifier;
  }

  const body: IDataObject = {
    data: {
      type: 'data-privacy-deletion-job',
      attributes: {
        profile,
      },
    },
  };

  const response = await klaviyoApiRequest.call(this, this, 'POST', '/api/data-privacy-deletion-jobs/', body);
  return [{ json: response as IDataObject }];
}

export async function getDataPrivacyDeletionJobs(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const returnAll = this.getNodeParameter('returnAll', index) as boolean;
  const limit = this.getNodeParameter('limit', index, 100) as number;
  const filters = this.getNodeParameter('filters', index, {}) as IDataObject;

  const query: IDataObject = {};

  const filterParts: string[] = [];
  if (filters.status) {
    filterParts.push(`equals(status,"${filters.status}")`);
  }
  if (filters.createdAfter) {
    filterParts.push(`greater-than(created_at,${filters.createdAfter})`);
  }
  if (filters.createdBefore) {
    filterParts.push(`less-than(created_at,${filters.createdBefore})`);
  }
  if (filterParts.length > 0) {
    query.filter = filterParts.join(',');
  }

  query['page[size]'] = returnAll ? 100 : Math.min(limit, 100);

  let jobs: IDataObject[];

  if (returnAll) {
    jobs = await klaviyoApiRequestAllItems.call(this, this, 'GET', '/api/data-privacy-deletion-jobs/', undefined, query);
  } else {
    jobs = await klaviyoApiRequestAllItems.call(this, this, 'GET', '/api/data-privacy-deletion-jobs/', undefined, query, limit);
  }

  return jobs.map((job) => ({ json: job }));
}

export async function getDataPrivacyDeletionJob(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const jobId = this.getNodeParameter('jobId', index) as string;

  const response = await klaviyoApiRequest.call(this, this, 'GET', `/api/data-privacy-deletion-jobs/${jobId}/`);
  return [{ json: response as IDataObject }];
}
