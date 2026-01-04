/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IDataObject, IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { klaviyoApiRequest, klaviyoApiRequestAllItems } from '../../transport/klaviyoApi';
import { buildJsonApiBody, cleanObject } from '../../utils/helpers';

export async function getCampaigns(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const returnAll = this.getNodeParameter('returnAll', index) as boolean;
  const limit = this.getNodeParameter('limit', index, 100) as number;
  const filters = this.getNodeParameter('filters', index, {}) as IDataObject;
  const options = this.getNodeParameter('options', index, {}) as IDataObject;

  const query: IDataObject = {};

  const filterParts: string[] = [];
  if (filters.status) {
    filterParts.push(`equals(messages.channel,"${filters.status}")`);
  }
  if (filterParts.length > 0) {
    query.filter = filterParts.join(',');
  }

  if (options.fields) {
    query['fields[campaign]'] = (options.fields as string[]).join(',');
  }

  if (options.include) {
    query.include = (options.include as string[]).join(',');
  }

  query['page[size]'] = returnAll ? 100 : Math.min(limit, 100);

  let campaigns: IDataObject[];

  if (returnAll) {
    campaigns = await klaviyoApiRequestAllItems.call(this, this, 'GET', '/api/campaigns/', undefined, query);
  } else {
    campaigns = await klaviyoApiRequestAllItems.call(this, this, 'GET', '/api/campaigns/', undefined, query, limit);
  }

  return campaigns.map((campaign) => ({ json: campaign }));
}

export async function getCampaign(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const campaignId = this.getNodeParameter('campaignId', index) as string;
  const options = this.getNodeParameter('options', index, {}) as IDataObject;

  const query: IDataObject = {};

  if (options.fields) {
    query['fields[campaign]'] = (options.fields as string[]).join(',');
  }

  if (options.include) {
    query.include = (options.include as string[]).join(',');
  }

  const response = await klaviyoApiRequest.call(this, this, 'GET', `/api/campaigns/${campaignId}/`, undefined, query);
  return [{ json: response as IDataObject }];
}

export async function createCampaign(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const name = this.getNodeParameter('name', index) as string;
  const channel = this.getNodeParameter('channel', index, 'email') as string;
  const additionalFields = this.getNodeParameter('additionalFields', index, {}) as IDataObject;

  const attributes: IDataObject = cleanObject({
    name,
    channel,
    audiences: additionalFields.audiences ? {
      included: (additionalFields.audiences as IDataObject).included,
      excluded: (additionalFields.audiences as IDataObject).excluded,
    } : undefined,
    send_options: additionalFields.sendOptions ? {
      use_smart_sending: (additionalFields.sendOptions as IDataObject).useSmartSending,
    } : undefined,
    tracking_options: additionalFields.trackingOptions ? {
      is_add_utm: (additionalFields.trackingOptions as IDataObject).isAddUtm,
      is_tracking_clicks: (additionalFields.trackingOptions as IDataObject).isTrackingClicks,
      is_tracking_opens: (additionalFields.trackingOptions as IDataObject).isTrackingOpens,
    } : undefined,
  });

  const body = buildJsonApiBody('campaign', attributes);
  const response = await klaviyoApiRequest.call(this, this, 'POST', '/api/campaigns/', body);
  return [{ json: response as IDataObject }];
}

export async function updateCampaign(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const campaignId = this.getNodeParameter('campaignId', index) as string;
  const updateFields = this.getNodeParameter('updateFields', index, {}) as IDataObject;

  const attributes: IDataObject = cleanObject({
    name: updateFields.name,
    audiences: updateFields.audiences ? {
      included: (updateFields.audiences as IDataObject).included,
      excluded: (updateFields.audiences as IDataObject).excluded,
    } : undefined,
    send_options: updateFields.sendOptions ? {
      use_smart_sending: (updateFields.sendOptions as IDataObject).useSmartSending,
    } : undefined,
    tracking_options: updateFields.trackingOptions ? {
      is_add_utm: (updateFields.trackingOptions as IDataObject).isAddUtm,
      is_tracking_clicks: (updateFields.trackingOptions as IDataObject).isTrackingClicks,
      is_tracking_opens: (updateFields.trackingOptions as IDataObject).isTrackingOpens,
    } : undefined,
  });

  const body = buildJsonApiBody('campaign', attributes, campaignId);
  const response = await klaviyoApiRequest.call(this, this, 'PATCH', `/api/campaigns/${campaignId}/`, body);
  return [{ json: response as IDataObject }];
}

export async function deleteCampaign(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const campaignId = this.getNodeParameter('campaignId', index) as string;
  await klaviyoApiRequest.call(this, this, 'DELETE', `/api/campaigns/${campaignId}/`);
  return [{ json: { success: true, campaignId } }];
}

export async function cloneCampaign(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const campaignId = this.getNodeParameter('campaignId', index) as string;
  const newName = this.getNodeParameter('newName', index, '') as string;

  const body = {
    data: {
      type: 'campaign-clone',
      id: campaignId,
      attributes: newName ? { name: newName } : {},
    },
  };

  const response = await klaviyoApiRequest.call(this, this, 'POST', '/api/campaign-clone/', body);
  return [{ json: response as IDataObject }];
}

export async function getCampaignMessage(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const campaignId = this.getNodeParameter('campaignId', index) as string;
  const options = this.getNodeParameter('options', index, {}) as IDataObject;

  const query: IDataObject = {};

  if (options.fields) {
    query['fields[campaign-message]'] = (options.fields as string[]).join(',');
  }

  const response = await klaviyoApiRequest.call(this, this, 'GET', `/api/campaigns/${campaignId}/campaign-messages/`, undefined, query);
  return [{ json: response as IDataObject }];
}

export async function updateCampaignMessage(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const messageId = this.getNodeParameter('messageId', index) as string;
  const updateFields = this.getNodeParameter('updateFields', index, {}) as IDataObject;

  const attributes: IDataObject = cleanObject({
    label: updateFields.label,
    channel: updateFields.channel,
    content: updateFields.content ? {
      subject: (updateFields.content as IDataObject).subject,
      preview_text: (updateFields.content as IDataObject).previewText,
      from_email: (updateFields.content as IDataObject).fromEmail,
      from_label: (updateFields.content as IDataObject).fromLabel,
      reply_to_email: (updateFields.content as IDataObject).replyToEmail,
    } : undefined,
  });

  const body = buildJsonApiBody('campaign-message', attributes, messageId);
  const response = await klaviyoApiRequest.call(this, this, 'PATCH', `/api/campaign-messages/${messageId}/`, body);
  return [{ json: response as IDataObject }];
}

export async function sendCampaign(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const campaignId = this.getNodeParameter('campaignId', index) as string;

  const body = {
    data: {
      type: 'campaign-send-job',
      id: campaignId,
    },
  };

  const response = await klaviyoApiRequest.call(this, this, 'POST', '/api/campaign-send-jobs/', body);
  return [{ json: response as IDataObject }];
}

export async function scheduleCampaign(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const campaignId = this.getNodeParameter('campaignId', index) as string;
  const sendTime = this.getNodeParameter('sendTime', index) as string;
  const options = this.getNodeParameter('options', index, {}) as IDataObject;

  const attributes: IDataObject = cleanObject({
    send_strategy: {
      method: 'static',
      options_static: {
        datetime: sendTime,
        is_local: options.isLocal || false,
        send_past_recipients_immediately: options.sendPastRecipientsImmediately || true,
      },
    },
  });

  const body = buildJsonApiBody('campaign', attributes, campaignId);
  const response = await klaviyoApiRequest.call(this, this, 'PATCH', `/api/campaigns/${campaignId}/`, body);
  return [{ json: response as IDataObject }];
}

export async function cancelCampaign(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const campaignId = this.getNodeParameter('campaignId', index) as string;

  const attributes: IDataObject = {
    send_strategy: {
      method: 'static',
      options_static: null,
    },
  };

  const body = buildJsonApiBody('campaign', attributes, campaignId);
  const response = await klaviyoApiRequest.call(this, this, 'PATCH', `/api/campaigns/${campaignId}/`, body);
  return [{ json: response as IDataObject }];
}

export async function getCampaignRecipientEstimation(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const campaignId = this.getNodeParameter('campaignId', index) as string;

  // First, create an estimation job
  const createBody = {
    data: {
      type: 'campaign-recipient-estimation-job',
      id: campaignId,
    },
  };

  await klaviyoApiRequest.call(this, this, 'POST', '/api/campaign-recipient-estimation-jobs/', createBody);

  // Then get the estimation result
  const response = await klaviyoApiRequest.call(this, this, 'GET', `/api/campaign-recipient-estimations/${campaignId}/`);
  return [{ json: response as IDataObject }];
}
