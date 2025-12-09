import React, { useState } from "react";
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
} from "@mui/material";
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  DragIndicator as DragIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
} from "@mui/icons-material";
import type {
  InformationConfig,
  InformationFieldConfig,
  SelectOption,
  ShortTextField,
} from "../types/information-config.types";
import { v4 as uuidv4 } from "uuid";

interface InformationConfigBuilderProps {
  config: Record<string, any>;
  onChange: (config: Record<string, any>) => void;
}

const FIELD_TYPES = [
  { value: "short_text", label: "Text ngắn" },
  { value: "long_text", label: "Text dài" },
  { value: "select", label: "Lựa chọn (Select)" },
  { value: "date", label: "Ngày tháng" },
  { value: "number", label: "Số" },
  { value: "email", label: "Email" },
  { value: "url", label: "URL" },
  { value: "image_upload", label: "Upload ảnh" },
];

export const InformationConfigBuilder: React.FC<
  InformationConfigBuilderProps
> = ({ config, onChange }) => {
  const [expandedFields, setExpandedFields] = useState<Set<string>>(new Set());

  const currentConfig: InformationConfig = config?.fields
    ? (config as InformationConfig)
    : {
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
    const newField: InformationFieldConfig = {
      id: uuidv4(),
      type: "short_text" as const,
      title: "",
      description: "",
      required: false,
      order: currentConfig.fields.length,
      placeholder: "",
      maxLength: 255,
    } as ShortTextField;

    const updatedConfig: InformationConfig = {
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
    updates: Partial<InformationFieldConfig>
  ) => {
    const updatedFields = currentConfig.fields.map((field) =>
      field.id === fieldId
        ? ({ ...field, ...updates } as InformationFieldConfig)
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
      const defaultValue = `Tùy chọn ${(field.options?.length || 0) + 1}`;

      const newOption: SelectOption = {
        id: uuidv4(),
        label: defaultValue,
        value: defaultValue,
      };

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

  const renderFieldEditor = (field: InformationFieldConfig) => {
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
                    .value as InformationFieldConfig["type"];
                  const updates: any = {
                    type: newType,
                  };

                  if (newType === "select") {
                    const currentField = field as any;
                    if (
                      !currentField.options ||
                      !Array.isArray(currentField.options)
                    ) {
                      updates.options = [];
                    }
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
              <TextField
                label="Mô tả"
                value={field.description || ""}
                onChange={(e) =>
                  updateField(field.id, { description: e.target.value })
                }
                fullWidth
                size="small"
                multiline
                rows={2}
              />

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

  const renderTypeSpecificFields = (field: InformationFieldConfig) => {
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

      case "number":
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
              label="Giá trị tối thiểu"
              type="number"
              value={field.min || ""}
              onChange={(e) =>
                updateField(field.id, {
                  min: e.target.value ? parseInt(e.target.value) : undefined,
                })
              }
              fullWidth
              size="small"
            />
            <TextField
              label="Giá trị tối đa"
              type="number"
              value={field.max || ""}
              onChange={(e) =>
                updateField(field.id, {
                  max: e.target.value ? parseInt(e.target.value) : undefined,
                })
              }
              fullWidth
              size="small"
            />
          </Box>
        );

      case "email":
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
            <Alert severity="info" sx={{ borderRadius: 1 }}>
              Trường này sẽ tự động validate định dạng email.
            </Alert>
          </Box>
        );

      case "url":
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
            <Alert severity="info" sx={{ borderRadius: 1 }}>
              Trường này sẽ tự động validate định dạng URL.
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
          bạn lưu thông tin.
        </Alert>
      )}
    </Box>
  );
};
