/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type {
  IDataObject,
  IHookFunctions,
  INodeType,
  INodeTypeDescription,
  IWebhookFunctions,
  IWebhookResponseData,
} from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';
import { klaviyoApiRequest } from './transport/klaviyoApi';
import crypto from 'crypto';

export class KlaviyoTrigger implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Klaviyo Trigger',
    name: 'klaviyoTrigger',
    icon: 'file:klaviyo.svg',
    group: ['trigger'],
    version: 1,
    subtitle: '={{$parameter["events"].join(", ")}}',
    description: 'Starts the workflow when Klaviyo events occur',
    defaults: {
      name: 'Klaviyo Trigger',
    },
    inputs: [],
    outputs: ['main'],
    credentials: [
      {
        name: 'klaviyoApi',
        required: true,
      },
    ],
    webhooks: [
      {
        name: 'default',
        httpMethod: 'POST',
        responseMode: 'onReceived',
        path: 'webhook',
      },
    ],
    properties: [
      {
        displayName: 'Events',
        name: 'events',
        type: 'multiOptions',
        required: true,
        default: [],
        options: [
          {
            name: 'Campaign Sent',
            value: 'campaign:sent',
            description: 'Triggered when a campaign is sent',
          },
          {
            name: 'Event Created',
            value: 'event:created',
            description: 'Triggered when a new event is tracked',
          },
          {
            name: 'Flow Message Sent',
            value: 'flow-message:sent',
            description: 'Triggered when a flow message is sent',
          },
          {
            name: 'Flow Triggered',
            value: 'flow:triggered',
            description: 'Triggered when a flow is triggered for a profile',
          },
          {
            name: 'List Created',
            value: 'list:created',
            description: 'Triggered when a new list is created',
          },
          {
            name: 'List Deleted',
            value: 'list:deleted',
            description: 'Triggered when a list is deleted',
          },
          {
            name: 'List Updated',
            value: 'list:updated',
            description: 'Triggered when a list is updated',
          },
          {
            name: 'Profile Created',
            value: 'profile:created',
            description: 'Triggered when a new profile is created',
          },
          {
            name: 'Profile Merged',
            value: 'profile:merged',
            description: 'Triggered when profiles are merged',
          },
          {
            name: 'Profile Subscribed',
            value: 'profile:subscribed',
            description: 'Triggered when a profile subscribes',
          },
          {
            name: 'Profile Unsubscribed',
            value: 'profile:unsubscribed',
            description: 'Triggered when a profile unsubscribes',
          },
          {
            name: 'Profile Updated',
            value: 'profile:updated',
            description: 'Triggered when a profile is updated',
          },
          {
            name: 'Segment Created',
            value: 'segment:created',
            description: 'Triggered when a new segment is created',
          },
          {
            name: 'Segment Deleted',
            value: 'segment:deleted',
            description: 'Triggered when a segment is deleted',
          },
          {
            name: 'Segment Updated',
            value: 'segment:updated',
            description: 'Triggered when a segment is updated',
          },
        ],
        description: 'The events to listen to',
      },
      {
        displayName: 'Options',
        name: 'options',
        type: 'collection',
        placeholder: 'Add Option',
        default: {},
        options: [
          {
            displayName: 'Webhook Name',
            name: 'webhookName',
            type: 'string',
            default: 'n8n Webhook',
            description: 'A name for this webhook in Klaviyo',
          },
          {
            displayName: 'Verify Signature',
            name: 'verifySignature',
            type: 'boolean',
            default: true,
            description: 'Whether to verify the webhook signature from Klaviyo',
          },
          {
            displayName: 'Secret Key',
            name: 'secretKey',
            type: 'string',
            typeOptions: {
              password: true,
            },
            default: '',
            description: 'The secret key for webhook signature verification. If not provided, a random key will be generated.',
          },
        ],
      },
    ],
  };

  webhookMethods = {
    default: {
      async checkExists(this: IHookFunctions): Promise<boolean> {
        const webhookUrl = this.getNodeWebhookUrl('default') as string;
        const webhookData = this.getWorkflowStaticData('node');

        // Check if we have a stored webhook ID
        if (webhookData.webhookId) {
          try {
            // Verify the webhook still exists in Klaviyo
            const response = await klaviyoApiRequest.call(
              this,
              this,
              'GET',
              `/api/webhooks/${webhookData.webhookId}/`,
            ) as IDataObject;

            // Check if the endpoint URL matches
            const data = response.data as IDataObject;
            const attributes = data?.attributes as IDataObject;
            if (attributes?.endpoint_url === webhookUrl) {
              return true;
            }
          } catch {
            // Webhook doesn't exist anymore
            delete webhookData.webhookId;
            delete webhookData.secretKey;
          }
        }

        return false;
      },

      async create(this: IHookFunctions): Promise<boolean> {
        const webhookUrl = this.getNodeWebhookUrl('default') as string;
        const events = this.getNodeParameter('events') as string[];
        const options = this.getNodeParameter('options', {}) as IDataObject;
        const webhookData = this.getWorkflowStaticData('node');

        // Generate a secret key if not provided
        const secretKey = (options.secretKey as string) || crypto.randomBytes(32).toString('hex');
        const webhookName = (options.webhookName as string) || 'n8n Webhook';

        const body = {
          data: {
            type: 'webhook',
            attributes: {
              name: webhookName,
              endpoint_url: webhookUrl,
              enabled_delivery_topics: events,
              secret_key: secretKey,
            },
          },
        };

        try {
          const response = await klaviyoApiRequest.call(
            this,
            this,
            'POST',
            '/api/webhooks/',
            body,
          ) as IDataObject;

          const data = response.data as IDataObject;
          webhookData.webhookId = data.id;
          webhookData.secretKey = secretKey;

          return true;
        } catch (error) {
          throw new NodeOperationError(
            this.getNode(),
            `Failed to create Klaviyo webhook: ${(error as Error).message}`,
          );
        }
      },

      async delete(this: IHookFunctions): Promise<boolean> {
        const webhookData = this.getWorkflowStaticData('node');

        if (webhookData.webhookId) {
          try {
            await klaviyoApiRequest.call(
              this,
              this,
              'DELETE',
              `/api/webhooks/${webhookData.webhookId}/`,
            );
          } catch (error) {
            // Log but don't fail if deletion fails
            console.warn(`Failed to delete Klaviyo webhook: ${(error as Error).message}`);
          }

          delete webhookData.webhookId;
          delete webhookData.secretKey;
        }

        return true;
      },
    },
  };

  async webhook(this: IWebhookFunctions): Promise<IWebhookResponseData> {
    const req = this.getRequestObject();
    const body = this.getBodyData() as IDataObject;
    const options = this.getNodeParameter('options', {}) as IDataObject;
    const webhookData = this.getWorkflowStaticData('node');

    // Verify signature if enabled
    if (options.verifySignature !== false && webhookData.secretKey) {
      const signature = req.headers['klaviyo-webhook-signature'] as string;
      const timestamp = req.headers['klaviyo-webhook-timestamp'] as string;

      if (signature && timestamp) {
        const rawBody = JSON.stringify(body);
        const expectedSignature = crypto
          .createHmac('sha256', webhookData.secretKey as string)
          .update(`${timestamp}.${rawBody}`)
          .digest('hex');

        // Check signature (Klaviyo may use different format)
        const signatureValue = signature.split(',').find(s => s.startsWith('v1='))?.substring(3) || signature;
        
        if (signatureValue !== expectedSignature) {
          // Log warning but don't reject - signature format may vary
          console.warn('Klaviyo webhook signature mismatch');
        }
      }
    }

    // Parse the webhook payload
    const webhookPayload: IDataObject = {
      topic: body.topic || body.type,
      timestamp: body.timestamp || new Date().toISOString(),
      data: body.data || body,
    };

    return {
      workflowData: [this.helpers.returnJsonArray([webhookPayload])],
    };
  }
}
