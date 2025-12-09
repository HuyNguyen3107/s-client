import React, { useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Alert,
  CircularProgress,
  Typography,
  Card,
  CardMedia,
  IconButton,
  MenuItem,
  Tabs,
  Tab,
} from "@mui/material";
import { PhotoCamera, Delete } from "@mui/icons-material";
import {
  useCreateBackgroundMutation,
  useUpdateBackgroundMutation,
} from "../mutations/background.mutations";
import { useUploadBackgroundImage } from "../mutations/upload.mutations";
import type {
  Background,
  CreateBackgroundRequest,
} from "../types/background.types";
import type { BackgroundConfig } from "../types/background-config.types";
import { BACKGROUND_CONSTANTS } from "../constants/background.constants";
import { BackgroundConfigBuilder } from "./background-config-builder.component";

/**
 * Background Form Component - Single Responsibility Principle (SRP)
 * Responsible only for rendering and handling the background form
 */

interface BackgroundFormProps {
  open: boolean;
  onClose: () => void;
  background?: Background | null;
  onSuccess?: () => void;
  products?: any[];
}

interface FormData extends CreateBackgroundRequest {
  id?: string;
}

interface FormErrors {
  productId?: string;
  name?: string;
  description?: string;
  imageUrl?: string;
}

export const BackgroundForm: React.FC<BackgroundFormProps> = ({
  open,
  onClose,
  background,
  onSuccess,
  products = [],
}) => {
  const [activeTab, setActiveTab] = useState(0);
  const [formData, setFormData] = useState<FormData>({
    productId: "",
    name: "",
    description: "",
    imageUrl: "",
    config: {
      version: "1.0",
      fields: [],
    },
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [imagePreview, setImagePreview] = useState<string>("");
  const [imageFile, setImageFile] = useState<File | null>(null);

  const isEditing = !!background;

  // Hooks
  const createMutation = useCreateBackgroundMutation();
  const updateMutation = useUpdateBackgroundMutation();
  const uploadImageMutation = useUploadBackgroundImage();
  const descInputRef = useRef<HTMLTextAreaElement | null>(null);

  // Update form when background changes
  useEffect(() => {
    if (background) {
      // Normalize config to ensure select fields have label = value if label is empty
      const normalizedConfig = background.config
        ? {
            ...background.config,
            fields: background.config.fields.map((field) => {
              if (field.type === "select") {
                return {
                  ...field,
                  options: field.options.map((opt: any) => ({
                    ...opt,
                    label:
                      opt.label && opt.label.trim() !== ""
                        ? opt.label
                        : opt.value,
                  })),
                  allowOther:
                    field.allowOther === true || field.allowOther === false
                      ? field.allowOther
                      : false,
                };
              }
              return field;
            }),
          }
        : {
            version: "1.0",
            fields: [],
          };

      setFormData({
        id: background.id,
        productId: background.productId,
        name: background.name || "",
        description: background.description || "",
        imageUrl: background.imageUrl,
        config: normalizedConfig,
      });
      setImagePreview(background.imageUrl);
    } else {
      setFormData({
        productId: "",
        name: "",
        description: "",
        imageUrl: "",
        config: {
          version: "1.0",
          fields: [],
        },
      });
      setImagePreview("");
    }
    setImageFile(null);
    setErrors({});
    setActiveTab(0);
  }, [background, open]);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.productId) {
      newErrors.productId = "Sản phẩm là bắt buộc";
    }

    if (!formData.imageUrl && !imageFile) {
      newErrors.imageUrl = "Hình ảnh là bắt buộc";
    }

    if (
      formData.name &&
      formData.name.length > BACKGROUND_CONSTANTS.VALIDATION.MAX_NAME_LENGTH
    ) {
      newErrors.name = "Tên quá dài";
    }

    if (
      formData.description &&
      formData.description.length >
        BACKGROUND_CONSTANTS.VALIDATION.MAX_DESCRIPTION_LENGTH
    ) {
      newErrors.description = "Mô tả quá dài";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      let finalImageUrl = formData.imageUrl;

      // Upload new image if selected
      if (imageFile) {
        const uploadResult = await uploadImageMutation.mutateAsync(imageFile);
        finalImageUrl = uploadResult.data?.url || "";
      }

      // Clean up config before submit
      const cleanedConfig = formData.config
        ? {
            version: formData.config.version || "1.0",
            fields: formData.config.fields.map((field) => {
              // For select fields, ensure all options have non-empty labels and allowOther is boolean
              if (field.type === "select") {
                return {
                  ...field,
                  options: field.options
                    .filter((opt: any) => opt.value && opt.value.trim() !== "")
                    .map((opt: any) => ({
                      ...opt,
                      // If label is empty, set it equal to value
                      label:
                        opt.label && opt.label.trim() !== ""
                          ? opt.label
                          : opt.value,
                    })),
                  allowOther:
                    field.allowOther === true || field.allowOther === false
                      ? field.allowOther
                      : false,
                };
              }
              return field;
            }),
            metadata: formData.config.metadata,
          }
        : {
            version: "1.0",
            fields: [],
          };

      const submitData = {
        productId: formData.productId,
        name: formData.name,
        description: formData.description,
        imageUrl: finalImageUrl,
        config: cleanedConfig,
      };

      console.log(
        "Submit data with cleaned config:",
        JSON.stringify(submitData, null, 2)
      );

      if (isEditing && formData.id) {
        await updateMutation.mutateAsync({
          id: formData.id,
          ...submitData,
        });
      } else {
        await createMutation.mutateAsync(submitData);
      }

      onSuccess?.();
      handleClose();
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const handleClose = () => {
    setFormData({
      productId: "",
      name: "",
      description: "",
      imageUrl: "",
      config: {
        version: "1.0",
        fields: [],
      },
    });
    setImagePreview("");
    setImageFile(null);
    setErrors({});
    setActiveTab(0);
    onClose();
  };

  const handleInputChange =
    (field: keyof FormData) => (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      setFormData((prev) => ({ ...prev, [field]: value }));

      // Clear error when user starts typing
      if (errors[field as keyof FormErrors]) {
        setErrors((prev) => ({ ...prev, [field]: undefined }));
      }
    };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type and size
      if (
        !(
          BACKGROUND_CONSTANTS.VALIDATION
            .ALLOWED_IMAGE_TYPES as readonly string[]
        ).includes(file.type)
      ) {
        setErrors((prev) => ({
          ...prev,
          imageUrl: BACKGROUND_CONSTANTS.MESSAGES.ERROR.INVALID_IMAGE,
        }));
        return;
      }

      if (file.size > BACKGROUND_CONSTANTS.VALIDATION.MAX_IMAGE_SIZE) {
        setErrors((prev) => ({
          ...prev,
          imageUrl: BACKGROUND_CONSTANTS.MESSAGES.ERROR.IMAGE_TOO_LARGE,
        }));
        return;
      }

      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setImagePreview(result);
        setFormData((prev) => ({ ...prev, imageUrl: result }));
        setErrors((prev) => ({ ...prev, imageUrl: undefined }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview("");
    setFormData((prev) => ({ ...prev, imageUrl: "" }));
  };

  const handleConfigChange = (config: BackgroundConfig) => {
    setFormData((prev) => ({ ...prev, config }));
  };

  const isSubmitting =
    createMutation.isPending ||
    updateMutation.isPending ||
    uploadImageMutation.isPending;

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          minHeight: "600px",
          borderRadius: 3,
          boxShadow: "0 20px 60px rgba(0,0,0,0.1)",
        },
      }}
    >
      <DialogTitle
        sx={{
          bgcolor: "primary.main",
          color: "white",
          py: 3,
          fontSize: "1.5rem",
          fontWeight: 600,
        }}
      >
        {isEditing ? "Chỉnh sửa Hình nền" : "Thêm Hình nền mới"}
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent
          dividers
          sx={{
            p: 0,
            bgcolor: "grey.50",
          }}
        >
          {/* Tabs */}
          <Box
            sx={{ borderBottom: 1, borderColor: "divider", bgcolor: "white" }}
          >
            <Tabs
              value={activeTab}
              onChange={(_, newValue) => setActiveTab(newValue)}
              sx={{ px: 4, pt: 2 }}
            >
              <Tab label="Thông tin cơ bản" />
              <Tab label="Cấu hình form" />
            </Tabs>
          </Box>

          {/* Tab Panel 0: Basic Info */}
          {activeTab === 0 && (
            <Box sx={{ p: 4 }}>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
                {/* Error Messages */}
                {(createMutation.error ||
                  updateMutation.error ||
                  uploadImageMutation.error) && (
                  <Alert severity="error">
                    {createMutation.error?.message ||
                      updateMutation.error?.message ||
                      uploadImageMutation.error?.message ||
                      "Có lỗi xảy ra"}
                  </Alert>
                )}

                {/* Product Selection */}
                <Box>
                  <TextField
                    select
                    fullWidth
                    label="Sản phẩm *"
                    value={formData.productId}
                    onChange={handleInputChange("productId")}
                    error={Boolean(errors.productId)}
                    helperText={
                      errors.productId ||
                      "Chỉ hiển thị sản phẩm có hỗ trợ hình nền"
                    }
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        bgcolor: "white",
                        borderRadius: 2,
                      },
                    }}
                  >
                    <MenuItem value="">
                      <em>Chọn sản phẩm</em>
                    </MenuItem>
                    {products
                      .filter((product) => product.hasBg === true)
                      .map((product) => (
                        <MenuItem key={product.id} value={product.id}>
                          {product.name}
                        </MenuItem>
                      ))}
                  </TextField>
                  {products.filter((product) => product.hasBg === true)
                    .length === 0 && (
                    <Alert severity="warning" sx={{ mt: 2 }}>
                      Không có sản phẩm nào hỗ trợ hình nền. Vui lòng đặt thuộc
                      tính "Hỗ trợ Background" cho sản phẩm trước.
                    </Alert>
                  )}
                </Box>

                {/* Name Field */}
                <TextField
                  fullWidth
                  label="Tên Hình nền"
                  value={formData.name}
                  onChange={handleInputChange("name")}
                  error={Boolean(errors.name)}
                  helperText={errors.name}
                  placeholder="Nhập tên hình nền (tùy chọn)"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      bgcolor: "white",
                      borderRadius: 2,
                    },
                  }}
                />

                {/* Description Field with lightweight formatting */}
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                  <Box sx={{ display: "flex", gap: 1 }}>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => {
                        const el = descInputRef.current;
                        if (!el) return;
                        const start = el.selectionStart || 0;
                        const end = el.selectionEnd || 0;
                        const val = formData.description || "";
                        const selected = val.slice(start, end) || "văn bản";
                        const next = val.slice(0, start) + "**" + selected + "**" + val.slice(end);
                        setFormData((prev) => ({ ...prev, description: next }));
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
                        const el = descInputRef.current;
                        if (!el) return;
                        const start = el.selectionStart || 0;
                        const end = el.selectionEnd || 0;
                        const val = formData.description || "";
                        const selected = val.slice(start, end) || "văn bản";
                        const next = val.slice(0, start) + "_" + selected + "_" + val.slice(end);
                        setFormData((prev) => ({ ...prev, description: next }));
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
                        const el = descInputRef.current;
                        if (!el) return;
                        const start = el.selectionStart || 0;
                        const end = el.selectionEnd || 0;
                        const val = formData.description || "";
                        const selected = val.slice(start, end) || "văn bản";
                        const next = val.slice(0, start) + "__" + selected + "__" + val.slice(end);
                        setFormData((prev) => ({ ...prev, description: next }));
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
                    fullWidth
                    label="Mô tả"
                    value={formData.description}
                    onChange={handleInputChange("description")}
                    error={Boolean(errors.description)}
                    helperText={
                      errors.description ||
                      "Hỗ trợ định dạng: **đậm**, _nghiêng_, __gạch chân__. Xuống dòng bằng Enter."
                    }
                    multiline
                    rows={4}
                    inputRef={(el) => {
                      descInputRef.current = el as HTMLTextAreaElement | null;
                    }}
                    placeholder="Nhập mô tả hình nền (tùy chọn)"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        bgcolor: "white",
                        borderRadius: 2,
                      },
                    }}
                  />
                </Box>

                {/* Image Upload */}
                <Box>
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{
                      fontWeight: 600,
                      mb: 2,
                      color: "text.primary",
                    }}
                  >
                    Hình ảnh Background *
                  </Typography>

                  {imagePreview ? (
                    <Card
                      sx={{
                        maxWidth: 500,
                        mb: 3,
                        borderRadius: 3,
                        overflow: "hidden",
                        boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                      }}
                    >
                      <Box sx={{ position: "relative" }}>
                        <CardMedia
                          component="img"
                          height="250"
                          image={imagePreview}
                          alt="Background preview"
                          sx={{
                            objectFit: "cover",
                          }}
                        />
                        <Box
                          sx={{
                            position: "absolute",
                            top: 12,
                            right: 12,
                            bgcolor: "rgba(255,255,255,0.9)",
                            borderRadius: "50%",
                          }}
                        >
                          <IconButton
                            onClick={handleRemoveImage}
                            color="error"
                            sx={{ p: 1 }}
                          >
                            <Delete fontSize="small" />
                          </IconButton>
                        </Box>
                      </Box>
                    </Card>
                  ) : null}

                  <input
                    accept="image/*"
                    style={{ display: "none" }}
                    id="background-image-upload"
                    type="file"
                    onChange={handleImageUpload}
                  />
                  <label htmlFor="background-image-upload">
                    <Button
                      variant={imagePreview ? "outlined" : "contained"}
                      component="span"
                      startIcon={<PhotoCamera />}
                      size="large"
                      sx={{
                        borderRadius: 2,
                        py: 1.5,
                        px: 3,
                        fontWeight: 600,
                        bgcolor: !imagePreview ? "primary.main" : "transparent",
                        borderStyle: "dashed",
                        borderWidth: 2,
                        borderColor: imagePreview
                          ? "primary.main"
                          : "transparent",
                        "&:hover": {
                          bgcolor: imagePreview ? "primary.50" : "primary.dark",
                          borderColor: "primary.main",
                        },
                      }}
                    >
                      {imagePreview ? "Thay đổi hình ảnh" : "Chọn hình ảnh"}
                    </Button>
                  </label>

                  {errors.imageUrl && (
                    <Typography
                      variant="caption"
                      color="error"
                      display="block"
                      sx={{ mt: 1 }}
                    >
                      {errors.imageUrl}
                    </Typography>
                  )}
                </Box>
              </Box>
            </Box>
          )}

          {/* Tab Panel 1: Configuration */}
          {activeTab === 1 && (
            <Box sx={{ p: 4 }}>
              <BackgroundConfigBuilder
                config={formData.config}
                onChange={handleConfigChange}
              />
            </Box>
          )}
        </DialogContent>

        <DialogActions
          sx={{
            p: 4,
            gap: 2,
            bgcolor: "white",
            borderTop: "1px solid",
            borderColor: "divider",
          }}
        >
          <Button
            onClick={handleClose}
            disabled={isSubmitting}
            size="large"
            sx={{
              px: 3,
              py: 1.5,
              borderRadius: 2,
              fontWeight: 600,
            }}
          >
            Hủy
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={isSubmitting}
            startIcon={isSubmitting ? <CircularProgress size={20} /> : null}
            size="large"
            sx={{
              px: 4,
              py: 1.5,
              borderRadius: 2,
              fontWeight: 600,
              backgroundColor: "#731618",
              "&:hover": {
                backgroundColor: "#5f0d10",
                transform: "translateY(-1px)",
              },
            }}
          >
            {isSubmitting
              ? "Đang xử lý..."
              : isEditing
              ? "Cập nhật"
              : "Tạo mới"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
