import type {
  BackgroundConfig,
  BackgroundFieldConfig,
  FieldValue,
  FieldValidationResult,
  ConfigValidationResult,
  BackgroundSubmission,
} from "../types/background-config.types";

/**
 * Validates a single field value against its configuration
 */
export const validateField = (
  field: BackgroundFieldConfig,
  value: FieldValue
): FieldValidationResult => {
  const errors: string[] = [];

  // Check required
  if (field.required) {
    if (
      value.value === null ||
      value.value === undefined ||
      value.value === "" ||
      (Array.isArray(value.value) && value.value.length === 0)
    ) {
      errors.push(`${field.title} là bắt buộc`);
    }
  }

  // Skip other validations if no value
  if (!value.value) {
    return {
      fieldId: field.id,
      valid: errors.length === 0,
      errors,
    };
  }

  // Type-specific validation
  switch (field.type) {
    case "short_text":
    case "long_text":
      if (typeof value.value === "string") {
        if (field.maxLength && value.value.length > field.maxLength) {
          errors.push(
            `${field.title} không được vượt quá ${field.maxLength} ký tự`
          );
        }
      }
      break;

    case "select":
      if (typeof value.value === "string") {
        const validOptions = field.options.map((opt) => opt.value);
        if (!validOptions.includes(value.value) && !field.allowOther) {
          errors.push(`${field.title} có giá trị không hợp lệ`);
        }
        // If "Other" is selected and allowOther is true, check otherValue
        if (
          field.allowOther &&
          !validOptions.includes(value.value) &&
          !value.otherValue
        ) {
          errors.push(
            `Vui lòng nhập giá trị cho mục "Khác" của ${field.title}`
          );
        }
      }
      break;

    case "date":
      if (typeof value.value === "string") {
        const dateValue = new Date(value.value);
        if (isNaN(dateValue.getTime())) {
          errors.push(`${field.title} không phải là ngày hợp lệ`);
        } else {
          if (field.minDate) {
            const minDate = new Date(field.minDate);
            if (dateValue < minDate) {
              errors.push(
                `${field.title} phải sau ngày ${formatDate(field.minDate)}`
              );
            }
          }
          if (field.maxDate) {
            const maxDate = new Date(field.maxDate);
            if (dateValue > maxDate) {
              errors.push(
                `${field.title} phải trước ngày ${formatDate(field.maxDate)}`
              );
            }
          }
        }
      }
      break;

    case "image_upload":
      if (Array.isArray(value.value)) {
        if (field.minFiles && value.value.length < field.minFiles) {
          errors.push(`${field.title} yêu cầu tối thiểu ${field.minFiles} ảnh`);
        }
        if (field.maxFiles && value.value.length > field.maxFiles) {
          errors.push(
            `${field.title} chỉ cho phép tối đa ${field.maxFiles} ảnh`
          );
        }
      }
      break;
  }

  return {
    fieldId: field.id,
    valid: errors.length === 0,
    errors,
  };
};

/**
 * Validates entire config submission
 */
export const validateConfigSubmission = (
  config: BackgroundConfig,
  submission: BackgroundSubmission
): ConfigValidationResult => {
  const fieldResults: FieldValidationResult[] = [];
  const globalErrors: string[] = [];

  // Check all fields
  for (const field of config.fields) {
    const fieldValue = submission.values.find((v) => v.fieldId === field.id);

    if (!fieldValue) {
      // Field not found in submission
      if (field.required) {
        fieldResults.push({
          fieldId: field.id,
          valid: false,
          errors: [`${field.title} là bắt buộc`],
        });
      } else {
        fieldResults.push({
          fieldId: field.id,
          valid: true,
          errors: [],
        });
      }
    } else {
      // Validate field
      const result = validateField(field, fieldValue);
      fieldResults.push(result);
    }
  }

  // Check if all fields are valid
  const allValid = fieldResults.every((r) => r.valid);

  return {
    valid: allValid && globalErrors.length === 0,
    fieldResults,
    globalErrors,
  };
};

/**
 * Get default value for a field
 */
export const getDefaultFieldValue = (
  field: BackgroundFieldConfig
): FieldValue => {
  let value: string | string[] | null = null;

  switch (field.type) {
    case "short_text":
    case "long_text":
      value = field.defaultValue || "";
      break;
    case "select":
      value = field.defaultValue || "";
      break;
    case "date":
      value = field.defaultValue || "";
      break;
    case "image_upload":
      value = [];
      break;
  }

  return {
    fieldId: field.id,
    value,
  };
};

/**
 * Initialize submission with default values
 */
export const initializeSubmission = (
  backgroundId: string,
  config: BackgroundConfig
): BackgroundSubmission => {
  return {
    backgroundId,
    values: config.fields.map(getDefaultFieldValue),
    submittedAt: new Date().toISOString(),
  };
};

/**
 * Format date for display
 */
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("vi-VN");
};

/**
 * Validate file before upload
 */
export const validateImageFile = (
  file: File,
  field: BackgroundFieldConfig
): { valid: boolean; error?: string } => {
  if (field.type !== "image_upload") {
    return { valid: false, error: "Trường không phải loại upload ảnh" };
  }

  // Check file size
  if (field.maxFileSize && file.size > field.maxFileSize) {
    const maxSizeMB = (field.maxFileSize / (1024 * 1024)).toFixed(2);
    return {
      valid: false,
      error: `File quá lớn. Kích thước tối đa: ${maxSizeMB}MB`,
    };
  }

  // Check file type
  if (field.allowedFormats && !field.allowedFormats.includes(file.type)) {
    return {
      valid: false,
      error: `Định dạng file không được hỗ trợ. Chỉ chấp nhận: ${field.allowedFormats.join(
        ", "
      )}`,
    };
  }

  return { valid: true };
};

/**
 * Check if field has value
 */
export const hasFieldValue = (value: FieldValue): boolean => {
  if (value.value === null || value.value === undefined) {
    return false;
  }

  if (typeof value.value === "string") {
    return value.value.trim().length > 0;
  }

  if (Array.isArray(value.value)) {
    return value.value.length > 0;
  }

  return false;
};

/**
 * Get field by ID from config
 */
export const getFieldById = (
  config: BackgroundConfig,
  fieldId: string
): BackgroundFieldConfig | undefined => {
  return config.fields.find((f) => f.id === fieldId);
};

/**
 * Sort fields by order
 */
export const sortFieldsByOrder = (
  fields: BackgroundFieldConfig[]
): BackgroundFieldConfig[] => {
  return [...fields].sort((a, b) => a.order - b.order);
};

/**
 * Generate example JSON for a field type
 */
export const generateExampleField = (
  type: BackgroundFieldConfig["type"]
): BackgroundFieldConfig => {
  const baseId = `field-${Date.now()}`;

  const base = {
    id: baseId,
    title: "",
    description: "",
    required: false,
    order: 0,
  };

  switch (type) {
    case "short_text":
      return {
        ...base,
        type: "short_text",
        placeholder: "",
        maxLength: 255,
      };
    case "long_text":
      return {
        ...base,
        type: "long_text",
        placeholder: "",
        maxLength: 1000,
        rows: 4,
      };
    case "select":
      return {
        ...base,
        type: "select",
        options: [],
        allowOther: false,
      };
    case "date":
      return {
        ...base,
        type: "date",
      };
    case "image_upload":
      return {
        ...base,
        type: "image_upload",
        maxFiles: 5,
        maxFileSize: 5242880, // 5MB
        allowedFormats: ["image/jpeg", "image/png", "image/webp"],
      };
  }
};
