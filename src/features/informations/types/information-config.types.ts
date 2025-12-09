/**
 * Information Configuration Types for Frontend
 * Similar to background configuration structure
 */

// Field type constants
export const InformationFieldType = {
  SHORT_TEXT: "short_text",
  LONG_TEXT: "long_text",
  SELECT: "select",
  DATE: "date",
  IMAGE_UPLOAD: "image_upload",
  NUMBER: "number",
  EMAIL: "email",
  URL: "url",
} as const;

export type InformationFieldTypeValue =
  (typeof InformationFieldType)[keyof typeof InformationFieldType];

// Select option interface
export interface SelectOption {
  id: string;
  label: string;
  value: string;
}

// Base interface for all field configurations
export interface BaseFieldConfig {
  id: string;
  type: InformationFieldTypeValue;
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

// Number field configuration
export interface NumberField extends BaseFieldConfig {
  type: "number";
  placeholder?: string;
  min?: number;
  max?: number;
  defaultValue?: number;
}

// Email field configuration
export interface EmailField extends BaseFieldConfig {
  type: "email";
  placeholder?: string;
  defaultValue?: string;
}

// URL field configuration
export interface URLField extends BaseFieldConfig {
  type: "url";
  placeholder?: string;
  defaultValue?: string;
}

// Union type for all field configurations
export type InformationFieldConfig =
  | ShortTextField
  | LongTextField
  | SelectField
  | DateField
  | ImageUploadField
  | NumberField
  | EmailField
  | URLField;

// Metadata interface
export interface ConfigMetadata {
  createdAt?: string;
  updatedAt?: string;
  createdBy?: string;
}

// Main configuration structure
export interface InformationConfig {
  version: string;
  fields: InformationFieldConfig[];
  metadata?: ConfigMetadata;
  name?: string;
  description?: string;
}

// Field value for user submissions
export interface FieldValue {
  fieldId: string;
  value: string | string[] | number | null;
  otherValue?: string; // For select fields with "Other" option
}

// User submission structure
export interface InformationSubmission {
  informationId: string;
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
  value: string | string[] | number | null;
  otherValue?: string;
  touched: boolean;
  errors: string[];
}

// Helper type for the entire form state
export type InformationFormFieldsState = Record<string, FieldFormState>;
