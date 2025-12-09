import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  TextField,
  MenuItem,
  Typography,
  Button,
  Card,
  CardContent,
  CardMedia,
  IconButton,
  FormHelperText,
  Alert,
  Chip,
} from "@mui/material";
import { PhotoCamera, Delete, Info } from "@mui/icons-material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { vi } from "date-fns/locale";
import type {
  BackgroundConfig,
  BackgroundFieldConfig,
  FieldValue,
  BackgroundSubmission,
} from "../types/background-config.types";
import {
  validateConfigSubmission,
  initializeSubmission,
  validateImageFile,
  sortFieldsByOrder,
} from "../utils/config-validator.utils";

interface BackgroundDynamicFormProps {
  backgroundId: string;
  config: BackgroundConfig;
  onSubmit: (submission: BackgroundSubmission) => void | Promise<void>;
  initialValues?: FieldValue[];
  autoSubmit?: boolean; // New prop for auto-submit behavior
  onValidationChange?: (payload: {
    valid: boolean;
    errors: Record<string, string[]>;
    submission: BackgroundSubmission;
  }) => void;
  forceShowErrors?: boolean;
}

export const BackgroundDynamicForm: React.FC<BackgroundDynamicFormProps> = ({
  backgroundId,
  config,
  onSubmit,
  initialValues,
  autoSubmit = true, // Default to auto-submit
  onValidationChange,
  forceShowErrors = false,
}) => {
  const [submission, setSubmission] = useState<BackgroundSubmission>(() =>
    initializeSubmission(backgroundId, config)
  );
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [touched, setTouched] = useState<Set<string>>(new Set());

  // Track the last submitted state to prevent duplicate submissions
  const lastSubmittedRef = useRef<string | null>(null);

  // Initialize with provided values
  useEffect(() => {
    if (initialValues && initialValues.length > 0) {
      setSubmission((prev) => ({
        ...prev,
        values: initialValues,
      }));
    }
  }, [initialValues]);

  // Auto-submit when form is valid and complete (if autoSubmit enabled)
  useEffect(() => {
    if (!autoSubmit) return;

    const validation = validateConfigSubmission(config, submission);
    if (onValidationChange) {
      const errs: Record<string, string[]> = {};
      validation.fieldResults.forEach((r) => {
        if (!r.valid) errs[r.fieldId] = r.errors;
      });
      onValidationChange({ valid: validation.valid, errors: errs, submission });
    }
    if (validation.valid) {
      // Create a unique key for this submission state
      const submissionKey = JSON.stringify(submission.values);

      // Only submit if this exact state hasn't been submitted before
      if (submissionKey !== lastSubmittedRef.current) {
        lastSubmittedRef.current = submissionKey;

        // Form is complete and valid, auto-submit
        onSubmit({
          ...submission,
          submittedAt: new Date().toISOString(),
        });
      }
    }
  }, [submission, config, autoSubmit]); // Removed onSubmit from dependencies

  const handleFieldChange = (
    fieldId: string,
    value: string | string[] | null
  ) => {
    setSubmission((prev) => ({
      ...prev,
      values: prev.values.map((v) =>
        v.fieldId === fieldId ? { ...v, value } : v
      ),
    }));

    // Mark as touched
    setTouched((prev) => new Set([...prev, fieldId]));

    // Clear error when user types
    if (errors[fieldId]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[fieldId];
        return newErrors;
      });
    }
  };

  const handleOtherValueChange = (fieldId: string, otherValue: string) => {
    setSubmission((prev) => ({
      ...prev,
      values: prev.values.map((v) =>
        v.fieldId === fieldId ? { ...v, otherValue } : v
      ),
    }));
  };

  const handleImageUpload = async (fieldId: string, files: FileList | null) => {
    if (!files || files.length === 0) return;

    const field = config.fields.find((f) => f.id === fieldId);
    if (!field || field.type !== "image_upload") return;

    const currentValue = submission.values.find((v) => v.fieldId === fieldId);
    const currentImages = Array.isArray(currentValue?.value)
      ? currentValue.value
      : [];

    // Validate each file
    const validFiles: File[] = [];
    const fileErrors: string[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const validation = validateImageFile(file, field);

      if (validation.valid) {
        validFiles.push(file);
      } else {
        fileErrors.push(validation.error || "Lỗi không xác định");
      }
    }

    // Check max files limit
    if (
      field.maxFiles &&
      currentImages.length + validFiles.length > field.maxFiles
    ) {
      setErrors((prev) => ({
        ...prev,
        [fieldId]: [`Chỉ cho phép tối đa ${field.maxFiles} ảnh`],
      }));
      return;
    }

    if (fileErrors.length > 0) {
      setErrors((prev) => ({
        ...prev,
        [fieldId]: fileErrors,
      }));
      return;
    }

    // Upload files (in real app, this would upload to server)
    // For now, we'll create object URLs
    const newImageUrls = validFiles.map((file) => URL.createObjectURL(file));

    handleFieldChange(fieldId, [...currentImages, ...newImageUrls]);
  };

  const handleRemoveImage = (fieldId: string, imageUrl: string) => {
    const currentValue = submission.values.find((v) => v.fieldId === fieldId);
    if (!currentValue || !Array.isArray(currentValue.value)) return;

    const newImages = currentValue.value.filter((url) => url !== imageUrl);
    handleFieldChange(fieldId, newImages);

    // Revoke object URL to free memory
    if (imageUrl.startsWith("blob:")) {
      URL.revokeObjectURL(imageUrl);
    }
  };

  const escapeHtml = (str: string) =>
    str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

  const toFormattedHtml = (text: string) => {
    const escaped = escapeHtml(text || "");
    let html = escaped
      .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
      .replace(/__([^_]+)__/g, "<u>$1</u>")
      .replace(/_([^_]+)_/g, "<em>$1</em>");
    html = html.replace(/\n/g, "<br/>");
    return html;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate all fields
    const validation = validateConfigSubmission(config, submission);

    if (!validation.valid) {
      const newErrors: Record<string, string[]> = {};
      validation.fieldResults.forEach((result) => {
        if (!result.valid) {
          newErrors[result.fieldId] = result.errors;
        }
      });
      setErrors(newErrors);

      // Mark all as touched
      setTouched(new Set(config.fields.map((f) => f.id)));
      return;
    }

    // Submit
    onSubmit({
      ...submission,
      submittedAt: new Date().toISOString(),
    });
  };

  const renderField = (field: BackgroundFieldConfig) => {
    const fieldValue = submission.values.find((v) => v.fieldId === field.id);
    const value = fieldValue?.value || "";
    const otherValue = fieldValue?.otherValue || "";
    const fieldErrors = errors[field.id] || [];
    const isTouched = touched.has(field.id);
    const showError = (isTouched || forceShowErrors) && fieldErrors.length > 0;

    return (
      <Box key={field.id} sx={{ mb: 3 }}>
        {/* Field Label with Image */}
        <Box sx={{ mb: 1 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
            <Typography variant="subtitle1" fontWeight={600}>
              {field.title}
              {field.required && (
                <Chip label="*" size="small" color="error" sx={{ ml: 1 }} />
              )}
            </Typography>
          </Box>

          {/* ⭐ Large Image Display */}
          {field.imageUrl && (
            <Box
              sx={{
                mb: 2,
                borderRadius: 2,
                overflow: "hidden",
                border: "1px solid",
                borderColor: "divider",
                boxShadow: 2,
              }}
            >
              <Box
                component="img"
                src={field.imageUrl}
                alt={field.title}
                sx={{
                  width: "100%",
                  maxWidth: "600px",
                  height: "auto",
                  display: "block",
                  objectFit: "contain",
                }}
              />
            </Box>
          )}
        </Box>

        {/* Field Description */}
        {field.description && (
          <Box sx={{ display: "flex", gap: 1, mb: 2, alignItems: "start" }}>
            <Info fontSize="small" color="info" />
            <Typography variant="body2" color="text.secondary" component="div">
              <span
                dangerouslySetInnerHTML={{ __html: toFormattedHtml(field.description) }}
              />
            </Typography>
          </Box>
        )}

        {/* Field Input */}
        {field.type === "short_text" && (
          <TextField
            fullWidth
            value={value}
            onChange={(e) => handleFieldChange(field.id, e.target.value)}
            placeholder={field.placeholder}
            error={showError}
            helperText={showError ? fieldErrors.join(", ") : ""}
            inputProps={{
              maxLength: field.maxLength,
            }}
            sx={{
              '& .MuiOutlinedInput-root.Mui-error fieldset': { borderColor: '#731618' },
            }}
          />
        )}

        {field.type === "long_text" && (
          <TextField
            fullWidth
            multiline
            rows={field.rows || 4}
            value={value}
            onChange={(e) => handleFieldChange(field.id, e.target.value)}
            placeholder={field.placeholder}
            error={showError}
            helperText={showError ? fieldErrors.join(", ") : ""}
            inputProps={{
              maxLength: field.maxLength,
            }}
            sx={{
              '& .MuiOutlinedInput-root.Mui-error fieldset': { borderColor: '#731618' },
            }}
          />
        )}

        {field.type === "select" && (
          <Box>
            <TextField
              fullWidth
              select
              value={value}
              onChange={(e) => handleFieldChange(field.id, e.target.value)}
              error={showError}
              helperText={showError ? fieldErrors.join(", ") : ""}
              sx={{
                '& .MuiOutlinedInput-root.Mui-error fieldset': { borderColor: '#731618' },
              }}
            >
              <MenuItem value="">
                <em>Chọn...</em>
              </MenuItem>
              {field.options.map((option) => (
                <MenuItem key={option.id} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
              {field.allowOther && (
                <MenuItem value="__other__">Khác (nhập tùy chỉnh)</MenuItem>
              )}
            </TextField>

            {field.allowOther && value === "__other__" && (
              <TextField
                fullWidth
                value={otherValue}
                onChange={(e) =>
                  handleOtherValueChange(field.id, e.target.value)
                }
                placeholder={field.otherPlaceholder || "Nhập giá trị..."}
                sx={{ mt: 2 }}
              />
            )}
          </Box>
        )}

        {field.type === "date" && (
          <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={vi}>
            <DatePicker
              value={value ? new Date(value as string) : null}
              onChange={(date: Date | null) =>
                handleFieldChange(
                  field.id,
                  date ? date.toISOString().split("T")[0] : ""
                )
              }
              minDate={field.minDate ? new Date(field.minDate) : undefined}
              maxDate={field.maxDate ? new Date(field.maxDate) : undefined}
              slotProps={{
                textField: {
                  fullWidth: true,
                  error: showError,
                  helperText: showError ? fieldErrors.join(", ") : "",
                  sx: { '& .MuiOutlinedInput-root.Mui-error fieldset': { borderColor: '#731618' } },
                },
              }}
            />
          </LocalizationProvider>
        )}

        {field.type === "image_upload" && (
          <Box>
            {/* Image Preview Grid */}
            {Array.isArray(value) && value.length > 0 && (
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
                  gap: 2,
                  mb: 2,
                }}
              >
                {value.map((imageUrl) => (
                  <Card key={imageUrl} sx={{ position: "relative" }}>
                    <CardMedia
                      component="img"
                      height="150"
                      image={imageUrl}
                      alt="Uploaded"
                      sx={{ objectFit: "cover" }}
                    />
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleRemoveImage(field.id, imageUrl)}
                      sx={{
                        position: "absolute",
                        top: 4,
                        right: 4,
                        bgcolor: "rgba(255,255,255,0.9)",
                      }}
                    >
                      <Delete fontSize="small" />
                    </IconButton>
                  </Card>
                ))}
              </Box>
            )}

            {/* Upload Button */}
            <input
              accept={field.allowedFormats?.join(",") || "image/*"}
              style={{ display: "none" }}
              id={`upload-${field.id}`}
              type="file"
              multiple={field.maxFiles !== 1}
              onChange={(e) => handleImageUpload(field.id, e.target.files)}
            />
            <label htmlFor={`upload-${field.id}`}>
              <Button
                variant="outlined"
                component="span"
                startIcon={<PhotoCamera />}
                disabled={
                  field.maxFiles
                    ? Array.isArray(value) && value.length >= field.maxFiles
                    : false
                }
              >
                Chọn ảnh
              </Button>
            </label>

            {showError && (
              <FormHelperText error>{fieldErrors.join(", ")}</FormHelperText>
            )}

            {/* Info */}
            <Typography
              variant="caption"
              color="text.secondary"
              display="block"
              sx={{ mt: 1 }}
            >
              {field.minFiles && `Tối thiểu: ${field.minFiles} ảnh. `}
              {field.maxFiles && `Tối đa: ${field.maxFiles} ảnh. `}
              {field.maxFileSize &&
                `Kích thước tối đa: ${(
                  field.maxFileSize /
                  (1024 * 1024)
                ).toFixed(1)}MB.`}
            </Typography>
          </Box>
        )}
      </Box>
    );
  };

  const sortedFields = sortFieldsByOrder(config.fields);

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Card sx={{ p: 3 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom fontWeight={600}>
            Thông tin tùy chỉnh
          </Typography>

          {config.fields.length === 0 ? (
            <Alert severity="info">
              Background này chưa có cấu hình form. Vui lòng liên hệ quản trị
              viên.
            </Alert>
          ) : (
            <>{sortedFields.map(renderField)}</>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};
