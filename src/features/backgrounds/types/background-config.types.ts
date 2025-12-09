/**
 * Background Configuration Types for Frontend
 * Mirrors the backend structure for type safety
 */

// Field type constants
export const BackgroundFieldType = {
  SHORT_TEXT: "short_text",
  LONG_TEXT: "long_text",
  SELECT: "select",
  DATE: "date",
  IMAGE_UPLOAD: "image_upload",
} as const;

export type BackgroundFieldTypeValue =
  (typeof BackgroundFieldType)[keyof typeof BackgroundFieldType];

// Select option interface
export interface SelectOption {
  id: string;
  label: string;
  value: string;
}

// Base interface for all field configurations
export interface BaseFieldConfig {
  id: string;
  type: BackgroundFieldTypeValue;
  title: string;
  description?: string;
  imageUrl?: string;
  required: boolean;
  order: number;
}

// Short text field configuration
export interface ShortTextField extends BaseFieldConfig {
  type: "short_text";
  placeholder?: string;
  maxLength?: number;
  defaultValue?: string;
}

// Long text field configuration
export interface LongTextField extends BaseFieldConfig {
  type: "long_text";
  placeholder?: string;
  maxLength?: number;
  rows?: number;
  defaultValue?: string;
}

// Select field configuration
export interface SelectField extends BaseFieldConfig {
  type: "select";
  options: SelectOption[];
  allowOther: boolean;
  otherPlaceholder?: string;
  defaultValue?: string;
}

// Date field configuration
export interface DateField extends BaseFieldConfig {
  type: "date";
  minDate?: string;
  maxDate?: string;
  defaultValue?: string;
}

// Image upload field configuration
export interface ImageUploadField extends BaseFieldConfig {
  type: "image_upload";
  maxFiles?: number;
  maxFileSize?: number;
  allowedFormats?: string[];
  minFiles?: number;
}

// Union type for all field configurations
export type BackgroundFieldConfig =
  | ShortTextField
  | LongTextField
  | SelectField
  | DateField
  | ImageUploadField;

// Metadata interface
export interface ConfigMetadata {
  createdAt?: string;
  updatedAt?: string;
  createdBy?: string;
}

// Main configuration structure
export interface BackgroundConfig {
  version: string;
  fields: BackgroundFieldConfig[];
  metadata?: ConfigMetadata;
}

// Field value for user submissions
export interface FieldValue {
  fieldId: string;
  value: string | string[] | null;
  otherValue?: string; // For select fields with "Other" option
}

// User submission structure
export interface BackgroundSubmission {
  backgroundId: string;
  values: FieldValue[];
  submittedAt: string;
  submittedBy?: string;
}

// Validation result interfaces
export interface FieldValidationResult {
  fieldId: string;
  valid: boolean;
  errors: string[];
}

export interface ConfigValidationResult {
  valid: boolean;
  fieldResults: FieldValidationResult[];
  globalErrors?: string[];
}

// Helper type for form field state
export interface FieldFormState {
  value: string | string[] | null;
  otherValue?: string;
  touched: boolean;
  errors: string[];
}

// Helper type for the entire form state
export type BackgroundFormFieldsState = Record<string, FieldFormState>;
