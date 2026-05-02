/**
 * Frontend validation utilities
 */

export interface ValidationRule {
  validate: (value: any) => boolean;
  message: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

/**
 * Email validation regex
 */
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Password validation regex (at least 1 uppercase, 1 lowercase, 1 number)
 */
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/;

/**
 * Phone validation regex (international format)
 */
const PHONE_REGEX = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;

/**
 * Validate email address
 */
export function validateEmail(email: string): ValidationResult {
  const errors: string[] = [];

  if (!email || email.trim() === '') {
    errors.push('Email is required');
  } else if (!EMAIL_REGEX.test(email)) {
    errors.push('Please enter a valid email address');
  } else if (email.length > 100) {
    errors.push('Email cannot exceed 100 characters');
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Validate password
 */
export function validatePassword(password: string): ValidationResult {
  const errors: string[] = [];

  if (!password || password === '') {
    errors.push('Password is required');
  } else {
    if (password.length < 6) {
      errors.push('Password must be at least 6 characters long');
    }
    if (password.length > 100) {
      errors.push('Password cannot exceed 100 characters');
    }
    if (!PASSWORD_REGEX.test(password)) {
      errors.push('Password must contain at least one uppercase letter, one lowercase letter, and one number');
    }
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Validate name
 */
export function validateName(name: string): ValidationResult {
  const errors: string[] = [];

  if (!name || name.trim() === '') {
    errors.push('Name is required');
  } else {
    const trimmed = name.trim();
    if (trimmed.length < 2) {
      errors.push('Name must be at least 2 characters long');
    }
    if (trimmed.length > 100) {
      errors.push('Name cannot exceed 100 characters');
    }
    if (!/^[a-zA-Z\s'-]+$/.test(trimmed)) {
      errors.push('Name can only contain letters, spaces, hyphens, and apostrophes');
    }
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Validate phone number
 */
export function validatePhone(phone: string): ValidationResult {
  const errors: string[] = [];

  if (phone && phone.trim() !== '') {
    if (phone.length > 20) {
      errors.push('Phone number cannot exceed 20 characters');
    }
    if (!PHONE_REGEX.test(phone)) {
      errors.push('Please enter a valid phone number');
    }
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Validate required field
 */
export function validateRequired(value: any, fieldName: string): ValidationResult {
  const errors: string[] = [];

  if (value === null || value === undefined || value === '') {
    errors.push(`${fieldName} is required`);
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Validate minimum length
 */
export function validateMinLength(value: string, minLength: number, fieldName: string): ValidationResult {
  const errors: string[] = [];

  if (!value || value.length < minLength) {
    errors.push(`${fieldName} must be at least ${minLength} characters long`);
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Validate maximum length
 */
export function validateMaxLength(value: string, maxLength: number, fieldName: string): ValidationResult {
  const errors: string[] = [];

  if (value && value.length > maxLength) {
    errors.push(`${fieldName} cannot exceed ${maxLength} characters`);
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Validate review rating
 */
export function validateRating(rating: number): ValidationResult {
  const errors: string[] = [];

  if (rating === null || rating === undefined) {
    errors.push('Rating is required');
  } else if (rating < 1 || rating > 5) {
    errors.push('Rating must be between 1 and 5 stars');
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Validate review comment
 */
export function validateReviewComment(comment: string): ValidationResult {
  const errors: string[] = [];

  if (comment && comment.length > 1000) {
    errors.push('Comment cannot exceed 1000 characters');
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Validate booking date (must be today or in the future)
 */
export function validateBookingDate(date: string): ValidationResult {
  const errors: string[] = [];

  if (!date) {
    errors.push('Date is required');
  } else {
    const selectedDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (isNaN(selectedDate.getTime())) {
      errors.push('Please enter a valid date');
    } else if (selectedDate < today) {
      errors.push('Booking date cannot be in the past');
    }
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Validate time format
 */
export function validateTime(time: string): ValidationResult {
  const errors: string[] = [];

  if (!time || time === '') {
    errors.push('Time is required');
  } else {
    const timeRegex = /^(0?[1-9]|1[0-2]):[0-5][0-9]\s?(AM|PM|am|pm)?$/;
    if (!timeRegex.test(time)) {
      errors.push('Please enter a valid time (e.g., 09:00 AM)');
    }
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Validate address
 */
export function validateAddress(street: string, city: string, state: string, zipCode: string): ValidationResult {
  const errors: string[] = [];

  if (!street || street.trim().length < 3) {
    errors.push('Street address must be at least 3 characters');
  }
  if (!city || city.trim().length < 2) {
    errors.push('City name must be at least 2 characters');
  }
  if (!state || state.trim().length < 2) {
    errors.push('State must be at least 2 characters');
  }
  if (!zipCode || zipCode.trim().length < 3) {
    errors.push('ZIP code must be at least 3 characters');
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Sanitize HTML to prevent XSS
 */
export function sanitizeHtml(input: string): string {
  if (!input) return input;

  const div = document.createElement('div');
  div.textContent = input;
  return div.innerHTML;
}

/**
 * Strip HTML tags from input
 */
export function stripHtmlTags(input: string): string {
  if (!input) return input;
  return input.replace(/<[^>]*>/g, '');
}

/**
 * Validate and sanitize input
 */
export function validateAndSanitize(
  value: string,
  validators: ((v: string) => ValidationResult)[],
  sanitize: boolean = true
): { value: string; result: ValidationResult } {
  let sanitized = value;

  if (sanitize) {
    sanitized = stripHtmlTags(value);
  }

  const allErrors: string[] = [];

  for (const validator of validators) {
    const result = validator(sanitized);
    if (!result.valid) {
      allErrors.push(...result.errors);
    }
  }

  return {
    value: sanitized,
    result: {
      valid: allErrors.length === 0,
      errors: allErrors
    }
  };
}

/**
 * Form validator helper class
 */
export class FormValidator {
  private errors: Map<string, string[]> = new Map();

  validate(fieldName: string, value: any, validators: ValidationRule[]): boolean {
    const errors: string[] = [];

    for (const rule of validators) {
      if (!rule.validate(value)) {
        errors.push(rule.message);
      }
    }

    if (errors.length > 0) {
      this.errors.set(fieldName, errors);
      return false;
    } else {
      this.errors.delete(fieldName);
      return true;
    }
  }

  getErrors(fieldName: string): string[] {
    return this.errors.get(fieldName) || [];
  }

  getFirstError(fieldName: string): string | null {
    const errors = this.getErrors(fieldName);
    return errors.length > 0 ? errors[0] : null;
  }

  hasErrors(): boolean {
    return this.errors.size > 0;
  }

  clearErrors(): void {
    this.errors.clear();
  }

  clearFieldErrors(fieldName: string): void {
    this.errors.delete(fieldName);
  }

  getAllErrors(): Record<string, string[]> {
    const result: Record<string, string[]> = {};
    this.errors.forEach((errors, field) => {
      result[field] = errors;
    });
    return result;
  }
}

/** NestJS default error body: `{ message: string | string[], statusCode: number }` */
export function describeHttpApiError(error: unknown, fallback = 'Something went wrong. Please try again.'): string {
  if (!error || typeof error !== 'object') {
    return fallback;
  }
  const err = error as {
    status?: number;
    message?: string;
    error?: string | Record<string, unknown>;
  };

  const bodyRaw = err.error;
  const body =
    typeof bodyRaw === 'object' && bodyRaw !== null ? (bodyRaw as Record<string, unknown>) : undefined;
  const msgDirect = typeof bodyRaw === 'string' ? bodyRaw.trim() : '';

  if (msgDirect) {
    return msgDirect;
  }

  const m = body?.['message'];
  if (typeof m === 'string' && m.trim()) return m.trim();
  if (Array.isArray(m) && m.length) return m.map(String).join('. ');

  if (typeof err.message === 'string' && err.message.trim()) {
    return err.message.trim();
  }
  return fallback;
}
