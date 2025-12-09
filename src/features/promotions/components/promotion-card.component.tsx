import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  Divider,
} from "@mui/material";
import {
  MoreVert,
  Edit,
  Delete,
  ContentCopy,
  CheckCircle,
  Cancel,
  Schedule,
  LocalOffer,
} from "@mui/icons-material";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import type {
  Promotion,
  PromotionType as PromotionTypeEnum,
} from "../types/promotion.types";

interface PromotionCardProps {
  promotion: Promotion;
  onEdit?: (promotion: Promotion) => void;
  onDelete?: (promotion: Promotion) => void;
  onCopyCode?: (promoCode: string) => void;
}

const PromotionCard: React.FC<PromotionCardProps> = ({
  promotion,
  onEdit,
  onDelete,
  onCopyCode,
}) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const getPromotionStatus = () => {
    const now = new Date();
    const startDate = new Date(promotion.startDate);
    const endDate = promotion.endDate ? new Date(promotion.endDate) : null;

    if (!promotion.isActive) {
      return {
        status: "inactive",
        label: "Tạm dừng",
        color: "warning" as const,
      };
    }

    if (startDate > now) {
      return {
        status: "upcoming",
        label: "Sắp diễn ra",
        color: "info" as const,
      };
    }

    if (endDate && endDate < now) {
      return {
        status: "expired",
        label: "Đã hết hạn",
        color: "error" as const,
      };
    }

    return {
      status: "active",
      label: "Đang hoạt động",
      color: "success" as const,
    };
  };

  const getPromotionTypeLabel = (type: PromotionTypeEnum) => {
    return type === "PERCENTAGE" ? "Phần trăm" : "Số tiền cố định";
  };

  const getDiscountDisplay = () => {
    const value = promotion?.value ?? 0;
    if (promotion?.type === "PERCENTAGE") {
      return `${value}%`;
    }
    return `${Number(value).toLocaleString("vi-VN")} VND`;
  };

  const statusInfo = getPromotionStatus();

  const handleCopyCode = () => {
    if (onCopyCode) {
      onCopyCode(promotion.promoCode);
    } else {
      navigator.clipboard.writeText(promotion.promoCode);
    }
    handleMenuClose();
  };

  return (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        "&:hover": {
          boxShadow: 4,
        },
      }}
    >
      <CardContent sx={{ flexGrow: 1, pb: 1 }}>
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            mb: 2,
          }}
        >
          <Box sx={{ flexGrow: 1, mr: 1 }}>
            <Typography variant="h6" component="h3" noWrap>
              {promotion.title}
            </Typography>
            <Typography variant="body2" color="text.secondary" noWrap>
              {promotion.description}
            </Typography>
          </Box>
          <IconButton size="small" onClick={handleMenuClick}>
            <MoreVert />
          </IconButton>
        </Box>

        {/* Status and Type */}
        <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
          <Chip
            label={statusInfo.label}
            color={statusInfo.color}
            size="small"
            icon={
              statusInfo.status === "active" ? (
                <CheckCircle />
              ) : statusInfo.status === "expired" ? (
                <Cancel />
              ) : statusInfo.status === "upcoming" ? (
                <Schedule />
              ) : (
                <Cancel />
              )
            }
          />
          <Chip
            label={getPromotionTypeLabel(promotion.type)}
            variant="outlined"
            size="small"
            icon={<LocalOffer />}
          />
        </Box>

        {/* Promo Code */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            mb: 2,
            p: 1,
            bgcolor: "grey.100",
            borderRadius: 1,
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontFamily: '"UTM-Avo", Arial, sans-serif',
              fontWeight: "bold",
              color: "primary.main",
              flexGrow: 1,
            }}
          >
            {promotion.promoCode}
          </Typography>
          <IconButton size="small" onClick={handleCopyCode} title="Sao chép mã">
            <ContentCopy fontSize="small" />
          </IconButton>
        </Box>

        {/* Discount Value */}
        <Box sx={{ textAlign: "center", mb: 2 }}>
          <Typography variant="h4" color="primary.main" fontWeight="bold">
            {getDiscountDisplay()}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Giảm giá
          </Typography>
        </Box>

        {/* Details */}
        <Box sx={{ space: 1 }}>
          <Typography variant="body2" color="text.secondary">
            <strong>Đơn tối thiểu:</strong>{" "}
            {Number(promotion?.minOrderValue ?? 0).toLocaleString("vi-VN")} VND
          </Typography>
          <Typography variant="body2" color="text.secondary">
            <strong>Giảm tối đa:</strong>{" "}
            {promotion?.maxDiscountAmount &&
            Number(promotion.maxDiscountAmount) > 0
              ? `${Number(promotion.maxDiscountAmount).toLocaleString(
                  "vi-VN"
                )} VND`
              : "Không giới hạn"}
          </Typography>
          {promotion.usageLimit && (
            <Typography variant="body2" color="text.secondary">
              <strong>Sử dụng:</strong> {promotion.usageCount || 0}/
              {promotion.usageLimit}
            </Typography>
          )}
        </Box>

        {/* Dates */}
        <Divider sx={{ my: 1 }} />
        <Box>
          <Typography variant="body2" color="text.secondary">
            <strong>Bắt đầu:</strong>{" "}
            {promotion?.startDate
              ? format(new Date(promotion.startDate), "dd/MM/yyyy HH:mm", {
                  locale: vi,
                })
              : "-"}
          </Typography>
          {promotion.endDate && (
            <Typography variant="body2" color="text.secondary">
              <strong>Kết thúc:</strong>{" "}
              {promotion?.endDate
                ? format(new Date(promotion.endDate), "dd/MM/yyyy HH:mm", {
                    locale: vi,
                  })
                : "-"}
            </Typography>
          )}
        </Box>
      </CardContent>

      {/* Menu */}
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleMenuClose}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        {/* 'Xem chi tiết' removed per request */}
        <MenuItem onClick={handleCopyCode}>
          <ListItemIcon>
            <ContentCopy fontSize="small" />
          </ListItemIcon>
          Sao chép mã
        </MenuItem>
        <Divider />
        <MenuItem
          onClick={() => {
            onEdit?.(promotion);
            handleMenuClose();
          }}
        >
          <ListItemIcon>
            <Edit fontSize="small" />
          </ListItemIcon>
          Chỉnh sửa
        </MenuItem>
        <MenuItem
          onClick={() => {
            onDelete?.(promotion);
            handleMenuClose();
          }}
          sx={{ color: "error.main" }}
        >
          <ListItemIcon>
            <Delete fontSize="small" color="error" />
          </ListItemIcon>
          Xóa
        </MenuItem>
      </Menu>
    </Card>
  );
};

export { PromotionCard };
