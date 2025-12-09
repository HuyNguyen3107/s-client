import React, { useState, useEffect, useCallback } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Alert,
  CircularProgress,
  FormHelperText,
  InputAdornment,
  IconButton,
} from "@mui/material";
import {
  CloudUpload,
  Close,
  Clear,
  Image as ImageIcon,
} from "@mui/icons-material";
import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "../../../constants/query-key.constants";
import { API_PATHS } from "../../../constants/api-path.constants";
import http from "../../../libs/http.libs";
import type {
  IProductCustomFormData,
  ProductCustomWithRelations,
} from "../types";
import { useProductCustomForm, useProductCustomFormValidation } from "../hooks";
import { productCustomValidator } from "../utils";
import { PRODUCT_CUSTOM_CONSTANTS } from "../constants";

interface ProductCategory {
  id: string;
  name: string;
  product: {
    id: string;
    name: string;
    collection: {
      id: string;
      name: string;
    };
  };
}

interface ProductCustomFormProps {
  open: boolean;
  onClose: () => void;
  productCustom?: ProductCustomWithRelations | null;
  initialCategoryId?: string;
  mode?: "create" | "edit";
}

/**
 * Product Custom Form Component
 * Following Single Responsibility Principle - handles form operations for product customs
 */
export const ProductCustomForm: React.FC<ProductCustomFormProps> = ({
  open,
  onClose,
  productCustom,
  initialCategoryId,
  mode = productCustom ? "edit" : "create",
}) => {
  // Form state
  const [formData, setFormData] = useState<IProductCustomFormData>({
    productCategoryId:
      initialCategoryId || productCustom?.productCategoryId || "",
    name: productCustom?.name || "",
    imageUrl: productCustom?.imageUrl || "",
    price: productCustom?.price || undefined,
    description: productCustom?.description || "",
    status: productCustom?.status || PRODUCT_CUSTOM_CONSTANTS.DEFAULTS.STATUS,
  });

  const [imagePreview, setImagePreview] = useState<string>(formData.imageUrl);
  const [isUploading, setIsUploading] = useState(false);

  // Hooks
  const { submitCustom, updateCustom, isLoading, error } =
    useProductCustomForm();
  const {
    touchedFields,
    validateField,
    touchField,
    getFieldError,
    clearErrors,
  } = useProductCustomFormValidation(formData);

  // Fetch product categories for dropdown
  const { data: categoriesData, isLoading: categoriesLoading } = useQuery({
    queryKey: [QUERY_KEYS.PRODUCT_CATEGORIES],
    queryFn: async () => {
      const response = await http.get<{ data: ProductCategory[] }>(
        API_PATHS.PRODUCT_CATEGORIES,
        { params: { limit: 100 } }
      );
      return response.data.data || [];
    },
    enabled: open,
  });

  // Reset form when dialog opens/closes or productCustom changes
  useEffect(() => {
    if (open) {
      const newFormData: IProductCustomFormData = {
        productCategoryId:
          initialCategoryId || productCustom?.productCategoryId || "",
        name: productCustom?.name || "",
        imageUrl: productCustom?.imageUrl || "",
        price: productCustom?.price || undefined,
        description: productCustom?.description || "",
        status:
          productCustom?.status || PRODUCT_CUSTOM_CONSTANTS.DEFAULTS.STATUS,
      };
      setFormData(newFormData);
      setImagePreview(newFormData.imageUrl);
      clearErrors();
    }
  }, [open, productCustom, initialCategoryId, clearErrors]);

  // Handle form field changes
  const handleFieldChange = useCallback(
    (fieldName: keyof IProductCustomFormData, value: any) => {
      setFormData((prev) => ({ ...prev, [fieldName]: value }));

      // Validate field on change
      if (touchedFields.has(fieldName)) {
        validateField(fieldName, value);
      }
    },
    [touchedFields, validateField]
  );

  // Handle field blur (touch)
  const handleFieldBlur = useCallback(
    (fieldName: keyof IProductCustomFormData) => {
      touchField(fieldName);
      validateField(fieldName, formData[fieldName]);
    },
    [touchField, validateField, formData]
  );

  // Handle image upload
  const handleImageUpload = async (file: File) => {
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      console.error("Only image files are allowed");
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      console.error("File size should not exceed 5MB");
      return;
    }

    try {
      setIsUploading(true);

      const uploadFormData = new FormData();
      uploadFormData.append("file", file);

      const response = await http.post<{
        success: boolean;
        message: string;
        data: { url: string };
      }>(API_PATHS.UPLOAD_IMAGE, uploadFormData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const imageUrl = response.data.data.url;
      handleFieldChange("imageUrl", imageUrl);
      setImagePreview(imageUrl);
    } catch (error: any) {
      console.error("Error uploading image:", error);
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to upload image";
      console.error("Upload error details:", errorMessage);
    } finally {
      setIsUploading(false);
    }
  };

  // Handle image URL change
  const handleImageUrlChange = (url: string) => {
    handleFieldChange("imageUrl", url);
    setImagePreview(url);
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Touch all fields to show validation errors
      Object.keys(formData).forEach((field) => touchField(field));

      // Validate form
      const validation =
        productCustomValidator.validateProductCustomForm(formData);
      if (!validation.isValid) {
        return;
      }

      // Submit based on mode
      if (mode === "create") {
        await submitCustom(formData);
      } else if (productCustom) {
        await updateCustom(productCustom.id, formData);
      }

      onClose();
    } catch (error) {
      console.error("Form submission error:", error);
    }
  };

  const isFormLoading = isLoading || isUploading;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        component: "form",
        onSubmit: handleSubmit,
      }}
    >
      <DialogTitle>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography variant="h6">
            {mode === "create"
              ? "Tạo sản phẩm tùy chỉnh mới"
              : "Chỉnh sửa sản phẩm tùy chỉnh"}
          </Typography>
          <IconButton onClick={onClose} disabled={isFormLoading}>
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        {/* Error Alert */}
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error.message || "Có lỗi xảy ra. Vui lòng thử lại."}
          </Alert>
        )}

        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          {/* Product Category Selection */}
          <FormControl
            fullWidth
            error={Boolean(getFieldError("productCategoryId"))}
            disabled={isFormLoading}
          >
            <InputLabel>Danh mục sản phẩm *</InputLabel>
            <Select
              value={formData.productCategoryId}
              label="Danh mục sản phẩm *"
              onChange={(e) =>
                handleFieldChange("productCategoryId", e.target.value)
              }
              onBlur={() => handleFieldBlur("productCategoryId")}
            >
              {categoriesLoading ? (
                <MenuItem disabled>
                  <span style={{ display: "flex", alignItems: "center" }}>
                    <CircularProgress size={20} />
                    <Box sx={{ ml: 1 }}>Đang tải...</Box>
                  </span>
                </MenuItem>
              ) : (
                categoriesData?.map((category) => (
                  <MenuItem key={category.id} value={category.id}>
                    <Box>
                      <Typography variant="body2">
                        {category.product.collection.name} →{" "}
                        {category.product.name} → {category.name}
                      </Typography>
                    </Box>
                  </MenuItem>
                ))
              )}
            </Select>
            <FormHelperText>
              {getFieldError("productCategoryId") ||
                "Chọn danh mục sản phẩm cho tùy chỉnh này"}
            </FormHelperText>
          </FormControl>

          {/* Name and Price Row */}
          <Box sx={{ display: "flex", gap: 2 }}>
            <TextField
              fullWidth
              label="Tên sản phẩm tùy chỉnh"
              value={formData.name}
              onChange={(e) => handleFieldChange("name", e.target.value)}
              onBlur={() => handleFieldBlur("name")}
              error={Boolean(getFieldError("name"))}
              helperText={
                getFieldError("name") ||
                `${formData.name.length}/${PRODUCT_CUSTOM_CONSTANTS.MAX_NAME_LENGTH} ký tự`
              }
              disabled={isFormLoading}
              required
            />

            <TextField
              fullWidth
              label="Giá"
              type="number"
              value={formData.price || ""}
              onChange={(e) =>
                handleFieldChange(
                  "price",
                  e.target.value ? Number(e.target.value) : undefined
                )
              }
              onBlur={() => handleFieldBlur("price")}
              error={Boolean(getFieldError("price"))}
              helperText={getFieldError("price") || "Để trống nếu chưa có giá"}
              disabled={isFormLoading}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">₫</InputAdornment>
                ),
              }}
            />
          </Box>

          {/* Status */}
          <FormControl fullWidth disabled={isFormLoading}>
            <InputLabel>Trạng thái</InputLabel>
            <Select
              value={formData.status}
              label="Trạng thái"
              onChange={(e) => handleFieldChange("status", e.target.value)}
            >
              {Object.entries(PRODUCT_CUSTOM_CONSTANTS.STATUS_LABELS).map(
                ([value, label]) => (
                  <MenuItem key={value} value={value}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Box
                        sx={{
                          width: 12,
                          height: 12,
                          borderRadius: "50%",
                          backgroundColor:
                            PRODUCT_CUSTOM_CONSTANTS.STATUS_COLORS[
                              value as keyof typeof PRODUCT_CUSTOM_CONSTANTS.STATUS_COLORS
                            ],
                        }}
                      />
                      {label}
                    </Box>
                  </MenuItem>
                )
              )}
            </Select>
          </FormControl>

          {/* Image Upload */}
          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Hình ảnh sản phẩm *
            </Typography>

            <Box sx={{ display: "flex", gap: 2, alignItems: "flex-start" }}>
              {/* Image Preview */}
              <Box sx={{ flex: "0 0 200px" }}>
                {imagePreview ? (
                  <Box sx={{ position: "relative" }}>
                    <img
                      src={imagePreview}
                      alt="Preview"
                      style={{
                        width: "100%",
                        height: 150,
                        objectFit: "cover",
                        borderRadius: 8,
                        border: "1px solid #ddd",
                      }}
                    />
                    <IconButton
                      size="small"
                      sx={{
                        position: "absolute",
                        top: 4,
                        right: 4,
                        bgcolor: "rgba(255,255,255,0.8)",
                      }}
                      onClick={() => handleImageUrlChange("")}
                    >
                      <Clear fontSize="small" />
                    </IconButton>
                  </Box>
                ) : (
                  <Box
                    sx={{
                      width: "100%",
                      height: 150,
                      border: "2px dashed #ddd",
                      borderRadius: 2,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "text.secondary",
                    }}
                  >
                    <ImageIcon sx={{ fontSize: 48, mb: 1 }} />
                    <Typography variant="body2">Chưa có hình ảnh</Typography>
                  </Box>
                )}
              </Box>

              {/* Upload Controls */}
              <Box sx={{ flex: 1 }}>
                <TextField
                  fullWidth
                  label="URL hình ảnh"
                  value={formData.imageUrl}
                  onChange={(e) => handleImageUrlChange(e.target.value)}
                  onBlur={() => handleFieldBlur("imageUrl")}
                  error={Boolean(getFieldError("imageUrl"))}
                  helperText={
                    getFieldError("imageUrl") ||
                    "Nhập URL hình ảnh hoặc tải lên file"
                  }
                  disabled={isFormLoading}
                  sx={{ mb: 2 }}
                />

                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Button
                    variant="outlined"
                    component="label"
                    startIcon={
                      isUploading ? (
                        <CircularProgress size={16} />
                      ) : (
                        <CloudUpload />
                      )
                    }
                    disabled={isFormLoading}
                  >
                    {isUploading ? "Đang tải..." : "Tải lên"}
                    <input
                      type="file"
                      accept="image/*"
                      hidden
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleImageUpload(file);
                      }}
                    />
                  </Button>
                </Box>
              </Box>
            </Box>
          </Box>

          {/* Description */}
          <TextField
            fullWidth
            label="Mô tả"
            multiline
            rows={3}
            value={formData.description}
            onChange={(e) => handleFieldChange("description", e.target.value)}
            onBlur={() => handleFieldBlur("description")}
            error={Boolean(getFieldError("description"))}
            helperText={
              getFieldError("description") ||
              `${formData.description?.length || 0}/${
                PRODUCT_CUSTOM_CONSTANTS.MAX_DESCRIPTION_LENGTH
              } ký tự`
            }
            disabled={isFormLoading}
          />
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3 }}>
        <Button onClick={onClose} disabled={isFormLoading}>
          Hủy
        </Button>
        <Button
          type="submit"
          variant="contained"
          disabled={isFormLoading}
          startIcon={isFormLoading && <CircularProgress size={16} />}
        >
          {isFormLoading
            ? "Đang xử lý..."
            : mode === "create"
            ? "Tạo mới"
            : "Cập nhật"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProductCustomForm;
