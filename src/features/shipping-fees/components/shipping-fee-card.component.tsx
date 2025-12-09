import React from "react";
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  IconButton,
  Chip,
  Box,
  Divider,
  Tooltip,
} from "@mui/material";
import {
  Edit,
  Delete,
  Visibility,
  LocalShipping,
  LocationOn,
  Schedule,
  AttachMoney,
  Note,
} from "@mui/icons-material";
import type { ShippingFee } from "../types";

/**
 * Props interface following Interface Segregation Principle
 * Only includes props needed for this specific component
 */
interface ShippingFeeCardProps {
  shippingFee: ShippingFee;
  onEdit?: (shippingFee: ShippingFee) => void;
  onDelete?: (shippingFee: ShippingFee) => void;
  onView?: (shippingFee: ShippingFee) => void;
  className?: string;
  showActions?: boolean;
}

/**
 * ShippingFeeCard Component
 * Following Single Responsibility Principle - only responsible for displaying a shipping fee card
 */
export const ShippingFeeCard: React.FC<ShippingFeeCardProps> = ({
  shippingFee,
  onEdit,
  onDelete,
  onView,
  className = "",
  showActions = true,
}) => {
  const handleEdit = () => {
    onEdit?.(shippingFee);
  };

  const handleDelete = () => {
    onDelete?.(shippingFee);
  };

  const handleView = () => {
    onView?.(shippingFee);
  };

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
    }).format(new Date(dateString));
  };

  return (
    <Card
      className={className}
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        transition: "all 0.2s ease-in-out",
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: 3,
        },
      }}
    >
      <CardContent sx={{ flexGrow: 1, pb: 1 }}>
        {/* Header */}
        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
            <LocalShipping sx={{ mr: 1, color: "primary.main" }} />
            <Typography variant="h6" component="h3" fontWeight={600}>
              {shippingFee.shippingType}
            </Typography>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center" }}>
            <LocationOn sx={{ mr: 1, fontSize: 18, color: "text.secondary" }} />
            <Chip
              label={shippingFee.area}
              size="small"
              variant="outlined"
              color="primary"
            />
          </Box>
        </Box>

        <Divider sx={{ mb: 2 }} />

        {/* Main Info */}
        <Box sx={{ mb: 2 }}>
          {/* Shipping Fee */}
          <Box sx={{ display: "flex", alignItems: "center", mb: 1.5 }}>
            <AttachMoney sx={{ mr: 1, fontSize: 18, color: "success.main" }} />
            <Box>
              <Typography variant="body2" color="text.secondary">
                Phí vận chuyển:
              </Typography>
              <Typography variant="h6" color="success.main" fontWeight={600}>
                {formatCurrency(shippingFee.shippingFee)}
              </Typography>
            </Box>
          </Box>

          {/* Delivery Time */}
          <Box sx={{ display: "flex", alignItems: "center", mb: 1.5 }}>
            <Schedule sx={{ mr: 1, fontSize: 18, color: "info.main" }} />
            <Box>
              <Typography variant="body2" color="text.secondary">
                Thời gian giao hàng:
              </Typography>
              <Typography variant="body2" fontWeight={500}>
                {shippingFee.estimatedDeliveryTime}
              </Typography>
            </Box>
          </Box>

          {/* Notes */}
          {shippingFee.notesOrRemarks && (
            <Box sx={{ display: "flex", alignItems: "flex-start" }}>
              <Note
                sx={{ mr: 1, fontSize: 18, color: "warning.main", mt: 0.5 }}
              />
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Ghi chú:
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    fontStyle: "italic",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                  }}
                >
                  {shippingFee.notesOrRemarks}
                </Typography>
              </Box>
            </Box>
          )}
        </Box>

        {/* Meta Information */}
        <Box sx={{ mt: "auto", pt: 1 }}>
          <Typography variant="caption" color="text.secondary" display="block">
            Ngày tạo: {formatDate(shippingFee.createdAt)}
          </Typography>
          <Typography variant="caption" color="text.secondary" display="block">
            Cập nhật: {formatDate(shippingFee.updatedAt)}
          </Typography>
        </Box>
      </CardContent>

      {showActions && (
        <CardActions sx={{ justifyContent: "flex-end", pt: 0 }}>
          {onView && (
            <Tooltip title="Xem chi tiết">
              <IconButton size="small" onClick={handleView} color="info">
                <Visibility />
              </IconButton>
            </Tooltip>
          )}

          {onEdit && (
            <Tooltip title="Chỉnh sửa">
              <IconButton size="small" onClick={handleEdit} color="primary">
                <Edit />
              </IconButton>
            </Tooltip>
          )}

          {onDelete && (
            <Tooltip title="Xóa">
              <IconButton size="small" onClick={handleDelete} color="error">
                <Delete />
              </IconButton>
            </Tooltip>
          )}
        </CardActions>
      )}
    </Card>
  );
};

export default ShippingFeeCard;
