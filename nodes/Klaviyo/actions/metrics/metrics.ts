/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IDataObject, IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { klaviyoApiRequest, klaviyoApiRequestAllItems } from '../../transport/klaviyoApi';
import { cleanObject } from '../../utils/helpers';

export async function getMetrics(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const returnAll = this.getNodeParameter('returnAll', index) as boolean;
  const limit = this.getNodeParameter('limit', index, 100) as number;
  const options = this.getNodeParameter('options', index, {}) as IDataObject;

  const query: IDataObject = {};

  if (options.filter) {
    query.filter = options.filter;
  }

  if (options.fields) {
    query['fields[metric]'] = (options.fields as string[]).join(',');
  }

  query['page[size]'] = returnAll ? 100 : Math.min(limit, 100);

  let metrics: IDataObject[];

  if (returnAll) {
    metrics = await klaviyoApiRequestAllItems.call(this, this, 'GET', '/api/metrics/', undefined, query);
  } else {
    metrics = await klaviyoApiRequestAllItems.call(this, this, 'GET', '/api/metrics/', undefined, query, limit);
  }

  return metrics.map((metric) => ({ json: metric }));
}

export async function getMetric(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const metricId = this.getNodeParameter('metricId', index) as string;
  const options = this.getNodeParameter('options', index, {}) as IDataObject;

  const query: IDataObject = {};

  if (options.fields) {
    query['fields[metric]'] = (options.fields as string[]).join(',');
  }

  const response = await klaviyoApiRequest.call(this, this, 'GET', `/api/metrics/${metricId}/`, undefined, query);
  return [{ json: response as IDataObject }];
}

export async function queryMetricAggregates(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const metricId = this.getNodeParameter('metricId', index) as string;
  const measurements = this.getNodeParameter('measurements', index) as string[];
  const interval = this.getNodeParameter('interval', index, 'day') as string;
  const filterOptions = this.getNodeParameter('filterOptions', index, {}) as IDataObject;
  const options = this.getNodeParameter('options', index, {}) as IDataObject;

  const attributes: IDataObject = cleanObject({
    metric_id: metricId,
    measurements,
    interval,
    page_size: options.pageSize || 500,
    timezone: options.timezone || 'UTC',
    filter: filterOptions.filter ? [filterOptions.filter] : undefined,
    by: options.by ? [options.by] : undefined,
    return_fields: options.returnFields,
  });

  if (filterOptions.startDate) {
    attributes.filter = attributes.filter || [];
    (attributes.filter as string[]).push(`greater-or-equal(datetime,${filterOptions.startDate})`);
  }

  if (filterOptions.endDate) {
    attributes.filter = attributes.filter || [];
    (attributes.filter as string[]).push(`less-than(datetime,${filterOptions.endDate})`);
  }

  const body = {
    data: {
      type: 'metric-aggregate',
      attributes,
    },
  };

  const response = await klaviyoApiRequest.call(this, this, 'POST', '/api/metric-aggregates/', body);
  return [{ json: response as IDataObject }];
}

export async function getMetricTimeline(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const metricId = this.getNodeParameter('metricId', index) as string;
  const returnAll = this.getNodeParameter('returnAll', index) as boolean;
  const limit = this.getNodeParameter('limit', index, 100) as number;
  const filters = this.getNodeParameter('filters', index, {}) as IDataObject;
  const options = this.getNodeParameter('options', index, {}) as IDataObject;

  const query: IDataObject = {};

  const filterParts: string[] = [];
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

  if (options.sort) {
    query.sort = options.sort;
  }

  query['page[size]'] = returnAll ? 100 : Math.min(limit, 100);

  let events: IDataObject[];

  if (returnAll) {
    events = await klaviyoApiRequestAllItems.call(this, this, 'GET', `/api/metrics/${metricId}/events/`, undefined, query);
  } else {
    events = await klaviyoApiRequestAllItems.call(this, this, 'GET', `/api/metrics/${metricId}/events/`, undefined, query, limit);
  }

  return events.map((event) => ({ json: event }));
}
