/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type {
  IAuthenticateGeneric,
  ICredentialTestRequest,
  ICredentialType,
  INodeProperties,
} from 'n8n-workflow';

export class KlaviyoApi implements ICredentialType {
  name = 'klaviyoApi';
  displayName = 'Klaviyo API';
  documentationUrl = 'https://developers.klaviyo.com/en/reference/api_overview';
  properties: INodeProperties[] = [
    {
      displayName: 'Private API Key',
      name: 'privateApiKey',
      type: 'string',
      typeOptions: {
        password: true,
      },
      default: '',
      required: true,
      description: 'Your Klaviyo Private API Key for server-side operations',
    },
    {
      displayName: 'Public API Key (Site ID)',
      name: 'publicApiKey',
      type: 'string',
      default: '',
      description: 'Your Klaviyo Public API Key (Site ID) for client-side operations (optional)',
    },
    {
      displayName: 'API Revision',
      name: 'apiRevision',
      type: 'string',
      default: '2024-10-15',
      description: 'The Klaviyo API revision date (format: YYYY-MM-DD)',
    },
    {
      displayName: 'Base URL',
      name: 'baseUrl',
      type: 'string',
      default: 'https://a.klaviyo.com',
      description: 'The Klaviyo API base URL',
    },
  ];

  authenticate: IAuthenticateGeneric = {
    type: 'generic',
    properties: {
      headers: {
        Authorization: '=Klaviyo-API-Key {{$credentials.privateApiKey}}',
        revision: '={{$credentials.apiRevision}}',
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    },
  };

  test: ICredentialTestRequest = {
    request: {
      baseURL: '={{$credentials.baseUrl}}',
      url: '/api/accounts/',
      method: 'GET',
    },
  };
}
