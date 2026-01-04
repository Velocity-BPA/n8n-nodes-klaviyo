/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IDataObject, IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { klaviyoApiRequest, klaviyoApiRequestAllItems, klaviyoApiBulkRequest } from '../../transport/klaviyoApi';
import { buildJsonApiBody, cleanObject } from '../../utils/helpers';

export async function getProfiles(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const returnAll = this.getNodeParameter('returnAll', index) as boolean;
  const limit = this.getNodeParameter('limit', index, 100) as number;
  const filters = this.getNodeParameter('filters', index, {}) as IDataObject;
  const options = this.getNodeParameter('options', index, {}) as IDataObject;

  const query: IDataObject = {};

  if (filters.email) {
    query.filter = `equals(email,"${filters.email}")`;
  } else if (filters.phoneNumber) {
    query.filter = `equals(phone_number,"${filters.phoneNumber}")`;
  } else if (filters.externalId) {
    query.filter = `equals(external_id,"${filters.externalId}")`;
  }

  if (options.fields) {
    query['fields[profile]'] = (options.fields as string[]).join(',');
  }

  if (options.include) {
    query.include = (options.include as string[]).join(',');
  }

  if (options.sort) {
    query.sort = options.sort;
  }

  query['page[size]'] = returnAll ? 100 : Math.min(limit, 100);

  let profiles: IDataObject[];

  if (returnAll) {
    profiles = await klaviyoApiRequestAllItems.call(this, this, 'GET', '/api/profiles/', undefined, query);
  } else {
    profiles = await klaviyoApiRequestAllItems.call(this, this, 'GET', '/api/profiles/', undefined, query, limit);
  }

  return profiles.map((profile) => ({ json: profile }));
}

export async function getProfile(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const profileId = this.getNodeParameter('profileId', index) as string;
  const options = this.getNodeParameter('options', index, {}) as IDataObject;

  const query: IDataObject = {};

  if (options.fields) {
    query['fields[profile]'] = (options.fields as string[]).join(',');
  }

  if (options.include) {
    query.include = (options.include as string[]).join(',');
  }

  const response = await klaviyoApiRequest.call(this, this, 'GET', `/api/profiles/${profileId}/`, undefined, query);
  return [{ json: response as IDataObject }];
}

export async function createProfile(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const email = this.getNodeParameter('email', index, '') as string;
  const phoneNumber = this.getNodeParameter('phoneNumber', index, '') as string;
  const additionalFields = this.getNodeParameter('additionalFields', index, {}) as IDataObject;

  const attributes: IDataObject = cleanObject({
    email: email || undefined,
    phone_number: phoneNumber || undefined,
    external_id: additionalFields.externalId,
    first_name: additionalFields.firstName,
    last_name: additionalFields.lastName,
    organization: additionalFields.organization,
    title: additionalFields.title,
    image: additionalFields.image,
    location: additionalFields.location ? {
      address1: (additionalFields.location as IDataObject).address1,
      address2: (additionalFields.location as IDataObject).address2,
      city: (additionalFields.location as IDataObject).city,
      country: (additionalFields.location as IDataObject).country,
      region: (additionalFields.location as IDataObject).region,
      zip: (additionalFields.location as IDataObject).zip,
      timezone: (additionalFields.location as IDataObject).timezone,
    } : undefined,
    properties: additionalFields.customProperties,
  });

  const body = buildJsonApiBody('profile', attributes);
  const response = await klaviyoApiRequest.call(this, this, 'POST', '/api/profiles/', body);
  return [{ json: response as IDataObject }];
}

export async function updateProfile(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const profileId = this.getNodeParameter('profileId', index) as string;
  const updateFields = this.getNodeParameter('updateFields', index, {}) as IDataObject;

  const attributes: IDataObject = cleanObject({
    email: updateFields.email,
    phone_number: updateFields.phoneNumber,
    external_id: updateFields.externalId,
    first_name: updateFields.firstName,
    last_name: updateFields.lastName,
    organization: updateFields.organization,
    title: updateFields.title,
    image: updateFields.image,
    location: updateFields.location ? {
      address1: (updateFields.location as IDataObject).address1,
      address2: (updateFields.location as IDataObject).address2,
      city: (updateFields.location as IDataObject).city,
      country: (updateFields.location as IDataObject).country,
      region: (updateFields.location as IDataObject).region,
      zip: (updateFields.location as IDataObject).zip,
      timezone: (updateFields.location as IDataObject).timezone,
    } : undefined,
    properties: updateFields.customProperties,
  });

  const body = buildJsonApiBody('profile', attributes, profileId);
  const response = await klaviyoApiRequest.call(this, this, 'PATCH', `/api/profiles/${profileId}/`, body);
  return [{ json: response as IDataObject }];
}

export async function deleteProfile(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const profileId = this.getNodeParameter('profileId', index) as string;
  await klaviyoApiRequest.call(this, this, 'DELETE', `/api/profiles/${profileId}/`);
  return [{ json: { success: true, profileId } }];
}

export async function mergeProfiles(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const sourceProfileIds = this.getNodeParameter('sourceProfileIds', index) as string[];
  const destinationProfileId = this.getNodeParameter('destinationProfileId', index) as string;

  const body = {
    data: {
      type: 'profile-merge',
      attributes: {},
      relationships: {
        profiles: {
          data: sourceProfileIds.map((id) => ({ type: 'profile', id })),
        },
        destination_profile: {
          data: { type: 'profile', id: destinationProfileId },
        },
      },
    },
  };

  const response = await klaviyoApiRequest.call(this, this, 'POST', '/api/profile-merge/', body);
  return [{ json: response as IDataObject }];
}

export async function getProfileLists(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const profileId = this.getNodeParameter('profileId', index) as string;
  const response = await klaviyoApiRequest.call(this, this, 'GET', `/api/profiles/${profileId}/lists/`);
  return [{ json: response as IDataObject }];
}

export async function getProfileSegments(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const profileId = this.getNodeParameter('profileId', index) as string;
  const response = await klaviyoApiRequest.call(this, this, 'GET', `/api/profiles/${profileId}/segments/`);
  return [{ json: response as IDataObject }];
}

export async function subscribeProfiles(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const listId = this.getNodeParameter('listId', index) as string;
  const profiles = this.getNodeParameter('profiles', index) as IDataObject[];
  const channels = this.getNodeParameter('channels', index, ['email']) as string[];

  const subscriptions: IDataObject = {};
  if (channels.includes('email')) {
    subscriptions.email = { marketing: { consent: 'SUBSCRIBED' } };
  }
  if (channels.includes('sms')) {
    subscriptions.sms = { marketing: { consent: 'SUBSCRIBED' } };
  }

  const body = {
    data: {
      type: 'profile-subscription-bulk-create-job',
      attributes: {
        profiles: {
          data: profiles.map((profile) => ({
            type: 'profile',
            attributes: {
              email: profile.email,
              phone_number: profile.phoneNumber,
              subscriptions,
            },
          })),
        },
      },
      relationships: {
        list: {
          data: { type: 'list', id: listId },
        },
      },
    },
  };

  const response = await klaviyoApiRequest.call(this, this, 'POST', '/api/profile-subscription-bulk-create-jobs/', body);
  return [{ json: response as IDataObject }];
}

export async function unsubscribeProfiles(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const listId = this.getNodeParameter('listId', index) as string;
  const profiles = this.getNodeParameter('profiles', index) as IDataObject[];
  const channels = this.getNodeParameter('channels', index, ['email']) as string[];

  const body = {
    data: {
      type: 'profile-subscription-bulk-delete-job',
      attributes: {
        profiles: {
          data: profiles.map((profile) => ({
            type: 'profile',
            attributes: {
              email: profile.email,
              phone_number: profile.phoneNumber,
            },
          })),
        },
        channels: channels,
      },
      relationships: {
        list: {
          data: { type: 'list', id: listId },
        },
      },
    },
  };

  const response = await klaviyoApiRequest.call(this, this, 'POST', '/api/profile-subscription-bulk-delete-jobs/', body);
  return [{ json: response as IDataObject }];
}

export async function suppressProfiles(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const profiles = this.getNodeParameter('profiles', index) as IDataObject[];

  const body = {
    data: {
      type: 'profile-suppression-bulk-create-job',
      attributes: {
        profiles: {
          data: profiles.map((profile) => ({
            type: 'profile',
            attributes: {
              email: profile.email,
            },
          })),
        },
      },
    },
  };

  const response = await klaviyoApiRequest.call(this, this, 'POST', '/api/profile-suppression-bulk-create-jobs/', body);
  return [{ json: response as IDataObject }];
}

export async function unsuppressProfiles(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const profiles = this.getNodeParameter('profiles', index) as IDataObject[];

  const body = {
    data: {
      type: 'profile-suppression-bulk-delete-job',
      attributes: {
        profiles: {
          data: profiles.map((profile) => ({
            type: 'profile',
            attributes: {
              email: profile.email,
            },
          })),
        },
      },
    },
  };

  const response = await klaviyoApiRequest.call(this, this, 'POST', '/api/profile-suppression-bulk-delete-jobs/', body);
  return [{ json: response as IDataObject }];
}

export async function bulkCreateProfiles(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const profiles = this.getNodeParameter('profiles', index) as IDataObject[];

  const body = {
    data: {
      type: 'profile-bulk-import-job',
      attributes: {
        profiles: {
          data: profiles.map((profile) => ({
            type: 'profile',
            attributes: cleanObject({
              email: profile.email,
              phone_number: profile.phoneNumber,
              external_id: profile.externalId,
              first_name: profile.firstName,
              last_name: profile.lastName,
              organization: profile.organization,
              title: profile.title,
              properties: profile.customProperties,
            }),
          })),
        },
      },
    },
  };

  const response = await klaviyoApiBulkRequest.call(this, this, 'POST', '/api/profile-bulk-import-jobs/', body);
  return [{ json: response }];
}

export async function bulkUpdateProfiles(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const profiles = this.getNodeParameter('profiles', index) as IDataObject[];

  const body = {
    data: {
      type: 'profile-bulk-import-job',
      attributes: {
        profiles: {
          data: profiles.map((profile) => ({
            type: 'profile',
            id: profile.id,
            attributes: cleanObject({
              email: profile.email,
              phone_number: profile.phoneNumber,
              external_id: profile.externalId,
              first_name: profile.firstName,
              last_name: profile.lastName,
              organization: profile.organization,
              title: profile.title,
              properties: profile.customProperties,
            }),
          })),
        },
      },
    },
  };

  const response = await klaviyoApiBulkRequest.call(this, this, 'POST', '/api/profile-bulk-import-jobs/', body);
  return [{ json: response }];
}
