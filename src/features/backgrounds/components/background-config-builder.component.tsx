import React, { useState, useRef } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  IconButton,
  Typography,
  TextField,
  MenuItem,
  Switch,
  FormControlLabel,
  Chip,
  Alert,
  Collapse,
  Divider,
  CircularProgress,
  CardMedia,
} from "@mui/material";
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  DragIndicator as DragIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  PhotoCamera,
} from "@mui/icons-material";
import type {
  BackgroundConfig,
  BackgroundFieldConfig,
  SelectOption,
  ShortTextField,
} from "../types/background-config.types";
import { v4 as uuidv4 } from "uuid";
import { useUploadBackgroundImage } from "../mutations/upload.mutations";

interface BackgroundConfigBuilderProps {
  config?: BackgroundConfig;
  onChange: (config: BackgroundConfig) => void;
}

const FIELD_TYPES = [
  { value: "short_text", label: "Text ngắn" },
  { value: "long_text", label: "Text dài" },
  { value: "select", label: "Lựa chọn (Select)" },
  { value: "date", label: "Ngày tháng" },
  { value: "image_upload", label: "Upload ảnh" },
];

export const BackgroundConfigBuilder: React.FC<
  BackgroundConfigBuilderProps
> = ({ config, onChange }) => {
  const [expandedFields, setExpandedFields] = useState<Set<string>>(new Set());
  const [uploadingFieldId, setUploadingFieldId] = useState<string | null>(null);
  const descRefs = useRef<Record<string, HTMLTextAreaElement | null>>({});

  const uploadImageMutation = useUploadBackgroundImage();

  const currentConfig: BackgroundConfig = config || {
    version: "1.0",
    fields: [],
    metadata: {
      createdAt: new Date().toISOString(),
    },
  };

  const toggleFieldExpanded = (fieldId: string) => {
    const newExpanded = new Set(expandedFields);
    if (newExpanded.has(fieldId)) {
      newExpanded.delete(fieldId);
    } else {
      newExpanded.add(fieldId);
    }
    setExpandedFields(newExpanded);
  };

  const addField = () => {
    const newField: BackgroundFieldConfig = {
      id: uuidv4(),
      type: "short_text" as const,
      title: "",
      description: "",
      required: false,
      order: currentConfig.fields.length,
      placeholder: "",
      maxLength: 255,
    } as ShortTextField;

    const updatedConfig: BackgroundConfig = {
      ...currentConfig,
      fields: [...currentConfig.fields, newField],
      metadata: {
        ...currentConfig.metadata,
        updatedAt: new Date().toISOString(),
      },
    };

    onChange(updatedConfig);
    setExpandedFields(new Set([...expandedFields, newField.id]));
  };

  const updateField = (
    fieldId: string,
    updates: Partial<BackgroundFieldConfig>
  ) => {
    const updatedFields = currentConfig.fields.map((field) =>
      field.id === fieldId
        ? ({ ...field, ...updates } as BackgroundFieldConfig)
        : field
    );

    onChange({
      ...currentConfig,
      fields: updatedFields,
      metadata: {
        ...currentConfig.metadata,
        updatedAt: new Date().toISOString(),
      },
    });
  };

  const deleteField = (fieldId: string) => {
    const updatedFields = currentConfig.fields
      .filter((field) => field.id !== fieldId)
      .map((field, index) => ({ ...field, order: index }));

    onChange({
      ...currentConfig,
      fields: updatedFields,
      metadata: {
        ...currentConfig.metadata,
        updatedAt: new Date().toISOString(),
      },
    });

    const newExpanded = new Set(expandedFields);
    newExpanded.delete(fieldId);
    setExpandedFields(newExpanded);
  };

  const moveField = (fieldId: string, direction: "up" | "down") => {
    const currentIndex = currentConfig.fields.findIndex(
      (f) => f.id === fieldId
    );
    if (
      (direction === "up" && currentIndex === 0) ||
      (direction === "down" && currentIndex === currentConfig.fields.length - 1)
    ) {
      return;
    }

    const newFields = [...currentConfig.fields];
    const targetIndex =
      direction === "up" ? currentIndex - 1 : currentIndex + 1;
    [newFields[currentIndex], newFields[targetIndex]] = [
      newFields[targetIndex],
      newFields[currentIndex],
    ];

    const reorderedFields = newFields.map((field, index) => ({
      ...field,
      order: index,
    }));

    onChange({
      ...currentConfig,
      fields: reorderedFields,
      metadata: {
        ...currentConfig.metadata,
        updatedAt: new Date().toISOString(),
      },
    });
  };

  const addSelectOption = (fieldId: string) => {
    const field = currentConfig.fields.find((f) => f.id === fieldId);
    if (field && field.type === "select") {
      // Generate a default value to avoid empty label/value validation error
      const defaultValue = `Tùy chọn ${(field.options?.length || 0) + 1}`;

      const newOption: SelectOption = {
        id: uuidv4(),
        label: defaultValue,
        value: defaultValue,
      };

      // Ensure options is an array before spreading
      const currentOptions = Array.isArray(field.options) ? field.options : [];

      updateField(fieldId, {
        options: [...currentOptions, newOption],
      });
    }
  };

  const updateSelectOption = (
    fieldId: string,
    optionId: string,
    updates: Partial<SelectOption>
  ) => {
    const field = currentConfig.fields.find((f) => f.id === fieldId);
    if (field && field.type === "select") {
      const updatedOptions = field.options.map((opt) => {
        if (opt.id === optionId) {
          const updated = { ...opt, ...updates };
          // Auto-sync label with value if value is updated
          if (updates.value !== undefined) {
            updated.label = updates.value;
          }
          return updated;
        }
        return opt;
      });

      updateField(fieldId, { options: updatedOptions });
    }
  };

  const deleteSelectOption = (fieldId: string, optionId: string) => {
    const field = currentConfig.fields.find((f) => f.id === fieldId);
    if (field && field.type === "select") {
      const updatedOptions = field.options.filter((opt) => opt.id !== optionId);
      updateField(fieldId, { options: updatedOptions });
    }
  };

  const handleFieldImageUpload = async (
    fieldId: string,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      alert("Vui lòng chọn file hình ảnh");
      return;
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      alert("Kích thước ảnh không được vượt quá 2MB");
      return;
    }

    try {
      setUploadingFieldId(fieldId);
      const uploadResult = await uploadImageMutation.mutateAsync(file);
      const imageUrl = uploadResult.data?.url || "";

      updateField(fieldId, { imageUrl });
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Lỗi khi upload ảnh. Vui lòng thử lại.");
    } finally {
      setUploadingFieldId(null);
    }
  };

  const handleRemoveFieldImage = (fieldId: string) => {
    updateField(fieldId, { imageUrl: undefined });
  };

  const renderFieldEditor = (field: BackgroundFieldConfig) => {
    const isExpanded = expandedFields.has(field.id);

    return (
      <Card
        key={field.id}
        sx={{
          mb: 2,
          borderRadius: 2,
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          transition: "all 0.3s",
          "&:hover": {
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
          },
        }}
      >
        <CardContent>
          {/* Field Header */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mb: isExpanded ? 2 : 0,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <DragIcon sx={{ color: "text.secondary", cursor: "grab" }} />
              <Chip
                label={
                  FIELD_TYPES.find((t) => t.value === field.type)?.label ||
                  field.type
                }
                size="small"
                color="primary"
              />
              <Typography variant="body1" fontWeight={600}>
                {field.title || "(Chưa có tiêu đề)"}
              </Typography>
              {field.required && (
                <Chip label="Bắt buộc" size="small" color="error" />
              )}
            </Box>

            <Box sx={{ display: "flex", gap: 1 }}>
              <IconButton
                size="small"
                onClick={() => moveField(field.id, "up")}
                disabled={field.order === 0}
              >
                ↑
              </IconButton>
              <IconButton
                size="small"
                onClick={() => moveField(field.id, "down")}
                disabled={field.order === currentConfig.fields.length - 1}
              >
                ↓
              </IconButton>
              <IconButton
                size="small"
                onClick={() => toggleFieldExpanded(field.id)}
              >
                {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </IconButton>
              <IconButton
                size="small"
                color="error"
                onClick={() => deleteField(field.id)}
              >
                <DeleteIcon />
              </IconButton>
            </Box>
          </Box>

          {/* Field Configuration */}
          <Collapse in={isExpanded}>
            <Box
              sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}
            >
              {/* Field Type */}
              <TextField
                select
                label="Loại trường"
                value={field.type}
                onChange={(e) => {
                  const newType = e.target
                    .value as BackgroundFieldConfig["type"];
                  const updates: any = {
                    type: newType,
                  };

                  // Initialize options array and allowOther when switching to select type
                  if (newType === "select") {
                    const currentField = field as any;
                    if (
                      !currentField.options ||
                      !Array.isArray(currentField.options)
                    ) {
                      updates.options = [];
                    }
                    // Always set allowOther as boolean to avoid validation error
                    if (currentField.allowOther === undefined) {
                      updates.allowOther = false;
                    }
                  }

                  updateField(field.id, updates);
                }}
                fullWidth
                size="small"
              >
                {FIELD_TYPES.map((type) => (
                  <MenuItem key={type.value} value={type.value}>
                    {type.label}
                  </MenuItem>
                ))}
              </TextField>

              {/* Title */}
              <TextField
                label="Tiêu đề *"
                value={field.title}
                onChange={(e) =>
                  updateField(field.id, { title: e.target.value })
                }
                fullWidth
                size="small"
                required
              />

              {/* Description */}
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                <Box sx={{ display: "flex", gap: 1 }}>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => {
                      const el = descRefs.current[field.id];
                      if (!el) return;
                      const start = el.selectionStart || 0;
                      const end = el.selectionEnd || 0;
                      const val = field.description || "";
                      const selected = val.slice(start, end) || "văn bản";
                      const next = val.slice(0, start) + "**" + selected + "**" + val.slice(end);
                      updateField(field.id, { description: next });
                      setTimeout(() => {
                        el.focus();
                        el.setSelectionRange(start, start + selected.length + 4);
                      }, 0);
                    }}
                  >
                    B
                  </Button>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => {
                      const el = descRefs.current[field.id];
                      if (!el) return;
                      const start = el.selectionStart || 0;
                      const end = el.selectionEnd || 0;
                      const val = field.description || "";
                      const selected = val.slice(start, end) || "văn bản";
                      const next = val.slice(0, start) + "_" + selected + "_" + val.slice(end);
                      updateField(field.id, { description: next });
                      setTimeout(() => {
                        el.focus();
                        el.setSelectionRange(start, start + selected.length + 2);
                      }, 0);
                    }}
                  >
                    I
                  </Button>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => {
                      const el = descRefs.current[field.id];
                      if (!el) return;
                      const start = el.selectionStart || 0;
                      const end = el.selectionEnd || 0;
                      const val = field.description || "";
                      const selected = val.slice(start, end) || "văn bản";
                      const next = val.slice(0, start) + "__" + selected + "__" + val.slice(end);
                      updateField(field.id, { description: next });
                      setTimeout(() => {
                        el.focus();
                        el.setSelectionRange(start, start + selected.length + 4);
                      }, 0);
                    }}
                  >
                    U
                  </Button>
                </Box>
                <TextField
                  label="Mô tả"
                  value={field.description || ""}
                  onChange={(e) =>
                    updateField(field.id, { description: e.target.value })
                  }
                  fullWidth
                  size="small"
                  multiline
                  rows={3}
                  inputRef={(el) => {
                    descRefs.current[field.id] = el as HTMLTextAreaElement | null;
                  }}
                  helperText={
                    "Hỗ trợ định dạng: **đậm**, _nghiêng_, __gạch chân__. Xuống dòng bằng Enter."
                  }
                />
              </Box>

              {/* Image Upload */}
              <Box>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Hình ảnh minh họa (tùy chọn)
                </Typography>

                {field.imageUrl ? (
                  <Card
                    sx={{
                      maxWidth: 200,
                      mb: 2,
                      borderRadius: 2,
                      overflow: "hidden",
                    }}
                  >
                    <Box sx={{ position: "relative" }}>
                      <CardMedia
                        component="img"
                        height="120"
                        image={field.imageUrl}
                        alt="Field icon"
                        sx={{ objectFit: "cover" }}
                      />
                      <Box
                        sx={{
                          position: "absolute",
                          top: 4,
                          right: 4,
                          bgcolor: "rgba(255,255,255,0.9)",
                          borderRadius: "50%",
                        }}
                      >
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleRemoveFieldImage(field.id)}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </Box>
                  </Card>
                ) : null}

                <input
                  accept="image/*"
                  style={{ display: "none" }}
                  id={`field-image-upload-${field.id}`}
                  type="file"
                  onChange={(e) => handleFieldImageUpload(field.id, e)}
                />
                <label htmlFor={`field-image-upload-${field.id}`}>
                  <Button
                    variant="outlined"
                    component="span"
                    startIcon={
                      uploadingFieldId === field.id ? (
                        <CircularProgress size={20} />
                      ) : (
                        <PhotoCamera />
                      )
                    }
                    size="small"
                    disabled={uploadingFieldId === field.id}
                    sx={{
                      borderRadius: 1,
                      textTransform: "none",
                    }}
                  >
                    {field.imageUrl ? "Thay đổi ảnh" : "Chọn ảnh"}
                  </Button>
                </label>
                <Typography
                  variant="caption"
                  display="block"
                  color="text.secondary"
                  sx={{ mt: 1 }}
                >
                  Icon/hình minh họa cho trường này. Tối đa 2MB.
                </Typography>
              </Box>

              {/* Required Toggle */}
              <FormControlLabel
                control={
                  <Switch
                    checked={field.required}
                    onChange={(e) =>
                      updateField(field.id, { required: e.target.checked })
                    }
                  />
                }
                label="Bắt buộc nhập"
              />

              <Divider sx={{ my: 1 }} />

              {/* Type-specific fields */}
              {renderTypeSpecificFields(field)}
            </Box>
          </Collapse>
        </CardContent>
      </Card>
    );
  };

  const renderTypeSpecificFields = (field: BackgroundFieldConfig) => {
    switch (field.type) {
      case "short_text":
        return (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField
              label="Placeholder"
              value={field.placeholder || ""}
              onChange={(e) =>
                updateField(field.id, { placeholder: e.target.value })
              }
              fullWidth
              size="small"
            />
            <TextField
              label="Độ dài tối đa"
              type="number"
              value={field.maxLength || ""}
              onChange={(e) =>
                updateField(field.id, {
                  maxLength: e.target.value
                    ? parseInt(e.target.value)
                    : undefined,
                })
              }
              fullWidth
              size="small"
            />
          </Box>
        );

      case "long_text":
        return (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField
              label="Placeholder"
              value={field.placeholder || ""}
              onChange={(e) =>
                updateField(field.id, { placeholder: e.target.value })
              }
              fullWidth
              size="small"
            />
            <TextField
              label="Số dòng hiển thị"
              type="number"
              value={field.rows || ""}
              onChange={(e) =>
                updateField(field.id, {
                  rows: e.target.value ? parseInt(e.target.value) : undefined,
                })
              }
              fullWidth
              size="small"
            />
            <TextField
              label="Độ dài tối đa"
              type="number"
              value={field.maxLength || ""}
              onChange={(e) =>
                updateField(field.id, {
                  maxLength: e.target.value
                    ? parseInt(e.target.value)
                    : undefined,
                })
              }
              fullWidth
              size="small"
            />
          </Box>
        );

      case "select":
        return (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Typography variant="subtitle2" fontWeight={600}>
              Tùy chọn
            </Typography>

            {field.options?.length === 0 && (
              <Alert severity="warning" sx={{ borderRadius: 1 }}>
                Vui lòng thêm ít nhất một tùy chọn cho trường này.
              </Alert>
            )}

            {field.options?.map((option, index) => (
              <Box
                key={option.id}
                sx={{ display: "flex", gap: 1, alignItems: "center" }}
              >
                <TextField
                  label={`Tùy chọn ${index + 1}`}
                  value={option.value}
                  onChange={(e) =>
                    updateSelectOption(field.id, option.id, {
                      value: e.target.value,
                    })
                  }
                  size="small"
                  sx={{ flex: 1 }}
                  placeholder="Nhập giá trị"
                  required
                  error={!option.value || option.value.trim() === ""}
                  helperText={
                    !option.value || option.value.trim() === ""
                      ? "Giá trị không được để trống"
                      : ""
                  }
                />
                <IconButton
                  size="small"
                  color="error"
                  onClick={() => deleteSelectOption(field.id, option.id)}
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            ))}

            <Button
              variant="outlined"
              size="small"
              startIcon={<AddIcon />}
              onClick={() => addSelectOption(field.id)}
            >
              Thêm tùy chọn
            </Button>

            <FormControlLabel
              control={
                <Switch
                  checked={field.allowOther || false}
                  onChange={(e) =>
                    updateField(field.id, { allowOther: e.target.checked })
                  }
                />
              }
              label='Cho phép chọn "Khác" và nhập text'
            />

            {field.allowOther && (
              <TextField
                label="Placeholder cho mục khác"
                value={field.otherPlaceholder || ""}
                onChange={(e) =>
                  updateField(field.id, { otherPlaceholder: e.target.value })
                }
                fullWidth
                size="small"
              />
            )}
          </Box>
        );

      case "date":
        return (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Alert severity="info" sx={{ borderRadius: 1 }}>
              Người dùng sẽ chọn ngày khi điền form. Không cần cấu hình thêm.
            </Alert>
          </Box>
        );

      case "image_upload":
        return (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField
              label="Số ảnh tối thiểu"
              type="number"
              value={field.minFiles || ""}
              onChange={(e) =>
                updateField(field.id, {
                  minFiles: e.target.value
                    ? parseInt(e.target.value)
                    : undefined,
                })
              }
              fullWidth
              size="small"
            />
            <TextField
              label="Số ảnh tối đa"
              type="number"
              value={field.maxFiles || ""}
              onChange={(e) =>
                updateField(field.id, {
                  maxFiles: e.target.value
                    ? parseInt(e.target.value)
                    : undefined,
                })
              }
              fullWidth
              size="small"
            />
            <TextField
              label="Kích thước file tối đa (bytes)"
              type="number"
              value={field.maxFileSize || ""}
              onChange={(e) =>
                updateField(field.id, {
                  maxFileSize: e.target.value
                    ? parseInt(e.target.value)
                    : undefined,
                })
              }
              fullWidth
              size="small"
              helperText="Ví dụ: 5242880 = 5MB"
            />
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h6" fontWeight={600}>
          Cấu hình trường nhập liệu
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={addField}
          sx={{
            borderRadius: 2,
            fontWeight: 600,
          }}
        >
          Thêm trường ({currentConfig.fields.length})
        </Button>
      </Box>

      {currentConfig.fields.length === 0 ? (
        <Alert severity="info" sx={{ borderRadius: 2 }}>
          Chưa có trường nào. Nhấn "Thêm trường" để bắt đầu cấu hình form.
        </Alert>
      ) : (
        <Box>
          {currentConfig.fields.map((field) => renderFieldEditor(field))}
        </Box>
      )}

      {currentConfig.fields.length > 0 && (
        <Alert severity="success" sx={{ mt: 3, borderRadius: 2 }}>
          Đã tạo {currentConfig.fields.length} trường. Cấu hình sẽ được lưu khi
          bạn lưu background.
        </Alert>
      )}
    </Box>
  );
};
