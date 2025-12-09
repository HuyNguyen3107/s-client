import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Box,
  Typography,
  Alert,
  Autocomplete,
  Chip,
  InputAdornment,
  Divider,
} from "@mui/material";
// LoadingButton functionality is now in Button
import { Save, Cancel, Inventory, Warning, Info } from "@mui/icons-material";
import { useQuery } from "@tanstack/react-query";
import {
  useCreateInventoryMutation,
  useUpdateInventoryMutation,
} from "../mutations";
import { StockLevelUtils, InventoryValidator } from "../utils";
import { INVENTORY_CONSTANTS } from "../constants";
import { API_PATHS } from "../../../constants/api-path.constants";
import http from "../../../libs/http.libs";
import type {
  InventoryWithRelations,
  CreateInventoryRequest,
  UpdateInventoryRequest,
  ProductCustom,
  ApiResponse,
  InventoryStatus,
} from "../types";

// Props interface following Interface Segregation Principle
interface InventoryFormProps {
  open: boolean;
  onClose: () => void;
  inventory?: InventoryWithRelations | null;
  mode?: "create" | "edit";
}

// Form data interface
interface FormData {
  productCustomId: string;
  currentStock: number;
  reservedStock: number;
  minStockAlert: number;
  status: InventoryStatus;
}

const InventoryForm: React.FC<InventoryFormProps> = ({
  open,
  onClose,
  inventory,
  mode = inventory ? "edit" : "create",
}) => {
  const [formData, setFormData] = useState<FormData>({
    productCustomId: "",
    currentStock: 0,
    reservedStock: 0,
    minStockAlert: 10,
    status: "active" as InventoryStatus,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const createMutation = useCreateInventoryMutation();
  const updateMutation = useUpdateInventoryMutation();

  // Fetch product customs for selection
  const { data: productCustoms, isLoading: loadingProducts } = useQuery({
    queryKey: ["product-customs"],
    queryFn: async () => {
      const response = await http.get<ApiResponse<ProductCustom[]>>(
        API_PATHS.PRODUCT_CUSTOMS
      );
      return response.data.data || [];
    },
    enabled: mode === "create",
  });

  // Initialize form data when inventory changes
  useEffect(() => {
    if (inventory) {
      setFormData({
        productCustomId: inventory.productCustomId,
        currentStock: inventory.currentStock,
        reservedStock: inventory.reservedStock,
        minStockAlert: inventory.minStockAlert,
        status: inventory.status,
      });
    } else {
      setFormData({
        productCustomId: "",
        currentStock: 0,
        reservedStock: 0,
        minStockAlert: 10,
        status: "active" as InventoryStatus,
      });
    }
    setErrors({});
    setTouched({});
  }, [inventory, open]);

  // Handle form field changes
  const handleFieldChange = (field: keyof FormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }

    // Mark field as touched
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  // Validate form
  const validateForm = (): boolean => {
    const validation = InventoryValidator.validateInventoryForm(formData);
    setErrors(validation.errors);
    return validation.isValid;
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      if (mode === "create") {
        const createData: CreateInventoryRequest = {
          productCustomId: formData.productCustomId,
          currentStock: formData.currentStock,
          reservedStock: formData.reservedStock,
          minStockAlert: formData.minStockAlert,
          status: formData.status,
        };
        await createMutation.mutateAsync(createData);
      } else if (inventory) {
        const updateData: UpdateInventoryRequest = {
          currentStock: formData.currentStock,
          reservedStock: formData.reservedStock,
          minStockAlert: formData.minStockAlert,
          status: formData.status,
        };
        await updateMutation.mutateAsync({
          id: inventory.id,
          data: updateData,
        });
      }
      onClose();
    } catch (error) {
      console.error("Form submission error:", error);
    }
  };

  const handleClose = () => {
    setErrors({});
    setTouched({});
    onClose();
  };

  const isSubmitting = createMutation.isPending || updateMutation.isPending;
  const selectedProductCustom = productCustoms?.find(
    (p) => p.id === formData.productCustomId
  );

  // Calculate available stock
  const availableStock = Math.max(
    0,
    formData.currentStock - formData.reservedStock
  );

  // Get stock level info
  const stockLevelInfo = inventory
    ? StockLevelUtils.getStockLevel({
        ...inventory,
        currentStock: formData.currentStock,
        minStockAlert: formData.minStockAlert,
      })
    : null;

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      disableEscapeKeyDown={isSubmitting}
    >
      <DialogTitle>
        <Box display="flex" alignItems="center" gap={1}>
          <Inventory />
          <Typography variant="h6">
            {mode === "create" ? "Tạo mới Inventory" : "Chỉnh sửa Inventory"}
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        <Grid container spacing={3}>
          {/* Product Selection (only for create mode) */}
          {mode === "create" && (
            <Grid size={{ xs: 12 }}>
              <Autocomplete
                options={productCustoms || []}
                getOptionLabel={(option) =>
                  `${option.name} - ${option.price?.toLocaleString()} VNĐ`
                }
                value={selectedProductCustom || null}
                onChange={(_, newValue) => {
                  handleFieldChange("productCustomId", newValue?.id || "");
                }}
                loading={loadingProducts}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Chọn sản phẩm"
                    error={!!errors.productCustomId}
                    helperText={errors.productCustomId}
                    required
                  />
                )}
                renderOption={(props, option) => (
                  <li {...props}>
                    <Box>
                      <Typography variant="body1">{option.name}</Typography>
                      <Typography variant="caption" color="textSecondary">
                        Giá: {option.price?.toLocaleString()} VNĐ
                      </Typography>
                    </Box>
                  </li>
                )}
              />
            </Grid>
          )}

          {/* Current Stock */}
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="Tồn kho hiện tại"
              type="number"
              value={formData.currentStock}
              onChange={(e) =>
                handleFieldChange("currentStock", parseInt(e.target.value) || 0)
              }
              error={!!errors.currentStock}
              helperText={
                errors.currentStock || "Số lượng sản phẩm hiện có trong kho"
              }
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Inventory fontSize="small" />
                  </InputAdornment>
                ),
                inputProps: {
                  min: 0,
                  max: INVENTORY_CONSTANTS.VALIDATION.CURRENT_STOCK_MAX,
                },
              }}
              required
            />
          </Grid>

          {/* Reserved Stock */}
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="Tồn kho đã đặt chỗ"
              type="number"
              value={formData.reservedStock}
              onChange={(e) =>
                handleFieldChange(
                  "reservedStock",
                  parseInt(e.target.value) || 0
                )
              }
              error={!!errors.reservedStock}
              helperText={
                errors.reservedStock || "Số lượng sản phẩm đã được đặt chỗ"
              }
              InputProps={{
                inputProps: { min: 0, max: formData.currentStock },
              }}
            />
          </Grid>

          {/* Min Stock Alert */}
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="Ngưỡng cảnh báo"
              type="number"
              value={formData.minStockAlert}
              onChange={(e) =>
                handleFieldChange(
                  "minStockAlert",
                  parseInt(e.target.value) || 0
                )
              }
              error={!!errors.minStockAlert}
              helperText={errors.minStockAlert || "Ngưỡng tồn kho để cảnh báo"}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Warning fontSize="small" />
                  </InputAdornment>
                ),
                inputProps: {
                  min: INVENTORY_CONSTANTS.VALIDATION.MIN_STOCK_MIN,
                  max: INVENTORY_CONSTANTS.VALIDATION.MIN_STOCK_MAX,
                },
              }}
              required
            />
          </Grid>

          {/* Status */}
          <Grid size={{ xs: 12, sm: 6 }}>
            <FormControl fullWidth error={!!errors.status}>
              <InputLabel>Trạng thái</InputLabel>
              <Select
                value={formData.status}
                onChange={(e) => handleFieldChange("status", e.target.value)}
                label="Trạng thái"
              >
                {INVENTORY_CONSTANTS.STATUS_OPTIONS.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Chip
                        label={option.label}
                        size="small"
                        color={option.color as any}
                        variant="outlined"
                      />
                    </Box>
                  </MenuItem>
                ))}
              </Select>
              {errors.status && (
                <Typography
                  variant="caption"
                  color="error"
                  sx={{ mt: 0.5, ml: 2 }}
                >
                  {errors.status}
                </Typography>
              )}
            </FormControl>
          </Grid>

          {/* Stock Information Summary */}
          {(formData.currentStock > 0 || formData.reservedStock > 0) && (
            <Grid size={{ xs: 12 }}>
              <Divider sx={{ my: 1 }} />
              <Typography variant="subtitle2" gutterBottom>
                Thông tin tồn kho
              </Typography>

              <Grid container spacing={2}>
                <Grid size={{ xs: 6, sm: 3 }}>
                  <Box textAlign="center">
                    <Typography variant="h6" color="primary">
                      {formData.currentStock.toLocaleString()}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      Tồn kho hiện tại
                    </Typography>
                  </Box>
                </Grid>

                <Grid size={{ xs: 6, sm: 3 }}>
                  <Box textAlign="center">
                    <Typography variant="h6" color="info.main">
                      {formData.reservedStock.toLocaleString()}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      Đã đặt chỗ
                    </Typography>
                  </Box>
                </Grid>

                <Grid size={{ xs: 6, sm: 3 }}>
                  <Box textAlign="center">
                    <Typography variant="h6" color="success.main">
                      {availableStock.toLocaleString()}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      Có sẵn
                    </Typography>
                  </Box>
                </Grid>

                <Grid size={{ xs: 6, sm: 3 }}>
                  <Box textAlign="center">
                    <Typography variant="h6" color="warning.main">
                      {formData.minStockAlert.toLocaleString()}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      Ngưỡng cảnh báo
                    </Typography>
                  </Box>
                </Grid>
              </Grid>

              {/* Stock Level Alert */}
              {stockLevelInfo && (
                <Alert
                  severity={
                    stockLevelInfo.level === "out"
                      ? "error"
                      : stockLevelInfo.level === "critical"
                      ? "error"
                      : stockLevelInfo.level === "low"
                      ? "warning"
                      : "info"
                  }
                  sx={{ mt: 2 }}
                  icon={<Info />}
                >
                  Mức tồn kho: <strong>{stockLevelInfo.label}</strong>
                  {stockLevelInfo.level !== "healthy" && (
                    <span> - Cần chú ý và bổ sung hàng hóa</span>
                  )}
                </Alert>
              )}
            </Grid>
          )}

          {/* Validation Errors */}
          {Object.keys(errors).length > 0 &&
            Object.keys(touched).length > 0 && (
              <Grid size={{ xs: 12 }}>
                <Alert severity="error">
                  <Typography variant="body2">
                    Vui lòng kiểm tra lại thông tin đã nhập:
                  </Typography>
                  <ul style={{ margin: "8px 0 0 20px", padding: 0 }}>
                    {Object.entries(errors).map(([field, error]) => (
                      <li key={field}>{error}</li>
                    ))}
                  </ul>
                </Alert>
              </Grid>
            )}
        </Grid>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button
          onClick={handleClose}
          disabled={isSubmitting}
          startIcon={<Cancel />}
        >
          Hủy
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={isSubmitting}
          variant="contained"
          startIcon={isSubmitting ? undefined : <Save />}
        >
          {isSubmitting
            ? "Đang xử lý..."
            : mode === "create"
            ? "Tạo mới"
            : "Cập nhật"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default InventoryForm;
