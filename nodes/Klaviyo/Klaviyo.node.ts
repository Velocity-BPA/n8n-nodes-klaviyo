/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
} from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';

// Import resource actions
import * as profiles from './actions/profiles/profiles';
import * as lists from './actions/lists/lists';
import * as segments from './actions/segments/segments';
import * as campaigns from './actions/campaigns/campaigns';
import * as flows from './actions/flows/flows';
import * as events from './actions/events/events';
import * as metrics from './actions/metrics/metrics';
import * as catalogs from './actions/catalogs/catalogs';
import * as templates from './actions/templates/templates';
import * as tags from './actions/tags/tags';
import * as coupons from './actions/coupons/coupons';
import * as images from './actions/images/images';
import * as dataPrivacy from './actions/dataPrivacy/dataPrivacy';
import * as webhooks from './actions/webhooks/webhooks';

export class Klaviyo implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Klaviyo',
    name: 'klaviyo',
    icon: 'file:klaviyo.svg',
    group: ['transform'],
    version: 1,
    subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
    description: 'Interact with Klaviyo marketing automation API',
    defaults: {
      name: 'Klaviyo',
    },
    inputs: ['main'],
    outputs: ['main'],
    credentials: [
      {
        name: 'klaviyoApi',
        required: true,
      },
    ],
    properties: [
      {
        displayName: 'Resource',
        name: 'resource',
        type: 'options',
        noDataExpression: true,
        options: [
          { name: 'Campaign', value: 'campaign' },
          { name: 'Catalog', value: 'catalog' },
          { name: 'Coupon', value: 'coupon' },
          { name: 'Data Privacy', value: 'dataPrivacy' },
          { name: 'Event', value: 'event' },
          { name: 'Flow', value: 'flow' },
          { name: 'Image', value: 'image' },
          { name: 'List', value: 'list' },
          { name: 'Metric', value: 'metric' },
          { name: 'Profile', value: 'profile' },
          { name: 'Segment', value: 'segment' },
          { name: 'Tag', value: 'tag' },
          { name: 'Template', value: 'template' },
          { name: 'Webhook', value: 'webhook' },
        ],
        default: 'profile',
      },

      // ==================== PROFILE OPERATIONS ====================
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
          show: {
            resource: ['profile'],
          },
        },
        options: [
          { name: 'Bulk Create Profiles', value: 'bulkCreateProfiles', description: 'Create profiles in bulk', action: 'Bulk create profiles' },
          { name: 'Bulk Update Profiles', value: 'bulkUpdateProfiles', description: 'Update profiles in bulk', action: 'Bulk update profiles' },
          { name: 'Create Profile', value: 'createProfile', description: 'Create a new profile', action: 'Create profile' },
          { name: 'Delete Profile', value: 'deleteProfile', description: 'Delete a profile', action: 'Delete profile' },
          { name: 'Get Many Profiles', value: 'getProfiles', description: 'Get many profiles', action: 'Get many profiles' },
          { name: 'Get Profile', value: 'getProfile', description: 'Get a profile by ID', action: 'Get profile' },
          { name: 'Get Profile Lists', value: 'getProfileLists', description: 'Get lists for a profile', action: 'Get profile lists' },
          { name: 'Get Profile Segments', value: 'getProfileSegments', description: 'Get segments for a profile', action: 'Get profile segments' },
          { name: 'Merge Profiles', value: 'mergeProfiles', description: 'Merge duplicate profiles', action: 'Merge profiles' },
          { name: 'Subscribe Profiles', value: 'subscribeProfiles', description: 'Subscribe profiles to list/channel', action: 'Subscribe profiles' },
          { name: 'Suppress Profiles', value: 'suppressProfiles', description: 'Suppress profiles from emails', action: 'Suppress profiles' },
          { name: 'Unsuppress Profiles', value: 'unsuppressProfiles', description: 'Unsuppress profiles', action: 'Unsuppress profiles' },
          { name: 'Unsubscribe Profiles', value: 'unsubscribeProfiles', description: 'Unsubscribe profiles', action: 'Unsubscribe profiles' },
          { name: 'Update Profile', value: 'updateProfile', description: 'Update a profile', action: 'Update profile' },
        ],
        default: 'getProfiles',
      },

      // ==================== LIST OPERATIONS ====================
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
          show: {
            resource: ['list'],
          },
        },
        options: [
          { name: 'Add Profiles to List', value: 'addProfilesToList', description: 'Add profiles to a list', action: 'Add profiles to list' },
          { name: 'Create List', value: 'createList', description: 'Create a new list', action: 'Create list' },
          { name: 'Delete List', value: 'deleteList', description: 'Delete a list', action: 'Delete list' },
          { name: 'Get List', value: 'getList', description: 'Get a list by ID', action: 'Get list' },
          { name: 'Get List Profiles', value: 'getListProfiles', description: 'Get profiles in a list', action: 'Get list profiles' },
          { name: 'Get List Relationships', value: 'getListRelationships', description: 'Get list relationships', action: 'Get list relationships' },
          { name: 'Get List Tags', value: 'getListTags', description: 'Get tags for a list', action: 'Get list tags' },
          { name: 'Get Many Lists', value: 'getLists', description: 'Get many lists', action: 'Get many lists' },
          { name: 'Remove Profiles from List', value: 'removeProfilesFromList', description: 'Remove profiles from a list', action: 'Remove profiles from list' },
          { name: 'Update List', value: 'updateList', description: 'Update a list', action: 'Update list' },
        ],
        default: 'getLists',
      },

      // ==================== SEGMENT OPERATIONS ====================
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
          show: {
            resource: ['segment'],
          },
        },
        options: [
          { name: 'Create Segment', value: 'createSegment', description: 'Create a new segment', action: 'Create segment' },
          { name: 'Delete Segment', value: 'deleteSegment', description: 'Delete a segment', action: 'Delete segment' },
          { name: 'Get Many Segments', value: 'getSegments', description: 'Get many segments', action: 'Get many segments' },
          { name: 'Get Segment', value: 'getSegment', description: 'Get a segment by ID', action: 'Get segment' },
          { name: 'Get Segment Profiles', value: 'getSegmentProfiles', description: 'Get profiles in a segment', action: 'Get segment profiles' },
          { name: 'Get Segment Relationships', value: 'getSegmentRelationships', description: 'Get segment relationships', action: 'Get segment relationships' },
          { name: 'Update Segment', value: 'updateSegment', description: 'Update a segment', action: 'Update segment' },
        ],
        default: 'getSegments',
      },

      // ==================== CAMPAIGN OPERATIONS ====================
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
          show: {
            resource: ['campaign'],
          },
        },
        options: [
          { name: 'Cancel Campaign', value: 'cancelCampaign', description: 'Cancel a scheduled campaign', action: 'Cancel campaign' },
          { name: 'Clone Campaign', value: 'cloneCampaign', description: 'Clone an existing campaign', action: 'Clone campaign' },
          { name: 'Create Campaign', value: 'createCampaign', description: 'Create a new campaign', action: 'Create campaign' },
          { name: 'Delete Campaign', value: 'deleteCampaign', description: 'Delete a campaign', action: 'Delete campaign' },
          { name: 'Get Campaign', value: 'getCampaign', description: 'Get a campaign by ID', action: 'Get campaign' },
          { name: 'Get Campaign Message', value: 'getCampaignMessage', description: 'Get campaign message content', action: 'Get campaign message' },
          { name: 'Get Campaign Recipient Estimation', value: 'getCampaignRecipientEstimation', description: 'Estimate campaign recipients', action: 'Get campaign recipient estimation' },
          { name: 'Get Many Campaigns', value: 'getCampaigns', description: 'Get many campaigns', action: 'Get many campaigns' },
          { name: 'Schedule Campaign', value: 'scheduleCampaign', description: 'Schedule a campaign', action: 'Schedule campaign' },
          { name: 'Send Campaign', value: 'sendCampaign', description: 'Send a campaign immediately', action: 'Send campaign' },
          { name: 'Update Campaign', value: 'updateCampaign', description: 'Update a campaign', action: 'Update campaign' },
          { name: 'Update Campaign Message', value: 'updateCampaignMessage', description: 'Update campaign message', action: 'Update campaign message' },
        ],
        default: 'getCampaigns',
      },

      // ==================== FLOW OPERATIONS ====================
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
          show: {
            resource: ['flow'],
          },
        },
        options: [
          { name: 'Get Flow', value: 'getFlow', description: 'Get a flow by ID', action: 'Get flow' },
          { name: 'Get Flow Action', value: 'getFlowAction', description: 'Get a specific flow action', action: 'Get flow action' },
          { name: 'Get Flow Actions', value: 'getFlowActions', description: 'Get flow action nodes', action: 'Get flow actions' },
          { name: 'Get Flow Message', value: 'getFlowMessage', description: 'Get a specific flow message', action: 'Get flow message' },
          { name: 'Get Flow Messages', value: 'getFlowMessages', description: 'Get flow messages', action: 'Get flow messages' },
          { name: 'Get Many Flows', value: 'getFlows', description: 'Get many flows', action: 'Get many flows' },
          { name: 'Update Flow Action', value: 'updateFlowAction', description: 'Update a flow action', action: 'Update flow action' },
          { name: 'Update Flow Message', value: 'updateFlowMessage', description: 'Update a flow message', action: 'Update flow message' },
          { name: 'Update Flow Status', value: 'updateFlowStatus', description: 'Enable or disable a flow', action: 'Update flow status' },
        ],
        default: 'getFlows',
      },

      // ==================== EVENT OPERATIONS ====================
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
          show: {
            resource: ['event'],
          },
        },
        options: [
          { name: 'Bulk Create Events', value: 'bulkCreateEvents', description: 'Create events in bulk', action: 'Bulk create events' },
          { name: 'Create Event', value: 'createEvent', description: 'Track a custom event', action: 'Create event' },
          { name: 'Get Event', value: 'getEvent', description: 'Get an event by ID', action: 'Get event' },
          { name: 'Get Event Metrics', value: 'getEventMetrics', description: 'Get metrics for events', action: 'Get event metrics' },
          { name: 'Get Event Profiles', value: 'getEventProfiles', description: 'Get profiles for an event', action: 'Get event profiles' },
          { name: 'Get Many Events', value: 'getEvents', description: 'Get many events', action: 'Get many events' },
        ],
        default: 'getEvents',
      },

      // ==================== METRIC OPERATIONS ====================
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
          show: {
            resource: ['metric'],
          },
        },
        options: [
          { name: 'Get Many Metrics', value: 'getMetrics', description: 'Get all metrics', action: 'Get many metrics' },
          { name: 'Get Metric', value: 'getMetric', description: 'Get a metric by ID', action: 'Get metric' },
          { name: 'Get Metric Timeline', value: 'getMetricTimeline', description: 'Get metric timeline', action: 'Get metric timeline' },
          { name: 'Query Metric Aggregates', value: 'queryMetricAggregates', description: 'Query aggregated metric data', action: 'Query metric aggregates' },
        ],
        default: 'getMetrics',
      },

      // ==================== CATALOG OPERATIONS ====================
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
          show: {
            resource: ['catalog'],
          },
        },
        options: [
          { name: 'Bulk Create Catalog Items', value: 'bulkCreateCatalogItems', description: 'Bulk create catalog items', action: 'Bulk create catalog items' },
          { name: 'Bulk Delete Catalog Items', value: 'bulkDeleteCatalogItems', description: 'Bulk delete catalog items', action: 'Bulk delete catalog items' },
          { name: 'Bulk Update Catalog Items', value: 'bulkUpdateCatalogItems', description: 'Bulk update catalog items', action: 'Bulk update catalog items' },
          { name: 'Create Catalog Category', value: 'createCatalogCategory', description: 'Create a catalog category', action: 'Create catalog category' },
          { name: 'Create Catalog Item', value: 'createCatalogItem', description: 'Create a catalog item', action: 'Create catalog item' },
          { name: 'Create Catalog Variant', value: 'createCatalogVariant', description: 'Create a catalog variant', action: 'Create catalog variant' },
          { name: 'Delete Catalog Item', value: 'deleteCatalogItem', description: 'Delete a catalog item', action: 'Delete catalog item' },
          { name: 'Delete Catalog Variant', value: 'deleteCatalogVariant', description: 'Delete a catalog variant', action: 'Delete catalog variant' },
          { name: 'Get Catalog Categories', value: 'getCatalogCategories', description: 'Get catalog categories', action: 'Get catalog categories' },
          { name: 'Get Catalog Item', value: 'getCatalogItem', description: 'Get a catalog item by ID', action: 'Get catalog item' },
          { name: 'Get Catalog Variants', value: 'getCatalogVariants', description: 'Get catalog variants', action: 'Get catalog variants' },
          { name: 'Get Many Catalog Items', value: 'getCatalogItems', description: 'Get many catalog items', action: 'Get many catalog items' },
          { name: 'Update Catalog Item', value: 'updateCatalogItem', description: 'Update a catalog item', action: 'Update catalog item' },
          { name: 'Update Catalog Variant', value: 'updateCatalogVariant', description: 'Update a catalog variant', action: 'Update catalog variant' },
        ],
        default: 'getCatalogItems',
      },

      // ==================== TEMPLATE OPERATIONS ====================
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
          show: {
            resource: ['template'],
          },
        },
        options: [
          { name: 'Clone Template', value: 'cloneTemplate', description: 'Clone a template', action: 'Clone template' },
          { name: 'Create Template', value: 'createTemplate', description: 'Create a new template', action: 'Create template' },
          { name: 'Delete Template', value: 'deleteTemplate', description: 'Delete a template', action: 'Delete template' },
          { name: 'Get Many Templates', value: 'getTemplates', description: 'Get many templates', action: 'Get many templates' },
          { name: 'Get Template', value: 'getTemplate', description: 'Get a template by ID', action: 'Get template' },
          { name: 'Render Template', value: 'renderTemplate', description: 'Render a template with data', action: 'Render template' },
          { name: 'Update Template', value: 'updateTemplate', description: 'Update a template', action: 'Update template' },
        ],
        default: 'getTemplates',
      },

      // ==================== TAG OPERATIONS ====================
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
          show: {
            resource: ['tag'],
          },
        },
        options: [
          { name: 'Create Tag', value: 'createTag', description: 'Create a new tag', action: 'Create tag' },
          { name: 'Create Tag Group', value: 'createTagGroup', description: 'Create a tag group', action: 'Create tag group' },
          { name: 'Delete Tag', value: 'deleteTag', description: 'Delete a tag', action: 'Delete tag' },
          { name: 'Get Many Tags', value: 'getTags', description: 'Get many tags', action: 'Get many tags' },
          { name: 'Get Tag', value: 'getTag', description: 'Get a tag by ID', action: 'Get tag' },
          { name: 'Get Tag Groups', value: 'getTagGroups', description: 'Get tag groups', action: 'Get tag groups' },
          { name: 'Get Tag Relationships', value: 'getTagRelationships', description: 'Get tagged resources', action: 'Get tag relationships' },
          { name: 'Tag Resources', value: 'tagResources', description: 'Apply tag to resources', action: 'Tag resources' },
          { name: 'Untag Resources', value: 'untagResources', description: 'Remove tag from resources', action: 'Untag resources' },
          { name: 'Update Tag', value: 'updateTag', description: 'Update a tag', action: 'Update tag' },
        ],
        default: 'getTags',
      },

      // ==================== COUPON OPERATIONS ====================
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
          show: {
            resource: ['coupon'],
          },
        },
        options: [
          { name: 'Bulk Create Coupon Codes', value: 'bulkCreateCouponCodes', description: 'Bulk create coupon codes', action: 'Bulk create coupon codes' },
          { name: 'Create Coupon', value: 'createCoupon', description: 'Create a coupon', action: 'Create coupon' },
          { name: 'Create Coupon Codes', value: 'createCouponCodes', description: 'Create coupon codes', action: 'Create coupon codes' },
          { name: 'Delete Coupon', value: 'deleteCoupon', description: 'Delete a coupon', action: 'Delete coupon' },
          { name: 'Get Coupon', value: 'getCoupon', description: 'Get a coupon by ID', action: 'Get coupon' },
          { name: 'Get Coupon Codes', value: 'getCouponCodes', description: 'Get codes for a coupon', action: 'Get coupon codes' },
          { name: 'Get Many Coupons', value: 'getCoupons', description: 'Get many coupons', action: 'Get many coupons' },
          { name: 'Update Coupon', value: 'updateCoupon', description: 'Update a coupon', action: 'Update coupon' },
        ],
        default: 'getCoupons',
      },

      // ==================== IMAGE OPERATIONS ====================
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
          show: {
            resource: ['image'],
          },
        },
        options: [
          { name: 'Delete Image', value: 'deleteImage', description: 'Delete an image', action: 'Delete image' },
          { name: 'Get Image', value: 'getImage', description: 'Get an image by ID', action: 'Get image' },
          { name: 'Get Many Images', value: 'getImages', description: 'Get many images', action: 'Get many images' },
          { name: 'Update Image', value: 'updateImage', description: 'Update image metadata', action: 'Update image' },
          { name: 'Upload Image', value: 'uploadImage', description: 'Upload a new image', action: 'Upload image' },
          { name: 'Upload Image From URL', value: 'uploadImageFromUrl', description: 'Upload an image from URL', action: 'Upload image from url' },
        ],
        default: 'getImages',
      },

      // ==================== DATA PRIVACY OPERATIONS ====================
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
          show: {
            resource: ['dataPrivacy'],
          },
        },
        options: [
          { name: 'Get Deletion Job', value: 'getDataPrivacyDeletionJob', description: 'Get a specific deletion job', action: 'Get deletion job' },
          { name: 'Get Deletion Jobs', value: 'getDataPrivacyDeletionJobs', description: 'Get deletion job status', action: 'Get deletion jobs' },
          { name: 'Request Profile Deletion', value: 'requestProfileDeletion', description: 'Request profile deletion (GDPR)', action: 'Request profile deletion' },
        ],
        default: 'requestProfileDeletion',
      },

      // ==================== WEBHOOK OPERATIONS ====================
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
          show: {
            resource: ['webhook'],
          },
        },
        options: [
          { name: 'Create Webhook', value: 'createWebhook', description: 'Create a webhook subscription', action: 'Create webhook' },
          { name: 'Delete Webhook', value: 'deleteWebhook', description: 'Delete a webhook', action: 'Delete webhook' },
          { name: 'Get Many Webhooks', value: 'getWebhooks', description: 'Get many webhooks', action: 'Get many webhooks' },
          { name: 'Get Webhook', value: 'getWebhook', description: 'Get a webhook by ID', action: 'Get webhook' },
          { name: 'Get Webhook Topics', value: 'getWebhookTopics', description: 'Get available webhook topics', action: 'Get webhook topics' },
          { name: 'Update Webhook', value: 'updateWebhook', description: 'Update a webhook', action: 'Update webhook' },
        ],
        default: 'getWebhooks',
      },

      // ==================== COMMON PARAMETERS ====================

      // Return All parameter for list operations
      {
        displayName: 'Return All',
        name: 'returnAll',
        type: 'boolean',
        default: false,
        description: 'Whether to return all results or only up to a given limit',
        displayOptions: {
          show: {
            operation: [
              'getProfiles', 'getLists', 'getSegments', 'getCampaigns', 'getFlows',
              'getEvents', 'getMetrics', 'getCatalogItems', 'getTemplates', 'getTags',
              'getTagGroups', 'getCoupons', 'getCouponCodes', 'getImages', 'getWebhooks',
              'getDataPrivacyDeletionJobs', 'getListProfiles', 'getSegmentProfiles',
              'getCatalogVariants', 'getCatalogCategories', 'getFlowActions', 'getFlowMessages',
            ],
          },
        },
      },

      // Limit parameter
      {
        displayName: 'Limit',
        name: 'limit',
        type: 'number',
        default: 50,
        description: 'Max number of results to return',
        typeOptions: {
          minValue: 1,
          maxValue: 100,
        },
        displayOptions: {
          show: {
            returnAll: [false],
            operation: [
              'getProfiles', 'getLists', 'getSegments', 'getCampaigns', 'getFlows',
              'getEvents', 'getMetrics', 'getCatalogItems', 'getTemplates', 'getTags',
              'getTagGroups', 'getCoupons', 'getCouponCodes', 'getImages', 'getWebhooks',
              'getDataPrivacyDeletionJobs', 'getListProfiles', 'getSegmentProfiles',
              'getCatalogVariants', 'getCatalogCategories', 'getFlowActions', 'getFlowMessages',
            ],
          },
        },
      },

      // ==================== PROFILE PARAMETERS ====================

      // Profile ID
      {
        displayName: 'Profile ID',
        name: 'profileId',
        type: 'string',
        required: true,
        default: '',
        displayOptions: {
          show: {
            resource: ['profile'],
            operation: ['getProfile', 'updateProfile', 'deleteProfile', 'getProfileLists', 'getProfileSegments'],
          },
        },
      },

      // Email for create profile
      {
        displayName: 'Email',
        name: 'email',
        type: 'string',
        placeholder: 'name@email.com',
        default: '',
        displayOptions: {
          show: {
            resource: ['profile'],
            operation: ['createProfile'],
          },
        },
      },

      // Additional Fields for createProfile
      {
        displayName: 'Additional Fields',
        name: 'additionalFields',
        type: 'collection',
        placeholder: 'Add Field',
        default: {},
        displayOptions: {
          show: {
            resource: ['profile'],
            operation: ['createProfile'],
          },
        },
        options: [
          { displayName: 'External ID', name: 'externalId', type: 'string', default: '' },
          { displayName: 'First Name', name: 'firstName', type: 'string', default: '' },
          { displayName: 'Last Name', name: 'lastName', type: 'string', default: '' },
          { displayName: 'Phone Number', name: 'phoneNumber', type: 'string', default: '' },
          { displayName: 'Organization', name: 'organization', type: 'string', default: '' },
          { displayName: 'Title', name: 'title', type: 'string', default: '' },
          { displayName: 'Image URL', name: 'image', type: 'string', default: '' },
          { displayName: 'City', name: 'city', type: 'string', default: '' },
          { displayName: 'Region', name: 'region', type: 'string', default: '' },
          { displayName: 'Country', name: 'country', type: 'string', default: '' },
          { displayName: 'Zip Code', name: 'zip', type: 'string', default: '' },
          {
            displayName: 'Custom Properties',
            name: 'properties',
            type: 'json',
            default: '{}',
            description: 'Custom properties as JSON object',
          },
        ],
      },

      // Update Fields for updateProfile
      {
        displayName: 'Update Fields',
        name: 'updateFields',
        type: 'collection',
        placeholder: 'Add Field',
        default: {},
        displayOptions: {
          show: {
            resource: ['profile'],
            operation: ['updateProfile'],
          },
        },
        options: [
          { displayName: 'Email', name: 'email', type: 'string', default: '' },
          { displayName: 'External ID', name: 'externalId', type: 'string', default: '' },
          { displayName: 'First Name', name: 'firstName', type: 'string', default: '' },
          { displayName: 'Last Name', name: 'lastName', type: 'string', default: '' },
          { displayName: 'Phone Number', name: 'phoneNumber', type: 'string', default: '' },
          { displayName: 'Organization', name: 'organization', type: 'string', default: '' },
          { displayName: 'Title', name: 'title', type: 'string', default: '' },
          { displayName: 'Image URL', name: 'image', type: 'string', default: '' },
          { displayName: 'City', name: 'city', type: 'string', default: '' },
          { displayName: 'Region', name: 'region', type: 'string', default: '' },
          { displayName: 'Country', name: 'country', type: 'string', default: '' },
          { displayName: 'Zip Code', name: 'zip', type: 'string', default: '' },
          {
            displayName: 'Custom Properties',
            name: 'properties',
            type: 'json',
            default: '{}',
            description: 'Custom properties as JSON object',
          },
        ],
      },

      // Source Profile ID for merge
      {
        displayName: 'Source Profile ID',
        name: 'sourceProfileId',
        type: 'string',
        required: true,
        default: '',
        description: 'The profile to merge from (will be deleted)',
        displayOptions: {
          show: {
            resource: ['profile'],
            operation: ['mergeProfiles'],
          },
        },
      },

      // Destination Profile ID for merge
      {
        displayName: 'Destination Profile ID',
        name: 'destinationProfileId',
        type: 'string',
        required: true,
        default: '',
        description: 'The profile to merge into (will be kept)',
        displayOptions: {
          show: {
            resource: ['profile'],
            operation: ['mergeProfiles'],
          },
        },
      },

      // Profile IDs for subscription operations
      {
        displayName: 'Profile IDs',
        name: 'profileIds',
        type: 'string',
        required: true,
        default: '',
        description: 'Comma-separated list of profile IDs',
        displayOptions: {
          show: {
            resource: ['profile'],
            operation: ['subscribeProfiles', 'unsubscribeProfiles', 'suppressProfiles', 'unsuppressProfiles'],
          },
        },
      },

      // List ID for subscription
      {
        displayName: 'List ID',
        name: 'listId',
        type: 'string',
        required: true,
        default: '',
        displayOptions: {
          show: {
            resource: ['profile'],
            operation: ['subscribeProfiles', 'unsubscribeProfiles'],
          },
        },
      },

      // Channel for subscription
      {
        displayName: 'Channel',
        name: 'channel',
        type: 'options',
        options: [
          { name: 'Email', value: 'EMAIL' },
          { name: 'SMS', value: 'SMS' },
          { name: 'Push', value: 'PUSH' },
        ],
        default: 'EMAIL',
        displayOptions: {
          show: {
            resource: ['profile'],
            operation: ['subscribeProfiles', 'unsubscribeProfiles'],
          },
        },
      },

      // Profiles for bulk operations
      {
        displayName: 'Profiles',
        name: 'profiles',
        type: 'json',
        required: true,
        default: '[]',
        description: 'Array of profile objects for bulk operations',
        displayOptions: {
          show: {
            resource: ['profile'],
            operation: ['bulkCreateProfiles', 'bulkUpdateProfiles'],
          },
        },
      },

      // ==================== LIST PARAMETERS ====================

      // List ID
      {
        displayName: 'List ID',
        name: 'listId',
        type: 'string',
        required: true,
        default: '',
        displayOptions: {
          show: {
            resource: ['list'],
            operation: ['getList', 'updateList', 'deleteList', 'getListProfiles', 'addProfilesToList', 'removeProfilesFromList', 'getListRelationships', 'getListTags'],
          },
        },
      },

      // List Name for create
      {
        displayName: 'Name',
        name: 'name',
        type: 'string',
        required: true,
        default: '',
        displayOptions: {
          show: {
            resource: ['list'],
            operation: ['createList'],
          },
        },
      },

      // Profile IDs for list operations
      {
        displayName: 'Profile IDs',
        name: 'profileIds',
        type: 'string',
        required: true,
        default: '',
        description: 'Comma-separated list of profile IDs',
        displayOptions: {
          show: {
            resource: ['list'],
            operation: ['addProfilesToList', 'removeProfilesFromList'],
          },
        },
      },

      // Update Fields for updateList
      {
        displayName: 'Update Fields',
        name: 'updateFields',
        type: 'collection',
        placeholder: 'Add Field',
        default: {},
        displayOptions: {
          show: {
            resource: ['list'],
            operation: ['updateList'],
          },
        },
        options: [
          { displayName: 'Name', name: 'name', type: 'string', default: '' },
        ],
      },

      // Relationship Type for list
      {
        displayName: 'Relationship Type',
        name: 'relationshipType',
        type: 'options',
        options: [
          { name: 'Profiles', value: 'profiles' },
          { name: 'Tags', value: 'tags' },
        ],
        default: 'profiles',
        displayOptions: {
          show: {
            resource: ['list'],
            operation: ['getListRelationships'],
          },
        },
      },

      // ==================== SEGMENT PARAMETERS ====================

      // Segment ID
      {
        displayName: 'Segment ID',
        name: 'segmentId',
        type: 'string',
        required: true,
        default: '',
        displayOptions: {
          show: {
            resource: ['segment'],
            operation: ['getSegment', 'updateSegment', 'deleteSegment', 'getSegmentProfiles', 'getSegmentRelationships'],
          },
        },
      },

      // Segment Name for create
      {
        displayName: 'Name',
        name: 'name',
        type: 'string',
        required: true,
        default: '',
        displayOptions: {
          show: {
            resource: ['segment'],
            operation: ['createSegment'],
          },
        },
      },

      // Segment Definition
      {
        displayName: 'Definition',
        name: 'definition',
        type: 'json',
        required: true,
        default: '{"and": []}',
        description: 'Segment definition in Klaviyo format',
        displayOptions: {
          show: {
            resource: ['segment'],
            operation: ['createSegment'],
          },
        },
      },

      // Update Fields for updateSegment
      {
        displayName: 'Update Fields',
        name: 'updateFields',
        type: 'collection',
        placeholder: 'Add Field',
        default: {},
        displayOptions: {
          show: {
            resource: ['segment'],
            operation: ['updateSegment'],
          },
        },
        options: [
          { displayName: 'Name', name: 'name', type: 'string', default: '' },
          { displayName: 'Definition', name: 'definition', type: 'json', default: '' },
        ],
      },

      // Relationship Type for segment
      {
        displayName: 'Relationship Type',
        name: 'relationshipType',
        type: 'options',
        options: [
          { name: 'Profiles', value: 'profiles' },
          { name: 'Tags', value: 'tags' },
        ],
        default: 'profiles',
        displayOptions: {
          show: {
            resource: ['segment'],
            operation: ['getSegmentRelationships'],
          },
        },
      },

      // ==================== CAMPAIGN PARAMETERS ====================

      // Campaign ID
      {
        displayName: 'Campaign ID',
        name: 'campaignId',
        type: 'string',
        required: true,
        default: '',
        displayOptions: {
          show: {
            resource: ['campaign'],
            operation: ['getCampaign', 'updateCampaign', 'deleteCampaign', 'cloneCampaign', 'getCampaignMessage', 'sendCampaign', 'scheduleCampaign', 'cancelCampaign', 'getCampaignRecipientEstimation'],
          },
        },
      },

      // Campaign Name for create
      {
        displayName: 'Name',
        name: 'name',
        type: 'string',
        required: true,
        default: '',
        displayOptions: {
          show: {
            resource: ['campaign'],
            operation: ['createCampaign', 'cloneCampaign'],
          },
        },
      },

      // Campaign Type
      {
        displayName: 'Campaign Type',
        name: 'campaignType',
        type: 'options',
        options: [
          { name: 'Email', value: 'email' },
          { name: 'SMS', value: 'sms' },
        ],
        default: 'email',
        displayOptions: {
          show: {
            resource: ['campaign'],
            operation: ['createCampaign'],
          },
        },
      },

      // Audience ID for campaign
      {
        displayName: 'Audience ID',
        name: 'audienceId',
        type: 'string',
        required: true,
        default: '',
        description: 'List or Segment ID for the campaign audience',
        displayOptions: {
          show: {
            resource: ['campaign'],
            operation: ['createCampaign'],
          },
        },
      },

      // Message ID for campaign message
      {
        displayName: 'Message ID',
        name: 'messageId',
        type: 'string',
        required: true,
        default: '',
        displayOptions: {
          show: {
            resource: ['campaign'],
            operation: ['updateCampaignMessage'],
          },
        },
      },

      // Schedule Time
      {
        displayName: 'Send Time',
        name: 'sendTime',
        type: 'dateTime',
        required: true,
        default: '',
        displayOptions: {
          show: {
            resource: ['campaign'],
            operation: ['scheduleCampaign'],
          },
        },
      },

      // Update Fields for updateCampaign
      {
        displayName: 'Update Fields',
        name: 'updateFields',
        type: 'collection',
        placeholder: 'Add Field',
        default: {},
        displayOptions: {
          show: {
            resource: ['campaign'],
            operation: ['updateCampaign'],
          },
        },
        options: [
          { displayName: 'Name', name: 'name', type: 'string', default: '' },
          { displayName: 'Audiences', name: 'audiences', type: 'json', default: '' },
          { displayName: 'Send Options', name: 'sendOptions', type: 'json', default: '' },
        ],
      },

      // Update Fields for updateCampaignMessage
      {
        displayName: 'Update Fields',
        name: 'updateFields',
        type: 'collection',
        placeholder: 'Add Field',
        default: {},
        displayOptions: {
          show: {
            resource: ['campaign'],
            operation: ['updateCampaignMessage'],
          },
        },
        options: [
          { displayName: 'Subject', name: 'subject', type: 'string', default: '' },
          { displayName: 'Preview Text', name: 'previewText', type: 'string', default: '' },
          { displayName: 'From Email', name: 'fromEmail', type: 'string', default: '' },
          { displayName: 'From Label', name: 'fromLabel', type: 'string', default: '' },
          { displayName: 'Template ID', name: 'templateId', type: 'string', default: '' },
        ],
      },

      // Additional Fields for createCampaign
      {
        displayName: 'Additional Fields',
        name: 'additionalFields',
        type: 'collection',
        placeholder: 'Add Field',
        default: {},
        displayOptions: {
          show: {
            resource: ['campaign'],
            operation: ['createCampaign'],
          },
        },
        options: [
          { displayName: 'Subject', name: 'subject', type: 'string', default: '' },
          { displayName: 'Preview Text', name: 'previewText', type: 'string', default: '' },
          { displayName: 'From Email', name: 'fromEmail', type: 'string', default: '' },
          { displayName: 'From Label', name: 'fromLabel', type: 'string', default: '' },
          { displayName: 'Template ID', name: 'templateId', type: 'string', default: '' },
        ],
      },

      // ==================== FLOW PARAMETERS ====================

      // Flow ID
      {
        displayName: 'Flow ID',
        name: 'flowId',
        type: 'string',
        required: true,
        default: '',
        displayOptions: {
          show: {
            resource: ['flow'],
            operation: ['getFlow', 'updateFlowStatus', 'getFlowActions', 'getFlowMessages'],
          },
        },
      },

      // Flow Status
      {
        displayName: 'Status',
        name: 'status',
        type: 'options',
        options: [
          { name: 'Live', value: 'live' },
          { name: 'Manual', value: 'manual' },
          { name: 'Draft', value: 'draft' },
        ],
        default: 'live',
        displayOptions: {
          show: {
            resource: ['flow'],
            operation: ['updateFlowStatus'],
          },
        },
      },

      // Action ID
      {
        displayName: 'Action ID',
        name: 'actionId',
        type: 'string',
        required: true,
        default: '',
        displayOptions: {
          show: {
            resource: ['flow'],
            operation: ['getFlowAction', 'updateFlowAction'],
          },
        },
      },

      // Message ID for flow
      {
        displayName: 'Message ID',
        name: 'messageId',
        type: 'string',
        required: true,
        default: '',
        displayOptions: {
          show: {
            resource: ['flow'],
            operation: ['getFlowMessage', 'updateFlowMessage'],
          },
        },
      },

      // Update Fields for updateFlowAction
      {
        displayName: 'Update Fields',
        name: 'updateFields',
        type: 'collection',
        placeholder: 'Add Field',
        default: {},
        displayOptions: {
          show: {
            resource: ['flow'],
            operation: ['updateFlowAction'],
          },
        },
        options: [
          {
            displayName: 'Status',
            name: 'status',
            type: 'options',
            options: [
              { name: 'Live', value: 'live' },
              { name: 'Manual', value: 'manual' },
              { name: 'Draft', value: 'draft' },
            ],
            default: 'live',
          },
          { displayName: 'Settings', name: 'settings', type: 'json', default: '{}' },
        ],
      },

      // Update Fields for updateFlowMessage
      {
        displayName: 'Update Fields',
        name: 'updateFields',
        type: 'collection',
        placeholder: 'Add Field',
        default: {},
        displayOptions: {
          show: {
            resource: ['flow'],
            operation: ['updateFlowMessage'],
          },
        },
        options: [
          { displayName: 'Subject', name: 'subject', type: 'string', default: '' },
          { displayName: 'Preview Text', name: 'previewText', type: 'string', default: '' },
          { displayName: 'From Email', name: 'fromEmail', type: 'string', default: '' },
          { displayName: 'From Label', name: 'fromLabel', type: 'string', default: '' },
          { displayName: 'Content', name: 'content', type: 'json', default: '{}' },
        ],
      },

      // ==================== EVENT PARAMETERS ====================

      // Event ID
      {
        displayName: 'Event ID',
        name: 'eventId',
        type: 'string',
        required: true,
        default: '',
        displayOptions: {
          show: {
            resource: ['event'],
            operation: ['getEvent', 'getEventMetrics', 'getEventProfiles'],
          },
        },
      },

      // Metric Name for createEvent
      {
        displayName: 'Metric Name',
        name: 'metricName',
        type: 'string',
        required: true,
        default: '',
        description: 'The name of the event/metric to track',
        displayOptions: {
          show: {
            resource: ['event'],
            operation: ['createEvent'],
          },
        },
      },

      // Profile Identifier for createEvent
      {
        displayName: 'Profile Identifier',
        name: 'profileIdentifier',
        type: 'string',
        required: true,
        default: '',
        description: 'Email or profile ID of the person',
        displayOptions: {
          show: {
            resource: ['event'],
            operation: ['createEvent'],
          },
        },
      },

      // Event Properties
      {
        displayName: 'Properties',
        name: 'properties',
        type: 'json',
        default: '{}',
        description: 'Custom properties for the event',
        displayOptions: {
          show: {
            resource: ['event'],
            operation: ['createEvent'],
          },
        },
      },

      // Events for bulk create
      {
        displayName: 'Events',
        name: 'events',
        type: 'json',
        required: true,
        default: '[]',
        description: 'Array of event objects for bulk creation',
        displayOptions: {
          show: {
            resource: ['event'],
            operation: ['bulkCreateEvents'],
          },
        },
      },

      // ==================== METRIC PARAMETERS ====================

      // Metric ID
      {
        displayName: 'Metric ID',
        name: 'metricId',
        type: 'string',
        required: true,
        default: '',
        displayOptions: {
          show: {
            resource: ['metric'],
            operation: ['getMetric', 'queryMetricAggregates', 'getMetricTimeline'],
          },
        },
      },

      // Aggregation for queryMetricAggregates
      {
        displayName: 'Measurements',
        name: 'measurements',
        type: 'multiOptions',
        options: [
          { name: 'Count', value: 'count' },
          { name: 'Sum Value', value: 'sum_value' },
          { name: 'Unique', value: 'unique' },
        ],
        default: ['count'],
        displayOptions: {
          show: {
            resource: ['metric'],
            operation: ['queryMetricAggregates'],
          },
        },
      },

      // Time Interval
      {
        displayName: 'Interval',
        name: 'interval',
        type: 'options',
        options: [
          { name: 'Day', value: 'day' },
          { name: 'Hour', value: 'hour' },
          { name: 'Month', value: 'month' },
          { name: 'Week', value: 'week' },
        ],
        default: 'day',
        displayOptions: {
          show: {
            resource: ['metric'],
            operation: ['queryMetricAggregates'],
          },
        },
      },

      // Date Range
      {
        displayName: 'Start Date',
        name: 'startDate',
        type: 'dateTime',
        default: '',
        displayOptions: {
          show: {
            resource: ['metric'],
            operation: ['queryMetricAggregates', 'getMetricTimeline'],
          },
        },
      },

      {
        displayName: 'End Date',
        name: 'endDate',
        type: 'dateTime',
        default: '',
        displayOptions: {
          show: {
            resource: ['metric'],
            operation: ['queryMetricAggregates', 'getMetricTimeline'],
          },
        },
      },

      // ==================== CATALOG PARAMETERS ====================

      // Catalog Item ID
      {
        displayName: 'Item ID',
        name: 'itemId',
        type: 'string',
        required: true,
        default: '',
        displayOptions: {
          show: {
            resource: ['catalog'],
            operation: ['getCatalogItem', 'updateCatalogItem', 'deleteCatalogItem', 'getCatalogVariants', 'createCatalogVariant'],
          },
        },
      },

      // Variant ID
      {
        displayName: 'Variant ID',
        name: 'variantId',
        type: 'string',
        required: true,
        default: '',
        displayOptions: {
          show: {
            resource: ['catalog'],
            operation: ['updateCatalogVariant', 'deleteCatalogVariant'],
          },
        },
      },

      // External ID for catalog
      {
        displayName: 'External ID',
        name: 'externalId',
        type: 'string',
        required: true,
        default: '',
        description: 'External ID for the catalog item',
        displayOptions: {
          show: {
            resource: ['catalog'],
            operation: ['createCatalogItem', 'createCatalogVariant'],
          },
        },
      },

      // Title for catalog
      {
        displayName: 'Title',
        name: 'title',
        type: 'string',
        required: true,
        default: '',
        displayOptions: {
          show: {
            resource: ['catalog'],
            operation: ['createCatalogItem', 'createCatalogVariant'],
          },
        },
      },

      // URL for catalog
      {
        displayName: 'URL',
        name: 'url',
        type: 'string',
        required: true,
        default: '',
        displayOptions: {
          show: {
            resource: ['catalog'],
            operation: ['createCatalogItem', 'createCatalogVariant'],
          },
        },
      },

      // Additional Fields for createCatalogItem
      {
        displayName: 'Additional Fields',
        name: 'additionalFields',
        type: 'collection',
        placeholder: 'Add Field',
        default: {},
        displayOptions: {
          show: {
            resource: ['catalog'],
            operation: ['createCatalogItem', 'createCatalogVariant'],
          },
        },
        options: [
          { displayName: 'Description', name: 'description', type: 'string', default: '' },
          { displayName: 'Image Full URL', name: 'imageFullUrl', type: 'string', default: '' },
          { displayName: 'Image Thumbnail URL', name: 'imageThumbnailUrl', type: 'string', default: '' },
          { displayName: 'Price', name: 'price', type: 'number', default: 0 },
          { displayName: 'Custom Metadata', name: 'customMetadata', type: 'json', default: '{}' },
        ],
      },

      // Update Fields for catalog items
      {
        displayName: 'Update Fields',
        name: 'updateFields',
        type: 'collection',
        placeholder: 'Add Field',
        default: {},
        displayOptions: {
          show: {
            resource: ['catalog'],
            operation: ['updateCatalogItem', 'updateCatalogVariant'],
          },
        },
        options: [
          { displayName: 'Title', name: 'title', type: 'string', default: '' },
          { displayName: 'Description', name: 'description', type: 'string', default: '' },
          { displayName: 'URL', name: 'url', type: 'string', default: '' },
          { displayName: 'Image Full URL', name: 'imageFullUrl', type: 'string', default: '' },
          { displayName: 'Price', name: 'price', type: 'number', default: 0 },
          { displayName: 'Custom Metadata', name: 'customMetadata', type: 'json', default: '{}' },
        ],
      },

      // Category Name
      {
        displayName: 'Category Name',
        name: 'categoryName',
        type: 'string',
        required: true,
        default: '',
        displayOptions: {
          show: {
            resource: ['catalog'],
            operation: ['createCatalogCategory'],
          },
        },
      },

      // Category External ID
      {
        displayName: 'Category External ID',
        name: 'categoryExternalId',
        type: 'string',
        required: true,
        default: '',
        displayOptions: {
          show: {
            resource: ['catalog'],
            operation: ['createCatalogCategory'],
          },
        },
      },

      // Items for bulk operations
      {
        displayName: 'Items',
        name: 'items',
        type: 'json',
        required: true,
        default: '[]',
        description: 'Array of catalog items for bulk operations',
        displayOptions: {
          show: {
            resource: ['catalog'],
            operation: ['bulkCreateCatalogItems', 'bulkUpdateCatalogItems', 'bulkDeleteCatalogItems'],
          },
        },
      },

      // ==================== TEMPLATE PARAMETERS ====================

      // Template ID
      {
        displayName: 'Template ID',
        name: 'templateId',
        type: 'string',
        required: true,
        default: '',
        displayOptions: {
          show: {
            resource: ['template'],
            operation: ['getTemplate', 'updateTemplate', 'deleteTemplate', 'cloneTemplate', 'renderTemplate'],
          },
        },
      },

      // Template Name
      {
        displayName: 'Name',
        name: 'name',
        type: 'string',
        required: true,
        default: '',
        displayOptions: {
          show: {
            resource: ['template'],
            operation: ['createTemplate'],
          },
        },
      },

      // New Name for clone
      {
        displayName: 'New Name',
        name: 'newName',
        type: 'string',
        required: true,
        default: '',
        displayOptions: {
          show: {
            resource: ['template'],
            operation: ['cloneTemplate'],
          },
        },
      },

      // Editor Type
      {
        displayName: 'Editor Type',
        name: 'editorType',
        type: 'options',
        options: [
          { name: 'Code', value: 'CODE' },
          { name: 'Drag & Drop', value: 'USER_DRAGGABLE' },
        ],
        default: 'CODE',
        displayOptions: {
          show: {
            resource: ['template'],
            operation: ['createTemplate'],
          },
        },
      },

      // Additional Fields for createTemplate
      {
        displayName: 'Additional Fields',
        name: 'additionalFields',
        type: 'collection',
        placeholder: 'Add Field',
        default: {},
        displayOptions: {
          show: {
            resource: ['template'],
            operation: ['createTemplate'],
          },
        },
        options: [
          { displayName: 'HTML', name: 'html', type: 'string', typeOptions: { rows: 10 }, default: '' },
          { displayName: 'Text', name: 'text', type: 'string', typeOptions: { rows: 5 }, default: '' },
        ],
      },

      // Update Fields for updateTemplate
      {
        displayName: 'Update Fields',
        name: 'updateFields',
        type: 'collection',
        placeholder: 'Add Field',
        default: {},
        displayOptions: {
          show: {
            resource: ['template'],
            operation: ['updateTemplate'],
          },
        },
        options: [
          { displayName: 'Name', name: 'name', type: 'string', default: '' },
          { displayName: 'HTML', name: 'html', type: 'string', typeOptions: { rows: 10 }, default: '' },
          { displayName: 'Text', name: 'text', type: 'string', typeOptions: { rows: 5 }, default: '' },
        ],
      },

      // Context for renderTemplate
      {
        displayName: 'Context',
        name: 'context',
        type: 'json',
        default: '{}',
        description: 'Context data for template rendering',
        displayOptions: {
          show: {
            resource: ['template'],
            operation: ['renderTemplate'],
          },
        },
      },

      // ==================== TAG PARAMETERS ====================

      // Tag ID
      {
        displayName: 'Tag ID',
        name: 'tagId',
        type: 'string',
        required: true,
        default: '',
        displayOptions: {
          show: {
            resource: ['tag'],
            operation: ['getTag', 'updateTag', 'deleteTag', 'getTagRelationships', 'tagResources', 'untagResources'],
          },
        },
      },

      // Tag Name
      {
        displayName: 'Name',
        name: 'name',
        type: 'string',
        required: true,
        default: '',
        displayOptions: {
          show: {
            resource: ['tag'],
            operation: ['createTag', 'createTagGroup'],
          },
        },
      },

      // Tag Group ID
      {
        displayName: 'Tag Group ID',
        name: 'tagGroupId',
        type: 'string',
        default: '',
        displayOptions: {
          show: {
            resource: ['tag'],
            operation: ['createTag'],
          },
        },
      },

      // Update Fields for updateTag
      {
        displayName: 'Update Fields',
        name: 'updateFields',
        type: 'collection',
        placeholder: 'Add Field',
        default: {},
        displayOptions: {
          show: {
            resource: ['tag'],
            operation: ['updateTag'],
          },
        },
        options: [
          { displayName: 'Name', name: 'name', type: 'string', default: '' },
        ],
      },

      // Additional Fields for createTagGroup
      {
        displayName: 'Additional Fields',
        name: 'additionalFields',
        type: 'collection',
        placeholder: 'Add Field',
        default: {},
        displayOptions: {
          show: {
            resource: ['tag'],
            operation: ['createTagGroup'],
          },
        },
        options: [
          { displayName: 'Exclusive', name: 'exclusive', type: 'boolean', default: false },
          { displayName: 'Default', name: 'default', type: 'boolean', default: false },
        ],
      },

      // Relationship Type for tag
      {
        displayName: 'Relationship Type',
        name: 'relationshipType',
        type: 'options',
        options: [
          { name: 'Campaigns', value: 'campaigns' },
          { name: 'Flows', value: 'flows' },
          { name: 'Lists', value: 'lists' },
          { name: 'Segments', value: 'segments' },
        ],
        default: 'campaigns',
        displayOptions: {
          show: {
            resource: ['tag'],
            operation: ['getTagRelationships'],
          },
        },
      },

      // Resource Type for tagging
      {
        displayName: 'Resource Type',
        name: 'resourceType',
        type: 'options',
        options: [
          { name: 'Campaign', value: 'campaign' },
          { name: 'Flow', value: 'flow' },
          { name: 'List', value: 'list' },
          { name: 'Segment', value: 'segment' },
        ],
        default: 'campaign',
        displayOptions: {
          show: {
            resource: ['tag'],
            operation: ['tagResources', 'untagResources'],
          },
        },
      },

      // Resource IDs for tagging
      {
        displayName: 'Resource IDs',
        name: 'resourceIds',
        type: 'string',
        required: true,
        default: '',
        description: 'Comma-separated list of resource IDs',
        displayOptions: {
          show: {
            resource: ['tag'],
            operation: ['tagResources', 'untagResources'],
          },
        },
      },

      // ==================== COUPON PARAMETERS ====================

      // Coupon ID
      {
        displayName: 'Coupon ID',
        name: 'couponId',
        type: 'string',
        required: true,
        default: '',
        displayOptions: {
          show: {
            resource: ['coupon'],
            operation: ['getCoupon', 'updateCoupon', 'deleteCoupon', 'getCouponCodes', 'createCouponCodes', 'bulkCreateCouponCodes'],
          },
        },
      },

      // External ID for coupon
      {
        displayName: 'External ID',
        name: 'externalId',
        type: 'string',
        required: true,
        default: '',
        displayOptions: {
          show: {
            resource: ['coupon'],
            operation: ['createCoupon'],
          },
        },
      },

      // Description for coupon
      {
        displayName: 'Description',
        name: 'description',
        type: 'string',
        default: '',
        displayOptions: {
          show: {
            resource: ['coupon'],
            operation: ['createCoupon'],
          },
        },
      },

      // Update Fields for updateCoupon
      {
        displayName: 'Update Fields',
        name: 'updateFields',
        type: 'collection',
        placeholder: 'Add Field',
        default: {},
        displayOptions: {
          show: {
            resource: ['coupon'],
            operation: ['updateCoupon'],
          },
        },
        options: [
          { displayName: 'Description', name: 'description', type: 'string', default: '' },
        ],
      },

      // Unique Code for coupon codes
      {
        displayName: 'Unique Code',
        name: 'uniqueCode',
        type: 'string',
        required: true,
        default: '',
        displayOptions: {
          show: {
            resource: ['coupon'],
            operation: ['createCouponCodes'],
          },
        },
      },

      // Additional Fields for createCouponCodes
      {
        displayName: 'Additional Fields',
        name: 'additionalFields',
        type: 'collection',
        placeholder: 'Add Field',
        default: {},
        displayOptions: {
          show: {
            resource: ['coupon'],
            operation: ['createCouponCodes'],
          },
        },
        options: [
          { displayName: 'Expires At', name: 'expiresAt', type: 'dateTime', default: '' },
        ],
      },

      // Codes for bulk create
      {
        displayName: 'Codes',
        name: 'codes',
        type: 'json',
        required: true,
        default: '[]',
        description: 'Array of coupon code objects',
        displayOptions: {
          show: {
            resource: ['coupon'],
            operation: ['bulkCreateCouponCodes'],
          },
        },
      },

      // ==================== IMAGE PARAMETERS ====================

      // Image ID
      {
        displayName: 'Image ID',
        name: 'imageId',
        type: 'string',
        required: true,
        default: '',
        displayOptions: {
          show: {
            resource: ['image'],
            operation: ['getImage', 'updateImage', 'deleteImage'],
          },
        },
      },

      // Binary Property Name for upload
      {
        displayName: 'Binary Property',
        name: 'binaryPropertyName',
        type: 'string',
        default: 'data',
        displayOptions: {
          show: {
            resource: ['image'],
            operation: ['uploadImage'],
          },
        },
      },

      // Image Name
      {
        displayName: 'Name',
        name: 'name',
        type: 'string',
        default: '',
        displayOptions: {
          show: {
            resource: ['image'],
            operation: ['uploadImage', 'uploadImageFromUrl'],
          },
        },
      },

      // Image URL for upload from URL
      {
        displayName: 'Image URL',
        name: 'imageUrl',
        type: 'string',
        required: true,
        default: '',
        displayOptions: {
          show: {
            resource: ['image'],
            operation: ['uploadImageFromUrl'],
          },
        },
      },

      // Hidden flag
      {
        displayName: 'Hidden',
        name: 'hidden',
        type: 'boolean',
        default: false,
        displayOptions: {
          show: {
            resource: ['image'],
            operation: ['uploadImage', 'uploadImageFromUrl'],
          },
        },
      },

      // Update Fields for updateImage
      {
        displayName: 'Update Fields',
        name: 'updateFields',
        type: 'collection',
        placeholder: 'Add Field',
        default: {},
        displayOptions: {
          show: {
            resource: ['image'],
            operation: ['updateImage'],
          },
        },
        options: [
          { displayName: 'Name', name: 'name', type: 'string', default: '' },
          { displayName: 'Hidden', name: 'hidden', type: 'boolean', default: false },
        ],
      },

      // ==================== DATA PRIVACY PARAMETERS ====================

      // Identifier Type
      {
        displayName: 'Identifier Type',
        name: 'identifierType',
        type: 'options',
        options: [
          { name: 'Email', value: 'email' },
          { name: 'Phone Number', value: 'phone_number' },
          { name: 'Profile ID', value: 'profile_id' },
        ],
        default: 'email',
        displayOptions: {
          show: {
            resource: ['dataPrivacy'],
            operation: ['requestProfileDeletion'],
          },
        },
      },

      // Identifier
      {
        displayName: 'Identifier',
        name: 'identifier',
        type: 'string',
        required: true,
        default: '',
        displayOptions: {
          show: {
            resource: ['dataPrivacy'],
            operation: ['requestProfileDeletion'],
          },
        },
      },

      // Job ID
      {
        displayName: 'Job ID',
        name: 'jobId',
        type: 'string',
        required: true,
        default: '',
        displayOptions: {
          show: {
            resource: ['dataPrivacy'],
            operation: ['getDataPrivacyDeletionJob'],
          },
        },
      },

      // ==================== WEBHOOK PARAMETERS ====================

      // Webhook ID
      {
        displayName: 'Webhook ID',
        name: 'webhookId',
        type: 'string',
        required: true,
        default: '',
        displayOptions: {
          show: {
            resource: ['webhook'],
            operation: ['getWebhook', 'updateWebhook', 'deleteWebhook'],
          },
        },
      },

      // Webhook Name
      {
        displayName: 'Name',
        name: 'name',
        type: 'string',
        required: true,
        default: '',
        displayOptions: {
          show: {
            resource: ['webhook'],
            operation: ['createWebhook'],
          },
        },
      },

      // Endpoint URL
      {
        displayName: 'Endpoint URL',
        name: 'endpointUrl',
        type: 'string',
        required: true,
        default: '',
        displayOptions: {
          show: {
            resource: ['webhook'],
            operation: ['createWebhook'],
          },
        },
      },

      // Topics
      {
        displayName: 'Topics',
        name: 'topics',
        type: 'multiOptions',
        options: [
          { name: 'Campaign Sent', value: 'campaign:sent' },
          { name: 'Event Created', value: 'event:created' },
          { name: 'Flow Message Sent', value: 'flow-message:sent' },
          { name: 'Flow Triggered', value: 'flow:triggered' },
          { name: 'List Created', value: 'list:created' },
          { name: 'List Deleted', value: 'list:deleted' },
          { name: 'List Updated', value: 'list:updated' },
          { name: 'Profile Created', value: 'profile:created' },
          { name: 'Profile Subscribed', value: 'profile:subscribed' },
          { name: 'Profile Unsubscribed', value: 'profile:unsubscribed' },
          { name: 'Profile Updated', value: 'profile:updated' },
          { name: 'Segment Created', value: 'segment:created' },
          { name: 'Segment Deleted', value: 'segment:deleted' },
          { name: 'Segment Updated', value: 'segment:updated' },
        ],
        default: [],
        displayOptions: {
          show: {
            resource: ['webhook'],
            operation: ['createWebhook'],
          },
        },
      },

      // Additional Fields for createWebhook
      {
        displayName: 'Additional Fields',
        name: 'additionalFields',
        type: 'collection',
        placeholder: 'Add Field',
        default: {},
        displayOptions: {
          show: {
            resource: ['webhook'],
            operation: ['createWebhook'],
          },
        },
        options: [
          { displayName: 'Description', name: 'description', type: 'string', default: '' },
          { displayName: 'Secret Key', name: 'secretKey', type: 'string', typeOptions: { password: true }, default: '' },
        ],
      },

      // Update Fields for updateWebhook
      {
        displayName: 'Update Fields',
        name: 'updateFields',
        type: 'collection',
        placeholder: 'Add Field',
        default: {},
        displayOptions: {
          show: {
            resource: ['webhook'],
            operation: ['updateWebhook'],
          },
        },
        options: [
          { displayName: 'Name', name: 'name', type: 'string', default: '' },
          { displayName: 'Endpoint URL', name: 'endpointUrl', type: 'string', default: '' },
          { displayName: 'Description', name: 'description', type: 'string', default: '' },
          {
            displayName: 'Topics',
            name: 'topics',
            type: 'multiOptions',
            options: [
              { name: 'Campaign Sent', value: 'campaign:sent' },
              { name: 'Event Created', value: 'event:created' },
              { name: 'Flow Triggered', value: 'flow:triggered' },
              { name: 'Profile Created', value: 'profile:created' },
              { name: 'Profile Updated', value: 'profile:updated' },
              { name: 'Profile Subscribed', value: 'profile:subscribed' },
              { name: 'Profile Unsubscribed', value: 'profile:unsubscribed' },
            ],
            default: [],
          },
        ],
      },

      // ==================== OPTIONS PARAMETER (COMMON) ====================
      {
        displayName: 'Options',
        name: 'options',
        type: 'collection',
        placeholder: 'Add Option',
        default: {},
        displayOptions: {
          show: {
            operation: [
              'getProfiles', 'getProfile', 'getLists', 'getList', 'getSegments', 'getSegment',
              'getCampaigns', 'getCampaign', 'getFlows', 'getFlow', 'getEvents', 'getEvent',
              'getMetrics', 'getMetric', 'getCatalogItems', 'getCatalogItem', 'getTemplates',
              'getTemplate', 'getTags', 'getTag', 'getTagGroups', 'getCoupons', 'getCoupon',
              'getCouponCodes', 'getImages', 'getImage', 'getWebhooks', 'getWebhook',
              'getListProfiles', 'getSegmentProfiles', 'getCatalogVariants', 'getCatalogCategories',
              'getFlowActions', 'getFlowMessages',
            ],
          },
        },
        options: [
          {
            displayName: 'Fields',
            name: 'fields',
            type: 'string',
            default: '',
            description: 'Comma-separated list of fields to include (sparse fieldsets)',
          },
          {
            displayName: 'Include',
            name: 'include',
            type: 'string',
            default: '',
            description: 'Comma-separated list of relationships to include',
          },
          {
            displayName: 'Sort',
            name: 'sort',
            type: 'string',
            default: '',
            description: 'Field to sort by (prefix with - for descending)',
          },
          {
            displayName: 'Filter',
            name: 'filter',
            type: 'string',
            default: '',
            description: 'Klaviyo filter expression',
          },
        ],
      },

      // ==================== FILTERS PARAMETER ====================
      {
        displayName: 'Filters',
        name: 'filters',
        type: 'collection',
        placeholder: 'Add Filter',
        default: {},
        displayOptions: {
          show: {
            operation: ['getProfiles', 'getDataPrivacyDeletionJobs', 'getTemplates'],
          },
        },
        options: [
          {
            displayName: 'Email',
            name: 'email',
            type: 'string',
            default: '',
            displayOptions: { show: { '/operation': ['getProfiles'] } },
          },
          {
            displayName: 'Phone Number',
            name: 'phoneNumber',
            type: 'string',
            default: '',
            displayOptions: { show: { '/operation': ['getProfiles'] } },
          },
          {
            displayName: 'External ID',
            name: 'externalId',
            type: 'string',
            default: '',
            displayOptions: { show: { '/operation': ['getProfiles'] } },
          },
          {
            displayName: 'Status',
            name: 'status',
            type: 'options',
            options: [
              { name: 'Pending', value: 'pending' },
              { name: 'Processing', value: 'processing' },
              { name: 'Complete', value: 'complete' },
              { name: 'Failed', value: 'failed' },
            ],
            default: '',
            displayOptions: { show: { '/operation': ['getDataPrivacyDeletionJobs'] } },
          },
          {
            displayName: 'Created After',
            name: 'createdAfter',
            type: 'dateTime',
            default: '',
            displayOptions: { show: { '/operation': ['getDataPrivacyDeletionJobs'] } },
          },
          {
            displayName: 'Created Before',
            name: 'createdBefore',
            type: 'dateTime',
            default: '',
            displayOptions: { show: { '/operation': ['getDataPrivacyDeletionJobs'] } },
          },
          {
            displayName: 'Editor Type',
            name: 'editorType',
            type: 'options',
            options: [
              { name: 'Code', value: 'CODE' },
              { name: 'Drag & Drop', value: 'USER_DRAGGABLE' },
            ],
            default: '',
            displayOptions: { show: { '/operation': ['getTemplates'] } },
          },
        ],
      },
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const returnData: INodeExecutionData[] = [];
    const resource = this.getNodeParameter('resource', 0) as string;
    const operation = this.getNodeParameter('operation', 0) as string;

    for (let i = 0; i < items.length; i++) {
      try {
        let responseData: INodeExecutionData[] = [];

        // Route to appropriate handler
        switch (resource) {
          case 'profile':
            responseData = await handleProfileOperation.call(this, operation, i);
            break;
          case 'list':
            responseData = await handleListOperation.call(this, operation, i);
            break;
          case 'segment':
            responseData = await handleSegmentOperation.call(this, operation, i);
            break;
          case 'campaign':
            responseData = await handleCampaignOperation.call(this, operation, i);
            break;
          case 'flow':
            responseData = await handleFlowOperation.call(this, operation, i);
            break;
          case 'event':
            responseData = await handleEventOperation.call(this, operation, i);
            break;
          case 'metric':
            responseData = await handleMetricOperation.call(this, operation, i);
            break;
          case 'catalog':
            responseData = await handleCatalogOperation.call(this, operation, i);
            break;
          case 'template':
            responseData = await handleTemplateOperation.call(this, operation, i);
            break;
          case 'tag':
            responseData = await handleTagOperation.call(this, operation, i);
            break;
          case 'coupon':
            responseData = await handleCouponOperation.call(this, operation, i);
            break;
          case 'image':
            responseData = await handleImageOperation.call(this, operation, i);
            break;
          case 'dataPrivacy':
            responseData = await handleDataPrivacyOperation.call(this, operation, i);
            break;
          case 'webhook':
            responseData = await handleWebhookOperation.call(this, operation, i);
            break;
          default:
            throw new NodeOperationError(this.getNode(), `Unknown resource: ${resource}`, { itemIndex: i });
        }

        returnData.push(...responseData);
      } catch (error) {
        if (this.continueOnFail()) {
          returnData.push({ json: { error: (error as Error).message }, pairedItem: { item: i } });
          continue;
        }
        throw error;
      }
    }

    return [returnData];
  }
}

// Handler functions for each resource
async function handleProfileOperation(
  this: IExecuteFunctions,
  operation: string,
  index: number,
): Promise<INodeExecutionData[]> {
  switch (operation) {
    case 'getProfiles':
      return profiles.getProfiles.call(this, index);
    case 'getProfile':
      return profiles.getProfile.call(this, index);
    case 'createProfile':
      return profiles.createProfile.call(this, index);
    case 'updateProfile':
      return profiles.updateProfile.call(this, index);
    case 'deleteProfile':
      return profiles.deleteProfile.call(this, index);
    case 'mergeProfiles':
      return profiles.mergeProfiles.call(this, index);
    case 'getProfileLists':
      return profiles.getProfileLists.call(this, index);
    case 'getProfileSegments':
      return profiles.getProfileSegments.call(this, index);
    case 'subscribeProfiles':
      return profiles.subscribeProfiles.call(this, index);
    case 'unsubscribeProfiles':
      return profiles.unsubscribeProfiles.call(this, index);
    case 'suppressProfiles':
      return profiles.suppressProfiles.call(this, index);
    case 'unsuppressProfiles':
      return profiles.unsuppressProfiles.call(this, index);
    case 'bulkCreateProfiles':
      return profiles.bulkCreateProfiles.call(this, index);
    case 'bulkUpdateProfiles':
      return profiles.bulkUpdateProfiles.call(this, index);
    default:
      throw new Error(`Unknown profile operation: ${operation}`);
  }
}

async function handleListOperation(
  this: IExecuteFunctions,
  operation: string,
  index: number,
): Promise<INodeExecutionData[]> {
  switch (operation) {
    case 'getLists':
      return lists.getLists.call(this, index);
    case 'getList':
      return lists.getList.call(this, index);
    case 'createList':
      return lists.createList.call(this, index);
    case 'updateList':
      return lists.updateList.call(this, index);
    case 'deleteList':
      return lists.deleteList.call(this, index);
    case 'getListProfiles':
      return lists.getListProfiles.call(this, index);
    case 'addProfilesToList':
      return lists.addProfilesToList.call(this, index);
    case 'removeProfilesFromList':
      return lists.removeProfilesFromList.call(this, index);
    case 'getListRelationships':
      return lists.getListRelationships.call(this, index);
    case 'getListTags':
      return lists.getListTags.call(this, index);
    default:
      throw new Error(`Unknown list operation: ${operation}`);
  }
}

async function handleSegmentOperation(
  this: IExecuteFunctions,
  operation: string,
  index: number,
): Promise<INodeExecutionData[]> {
  switch (operation) {
    case 'getSegments':
      return segments.getSegments.call(this, index);
    case 'getSegment':
      return segments.getSegment.call(this, index);
    case 'createSegment':
      return segments.createSegment.call(this, index);
    case 'updateSegment':
      return segments.updateSegment.call(this, index);
    case 'deleteSegment':
      return segments.deleteSegment.call(this, index);
    case 'getSegmentProfiles':
      return segments.getSegmentProfiles.call(this, index);
    case 'getSegmentRelationships':
      return segments.getSegmentRelationships.call(this, index);
    default:
      throw new Error(`Unknown segment operation: ${operation}`);
  }
}

async function handleCampaignOperation(
  this: IExecuteFunctions,
  operation: string,
  index: number,
): Promise<INodeExecutionData[]> {
  switch (operation) {
    case 'getCampaigns':
      return campaigns.getCampaigns.call(this, index);
    case 'getCampaign':
      return campaigns.getCampaign.call(this, index);
    case 'createCampaign':
      return campaigns.createCampaign.call(this, index);
    case 'updateCampaign':
      return campaigns.updateCampaign.call(this, index);
    case 'deleteCampaign':
      return campaigns.deleteCampaign.call(this, index);
    case 'cloneCampaign':
      return campaigns.cloneCampaign.call(this, index);
    case 'getCampaignMessage':
      return campaigns.getCampaignMessage.call(this, index);
    case 'updateCampaignMessage':
      return campaigns.updateCampaignMessage.call(this, index);
    case 'sendCampaign':
      return campaigns.sendCampaign.call(this, index);
    case 'scheduleCampaign':
      return campaigns.scheduleCampaign.call(this, index);
    case 'cancelCampaign':
      return campaigns.cancelCampaign.call(this, index);
    case 'getCampaignRecipientEstimation':
      return campaigns.getCampaignRecipientEstimation.call(this, index);
    default:
      throw new Error(`Unknown campaign operation: ${operation}`);
  }
}

async function handleFlowOperation(
  this: IExecuteFunctions,
  operation: string,
  index: number,
): Promise<INodeExecutionData[]> {
  switch (operation) {
    case 'getFlows':
      return flows.getFlows.call(this, index);
    case 'getFlow':
      return flows.getFlow.call(this, index);
    case 'updateFlowStatus':
      return flows.updateFlowStatus.call(this, index);
    case 'getFlowActions':
      return flows.getFlowActions.call(this, index);
    case 'getFlowAction':
      return flows.getFlowAction.call(this, index);
    case 'updateFlowAction':
      return flows.updateFlowAction.call(this, index);
    case 'getFlowMessages':
      return flows.getFlowMessages.call(this, index);
    case 'getFlowMessage':
      return flows.getFlowMessage.call(this, index);
    case 'updateFlowMessage':
      return flows.updateFlowMessage.call(this, index);
    default:
      throw new Error(`Unknown flow operation: ${operation}`);
  }
}

async function handleEventOperation(
  this: IExecuteFunctions,
  operation: string,
  index: number,
): Promise<INodeExecutionData[]> {
  switch (operation) {
    case 'getEvents':
      return events.getEvents.call(this, index);
    case 'getEvent':
      return events.getEvent.call(this, index);
    case 'createEvent':
      return events.createEvent.call(this, index);
    case 'bulkCreateEvents':
      return events.bulkCreateEvents.call(this, index);
    case 'getEventMetrics':
      return events.getEventMetrics.call(this, index);
    case 'getEventProfiles':
      return events.getEventProfiles.call(this, index);
    default:
      throw new Error(`Unknown event operation: ${operation}`);
  }
}

async function handleMetricOperation(
  this: IExecuteFunctions,
  operation: string,
  index: number,
): Promise<INodeExecutionData[]> {
  switch (operation) {
    case 'getMetrics':
      return metrics.getMetrics.call(this, index);
    case 'getMetric':
      return metrics.getMetric.call(this, index);
    case 'queryMetricAggregates':
      return metrics.queryMetricAggregates.call(this, index);
    case 'getMetricTimeline':
      return metrics.getMetricTimeline.call(this, index);
    default:
      throw new Error(`Unknown metric operation: ${operation}`);
  }
}

async function handleCatalogOperation(
  this: IExecuteFunctions,
  operation: string,
  index: number,
): Promise<INodeExecutionData[]> {
  switch (operation) {
    case 'getCatalogItems':
      return catalogs.getCatalogItems.call(this, index);
    case 'getCatalogItem':
      return catalogs.getCatalogItem.call(this, index);
    case 'createCatalogItem':
      return catalogs.createCatalogItem.call(this, index);
    case 'updateCatalogItem':
      return catalogs.updateCatalogItem.call(this, index);
    case 'deleteCatalogItem':
      return catalogs.deleteCatalogItem.call(this, index);
    case 'getCatalogVariants':
      return catalogs.getCatalogVariants.call(this, index);
    case 'createCatalogVariant':
      return catalogs.createCatalogVariant.call(this, index);
    case 'updateCatalogVariant':
      return catalogs.updateCatalogVariant.call(this, index);
    case 'deleteCatalogVariant':
      return catalogs.deleteCatalogVariant.call(this, index);
    case 'getCatalogCategories':
      return catalogs.getCatalogCategories.call(this, index);
    case 'createCatalogCategory':
      return catalogs.createCatalogCategory.call(this, index);
    case 'bulkCreateCatalogItems':
      return catalogs.bulkCreateCatalogItems.call(this, index);
    case 'bulkUpdateCatalogItems':
      return catalogs.bulkUpdateCatalogItems.call(this, index);
    case 'bulkDeleteCatalogItems':
      return catalogs.bulkDeleteCatalogItems.call(this, index);
    default:
      throw new Error(`Unknown catalog operation: ${operation}`);
  }
}

async function handleTemplateOperation(
  this: IExecuteFunctions,
  operation: string,
  index: number,
): Promise<INodeExecutionData[]> {
  switch (operation) {
    case 'getTemplates':
      return templates.getTemplates.call(this, index);
    case 'getTemplate':
      return templates.getTemplate.call(this, index);
    case 'createTemplate':
      return templates.createTemplate.call(this, index);
    case 'updateTemplate':
      return templates.updateTemplate.call(this, index);
    case 'deleteTemplate':
      return templates.deleteTemplate.call(this, index);
    case 'cloneTemplate':
      return templates.cloneTemplate.call(this, index);
    case 'renderTemplate':
      return templates.renderTemplate.call(this, index);
    default:
      throw new Error(`Unknown template operation: ${operation}`);
  }
}

async function handleTagOperation(
  this: IExecuteFunctions,
  operation: string,
  index: number,
): Promise<INodeExecutionData[]> {
  switch (operation) {
    case 'getTags':
      return tags.getTags.call(this, index);
    case 'getTag':
      return tags.getTag.call(this, index);
    case 'createTag':
      return tags.createTag.call(this, index);
    case 'updateTag':
      return tags.updateTag.call(this, index);
    case 'deleteTag':
      return tags.deleteTag.call(this, index);
    case 'getTagGroups':
      return tags.getTagGroups.call(this, index);
    case 'createTagGroup':
      return tags.createTagGroup.call(this, index);
    case 'getTagRelationships':
      return tags.getTagRelationships.call(this, index);
    case 'tagResources':
      return tags.tagResources.call(this, index);
    case 'untagResources':
      return tags.untagResources.call(this, index);
    default:
      throw new Error(`Unknown tag operation: ${operation}`);
  }
}

async function handleCouponOperation(
  this: IExecuteFunctions,
  operation: string,
  index: number,
): Promise<INodeExecutionData[]> {
  switch (operation) {
    case 'getCoupons':
      return coupons.getCoupons.call(this, index);
    case 'getCoupon':
      return coupons.getCoupon.call(this, index);
    case 'createCoupon':
      return coupons.createCoupon.call(this, index);
    case 'updateCoupon':
      return coupons.updateCoupon.call(this, index);
    case 'deleteCoupon':
      return coupons.deleteCoupon.call(this, index);
    case 'getCouponCodes':
      return coupons.getCouponCodes.call(this, index);
    case 'createCouponCodes':
      return coupons.createCouponCodes.call(this, index);
    case 'bulkCreateCouponCodes':
      return coupons.bulkCreateCouponCodes.call(this, index);
    default:
      throw new Error(`Unknown coupon operation: ${operation}`);
  }
}

async function handleImageOperation(
  this: IExecuteFunctions,
  operation: string,
  index: number,
): Promise<INodeExecutionData[]> {
  switch (operation) {
    case 'getImages':
      return images.getImages.call(this, index);
    case 'getImage':
      return images.getImage.call(this, index);
    case 'uploadImage':
      return images.uploadImage.call(this, index);
    case 'uploadImageFromUrl':
      return images.uploadImageFromUrl.call(this, index);
    case 'updateImage':
      return images.updateImage.call(this, index);
    case 'deleteImage':
      return images.deleteImage.call(this, index);
    default:
      throw new Error(`Unknown image operation: ${operation}`);
  }
}

async function handleDataPrivacyOperation(
  this: IExecuteFunctions,
  operation: string,
  index: number,
): Promise<INodeExecutionData[]> {
  switch (operation) {
    case 'requestProfileDeletion':
      return dataPrivacy.requestProfileDeletion.call(this, index);
    case 'getDataPrivacyDeletionJobs':
      return dataPrivacy.getDataPrivacyDeletionJobs.call(this, index);
    case 'getDataPrivacyDeletionJob':
      return dataPrivacy.getDataPrivacyDeletionJob.call(this, index);
    default:
      throw new Error(`Unknown data privacy operation: ${operation}`);
  }
}

async function handleWebhookOperation(
  this: IExecuteFunctions,
  operation: string,
  index: number,
): Promise<INodeExecutionData[]> {
  switch (operation) {
    case 'getWebhooks':
      return webhooks.getWebhooks.call(this, index);
    case 'getWebhook':
      return webhooks.getWebhook.call(this, index);
    case 'createWebhook':
      return webhooks.createWebhook.call(this, index);
    case 'updateWebhook':
      return webhooks.updateWebhook.call(this, index);
    case 'deleteWebhook':
      return webhooks.deleteWebhook.call(this, index);
    case 'getWebhookTopics':
      return webhooks.getWebhookTopics.call(this, index);
    default:
      throw new Error(`Unknown webhook operation: ${operation}`);
  }
}
