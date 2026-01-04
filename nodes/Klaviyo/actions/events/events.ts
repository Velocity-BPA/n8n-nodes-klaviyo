/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IDataObject, IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { klaviyoApiRequest, klaviyoApiRequestAllItems, klaviyoApiBulkRequest } from '../../transport/klaviyoApi';
import { cleanObject } from '../../utils/helpers';

export async function getEvents(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const returnAll = this.getNodeParameter('returnAll', index) as boolean;
  const limit = this.getNodeParameter('limit', index, 100) as number;
  const filters = this.getNodeParameter('filters', index, {}) as IDataObject;
  const options = this.getNodeParameter('options', index, {}) as IDataObject;

  const query: IDataObject = {};

  const filterParts: string[] = [];
  if (filters.metricId) {
    filterParts.push(`equals(metric_id,"${filters.metricId}")`);
  }
  if (filters.profileId) {
    filterParts.push(`equals(profile_id,"${filters.profileId}")`);
  }
  if (filters.since) {
    filterParts.push(`greater-than(datetime,${filters.since})`);
  }
  if (filters.until) {
    filterParts.push(`less-than(datetime,${filters.until})`);
  }
  if (filterParts.length > 0) {
    query.filter = filterParts.join(',');
  }

  if (options.fields) {
    query['fields[event]'] = (options.fields as string[]).join(',');
  }

  if (options.include) {
    query.include = (options.include as string[]).join(',');
  }

  if (options.sort) {
    query.sort = options.sort;
  }

  query['page[size]'] = returnAll ? 100 : Math.min(limit, 100);

  let events: IDataObject[];

  if (returnAll) {
    events = await klaviyoApiRequestAllItems.call(this, this, 'GET', '/api/events/', undefined, query);
  } else {
    events = await klaviyoApiRequestAllItems.call(this, this, 'GET', '/api/events/', undefined, query, limit);
  }

  return events.map((event) => ({ json: event }));
}

export async function getEvent(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const eventId = this.getNodeParameter('eventId', index) as string;
  const options = this.getNodeParameter('options', index, {}) as IDataObject;

  const query: IDataObject = {};

  if (options.fields) {
    query['fields[event]'] = (options.fields as string[]).join(',');
  }

  if (options.include) {
    query.include = (options.include as string[]).join(',');
  }

  const response = await klaviyoApiRequest.call(this, this, 'GET', `/api/events/${eventId}/`, undefined, query);
  return [{ json: response as IDataObject }];
}

export async function createEvent(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const metricName = this.getNodeParameter('metricName', index) as string;
  const profileIdentifier = this.getNodeParameter('profileIdentifier', index) as IDataObject;
  const additionalFields = this.getNodeParameter('additionalFields', index, {}) as IDataObject;

  const profileData: IDataObject = {};
  if (profileIdentifier.email) {
    profileData.email = profileIdentifier.email;
  }
  if (profileIdentifier.phoneNumber) {
    profileData.phone_number = profileIdentifier.phoneNumber;
  }
  if (profileIdentifier.externalId) {
    profileData.external_id = profileIdentifier.externalId;
  }
  if (profileIdentifier.profileId) {
    profileData.id = profileIdentifier.profileId;
  }

  const attributes: IDataObject = cleanObject({
    time: additionalFields.time || new Date().toISOString(),
    value: additionalFields.value,
    unique_id: additionalFields.uniqueId,
    properties: additionalFields.properties,
  });

  const body = {
    data: {
      type: 'event',
      attributes,
      relationships: {
        metric: {
          data: {
            type: 'metric',
            attributes: {
              name: metricName,
            },
          },
        },
        profile: {
          data: {
            type: 'profile',
            attributes: profileData,
          },
        },
      },
    },
  };

  const response = await klaviyoApiRequest.call(this, this, 'POST', '/api/events/', body);
  return [{ json: response as IDataObject }];
}

export async function bulkCreateEvents(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const events = this.getNodeParameter('events', index) as IDataObject[];

  const body = {
    data: {
      type: 'event-bulk-create-job',
      attributes: {
        events: {
          data: events.map((event) => {
            const profileData: IDataObject = {};
            const profile = event.profile as IDataObject;
            if (profile?.email) profileData.email = profile.email;
            if (profile?.phoneNumber) profileData.phone_number = profile.phoneNumber;
            if (profile?.externalId) profileData.external_id = profile.externalId;

            return {
              type: 'event',
              attributes: cleanObject({
                time: event.time || new Date().toISOString(),
                value: event.value,
                unique_id: event.uniqueId,
                properties: event.properties,
              }),
              relationships: {
                metric: {
                  data: {
                    type: 'metric',
                    attributes: {
                      name: event.metricName,
                    },
                  },
                },
                profile: {
                  data: {
                    type: 'profile',
                    attributes: profileData,
                  },
                },
              },
            };
          }),
        },
      },
    },
  };

  const response = await klaviyoApiBulkRequest.call(this, this, 'POST', '/api/event-bulk-create-jobs/', body);
  return [{ json: response }];
}

export async function getEventMetrics(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const eventId = this.getNodeParameter('eventId', index) as string;
  const response = await klaviyoApiRequest.call(this, this, 'GET', `/api/events/${eventId}/metric/`);
  return [{ json: response as IDataObject }];
}

export async function getEventProfiles(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const eventId = this.getNodeParameter('eventId', index) as string;
  const response = await klaviyoApiRequest.call(this, this, 'GET', `/api/events/${eventId}/profile/`);
  return [{ json: response as IDataObject }];
}
