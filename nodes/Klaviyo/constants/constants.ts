/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { INodePropertyOptions } from 'n8n-workflow';

export const KLAVIYO_API_BASE_URL = 'https://a.klaviyo.com';
export const KLAVIYO_API_VERSION = '2024-10-15';

export const RESOURCES: INodePropertyOptions[] = [
  { name: 'Profiles', value: 'profiles' },
  { name: 'Lists', value: 'lists' },
  { name: 'Segments', value: 'segments' },
  { name: 'Campaigns', value: 'campaigns' },
  { name: 'Flows', value: 'flows' },
  { name: 'Events', value: 'events' },
  { name: 'Metrics', value: 'metrics' },
  { name: 'Catalogs', value: 'catalogs' },
  { name: 'Templates', value: 'templates' },
  { name: 'Tags', value: 'tags' },
  { name: 'Coupons', value: 'coupons' },
  { name: 'Images', value: 'images' },
  { name: 'Data Privacy', value: 'dataPrivacy' },
  { name: 'Webhooks', value: 'webhooks' },
];

export const PROFILE_OPERATIONS: INodePropertyOptions[] = [
  { name: 'Get Many', value: 'getProfiles' },
  { name: 'Get', value: 'getProfile' },
  { name: 'Create', value: 'createProfile' },
  { name: 'Update', value: 'updateProfile' },
  { name: 'Delete', value: 'deleteProfile' },
  { name: 'Merge', value: 'mergeProfiles' },
  { name: 'Get Lists', value: 'getProfileLists' },
  { name: 'Get Segments', value: 'getProfileSegments' },
  { name: 'Subscribe', value: 'subscribeProfiles' },
  { name: 'Unsubscribe', value: 'unsubscribeProfiles' },
  { name: 'Suppress', value: 'suppressProfiles' },
  { name: 'Unsuppress', value: 'unsuppressProfiles' },
  { name: 'Bulk Create', value: 'bulkCreateProfiles' },
  { name: 'Bulk Update', value: 'bulkUpdateProfiles' },
];

export const LIST_OPERATIONS: INodePropertyOptions[] = [
  { name: 'Get Many', value: 'getLists' },
  { name: 'Get', value: 'getList' },
  { name: 'Create', value: 'createList' },
  { name: 'Update', value: 'updateList' },
  { name: 'Delete', value: 'deleteList' },
  { name: 'Get Profiles', value: 'getListProfiles' },
  { name: 'Add Profiles', value: 'addProfilesToList' },
  { name: 'Remove Profiles', value: 'removeProfilesFromList' },
  { name: 'Get Relationships', value: 'getListRelationships' },
  { name: 'Get Tags', value: 'getListTags' },
];

export const SEGMENT_OPERATIONS: INodePropertyOptions[] = [
  { name: 'Get Many', value: 'getSegments' },
  { name: 'Get', value: 'getSegment' },
  { name: 'Create', value: 'createSegment' },
  { name: 'Update', value: 'updateSegment' },
  { name: 'Delete', value: 'deleteSegment' },
  { name: 'Get Profiles', value: 'getSegmentProfiles' },
  { name: 'Get Relationships', value: 'getSegmentRelationships' },
];

export const CAMPAIGN_OPERATIONS: INodePropertyOptions[] = [
  { name: 'Get Many', value: 'getCampaigns' },
  { name: 'Get', value: 'getCampaign' },
  { name: 'Create', value: 'createCampaign' },
  { name: 'Update', value: 'updateCampaign' },
  { name: 'Delete', value: 'deleteCampaign' },
  { name: 'Clone', value: 'cloneCampaign' },
  { name: 'Get Message', value: 'getCampaignMessage' },
  { name: 'Update Message', value: 'updateCampaignMessage' },
  { name: 'Send', value: 'sendCampaign' },
  { name: 'Schedule', value: 'scheduleCampaign' },
  { name: 'Cancel', value: 'cancelCampaign' },
  { name: 'Get Recipient Estimation', value: 'getCampaignRecipientEstimation' },
];

export const FLOW_OPERATIONS: INodePropertyOptions[] = [
  { name: 'Get Many', value: 'getFlows' },
  { name: 'Get', value: 'getFlow' },
  { name: 'Update Status', value: 'updateFlowStatus' },
  { name: 'Get Actions', value: 'getFlowActions' },
  { name: 'Get Action', value: 'getFlowAction' },
  { name: 'Update Action', value: 'updateFlowAction' },
  { name: 'Get Messages', value: 'getFlowMessages' },
  { name: 'Get Message', value: 'getFlowMessage' },
  { name: 'Update Message', value: 'updateFlowMessage' },
];

export const EVENT_OPERATIONS: INodePropertyOptions[] = [
  { name: 'Get Many', value: 'getEvents' },
  { name: 'Get', value: 'getEvent' },
  { name: 'Create', value: 'createEvent' },
  { name: 'Bulk Create', value: 'bulkCreateEvents' },
  { name: 'Get Metrics', value: 'getEventMetrics' },
  { name: 'Get Profiles', value: 'getEventProfiles' },
];

export const METRIC_OPERATIONS: INodePropertyOptions[] = [
  { name: 'Get Many', value: 'getMetrics' },
  { name: 'Get', value: 'getMetric' },
  { name: 'Query Aggregates', value: 'queryMetricAggregates' },
  { name: 'Get Timeline', value: 'getMetricTimeline' },
];

export const CATALOG_OPERATIONS: INodePropertyOptions[] = [
  { name: 'Get Items', value: 'getCatalogItems' },
  { name: 'Get Item', value: 'getCatalogItem' },
  { name: 'Create Item', value: 'createCatalogItem' },
  { name: 'Update Item', value: 'updateCatalogItem' },
  { name: 'Delete Item', value: 'deleteCatalogItem' },
  { name: 'Get Variants', value: 'getCatalogVariants' },
  { name: 'Create Variant', value: 'createCatalogVariant' },
  { name: 'Update Variant', value: 'updateCatalogVariant' },
  { name: 'Delete Variant', value: 'deleteCatalogVariant' },
  { name: 'Get Categories', value: 'getCatalogCategories' },
  { name: 'Create Category', value: 'createCatalogCategory' },
  { name: 'Bulk Create Items', value: 'bulkCreateCatalogItems' },
  { name: 'Bulk Update Items', value: 'bulkUpdateCatalogItems' },
  { name: 'Bulk Delete Items', value: 'bulkDeleteCatalogItems' },
];

export const TEMPLATE_OPERATIONS: INodePropertyOptions[] = [
  { name: 'Get Many', value: 'getTemplates' },
  { name: 'Get', value: 'getTemplate' },
  { name: 'Create', value: 'createTemplate' },
  { name: 'Update', value: 'updateTemplate' },
  { name: 'Delete', value: 'deleteTemplate' },
  { name: 'Clone', value: 'cloneTemplate' },
  { name: 'Render', value: 'renderTemplate' },
];

export const TAG_OPERATIONS: INodePropertyOptions[] = [
  { name: 'Get Many', value: 'getTags' },
  { name: 'Get', value: 'getTag' },
  { name: 'Create', value: 'createTag' },
  { name: 'Update', value: 'updateTag' },
  { name: 'Delete', value: 'deleteTag' },
  { name: 'Get Groups', value: 'getTagGroups' },
  { name: 'Create Group', value: 'createTagGroup' },
  { name: 'Get Relationships', value: 'getTagRelationships' },
  { name: 'Tag Resources', value: 'tagResources' },
  { name: 'Untag Resources', value: 'untagResources' },
];

export const COUPON_OPERATIONS: INodePropertyOptions[] = [
  { name: 'Get Many', value: 'getCoupons' },
  { name: 'Get', value: 'getCoupon' },
  { name: 'Create', value: 'createCoupon' },
  { name: 'Update', value: 'updateCoupon' },
  { name: 'Delete', value: 'deleteCoupon' },
  { name: 'Get Codes', value: 'getCouponCodes' },
  { name: 'Create Codes', value: 'createCouponCodes' },
  { name: 'Bulk Create Codes', value: 'bulkCreateCouponCodes' },
];

export const IMAGE_OPERATIONS: INodePropertyOptions[] = [
  { name: 'Get Many', value: 'getImages' },
  { name: 'Get', value: 'getImage' },
  { name: 'Upload', value: 'uploadImage' },
  { name: 'Update', value: 'updateImage' },
  { name: 'Delete', value: 'deleteImage' },
];

export const DATA_PRIVACY_OPERATIONS: INodePropertyOptions[] = [
  { name: 'Request Profile Deletion', value: 'requestProfileDeletion' },
  { name: 'Get Deletion Jobs', value: 'getDataPrivacyDeletionJobs' },
];

export const WEBHOOK_OPERATIONS: INodePropertyOptions[] = [
  { name: 'Get Many', value: 'getWebhooks' },
  { name: 'Get', value: 'getWebhook' },
  { name: 'Create', value: 'createWebhook' },
  { name: 'Update', value: 'updateWebhook' },
  { name: 'Delete', value: 'deleteWebhook' },
  { name: 'Get Topics', value: 'getWebhookTopics' },
];

export const WEBHOOK_TOPICS: INodePropertyOptions[] = [
  { name: 'Profile Created', value: 'profile.created' },
  { name: 'Profile Updated', value: 'profile.updated' },
  { name: 'Profile Merged', value: 'profile.merged' },
  { name: 'Profile Subscribed', value: 'profile.subscribed' },
  { name: 'Profile Unsubscribed', value: 'profile.unsubscribed' },
  { name: 'Profile Suppressed', value: 'profile.suppressed' },
  { name: 'Profile Unsuppressed', value: 'profile.unsuppressed' },
  { name: 'Event Created', value: 'event.created' },
  { name: 'Campaign Sent', value: 'campaign.sent' },
  { name: 'Flow Triggered', value: 'flow.triggered' },
];

export const CAMPAIGN_STATUS_OPTIONS: INodePropertyOptions[] = [
  { name: 'Draft', value: 'draft' },
  { name: 'Scheduled', value: 'scheduled' },
  { name: 'Sent', value: 'sent' },
  { name: 'Cancelled', value: 'cancelled' },
];

export const FLOW_STATUS_OPTIONS: INodePropertyOptions[] = [
  { name: 'Draft', value: 'draft' },
  { name: 'Manual', value: 'manual' },
  { name: 'Live', value: 'live' },
];

export const CONSENT_OPTIONS: INodePropertyOptions[] = [
  { name: 'Subscribed', value: 'SUBSCRIBED' },
  { name: 'Unsubscribed', value: 'UNSUBSCRIBED' },
  { name: 'Never Subscribed', value: 'NEVER_SUBSCRIBED' },
];

export const CHANNEL_OPTIONS: INodePropertyOptions[] = [
  { name: 'Email', value: 'email' },
  { name: 'SMS', value: 'sms' },
  { name: 'Push', value: 'push' },
];

export const DEFAULT_PAGE_SIZE = 20;
export const MAX_PAGE_SIZE = 100;
