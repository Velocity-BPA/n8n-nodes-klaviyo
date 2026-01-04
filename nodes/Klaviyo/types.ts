/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IDataObject } from 'n8n-workflow';

// JSON:API types
export interface JsonApiResource {
  type: string;
  id?: string;
  attributes?: IDataObject;
  relationships?: IDataObject;
  links?: IDataObject;
}

export interface JsonApiDocument {
  data: JsonApiResource | JsonApiResource[];
  included?: JsonApiResource[];
  links?: {
    self?: string;
    next?: string;
    prev?: string;
  };
  meta?: IDataObject;
}

export interface JsonApiError {
  id?: string;
  status?: string;
  code?: string;
  title?: string;
  detail?: string;
  source?: {
    pointer?: string;
    parameter?: string;
  };
}

export interface JsonApiErrorResponse {
  errors: JsonApiError[];
}

// Klaviyo specific types
export interface KlaviyoProfile {
  type: 'profile';
  id?: string;
  attributes: {
    email?: string;
    phone_number?: string;
    external_id?: string;
    first_name?: string;
    last_name?: string;
    organization?: string;
    title?: string;
    image?: string;
    location?: {
      address1?: string;
      address2?: string;
      city?: string;
      country?: string;
      region?: string;
      zip?: string;
      timezone?: string;
      ip?: string;
    };
    properties?: IDataObject;
    subscriptions?: {
      email?: {
        marketing?: {
          consent?: string;
          consent_timestamp?: string;
        };
      };
      sms?: {
        marketing?: {
          consent?: string;
          consent_timestamp?: string;
        };
      };
    };
  };
}

export interface KlaviyoList {
  type: 'list';
  id?: string;
  attributes: {
    name: string;
    created?: string;
    updated?: string;
    opt_in_process?: string;
  };
}

export interface KlaviyoSegment {
  type: 'segment';
  id?: string;
  attributes: {
    name: string;
    definition?: IDataObject;
    created?: string;
    updated?: string;
    is_active?: boolean;
    is_processing?: boolean;
    is_starred?: boolean;
  };
}

export interface KlaviyoCampaign {
  type: 'campaign';
  id?: string;
  attributes: {
    name: string;
    status?: string;
    archived?: boolean;
    audiences?: {
      included?: string[];
      excluded?: string[];
    };
    send_options?: {
      use_smart_sending?: boolean;
    };
    tracking_options?: {
      is_add_utm?: boolean;
      utm_params?: IDataObject[];
      is_tracking_clicks?: boolean;
      is_tracking_opens?: boolean;
    };
    send_strategy?: {
      method?: string;
      options_static?: {
        datetime?: string;
        is_local?: boolean;
        send_past_recipients_immediately?: boolean;
      };
      options_throttled?: {
        datetime?: string;
        throttle_percentage?: number;
      };
      options_sto?: {
        date?: string;
      };
    };
    created_at?: string;
    scheduled_at?: string;
    updated_at?: string;
    send_time?: string;
  };
}

export interface KlaviyoFlow {
  type: 'flow';
  id?: string;
  attributes: {
    name: string;
    status?: string;
    archived?: boolean;
    created?: string;
    updated?: string;
    trigger_type?: string;
  };
}

export interface KlaviyoEvent {
  type: 'event';
  id?: string;
  attributes: {
    metric_id?: string;
    profile_id?: string;
    timestamp?: string;
    event_properties?: IDataObject;
    datetime?: string;
    uuid?: string;
  };
}

export interface KlaviyoMetric {
  type: 'metric';
  id?: string;
  attributes: {
    name: string;
    created?: string;
    updated?: string;
    integration?: {
      id?: string;
      name?: string;
      category?: string;
    };
  };
}

export interface KlaviyoCatalogItem {
  type: 'catalog-item';
  id?: string;
  attributes: {
    external_id: string;
    title: string;
    description?: string;
    url?: string;
    image_full_url?: string;
    image_thumbnail_url?: string;
    images?: string[];
    custom_metadata?: IDataObject;
    published?: boolean;
    price?: number;
  };
}

export interface KlaviyoCatalogVariant {
  type: 'catalog-variant';
  id?: string;
  attributes: {
    external_id: string;
    catalog_type?: string;
    title: string;
    description?: string;
    sku?: string;
    inventory_policy?: number;
    inventory_quantity?: number;
    price?: number;
    url?: string;
    image_full_url?: string;
    image_thumbnail_url?: string;
    images?: string[];
    custom_metadata?: IDataObject;
    published?: boolean;
  };
}

export interface KlaviyoTemplate {
  type: 'template';
  id?: string;
  attributes: {
    name: string;
    editor_type?: string;
    html?: string;
    text?: string;
    created?: string;
    updated?: string;
  };
}

export interface KlaviyoTag {
  type: 'tag';
  id?: string;
  attributes: {
    name: string;
  };
}

export interface KlaviyoTagGroup {
  type: 'tag-group';
  id?: string;
  attributes: {
    name: string;
    exclusive?: boolean;
    default?: boolean;
  };
}

export interface KlaviyoCoupon {
  type: 'coupon';
  id?: string;
  attributes: {
    external_id: string;
    description?: string;
  };
}

export interface KlaviyoCouponCode {
  type: 'coupon-code';
  id?: string;
  attributes: {
    unique_code: string;
    expires_at?: string;
    status?: string;
  };
}

export interface KlaviyoImage {
  type: 'image';
  id?: string;
  attributes: {
    name?: string;
    image_url?: string;
    format?: string;
    size?: number;
    hidden?: boolean;
    updated_at?: string;
  };
}

export interface KlaviyoWebhook {
  type: 'webhook';
  id?: string;
  attributes: {
    name: string;
    description?: string;
    endpoint_url: string;
    enabled?: boolean;
    secret_key?: string;
  };
  relationships?: {
    webhook_topics?: {
      data: Array<{ type: string; id: string }>;
    };
  };
}

export interface KlaviyoBulkJob {
  type: string;
  id?: string;
  attributes: {
    status?: string;
    created_at?: string;
    total_count?: number;
    completed_count?: number;
    failed_count?: number;
    completed_at?: string;
    errors?: JsonApiError[];
  };
}

// Request/Response types
export interface KlaviyoPaginationOptions {
  pageSize?: number;
  pageCursor?: string;
  sort?: string;
}

export interface KlaviyoFilterOptions {
  filter?: string;
  fields?: string[];
  include?: string[];
}

export interface KlaviyoRequestOptions extends KlaviyoPaginationOptions, KlaviyoFilterOptions {
  additionalFields?: IDataObject;
}

// Resource and Operation types
export type KlaviyoResource =
  | 'profiles'
  | 'lists'
  | 'segments'
  | 'campaigns'
  | 'flows'
  | 'events'
  | 'metrics'
  | 'catalogs'
  | 'templates'
  | 'tags'
  | 'coupons'
  | 'images'
  | 'dataPrivacy'
  | 'webhooks';

// Webhook topic types
export type KlaviyoWebhookTopic =
  | 'profile.created'
  | 'profile.updated'
  | 'profile.merged'
  | 'profile.subscribed'
  | 'profile.unsubscribed'
  | 'profile.suppressed'
  | 'profile.unsuppressed'
  | 'event.created'
  | 'campaign.sent'
  | 'flow.triggered';
