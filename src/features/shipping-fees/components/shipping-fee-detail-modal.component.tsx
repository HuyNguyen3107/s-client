import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  IconButton,
  Box,
  List,
  ListItem,
  ListItemText,
  Chip,
  Paper,
} from "@mui/material";
import {
  Close,
  Edit,
  Delete,
  LocalShipping,
  LocationOn,
  Schedule,
  AttachMoney,
  Note,
  DateRange,
  Update,
  Fingerprint,
} from "@mui/icons-material";
import type { ShippingFee } from "../types";

/**
 * Props interface following Interface Segregation Principle
 */
interface ShippingFeeDetailModalProps {
  shippingFee: ShippingFee | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit?: (shippingFee: ShippingFee) => void;
  onDelete?: (shippingFee: ShippingFee) => void;
}

/**
 * ShippingFeeDetailModal Component
 * Following Single Responsibility Principle - only responsible for displaying shipping fee details
 */
export const ShippingFeeDetailModal: React.FC<ShippingFeeDetailModalProps> = ({
  shippingFee,
  isOpen,
  onClose,
  onEdit,
  onDelete,
}) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }).format(new Date(dateString));
  };

  const handleEdit = () => {
    if (shippingFee) {
      onEdit?.(shippingFee);
      onClose();
    }
  };

  const handleDelete = () => {
    if (shippingFee) {
      onDelete?.(shippingFee);
      onClose();
    }
  };

  return (
    <Dialog
      open={isOpen && !!shippingFee}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          maxHeight: "90vh",
        },
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography variant="h5" component="h2" fontWeight={600}>
            Chi tiết phí vận chuyển
          </Typography>
          <IconButton
            onClick={onClose}
            size="small"
            sx={{ color: "text.secondary" }}
          >
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>

      {shippingFee && (
        <>
          <DialogContent sx={{ px: 3 }}>
            {/* Basic Information Section */}
            <Paper
              elevation={0}
              sx={{
                p: 3,
                mb: 3,
                backgroundColor: "grey.50",
                borderRadius: 2,
              }}
            >
              <Typography
                variant="h6"
                gutterBottom
                sx={{ display: "flex", alignItems: "center", mb: 2 }}
              >
                <LocalShipping sx={{ mr: 1, color: "primary.main" }} />
                Thông tin cơ bản
              </Typography>

              <List sx={{ py: 0 }}>
                <ListItem sx={{ px: 0, py: 1 }}>
                  <ListItemText
                    primary={
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <LocalShipping
                          sx={{ mr: 1, fontSize: 18, color: "text.secondary" }}
                        />
                        <Typography variant="body2" color="text.secondary">
                          Loại vận chuyển:
                        </Typography>
                      </Box>
                    }
                    secondary={
                      <Typography
                        variant="body1"
                        fontWeight={500}
                        sx={{ mt: 0.5 }}
                      >
                        {shippingFee.shippingType}
                      </Typography>
                    }
                  />
                </ListItem>

                <ListItem sx={{ px: 0, py: 1 }}>
                  <ListItemText
                    primary={
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <LocationOn
                          sx={{ mr: 1, fontSize: 18, color: "text.secondary" }}
                        />
                        <Typography variant="body2" color="text.secondary">
                          Khu vực:
                        </Typography>
                      </Box>
                    }
                    secondary={
                      <Chip
                        label={shippingFee.area}
                        size="small"
                        color="primary"
                        variant="outlined"
                        sx={{ mt: 0.5 }}
                      />
                    }
                  />
                </ListItem>

                <ListItem sx={{ px: 0, py: 1 }}>
                  <ListItemText
                    primary={
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Schedule
                          sx={{ mr: 1, fontSize: 18, color: "text.secondary" }}
                        />
                        <Typography variant="body2" color="text.secondary">
                          Thời gian giao hàng dự kiến:
                        </Typography>
                      </Box>
                    }
                    secondary={
                      <Typography
                        variant="body1"
                        fontWeight={500}
                        sx={{ mt: 0.5 }}
                      >
                        {shippingFee.estimatedDeliveryTime}
                      </Typography>
                    }
                  />
                </ListItem>

                <ListItem sx={{ px: 0, py: 1 }}>
                  <ListItemText
                    primary={
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <AttachMoney
                          sx={{ mr: 1, fontSize: 18, color: "text.secondary" }}
                        />
                        <Typography variant="body2" color="text.secondary">
                          Phí vận chuyển:
                        </Typography>
                      </Box>
                    }
                    secondary={
                      <Typography
                        variant="h6"
                        color="success.main"
                        fontWeight={600}
                        sx={{ mt: 0.5 }}
                      >
                        {formatCurrency(shippingFee.shippingFee)}
                      </Typography>
                    }
                  />
                </ListItem>
              </List>
            </Paper>

            {/* Notes Section */}
            {shippingFee.notesOrRemarks && (
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  mb: 3,
                  backgroundColor: "warning.50",
                  borderRadius: 2,
                  border: "1px solid",
                  borderColor: "warning.200",
                }}
              >
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{ display: "flex", alignItems: "center", mb: 2 }}
                >
                  <Note sx={{ mr: 1, color: "warning.main" }} />
                  Ghi chú
                </Typography>

                <Typography variant="body1" sx={{ fontStyle: "italic" }}>
                  {shippingFee.notesOrRemarks}
                </Typography>
              </Paper>
            )}

            {/* System Information Section */}
            <Paper
              elevation={0}
              sx={{
                p: 3,
                backgroundColor: "grey.50",
                borderRadius: 2,
              }}
            >
              <Typography
                variant="h6"
                gutterBottom
                sx={{ display: "flex", alignItems: "center", mb: 2 }}
              >
                <Fingerprint sx={{ mr: 1, color: "info.main" }} />
                Thông tin hệ thống
              </Typography>

              <List sx={{ py: 0 }}>
                <ListItem sx={{ px: 0, py: 1 }}>
                  <ListItemText
                    primary={
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Fingerprint
                          sx={{ mr: 1, fontSize: 18, color: "text.secondary" }}
                        />
                        <Typography variant="body2" color="text.secondary">
                          ID:
                        </Typography>
                      </Box>
                    }
                    secondary={
                      <Typography
                        variant="body2"
                        fontFamily='"UTM-Avo", Arial, sans-serif'
                        sx={{
                          mt: 0.5,
                          backgroundColor: "grey.100",
                          p: 0.5,
                          borderRadius: 1,
                          display: "inline-block",
                        }}
                      >
                        {shippingFee.id}
                      </Typography>
                    }
                  />
                </ListItem>

                <ListItem sx={{ px: 0, py: 1 }}>
                  <ListItemText
                    primary={
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <DateRange
                          sx={{ mr: 1, fontSize: 18, color: "text.secondary" }}
                        />
                        <Typography variant="body2" color="text.secondary">
                          Ngày tạo:
                        </Typography>
                      </Box>
                    }
                    secondary={
                      <Typography variant="body2" sx={{ mt: 0.5 }}>
                        {formatDate(shippingFee.createdAt)}
                      </Typography>
                    }
                  />
                </ListItem>

                <ListItem sx={{ px: 0, py: 1 }}>
                  <ListItemText
                    primary={
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Update
                          sx={{ mr: 1, fontSize: 18, color: "text.secondary" }}
                        />
                        <Typography variant="body2" color="text.secondary">
                          Cập nhật lần cuối:
                        </Typography>
                      </Box>
                    }
                    secondary={
                      <Typography variant="body2" sx={{ mt: 0.5 }}>
                        {formatDate(shippingFee.updatedAt)}
                      </Typography>
                    }
                  />
                </ListItem>
              </List>
            </Paper>
          </DialogContent>

          <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
            <Button onClick={onClose} variant="outlined" sx={{ minWidth: 100 }}>
              Đóng
            </Button>

            {onEdit && (
              <Button
                onClick={handleEdit}
                variant="contained"
                startIcon={<Edit />}
                sx={{ minWidth: 120 }}
              >
                Chỉnh sửa
              </Button>
            )}

            {onDelete && (
              <Button
                onClick={handleDelete}
                variant="contained"
                color="error"
                startIcon={<Delete />}
                sx={{ minWidth: 100 }}
              >
                Xóa
              </Button>
            )}
          </DialogActions>
        </>
      )}
    </Dialog>
  );
};

export default ShippingFeeDetailModal;
