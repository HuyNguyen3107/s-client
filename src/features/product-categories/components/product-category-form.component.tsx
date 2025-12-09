import React, { useState, useEffect } from "react";
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
  CircularProgress,
  Typography,
  Alert,
} from "@mui/material";
import { Save, Close, Refresh } from "@mui/icons-material";
import { useQuery } from "@tanstack/react-query";
import type {
  ProductCategoryWithRelations,
  IProductCategoryFormData,
} from "../types";
import { useProductCategoryForm } from "../hooks";
import { ProductCategoryValidator } from "../utils";
import { PRODUCT_CATEGORY_CONSTANTS } from "../constants";
import { API_PATHS } from "../../../constants/api-path.constants";
import http from "../../../libs/http.libs";

interface ProductCategoryFormProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  category?: ProductCategoryWithRelations | null;
}

interface Product {
  id: string;
  name: string;
}

/**
 * Product Category Form Component
 * Following Single Responsibility Principle - handles only form rendering and validation
 */
export const ProductCategoryForm: React.FC<ProductCategoryFormProps> = ({
  open,
  onClose,
  onSuccess,
  category,
}) => {
  // Form state
  const [formData, setFormData] = useState<IProductCategoryFormData>({
    name: "",
    productId: "",
  });
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});

  // Custom hooks
  const { isLoading, submitCategory, updateCategory } =
    useProductCategoryForm();

  // Fetch products for dropdown
  const {
    data: productsData,
    isLoading: isLoadingProducts,
    error: productsError,
    refetch: refetchProducts,
  } = useQuery<Product[]>({
    queryKey: ["products-for-categories"],
    queryFn: async (): Promise<Product[]> => {
      try {
        const response = await http.get<{ data: Product[] }>(
          API_PATHS.PRODUCTS,
          {
            params: {
              limit: 100, // Reduced limit
              status: "active", // Only get active products
            },
          }
        );
        return response.data.data || [];
      } catch (error) {
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
    retry: 3,
    retryDelay: 1000,
    enabled: open, // Only fetch when dialog is open
  });

  // Refetch products when dialog opens
  useEffect(() => {
    if (open) {
      refetchProducts();
    }
  }, [open, refetchProducts]);

  const isEditing = !!category;

  // Initialize form data when category changes
  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name,
        productId: category.productId,
      });
    } else {
      setFormData({
        name: "",
        productId: "",
      });
    }
    setValidationErrors({});
  }, [category, open]);

  // Update form field
  const updateField = (
    field: keyof IProductCategoryFormData,
    value: string
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear validation error for this field
    if (validationErrors[field]) {
      setValidationErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  // Validate form
  const validateForm = (): boolean => {
    const validation =
      ProductCategoryValidator.validateProductCategoryForm(formData);
    setValidationErrors(validation.errors);
    return validation.isValid;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      if (isEditing && category) {
        await updateCategory(category.id, formData);
      } else {
        await submitCategory(formData);
      }

      onSuccess?.();
      onClose();
    } catch (error) {
      // Error is handled by the hook
    }
  };

  // Handle cancel
  const handleCancel = () => {
    setFormData({ name: "", productId: "" });
    setValidationErrors({});
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleCancel}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        component: "form",
        onSubmit: handleSubmit,
      }}
    >
      <DialogTitle>
        {isEditing
          ? "Chỉnh sửa thể loại sản phẩm"
          : "Tạo thể loại sản phẩm mới"}
      </DialogTitle>

      <DialogContent dividers>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3, pt: 1 }}>
          {/* Error Alert for Products */}
          {productsError && (
            <Alert
              severity="error"
              action={
                <Button
                  size="small"
                  onClick={() => refetchProducts()}
                  disabled={isLoadingProducts}
                  startIcon={<Refresh />}
                >
                  Thử lại
                </Button>
              }
            >
              <Typography variant="body2">
                Không thể tải danh sách sản phẩm. Vui lòng thử lại.
              </Typography>
            </Alert>
          )}

          {/* Product Selection */}
          <FormControl
            fullWidth
            error={!!validationErrors.productId}
            disabled={isEditing || isLoadingProducts} // Don't allow changing product in edit mode
          >
            <InputLabel>Sản phẩm *</InputLabel>
            <Select
              value={formData.productId}
              label="Sản phẩm *"
              onChange={(e) => updateField("productId", e.target.value)}
            >
              {isLoadingProducts ? (
                <MenuItem disabled>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <CircularProgress size={16} />
                    <span>Đang tải...</span>
                  </Box>
                </MenuItem>
              ) : productsData && productsData.length > 0 ? (
                productsData.map((product) => (
                  <MenuItem key={product.id} value={product.id}>
                    {product.name}
                  </MenuItem>
                ))
              ) : (
                <MenuItem disabled>
                  <Typography variant="body2" color="text.secondary">
                    {productsError
                      ? "Lỗi tải dữ liệu"
                      : "Không có sản phẩm nào khả dụng. Vui lòng tạo sản phẩm trước."}
                  </Typography>
                </MenuItem>
              )}
            </Select>
            {validationErrors.productId && (
              <Typography variant="caption" color="error" sx={{ mt: 0.5 }}>
                {validationErrors.productId}
              </Typography>
            )}
          </FormControl>

          {/* Category Name */}
          <TextField
            label="Tên thể loại"
            value={formData.name}
            onChange={(e) => updateField("name", e.target.value)}
            error={!!validationErrors.name}
            helperText={validationErrors.name}
            required
            fullWidth
            placeholder="Nhập tên thể loại sản phẩm..."
          />

          {/* Validation Info */}
          <Alert severity="info" sx={{ fontSize: "0.875rem" }}>
            <Typography variant="body2">
              • Tên thể loại phải có từ{" "}
              {PRODUCT_CATEGORY_CONSTANTS.VALIDATION.NAME_MIN_LENGTH}
              đến {PRODUCT_CATEGORY_CONSTANTS.VALIDATION.NAME_MAX_LENGTH} ký tự
              <br />
              • Mỗi sản phẩm có thể có nhiều thể loại khác nhau
              <br />• Tên thể loại phải duy nhất trong cùng một sản phẩm
              {(!productsData || productsData.length === 0) &&
                !isLoadingProducts && (
                  <>
                    <br />
                    <strong>
                      • Cần tạo sản phẩm trước khi tạo thể loại sản phẩm
                    </strong>
                  </>
                )}
            </Typography>
          </Alert>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button
          onClick={handleCancel}
          disabled={isLoading}
          startIcon={<Close />}
        >
          Hủy
        </Button>
        <Button
          type="submit"
          variant="contained"
          disabled={
            isLoading ||
            isLoadingProducts ||
            !productsData ||
            productsData.length === 0 ||
            !!productsError
          }
          startIcon={isLoading ? <CircularProgress size={16} /> : <Save />}
        >
          {isLoading
            ? "Đang xử lý..."
            : (!productsData || productsData.length === 0) && !isLoadingProducts
            ? "Cần có sản phẩm để tạo thể loại"
            : isEditing
            ? "Cập nhật"
            : "Tạo mới"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
