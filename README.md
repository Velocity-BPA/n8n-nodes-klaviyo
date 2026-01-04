# n8n-nodes-klaviyo

> [Velocity BPA Licensing Notice]
>
> This n8n node is licensed under the Business Source License 1.1 (BSL 1.1).
>
> Use of this node by for-profit organizations in production environments requires a commercial license from Velocity BPA.
>
> For licensing information, visit https://velobpa.com/licensing or contact licensing@velobpa.com.

A comprehensive n8n community node for Klaviyo, the leading email and SMS marketing automation platform for e-commerce businesses. This node provides complete access to Klaviyo's API for managing profiles, lists, segments, campaigns, flows, events, catalogs, templates, and more.

![n8n](https://img.shields.io/badge/n8n-community--node-orange)
![Klaviyo](https://img.shields.io/badge/Klaviyo-API--2024--10--15-green)
![License](https://img.shields.io/badge/license-BSL--1.1-blue)

## Features

- **14 Resource Categories** with 100+ operations
- **Complete Profile Management** - Create, update, merge, subscribe, suppress profiles
- **List & Segment Management** - Static lists and dynamic segments
- **Campaign Operations** - Create, schedule, send, and track campaigns
- **Flow Automation** - Manage automated email/SMS sequences
- **Event Tracking** - Track custom events and behaviors
- **Catalog Sync** - Sync product catalogs for recommendations
- **Template Management** - Create and render email templates
- **Tag Organization** - Organize resources with tags
- **GDPR Compliance** - Built-in data privacy operations
- **Webhook Triggers** - Real-time event notifications
- **JSON:API Compliance** - Full filtering, pagination, and includes support
- **Bulk Operations** - Async job handling for large datasets

## Installation

### Community Nodes (Recommended)

1. Open n8n
2. Go to **Settings** > **Community Nodes**
3. Click **Install a community node**
4. Enter `n8n-nodes-klaviyo`
5. Click **Install**

### Manual Installation

```bash
# Navigate to your n8n installation
cd ~/.n8n

# Install the package
npm install n8n-nodes-klaviyo

# Restart n8n
```

### Development Installation

```bash
# Clone the repository
git clone https://github.com/Velocity-BPA/n8n-nodes-klaviyo.git
cd n8n-nodes-klaviyo

# Install dependencies
npm install

# Build the project
npm run build

# Create symlink
mkdir -p ~/.n8n/custom
ln -s $(pwd) ~/.n8n/custom/n8n-nodes-klaviyo

# Restart n8n
```

## Credentials Setup

| Field | Description | Required |
|-------|-------------|----------|
| Private API Key | Your Klaviyo private API key (starts with `pk_`) | Yes |
| Public API Key | Your Klaviyo public/site ID (optional, for client operations) | No |
| API Revision | API version date (default: 2024-10-15) | No |
| Base URL | API base URL (default: https://a.klaviyo.com) | No |

### Getting Your API Key

1. Log in to your Klaviyo account
2. Go to **Settings** > **Account** > **API Keys**
3. Create a new **Private API Key** with the required scopes
4. Copy the key (it starts with `pk_`)

## Resources & Operations

### Profiles (14 operations)
| Operation | Description |
|-----------|-------------|
| getProfiles | List profiles with filters |
| getProfile | Get profile by ID |
| createProfile | Create new profile |
| updateProfile | Update profile properties |
| deleteProfile | Delete profile |
| mergeProfiles | Merge duplicate profiles |
| getProfileLists | Get lists for profile |
| getProfileSegments | Get segments for profile |
| subscribeProfiles | Subscribe profiles to list/channel |
| unsubscribeProfiles | Unsubscribe profiles |
| suppressProfiles | Suppress profile (prevent emails) |
| unsuppressProfiles | Unsuppress profile |
| bulkCreateProfiles | Bulk create profiles job |
| bulkUpdateProfiles | Bulk update profiles job |

### Lists (10 operations)
| Operation | Description |
|-----------|-------------|
| getLists | Get all lists |
| getList | Get list by ID |
| createList | Create new list |
| updateList | Update list |
| deleteList | Delete list |
| getListProfiles | Get profiles in list |
| addProfilesToList | Add profiles to list |
| removeProfilesFromList | Remove profiles from list |
| getListRelationships | Get list relationships |
| getListTags | Get tags for list |

### Segments (7 operations)
| Operation | Description |
|-----------|-------------|
| getSegments | Get all segments |
| getSegment | Get segment by ID |
| createSegment | Create new segment |
| updateSegment | Update segment definition |
| deleteSegment | Delete segment |
| getSegmentProfiles | Get profiles in segment |
| getSegmentRelationships | Get segment relationships |

### Campaigns (12 operations)
| Operation | Description |
|-----------|-------------|
| getCampaigns | Get all campaigns |
| getCampaign | Get campaign by ID |
| createCampaign | Create new campaign |
| updateCampaign | Update campaign |
| deleteCampaign | Delete campaign |
| cloneCampaign | Clone existing campaign |
| getCampaignMessage | Get campaign message content |
| updateCampaignMessage | Update message content |
| sendCampaign | Send campaign immediately |
| scheduleCampaign | Schedule campaign |
| cancelCampaign | Cancel scheduled campaign |
| getCampaignRecipientEstimation | Estimate recipients |

### Flows (9 operations)
| Operation | Description |
|-----------|-------------|
| getFlows | Get all flows |
| getFlow | Get flow by ID |
| updateFlowStatus | Enable/disable flow |
| getFlowActions | Get flow action nodes |
| getFlowAction | Get specific action |
| updateFlowAction | Update action settings |
| getFlowMessages | Get flow messages |
| getFlowMessage | Get specific message |
| updateFlowMessage | Update message content |

### Events (6 operations)
| Operation | Description |
|-----------|-------------|
| getEvents | Get events with filters |
| getEvent | Get event by ID |
| createEvent | Create/track custom event |
| bulkCreateEvents | Bulk create events job |
| getEventMetrics | Get metrics for events |
| getEventProfiles | Get profiles for event |

### Metrics (4 operations)
| Operation | Description |
|-----------|-------------|
| getMetrics | Get all metrics |
| getMetric | Get metric by ID |
| queryMetricAggregates | Query aggregated metric data |
| getMetricTimeline | Get metric timeline |

### Catalogs (14 operations)
| Operation | Description |
|-----------|-------------|
| getCatalogItems | Get catalog items |
| getCatalogItem | Get item by ID |
| createCatalogItem | Create catalog item |
| updateCatalogItem | Update item |
| deleteCatalogItem | Delete item |
| getCatalogVariants | Get item variants |
| createCatalogVariant | Create variant |
| updateCatalogVariant | Update variant |
| deleteCatalogVariant | Delete variant |
| getCatalogCategories | Get categories |
| createCatalogCategory | Create category |
| bulkCreateCatalogItems | Bulk create items job |
| bulkUpdateCatalogItems | Bulk update items job |
| bulkDeleteCatalogItems | Bulk delete items job |

### Templates (7 operations)
| Operation | Description |
|-----------|-------------|
| getTemplates | Get all templates |
| getTemplate | Get template by ID |
| createTemplate | Create new template |
| updateTemplate | Update template |
| deleteTemplate | Delete template |
| cloneTemplate | Clone template |
| renderTemplate | Render template with data |

### Tags (10 operations)
| Operation | Description |
|-----------|-------------|
| getTags | Get all tags |
| getTag | Get tag by ID |
| createTag | Create new tag |
| updateTag | Update tag |
| deleteTag | Delete tag |
| getTagGroups | Get tag groups |
| createTagGroup | Create tag group |
| getTagRelationships | Get tagged resources |
| tagResources | Apply tag to resources |
| untagResources | Remove tag from resources |

### Coupons (8 operations)
| Operation | Description |
|-----------|-------------|
| getCoupons | Get all coupons |
| getCoupon | Get coupon by ID |
| createCoupon | Create coupon |
| updateCoupon | Update coupon |
| deleteCoupon | Delete coupon |
| getCouponCodes | Get codes for coupon |
| createCouponCodes | Create coupon codes |
| bulkCreateCouponCodes | Bulk create codes job |

### Images (5 operations)
| Operation | Description |
|-----------|-------------|
| getImages | Get all images |
| getImage | Get image by ID |
| uploadImage | Upload new image |
| updateImage | Update image metadata |
| deleteImage | Delete image |

### Data Privacy (2 operations)
| Operation | Description |
|-----------|-------------|
| requestProfileDeletion | Request profile deletion (GDPR) |
| getDataPrivacyDeletionJobs | Get deletion job status |

### Webhooks (6 operations)
| Operation | Description |
|-----------|-------------|
| getWebhooks | Get all webhooks |
| getWebhook | Get webhook by ID |
| createWebhook | Create webhook subscription |
| updateWebhook | Update webhook |
| deleteWebhook | Delete webhook |
| getWebhookTopics | Get available topics |

## Trigger Node

The **Klaviyo Trigger** node listens for real-time events:

| Event | Description |
|-------|-------------|
| profile.created | New profile created |
| profile.updated | Profile updated |
| profile.subscribed | Profile subscribed |
| profile.unsubscribed | Profile unsubscribed |
| event.created | Custom event tracked |
| campaign.sent | Campaign sent |
| flow.triggered | Flow triggered for profile |
| order.placed | Order event received |
| order.fulfilled | Fulfillment event |

## Usage Examples

### Track a Custom Event

```json
{
  "resource": "events",
  "operation": "createEvent",
  "metricName": "Viewed Product",
  "profileEmail": "customer@example.com",
  "properties": {
    "product_id": "PROD-123",
    "product_name": "Blue T-Shirt",
    "price": 29.99
  }
}
```

### Subscribe Profile to List

```json
{
  "resource": "profiles",
  "operation": "subscribeProfiles",
  "listId": "LIST-ID",
  "profiles": [
    {
      "email": "subscriber@example.com",
      "first_name": "John"
    }
  ],
  "channels": ["email", "sms"]
}
```

### Create a Campaign

```json
{
  "resource": "campaigns",
  "operation": "createCampaign",
  "name": "Summer Sale Campaign",
  "channel": "email",
  "listIds": ["LIST-ID"],
  "templateId": "TEMPLATE-ID"
}
```

## Klaviyo Concepts

| Concept | Description |
|---------|-------------|
| Profile | Contact/customer record with email, phone, and properties |
| List | Static collection of profiles (manual membership) |
| Segment | Dynamic collection based on conditions (auto-updating) |
| Flow | Automated email/SMS sequence triggered by events |
| Metric | Event type definition (e.g., "Ordered Product") |
| Event | Tracked user action with timestamp and properties |
| Catalog | Product catalog for personalized recommendations |
| Revision | API version (date format: YYYY-MM-DD) |

## Error Handling

The node handles Klaviyo's JSON:API error responses and provides clear error messages:

- **400** - Bad Request (invalid parameters)
- **401** - Unauthorized (invalid API key)
- **403** - Forbidden (insufficient permissions)
- **404** - Not Found (resource doesn't exist)
- **409** - Conflict (duplicate resource)
- **429** - Rate Limited (retry with backoff)
- **500** - Server Error (Klaviyo issue)

Rate limiting is handled automatically with exponential backoff.

## Security Best Practices

1. **Use Private API Keys** - Never expose private keys in client-side code
2. **Limit Scopes** - Only grant required permissions to API keys
3. **Rotate Keys** - Regularly rotate API keys
4. **Monitor Usage** - Track API usage in Klaviyo dashboard
5. **Secure Storage** - Store credentials securely in n8n

## Development

```bash
# Install dependencies
npm install

# Build
npm run build

# Watch mode
npm run dev

# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Lint
npm run lint

# Lint and fix
npm run lint:fix

# Format code
npm run format
```

## Author

**Velocity BPA**
- Website: [velobpa.com](https://velobpa.com)
- GitHub: [Velocity-BPA](https://github.com/Velocity-BPA)

## Licensing

This n8n community node is licensed under the **Business Source License 1.1**.

### Free Use
Permitted for personal, educational, research, and internal business use.

### Commercial Use
Use of this node within any SaaS, PaaS, hosted platform, managed service, or paid automation offering requires a commercial license.

For licensing inquiries: **licensing@velobpa.com**

See [LICENSE](LICENSE), [COMMERCIAL_LICENSE.md](COMMERCIAL_LICENSE.md), and [LICENSING_FAQ.md](LICENSING_FAQ.md) for details.

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

Please ensure:
- All tests pass
- Code follows the existing style
- Documentation is updated

## Support

- **Documentation**: [Klaviyo API Docs](https://developers.klaviyo.com/en)
- **Issues**: [GitHub Issues](https://github.com/Velocity-BPA/n8n-nodes-klaviyo/issues)
- **n8n Community**: [n8n Community Forum](https://community.n8n.io)

## Acknowledgments

- [Klaviyo](https://www.klaviyo.com) for their comprehensive API
- [n8n](https://n8n.io) for the automation platform
- The n8n community for feedback and contributions
