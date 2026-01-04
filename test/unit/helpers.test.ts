/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import {
  buildJsonApiBody,
  buildJsonApiBulkBody,
  buildFilterQuery,
  parseJsonApiResponse,
  cleanObject,
  isValidEmail,
  isValidPhoneNumber,
  extractNextCursor,
} from '../../nodes/Klaviyo/utils/helpers';
import type { JsonApiDocument } from '../../nodes/Klaviyo/types';
import type { IDataObject } from 'n8n-workflow';

describe('Klaviyo Helpers', () => {
  describe('buildJsonApiBody', () => {
    it('should build a JSON:API body without ID', () => {
      const result = buildJsonApiBody('profile', { email: 'test@example.com' });
      expect(result).toEqual({
        data: {
          type: 'profile',
          attributes: { email: 'test@example.com' },
        },
      });
    });

    it('should build a JSON:API body with ID', () => {
      const result = buildJsonApiBody('profile', { email: 'test@example.com' }, '123');
      expect(result).toEqual({
        data: {
          type: 'profile',
          id: '123',
          attributes: { email: 'test@example.com' },
        },
      });
    });
  });

  describe('buildJsonApiBulkBody', () => {
    it('should build bulk JSON:API body', () => {
      const items = [
        { email: 'test1@example.com' },
        { email: 'test2@example.com' },
      ];
      const result = buildJsonApiBulkBody('profile', items);
      expect(result.data).toHaveLength(2);
      const dataArray = result.data as unknown as Array<{ type: string; attributes: { email: string } }>;
      expect(dataArray[0].type).toBe('profile');
      expect(dataArray[0].attributes.email).toBe('test1@example.com');
    });
  });

  describe('buildFilterQuery', () => {
    it('should build filter from object with string value', () => {
      const result = buildFilterQuery({ email: 'test@example.com' });
      expect(result).toBe('equals(email,"test@example.com")');
    });

    it('should build filter from object with number value', () => {
      const result = buildFilterQuery({ count: 5 });
      expect(result).toBe('equals(count,5)');
    });

    it('should build filter from object with boolean value', () => {
      const result = buildFilterQuery({ subscribed: true });
      expect(result).toBe('equals(subscribed,true)');
    });

    it('should build multiple filters', () => {
      const result = buildFilterQuery({ 
        email: 'test@example.com',
        first_name: 'John',
      });
      expect(result).toContain('equals(email,"test@example.com")');
      expect(result).toContain('equals(first_name,"John")');
    });

    it('should build filter from object with array value', () => {
      const result = buildFilterQuery({ list_id: ['id1', 'id2'] });
      expect(result).toBe('any(list_id,["id1","id2"])');
    });

    it('should skip undefined and null values', () => {
      const result = buildFilterQuery({
        email: 'test@example.com',
        name: undefined,
        phone: null,
      });
      expect(result).toBe('equals(email,"test@example.com")');
    });

    it('should skip empty string values', () => {
      const result = buildFilterQuery({
        email: 'test@example.com',
        name: '',
      });
      expect(result).toBe('equals(email,"test@example.com")');
    });
  });

  describe('parseJsonApiResponse', () => {
    it('should parse single resource response', () => {
      const response: JsonApiDocument = {
        data: {
          type: 'profile',
          id: '123',
          attributes: { email: 'test@example.com' },
        },
      };
      const result = parseJsonApiResponse(response) as IDataObject;
      expect(result.type).toBe('profile');
      expect(result.id).toBe('123');
      expect(result.email).toBe('test@example.com');
    });

    it('should parse multiple resources response', () => {
      const response: JsonApiDocument = {
        data: [
          {
            type: 'profile',
            id: '123',
            attributes: { email: 'test1@example.com' },
          },
          {
            type: 'profile',
            id: '456',
            attributes: { email: 'test2@example.com' },
          },
        ],
      };
      const result = parseJsonApiResponse(response) as IDataObject[];
      expect(result).toHaveLength(2);
      expect(result[0].email).toBe('test1@example.com');
      expect(result[1].email).toBe('test2@example.com');
    });

    it('should return empty array for empty data array', () => {
      const response: JsonApiDocument = { 
        data: [] as any,
      };
      const result = parseJsonApiResponse(response);
      expect(result).toEqual([]);
    });
  });

  describe('cleanObject', () => {
    it('should remove undefined values', () => {
      const result = cleanObject({ a: 1, b: undefined, c: 'test' });
      expect(result).toEqual({ a: 1, c: 'test' });
    });

    it('should remove null values', () => {
      const result = cleanObject({ a: 1, b: null, c: 'test' });
      expect(result).toEqual({ a: 1, c: 'test' });
    });

    it('should remove empty strings', () => {
      const result = cleanObject({ a: 1, b: '', c: 'test' });
      expect(result).toEqual({ a: 1, c: 'test' });
    });

    it('should keep zero values', () => {
      const result = cleanObject({ a: 0, b: null, c: 'test' });
      expect(result).toEqual({ a: 0, c: 'test' });
    });

    it('should keep false values', () => {
      const result = cleanObject({ a: false, b: null, c: 'test' });
      expect(result).toEqual({ a: false, c: 'test' });
    });
  });

  describe('isValidEmail', () => {
    it('should return true for valid emails', () => {
      expect(isValidEmail('test@example.com')).toBe(true);
      expect(isValidEmail('user.name@domain.co.uk')).toBe(true);
      expect(isValidEmail('user+tag@example.org')).toBe(true);
    });

    it('should return false for invalid emails', () => {
      expect(isValidEmail('invalid')).toBe(false);
      expect(isValidEmail('invalid@')).toBe(false);
      expect(isValidEmail('@invalid.com')).toBe(false);
      expect(isValidEmail('')).toBe(false);
    });
  });

  describe('isValidPhoneNumber', () => {
    it('should return true for valid phone numbers', () => {
      expect(isValidPhoneNumber('+12025551234')).toBe(true);
      expect(isValidPhoneNumber('+442071234567')).toBe(true);
    });

    it('should return false for invalid phone numbers', () => {
      expect(isValidPhoneNumber('12025551234')).toBe(false);
      expect(isValidPhoneNumber('invalid')).toBe(false);
      expect(isValidPhoneNumber('')).toBe(false);
    });
  });

  describe('extractNextCursor', () => {
    it('should extract cursor from links.next', () => {
      const response: JsonApiDocument = {
        data: { type: 'profile', id: '1', attributes: {} },
        links: {
          next: 'https://a.klaviyo.com/api/profiles/?page%5Bcursor%5D=abc123',
        },
      };
      const result = extractNextCursor(response);
      expect(result).toBe('abc123');
    });

    it('should return undefined if no next link', () => {
      const response: JsonApiDocument = {
        data: { type: 'profile', id: '1', attributes: {} },
        links: {
          self: 'https://a.klaviyo.com/api/profiles/',
        },
      };
      const result = extractNextCursor(response);
      expect(result).toBeUndefined();
    });

    it('should return undefined if links is undefined', () => {
      const response: JsonApiDocument = { 
        data: { type: 'profile', id: '1', attributes: {} },
      };
      const result = extractNextCursor(response);
      expect(result).toBeUndefined();
    });
  });
});
