import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
} from '@nestjs/common';
import * as sanitizeHtml from 'sanitize-html';

/**
 * Configuration for sanitize-html
 * Strips all HTML tags by default for security
 */
const sanitizeConfig: sanitizeHtml.IOptions = {
  allowedTags: [],           // No HTML tags allowed
  allowedAttributes: {},     // No attributes allowed
  disallowedTagsMode: 'discard',
};

/**
 * Pipe to sanitize string inputs and prevent XSS attacks
 * Recursively sanitizes all string values in objects and arrays
 */
@Injectable()
export class SanitizePipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata): any {
    // Only transform body parameters
    if (metadata.type !== 'body') {
      return value;
    }

    return this.sanitizeValue(value);
  }

  private sanitizeValue(value: any): any {
    if (value === null || value === undefined) {
      return value;
    }

    if (typeof value === 'string') {
      return this.sanitizeString(value);
    }

    if (Array.isArray(value)) {
      return value.map((item) => this.sanitizeValue(item));
    }

    if (typeof value === 'object') {
      return this.sanitizeObject(value);
    }

    return value;
  }

  private sanitizeString(value: string): string {
    // Remove HTML tags and decode entities
    let sanitized = sanitizeHtml(value, sanitizeConfig);

    // Trim whitespace
    sanitized = sanitized.trim();

    // Remove null bytes (potential attack vector)
    sanitized = sanitized.replace(/\x00/g, '');

    // Normalize unicode to prevent homograph attacks
    sanitized = sanitized.normalize('NFC');

    return sanitized;
  }

  private sanitizeObject(obj: Record<string, any>): Record<string, any> {
    const sanitized: Record<string, any> = {};

    for (const key of Object.keys(obj)) {
      // Also sanitize object keys to prevent prototype pollution
      const sanitizedKey = this.sanitizeString(key);

      // Prevent prototype pollution
      if (sanitizedKey === '__proto__' || sanitizedKey === 'constructor' || sanitizedKey === 'prototype') {
        continue;
      }

      sanitized[sanitizedKey] = this.sanitizeValue(obj[key]);
    }

    return sanitized;
  }
}

/**
 * Utility function for manual sanitization
 */
export function sanitizeInput(input: string): string {
  if (!input || typeof input !== 'string') {
    return input;
  }

  return sanitizeHtml(input, sanitizeConfig)
    .trim()
    .replace(/\x00/g, '')
    .normalize('NFC');
}
