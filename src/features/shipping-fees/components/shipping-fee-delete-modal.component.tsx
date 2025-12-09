import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Alert,
  Box,
  Divider,
  CircularProgress,
} from "@mui/material";
import { Warning } from "@mui/icons-material";
import type { ShippingFee } from "../types";

/**
 * Props interface following Interface Segregation Principle
 */
interface ShippingFeeDeleteModalProps {
  shippingFee: ShippingFee | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (shippingFee: ShippingFee) => void;
  loading?: boolean;
}

/**
 * ShippingFeeDeleteModal Component
 * Following Single Responsibility Principle - only responsible for delete confirmation
 */
export const ShippingFeeDeleteModal: React.FC<ShippingFeeDeleteModalProps> = ({
  shippingFee,
  isOpen,
  onClose,
  onConfirm,
  loading = false,
}) => {
  const handleConfirm = () => {
    if (shippingFee) {
      onConfirm(shippingFee);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  return (
    <Dialog
      open={isOpen && !!shippingFee}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
        },
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Typography variant="h6" component="h2" fontWeight={600}>
          Xác nhận xóa phí vận chuyển
        </Typography>
      </DialogTitle>

      <DialogContent>
        <Alert severity="warning" icon={<Warning />} sx={{ mb: 3 }}>
          <Typography variant="body2">
            Bạn có chắc chắn muốn xóa phí vận chuyển này? Hành động này không
            thể hoàn tác.
          </Typography>
        </Alert>

        {shippingFee && (
          <Box>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              Thông tin phí vận chuyển:
            </Typography>

            <Divider sx={{ mb: 2 }} />

            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography variant="body2" color="text.secondary">
                  Loại vận chuyển:
                </Typography>
                <Typography variant="body2" fontWeight={500}>
                  {shippingFee.shippingType}
                </Typography>
              </Box>

              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography variant="body2" color="text.secondary">
                  Khu vực:
                </Typography>
                <Typography variant="body2" fontWeight={500}>
                  {shippingFee.area}
                </Typography>
              </Box>

              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography variant="body2" color="text.secondary">
                  Phí vận chuyển:
                </Typography>
                <Typography variant="body2" fontWeight={600} color="primary">
                  {formatCurrency(shippingFee.shippingFee)}
                </Typography>
              </Box>

              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography variant="body2" color="text.secondary">
                  Thời gian giao hàng:
                </Typography>
                <Typography variant="body2" fontWeight={500}>
                  {shippingFee.estimatedDeliveryTime}
                </Typography>
              </Box>
            </Box>
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button
          onClick={onClose}
          disabled={loading}
          variant="outlined"
          sx={{ minWidth: 100 }}
        >
          Hủy
        </Button>

        <Button
          onClick={handleConfirm}
          disabled={loading}
          variant="contained"
          color="error"
          sx={{ minWidth: 120 }}
          startIcon={loading && <CircularProgress size={16} />}
        >
          {loading ? "Đang xóa..." : "Xác nhận xóa"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ShippingFeeDeleteModal;
