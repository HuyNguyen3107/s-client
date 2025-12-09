import React, { useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Autocomplete,
  Button,
  InputAdornment,
  CircularProgress,
  Divider,
} from "@mui/material";
import {
  LocalShipping,
  LocationOn,
  Schedule,
  AttachMoney,
  Note,
  Save,
  Cancel,
} from "@mui/icons-material";
import type {
  IShippingFeeFormData,
  CreateShippingFeeRequest,
  UpdateShippingFeeRequest,
  ShippingFee,
} from "../types";
import { useShippingFeeForm, useShippingFeeValidation } from "../hooks";
import { COMMON_SHIPPING_TYPES, COMMON_AREAS } from "../constants";

/**
 * Props interface following Interface Segregation Principle
 */
interface ShippingFeeFormProps {
  initialData?: ShippingFee | null;
  onSubmit: (data: CreateShippingFeeRequest | UpdateShippingFeeRequest) => void;
  onCancel?: () => void;
  loading?: boolean;
  className?: string;
  mode?: "create" | "edit";
}

/**
 * ShippingFeeForm Component
 * Following Single Responsibility Principle - only responsible for form rendering and handling
 */
export const ShippingFeeForm: React.FC<ShippingFeeFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  loading = false,
  className = "",
  mode = "create",
}) => {
  const isEditMode = mode === "edit";

  // Initialize form with initial data
  const initialFormData: Partial<IShippingFeeFormData> = initialData
    ? {
        shippingType: initialData.shippingType,
        area: initialData.area,
        estimatedDeliveryTime: initialData.estimatedDeliveryTime,
        shippingFee: initialData.shippingFee.toString(),
        notesOrRemarks: initialData.notesOrRemarks || "",
      }
    : {};

  const { formData, isDirty, updateField, resetForm, getSubmitData } =
    useShippingFeeForm(initialFormData);

  const { errors, isValid, validateForm, validateField, clearErrors } =
    useShippingFeeValidation();

  // Reset form when initialData changes
  useEffect(() => {
    if (initialData && isEditMode) {
      resetForm({
        shippingType: initialData.shippingType,
        area: initialData.area,
        estimatedDeliveryTime: initialData.estimatedDeliveryTime,
        shippingFee: initialData.shippingFee.toString(),
        notesOrRemarks: initialData.notesOrRemarks || "",
      });
      clearErrors();
    }
  }, [initialData, isEditMode, resetForm, clearErrors]);

  const handleFieldChange = (field: keyof IShippingFeeFormData, value: any) => {
    updateField(field, value);
    validateField(field, value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const submitData = getSubmitData();
    const validation = validateForm(submitData);

    if (validation.isValid) {
      const requestData = {
        shippingType: submitData.shippingType,
        area: submitData.area,
        estimatedDeliveryTime: submitData.estimatedDeliveryTime,
        shippingFee: parseFloat(submitData.shippingFee.toString()),
        notesOrRemarks: submitData.notesOrRemarks || undefined,
      };

      onSubmit(requestData);
    }
  };

  const handleCancel = () => {
    resetForm();
    clearErrors();
    onCancel?.();
  };

  return (
    <Paper
      className={className}
      sx={{
        p: 4,
        borderRadius: 2,
        boxShadow: 2,
      }}
    >
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" component="h2" fontWeight={600} gutterBottom>
          {isEditMode ? "Chỉnh sửa phí vận chuyển" : "Thêm phí vận chuyển mới"}
        </Typography>
        <Divider />
      </Box>

      <Box component="form" onSubmit={handleSubmit} noValidate>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          {/* Shipping Type Field */}
          <Autocomplete
            value={formData.shippingType || null}
            onChange={(_, newValue) =>
              handleFieldChange("shippingType", newValue || "")
            }
            onInputChange={(_, newInputValue) =>
              handleFieldChange("shippingType", newInputValue)
            }
            options={COMMON_SHIPPING_TYPES}
            freeSolo
            disabled={loading}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Loại vận chuyển"
                required
                error={!!errors.shippingType}
                helperText={errors.shippingType}
                InputProps={{
                  ...params.InputProps,
                  startAdornment: (
                    <InputAdornment position="start">
                      <LocalShipping sx={{ color: "text.secondary" }} />
                    </InputAdornment>
                  ),
                }}
                placeholder="Nhập hoặc chọn loại vận chuyển"
              />
            )}
          />

          {/* Area Field */}
          <Autocomplete
            value={formData.area || null}
            onChange={(_, newValue) =>
              handleFieldChange("area", newValue || "")
            }
            onInputChange={(_, newInputValue) =>
              handleFieldChange("area", newInputValue)
            }
            options={COMMON_AREAS}
            freeSolo
            disabled={loading}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Khu vực"
                required
                error={!!errors.area}
                helperText={errors.area}
                InputProps={{
                  ...params.InputProps,
                  startAdornment: (
                    <InputAdornment position="start">
                      <LocationOn sx={{ color: "text.secondary" }} />
                    </InputAdornment>
                  ),
                }}
                placeholder="Nhập hoặc chọn khu vực"
              />
            )}
          />

          {/* Estimated Delivery Time Field */}
          <TextField
            label="Thời gian giao hàng dự kiến"
            required
            value={formData.estimatedDeliveryTime || ""}
            onChange={(e) =>
              handleFieldChange("estimatedDeliveryTime", e.target.value)
            }
            error={!!errors.estimatedDeliveryTime}
            helperText={errors.estimatedDeliveryTime}
            disabled={loading}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Schedule sx={{ color: "text.secondary" }} />
                </InputAdornment>
              ),
            }}
            placeholder="VD: 2-3 ngày làm việc"
          />

          {/* Shipping Fee Field */}
          <TextField
            label="Phí vận chuyển"
            required
            type="number"
            value={formData.shippingFee || ""}
            onChange={(e) => handleFieldChange("shippingFee", e.target.value)}
            error={!!errors.shippingFee}
            helperText={errors.shippingFee}
            disabled={loading}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <AttachMoney sx={{ color: "text.secondary" }} />
                </InputAdornment>
              ),
              endAdornment: <InputAdornment position="end">VNĐ</InputAdornment>,
            }}
            inputProps={{
              min: 0,
              step: 1000,
            }}
            placeholder="0"
          />

          {/* Notes Field */}
          <TextField
            label="Ghi chú"
            multiline
            rows={3}
            value={formData.notesOrRemarks || ""}
            onChange={(e) =>
              handleFieldChange("notesOrRemarks", e.target.value)
            }
            error={!!errors.notesOrRemarks}
            helperText={errors.notesOrRemarks}
            disabled={loading}
            InputProps={{
              startAdornment: (
                <InputAdornment
                  position="start"
                  sx={{ alignSelf: "flex-start", mt: 1 }}
                >
                  <Note sx={{ color: "text.secondary" }} />
                </InputAdornment>
              ),
            }}
            placeholder="Ghi chú thêm về phí vận chuyển..."
          />
        </Box>

        {/* Action Buttons */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            gap: 2,
            mt: 4,
            pt: 3,
            borderTop: "1px solid",
            borderColor: "divider",
          }}
        >
          <Button
            variant="outlined"
            onClick={handleCancel}
            disabled={loading}
            startIcon={<Cancel />}
            sx={{ minWidth: 120 }}
          >
            Hủy
          </Button>

          <Button
            type="submit"
            variant="contained"
            disabled={!isValid || loading || (!isDirty && isEditMode)}
            startIcon={loading ? <CircularProgress size={16} /> : <Save />}
            sx={{ minWidth: 140 }}
          >
            {loading
              ? isEditMode
                ? "Đang cập nhật..."
                : "Đang tạo..."
              : isEditMode
              ? "Cập nhật"
              : "Tạo mới"}
          </Button>
        </Box>
      </Box>
    </Paper>
  );
};

export default ShippingFeeForm;
