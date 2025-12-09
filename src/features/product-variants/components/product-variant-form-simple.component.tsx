import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Alert,
  Autocomplete,
  Chip,
} from "@mui/material";
import { Controller } from "react-hook-form";
import type {
  ProductVariantWithProduct,
  IProductVariantFormData,
} from "../types";
import { useProductVariantForm } from "../hooks";
import { useProducts } from "../../products/queries";
import { PRODUCT_VARIANT_CONSTANTS } from "../constants";
import EndowManager from "./endow-manager.component";
import PurchaseOptionsManager from "./purchase-options-manager.component";
import ConfigurationManager from "./configuration-manager.component";

interface ProductVariantFormProps {
  open: boolean;
  variant?: ProductVariantWithProduct;
  onClose: () => void;
  onSuccess?: (variant: ProductVariantWithProduct) => void;
}

/**
 * Product Variant Form Component
 * Following Single Responsibility Principle - handles variant creation and editing
 */
export const ProductVariantForm: React.FC<ProductVariantFormProps> = ({
  open,
  variant,
  onClose,
  onSuccess,
}) => {
  const [jsonErrors, setJsonErrors] = useState<{
    option?: string;
    config?: string;
  }>({});

  const { form, isSubmitting, isEditing, onSubmit, validateForm, reset } =
    useProductVariantForm({
      variant,
      onSuccess: (result) => {
        onSuccess?.(result);
        handleClose();
      },
    });

  const { data: productsData } = useProducts({
    page: 1,
    limit: 100, // Get enough products for selection
  });

  const {
    control,
    handleSubmit,
    watch,

    formState: { errors },
  } = form;

  // Watch JSON fields for validation (chỉ cho option và config)
  const watchedOption = watch("option");
  const watchedConfig = watch("config");

  // Validate JSON fields on change (chỉ cho option và config)
  useEffect(() => {
    const newErrors: typeof jsonErrors = {};

    if (watchedOption) {
      try {
        JSON.parse(watchedOption);
      } catch {
        newErrors.option = "JSON không hợp lệ";
      }
    }

    if (watchedConfig) {
      try {
        JSON.parse(watchedConfig);
      } catch {
        newErrors.config = "JSON không hợp lệ";
      }
    }

    setJsonErrors(newErrors);
  }, [watchedOption, watchedConfig]);

  const handleClose = () => {
    reset();
    setJsonErrors({});
    onClose();
  };

  const handleFormSubmit = async (data: IProductVariantFormData) => {
    // Additional client-side validation
    const validation = validateForm(data);
    if (!validation.isValid) {
      return;
    }

    // Check for JSON errors
    if (Object.keys(jsonErrors).length > 0) {
      return;
    }

    await onSubmit(data);
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      disableEscapeKeyDown={isSubmitting}
      PaperProps={{
        sx: { minHeight: "600px" },
      }}
    >
      <DialogTitle>
        {isEditing
          ? "Chỉnh sửa biến thể sản phẩm"
          : "Tạo biến thể sản phẩm mới"}
      </DialogTitle>

      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <DialogContent dividers>
          <Grid container spacing={3}>
            {/* Product Selection */}
            <Grid size={12}>
              <Controller
                name="productId"
                control={control}
                rules={{ required: "Vui lòng chọn sản phẩm" }}
                render={({ field }) => (
                  <Autocomplete
                    {...field}
                    options={productsData?.data || []}
                    getOptionLabel={(option: any) =>
                      typeof option === "string" ? option : option.name
                    }
                    value={
                      productsData?.data?.find(
                        (p: any) => p.id === field.value
                      ) || null
                    }
                    onChange={(_, value: any) =>
                      field.onChange(value?.id || "")
                    }
                    disabled={isEditing} // Can't change product when editing
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label={PRODUCT_VARIANT_CONSTANTS.FORM_LABELS.PRODUCT}
                        error={!!errors.productId}
                        helperText={errors.productId?.message}
                        required
                      />
                    )}
                    renderOption={(props, option: any) => {
                      const { key, ...otherProps } = props;
                      return (
                        <li key={key} {...otherProps}>
                          <Box>
                            <Typography variant="body1">
                              {option.name}
                            </Typography>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              ID: {option.id}
                            </Typography>
                          </Box>
                        </li>
                      );
                    }}
                  />
                )}
              />
            </Grid>

            {/* Name */}
            <Grid size={{ xs: 12, md: 8 }}>
              <Controller
                name="name"
                control={control}
                rules={{
                  required: "Tên biến thể là bắt buộc",
                  minLength: {
                    value: 2,
                    message: "Tên biến thể phải có ít nhất 2 ký tự",
                  },
                  maxLength: {
                    value: 255,
                    message: "Tên biến thể không được vượt quá 255 ký tự",
                  },
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label={PRODUCT_VARIANT_CONSTANTS.FORM_LABELS.NAME}
                    placeholder={PRODUCT_VARIANT_CONSTANTS.PLACEHOLDERS.NAME}
                    error={!!errors.name}
                    helperText={errors.name?.message}
                    fullWidth
                    required
                  />
                )}
              />
            </Grid>

            {/* Status */}
            <Grid size={{ xs: 12, md: 4 }}>
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth>
                    <InputLabel>
                      {PRODUCT_VARIANT_CONSTANTS.FORM_LABELS.STATUS}
                    </InputLabel>
                    <Select
                      {...field}
                      label={PRODUCT_VARIANT_CONSTANTS.FORM_LABELS.STATUS}
                    >
                      {PRODUCT_VARIANT_CONSTANTS.STATUS_OPTIONS.map(
                        (option) => (
                          <MenuItem key={option.value} value={option.value}>
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                              }}
                            >
                              <Chip
                                label={option.label}
                                color={option.color as any}
                                size="small"
                              />
                            </Box>
                          </MenuItem>
                        )
                      )}
                    </Select>
                  </FormControl>
                )}
              />
            </Grid>

            {/* Price */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Controller
                name="price"
                control={control}
                rules={{
                  required: "Giá là bắt buộc",
                  min: {
                    value: 0,
                    message: "Giá không thể âm",
                  },
                  max: {
                    value: 999999999,
                    message: "Giá quá cao",
                  },
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    type="number"
                    label={PRODUCT_VARIANT_CONSTANTS.FORM_LABELS.PRICE}
                    placeholder={PRODUCT_VARIANT_CONSTANTS.PLACEHOLDERS.PRICE}
                    error={!!errors.price}
                    helperText={errors.price?.message}
                    fullWidth
                    required
                    InputProps={{
                      endAdornment: (
                        <Typography variant="body2">VNĐ</Typography>
                      ),
                    }}
                  />
                )}
              />
            </Grid>

            {/* Description */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label={PRODUCT_VARIANT_CONSTANTS.FORM_LABELS.DESCRIPTION}
                    placeholder={
                      PRODUCT_VARIANT_CONSTANTS.PLACEHOLDERS.DESCRIPTION
                    }
                    multiline
                    rows={3}
                    fullWidth
                  />
                )}
              />
            </Grid>

            {/* JSON Fields */}
            {/* Endow - Sử dụng EndowManager mới */}
            <Grid size={12}>
              <Typography variant="subtitle2" sx={{ mb: 2 }}>
                {PRODUCT_VARIANT_CONSTANTS.FORM_LABELS.ENDOW}
              </Typography>
              <Controller
                name="endow"
                control={control}
                render={({ field }) => (
                  <EndowManager
                    value={(() => {
                      try {
                        if (!field.value) return undefined;
                        if (typeof field.value === "string") {
                          const parsed = JSON.parse(field.value);
                          // Ensure it has the expected structure
                          return {
                            endows: parsed?.endows || [],
                            customProducts: parsed?.customProducts || [],
                          };
                        }
                        return {
                          endows: field.value?.endows || [],
                          customProducts: field.value?.customProducts || [],
                        };
                      } catch {
                        return undefined;
                      }
                    })()}
                    onChange={(endowSystem) => {
                      // Lưu cấu trúc frontend (EndowSystem) để EndowManager có thể hiển thị đúng
                      const endows = endowSystem.endows || [];
                      const customProducts = endowSystem.customProducts || [];

                      // Nếu không có endow và custom product nào, gửi undefined
                      if (endows.length === 0 && customProducts.length === 0) {
                        field.onChange(undefined);
                        return;
                      }

                      // Lưu cấu trúc frontend để component có thể hiển thị
                      field.onChange(JSON.stringify(endowSystem));
                    }}
                    placeholder="Nhập nội dung ưu đãi..."
                    disabled={isSubmitting}
                  />
                )}
              />
            </Grid>

            {/* Purchase Options Management */}
            <Grid size={12}>
              <Typography variant="subtitle2" sx={{ mb: 2 }}>
                Option mua thêm
              </Typography>
              <Controller
                name="option"
                control={control}
                render={({ field }) => (
                  <PurchaseOptionsManager
                    value={(() => {
                      try {
                        const parsed = field.value
                          ? typeof field.value === "string"
                            ? JSON.parse(field.value)
                            : field.value
                          : {};
                        return parsed.purchaseOptions || [];
                      } catch {
                        return [];
                      }
                    })()}
                    onChange={(options) => {
                      // Nếu không có option nào, gửi undefined thay vì empty object
                      if (!options || options.length === 0) {
                        field.onChange(undefined);
                        return;
                      }

                      try {
                        const currentOption = field.value
                          ? typeof field.value === "string"
                            ? JSON.parse(field.value)
                            : field.value
                          : {};
                        field.onChange(
                          JSON.stringify({
                            ...currentOption,
                            purchaseOptions: options,
                          })
                        );
                      } catch {
                        field.onChange(
                          JSON.stringify({ purchaseOptions: options })
                        );
                      }
                    }}
                  />
                )}
              />
            </Grid>

            {/* Configuration Management */}
            <Grid size={12}>
              <Typography variant="subtitle2" sx={{ mb: 2 }}>
                Cấu hình sản phẩm (Items & Quy tắc)
              </Typography>
              <Controller
                name="config"
                control={control}
                render={({ field }) => (
                  <ConfigurationManager
                    value={(() => {
                      try {
                        const parsed = field.value
                          ? typeof field.value === "string"
                            ? JSON.parse(field.value)
                            : field.value
                          : {};
                        return parsed;
                      } catch {
                        return {
                          items: [],
                          globalCategoryRules: [],
                          allowCustomQuantity: true,
                        };
                      }
                    })()}
                    onChange={(config) => {
                      // Kiểm tra xem config có ý nghĩa hay không
                      // Chỉ set undefined khi config thực sự rỗng (items rỗng + settings ở giá trị mặc định)
                      if (
                        !config ||
                        ((!config.items || config.items.length === 0) &&
                          (!config.globalCategoryRules ||
                            config.globalCategoryRules.length === 0) &&
                          (config.allowCustomQuantity === undefined ||
                            config.allowCustomQuantity === true))
                      ) {
                        field.onChange(undefined);
                        return;
                      }

                      try {
                        field.onChange(JSON.stringify(config));
                      } catch {
                        field.onChange(
                          JSON.stringify({
                            items: [],
                            globalCategoryRules: [],
                            allowCustomQuantity: true,
                          })
                        );
                      }
                    }}
                  />
                )}
              />
            </Grid>
          </Grid>

          {/* Form Errors */}
          {Object.keys(errors).length > 0 && (
            <Alert severity="error" sx={{ mt: 2 }}>
              Vui lòng kiểm tra lại thông tin đã nhập
            </Alert>
          )}
        </DialogContent>

        <DialogActions sx={{ p: 3 }}>
          <Button onClick={handleClose} disabled={isSubmitting}>
            Hủy
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={isSubmitting || Object.keys(jsonErrors).length > 0}
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
