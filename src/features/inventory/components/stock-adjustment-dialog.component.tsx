import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Box,
  Alert,
  InputAdornment,
  Divider,
} from "@mui/material";
// LoadingButton functionality is now in Button
import {
  Add,
  Remove,
  BookmarkBorder,
  Bookmark,
  Info,
} from "@mui/icons-material";
import { InventoryValidator, StockLevelUtils, FormatUtils } from "../utils";
import { INVENTORY_CONSTANTS } from "../constants";
import type { InventoryWithRelations } from "../types";

interface StockAdjustmentDialogProps {
  open: boolean;
  onClose: () => void;
  inventory: InventoryWithRelations | null;
  operation: "adjust" | "reserve" | "release";
  onConfirm: (quantity: number, reason?: string) => Promise<void>;
  loading?: boolean;
}

const StockAdjustmentDialog: React.FC<StockAdjustmentDialogProps> = ({
  open,
  onClose,
  inventory,
  operation,
  onConfirm,
  loading = false,
}) => {
  const [quantity, setQuantity] = useState<number>(0);
  const [reason, setReason] = useState<string>("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Reset form when dialog opens/closes or operation changes
  useEffect(() => {
    if (open) {
      setQuantity(operation === "adjust" ? 1 : 1);
      setReason("");
      setErrors({});
    }
  }, [open, operation]);

  const handleQuantityChange = (value: number) => {
    setQuantity(value);
    if (errors.quantity) {
      setErrors((prev) => ({ ...prev, quantity: "" }));
    }
  };

  const handleReasonChange = (value: string) => {
    setReason(value);
    if (errors.reason) {
      setErrors((prev) => ({ ...prev, reason: "" }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!inventory) {
      return false;
    }

    if (operation === "adjust") {
      const validation = InventoryValidator.validateStockAdjustment(
        { quantity, reason },
        inventory.currentStock
      );
      Object.assign(newErrors, validation.errors);
    } else if (operation === "reserve") {
      const availableStock = StockLevelUtils.getAvailableStock(inventory);
      const validation = InventoryValidator.validateReserveStock(
        { quantity, reason },
        availableStock
      );
      Object.assign(newErrors, validation.errors);
    } else if (operation === "release") {
      if (quantity <= 0) {
        newErrors.quantity = "Số lượng phải lớn hơn 0";
      }
      if (quantity > inventory.reservedStock) {
        newErrors.quantity = "Số lượng vượt quá tồn kho đã đặt chỗ";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      await onConfirm(quantity, reason || undefined);
      onClose();
    } catch (error) {
      console.error("Stock operation error:", error);
    }
  };

  const getDialogTitle = () => {
    switch (operation) {
      case "adjust":
        return "Điều chỉnh tồn kho";
      case "reserve":
        return "Đặt chỗ tồn kho";
      case "release":
        return "Giải phóng tồn kho đã đặt chỗ";
      default:
        return "Thao tác tồn kho";
    }
  };

  const getDialogIcon = () => {
    switch (operation) {
      case "adjust":
        return quantity >= 0 ? <Add /> : <Remove />;
      case "reserve":
        return <BookmarkBorder />;
      case "release":
        return <Bookmark />;
      default:
        return <Info />;
    }
  };

  const getQuantityLabel = () => {
    switch (operation) {
      case "adjust":
        return "Số lượng điều chỉnh";
      case "reserve":
        return "Số lượng đặt chỗ";
      case "release":
        return "Số lượng giải phóng";
      default:
        return "Số lượng";
    }
  };

  const getQuantityHelperText = () => {
    if (errors.quantity) return errors.quantity;

    switch (operation) {
      case "adjust":
        return "Nhập số dương để tăng, số âm để giảm tồn kho";
      case "reserve":
        return `Có sẵn: ${
          inventory
            ? StockLevelUtils.getAvailableStock(inventory).toLocaleString()
            : 0
        } sản phẩm`;
      case "release":
        return `Đã đặt chỗ: ${
          inventory?.reservedStock.toLocaleString() || 0
        } sản phẩm`;
      default:
        return "";
    }
  };

  const getPreviewInfo = () => {
    if (!inventory) return null;

    const currentStock = inventory.currentStock;
    const reservedStock = inventory.reservedStock;
    const availableStock = StockLevelUtils.getAvailableStock(inventory);

    let newCurrentStock = currentStock;
    let newReservedStock = reservedStock;

    switch (operation) {
      case "adjust":
        newCurrentStock = currentStock + quantity;
        break;
      case "reserve":
        newReservedStock = reservedStock + quantity;
        break;
      case "release":
        newReservedStock = reservedStock - quantity;
        break;
    }

    const newAvailableStock = Math.max(0, newCurrentStock - newReservedStock);

    return {
      current: {
        currentStock,
        reservedStock,
        availableStock,
      },
      new: {
        currentStock: newCurrentStock,
        reservedStock: newReservedStock,
        availableStock: newAvailableStock,
      },
    };
  };

  const previewInfo = getPreviewInfo();

  if (!inventory) {
    return null;
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box display="flex" alignItems="center" gap={1}>
          {getDialogIcon()}
          <Typography variant="h6">{getDialogTitle()}</Typography>
        </Box>
        <Typography variant="body2" color="textSecondary">
          {inventory.productCustom?.name}
        </Typography>
      </DialogTitle>

      <DialogContent dividers>
        <Box>
          {/* Current Stock Info */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" gutterBottom>
              Thông tin hiện tại
            </Typography>
            <Box display="flex" justifyContent="space-between" gap={2}>
              <Box textAlign="center">
                <Typography variant="h6" color="primary">
                  {FormatUtils.formatStockNumber(inventory.currentStock)}
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  Tồn kho hiện tại
                </Typography>
              </Box>
              <Box textAlign="center">
                <Typography variant="h6" color="info.main">
                  {FormatUtils.formatStockNumber(inventory.reservedStock)}
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  Đã đặt chỗ
                </Typography>
              </Box>
              <Box textAlign="center">
                <Typography variant="h6" color="success.main">
                  {FormatUtils.formatStockNumber(
                    StockLevelUtils.getAvailableStock(inventory)
                  )}
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  Có sẵn
                </Typography>
              </Box>
            </Box>
          </Box>

          <Divider sx={{ my: 2 }} />

          {/* Quantity Input */}
          <TextField
            fullWidth
            label={getQuantityLabel()}
            type="number"
            value={quantity}
            onChange={(e) =>
              handleQuantityChange(parseInt(e.target.value) || 0)
            }
            error={!!errors.quantity}
            helperText={getQuantityHelperText()}
            sx={{ mb: 3 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  {getDialogIcon()}
                </InputAdornment>
              ),
              inputProps: {
                min: operation === "adjust" ? -inventory.currentStock : 1,
                max:
                  operation === "reserve"
                    ? StockLevelUtils.getAvailableStock(inventory)
                    : operation === "release"
                    ? inventory.reservedStock
                    : INVENTORY_CONSTANTS.VALIDATION.QUANTITY_MAX,
              },
            }}
            required
          />

          {/* Reason Input */}
          <TextField
            fullWidth
            label="Lý do (tùy chọn)"
            multiline
            rows={2}
            value={reason}
            onChange={(e) => handleReasonChange(e.target.value)}
            error={!!errors.reason}
            helperText={errors.reason}
            sx={{ mb: 3 }}
            inputProps={{
              maxLength: INVENTORY_CONSTANTS.VALIDATION.REASON_MAX_LENGTH,
            }}
          />

          {/* Preview */}
          {quantity !== 0 && previewInfo && (
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Sau khi thực hiện
              </Typography>
              <Box display="flex" justifyContent="space-between" gap={2}>
                <Box textAlign="center">
                  <Typography
                    variant="h6"
                    color={
                      previewInfo.new.currentStock < 0 ? "error" : "primary"
                    }
                  >
                    {FormatUtils.formatStockNumber(
                      previewInfo.new.currentStock
                    )}
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    Tồn kho hiện tại
                  </Typography>
                  {previewInfo.new.currentStock !==
                    previewInfo.current.currentStock && (
                    <Typography
                      variant="caption"
                      color={
                        previewInfo.new.currentStock >
                        previewInfo.current.currentStock
                          ? "success.main"
                          : "error.main"
                      }
                      display="block"
                    >
                      (
                      {previewInfo.new.currentStock >
                      previewInfo.current.currentStock
                        ? "+"
                        : ""}
                      {previewInfo.new.currentStock -
                        previewInfo.current.currentStock}
                      )
                    </Typography>
                  )}
                </Box>

                <Box textAlign="center">
                  <Typography variant="h6" color="info.main">
                    {FormatUtils.formatStockNumber(
                      previewInfo.new.reservedStock
                    )}
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    Đã đặt chỗ
                  </Typography>
                  {previewInfo.new.reservedStock !==
                    previewInfo.current.reservedStock && (
                    <Typography
                      variant="caption"
                      color={
                        previewInfo.new.reservedStock >
                        previewInfo.current.reservedStock
                          ? "info.main"
                          : "success.main"
                      }
                      display="block"
                    >
                      (
                      {previewInfo.new.reservedStock >
                      previewInfo.current.reservedStock
                        ? "+"
                        : ""}
                      {previewInfo.new.reservedStock -
                        previewInfo.current.reservedStock}
                      )
                    </Typography>
                  )}
                </Box>

                <Box textAlign="center">
                  <Typography variant="h6" color="success.main">
                    {FormatUtils.formatStockNumber(
                      previewInfo.new.availableStock
                    )}
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    Có sẵn
                  </Typography>
                  {previewInfo.new.availableStock !==
                    previewInfo.current.availableStock && (
                    <Typography
                      variant="caption"
                      color={
                        previewInfo.new.availableStock >
                        previewInfo.current.availableStock
                          ? "success.main"
                          : "warning.main"
                      }
                      display="block"
                    >
                      (
                      {previewInfo.new.availableStock >
                      previewInfo.current.availableStock
                        ? "+"
                        : ""}
                      {previewInfo.new.availableStock -
                        previewInfo.current.availableStock}
                      )
                    </Typography>
                  )}
                </Box>
              </Box>

              {/* Warnings */}
              {previewInfo.new.currentStock < 0 && (
                <Alert severity="error" sx={{ mt: 2 }}>
                  Cảnh báo: Tồn kho sẽ trở thành số âm!
                </Alert>
              )}

              {operation === "adjust" &&
                previewInfo.new.currentStock <= inventory.minStockAlert &&
                previewInfo.new.currentStock > 0 && (
                  <Alert severity="warning" sx={{ mt: 2 }}>
                    Cảnh báo: Tồn kho sẽ dưới ngưỡng cảnh báo (
                    {inventory.minStockAlert})
                  </Alert>
                )}

              {previewInfo.new.currentStock === 0 && (
                <Alert severity="error" sx={{ mt: 2 }}>
                  Cảnh báo: Sản phẩm sẽ hết hàng!
                </Alert>
              )}
            </Box>
          )}
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose} disabled={loading}>
          Hủy
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={loading || quantity === 0}
          variant="contained"
          color={
            operation === "adjust" && quantity < 0
              ? "error"
              : operation === "reserve"
              ? "info"
              : operation === "release"
              ? "warning"
              : "primary"
          }
        >
          {loading ? "Đang xử lý..." : "Xác nhận"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default StockAdjustmentDialog;
