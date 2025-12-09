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
  ListItemText,
  Divider,
  Tooltip,
  CircularProgress,
} from "@mui/material";
import {
  MoreVert,
  Edit,
  Delete,
  ContentCopy,
  Visibility,
  PowerSettingsNew,
} from "@mui/icons-material";
import type { ProductVariantWithProduct, ProductVariantStatus } from "../types";
import { ProductVariantFormatter } from "../utils";
import { useProductVariantActions } from "../hooks";

interface ProductVariantCardProps {
  variant: ProductVariantWithProduct;
  onView?: (variant: ProductVariantWithProduct) => void;
  onEdit?: (variant: ProductVariantWithProduct) => void;
  onDelete?: (variant: ProductVariantWithProduct) => void;
  onStatusChange?: (
    variant: ProductVariantWithProduct,
    status: ProductVariantStatus
  ) => void;
  onDuplicate?: (variant: ProductVariantWithProduct) => void;
}

/**
 * Product Variant Card Component
 * Following Single Responsibility Principle - displays variant information in card format
 */
export const ProductVariantCard: React.FC<ProductVariantCardProps> = ({
  variant,
  onView,
  onEdit,
  onDelete,
  onStatusChange,
  onDuplicate,
}) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const { updateStatus, deleteVariant, duplicateVariant, isLoading } =
    useProductVariantActions({
      onStatusUpdate: (updatedVariant) => {
        onStatusChange?.(
          updatedVariant,
          updatedVariant.status as ProductVariantStatus
        );
      },
      onDelete: () => {
        onDelete?.(variant);
      },
      onDuplicate: (duplicatedVariant) => {
        onDuplicate?.(duplicatedVariant);
      },
    });

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleView = () => {
    onView?.(variant);
    handleMenuClose();
  };

  const handleEdit = () => {
    onEdit?.(variant);
    handleMenuClose();
  };

  const handleDelete = async () => {
    handleMenuClose();
    await deleteVariant(variant.id);
  };

  const handleDuplicate = async () => {
    handleMenuClose();
    await duplicateVariant(variant.id);
  };

  const handleStatusToggle = async () => {
    const newStatus: ProductVariantStatus =
      variant.status === "active" ? "inactive" : "active";
    await updateStatus(variant.id, newStatus);
    handleMenuClose();
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case "active":
        return "success";
      case "inactive":
        return "default";
      case "draft":
        return "warning";
      default:
        return "default";
    }
  };

  return (
    <Card
      elevation={2}
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        "&:hover": {
          elevation: 4,
          transform: "translateY(-2px)",
          transition: "all 0.2s ease-in-out",
        },
      }}
    >
      <CardContent sx={{ flexGrow: 1 }}>
        {/* Header with actions */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            mb: 2,
          }}
        >
          <Box sx={{ flexGrow: 1, minWidth: 0 }}>
            <Tooltip title={variant.name} placement="top">
              <Typography
                variant="h6"
                fontWeight="bold"
                sx={{
                  mb: 1,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  lineHeight: 1.2,
                }}
              >
                {variant.name}
              </Typography>
            </Tooltip>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              {ProductVariantFormatter.truncateText(variant.product.name, 40)}
            </Typography>
          </Box>

          <IconButton
            size="small"
            onClick={handleMenuClick}
            sx={{ ml: 1, flexShrink: 0 }}
          >
            <MoreVert />
          </IconButton>
        </Box>

        {/* Price */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="h5" color="primary.main" fontWeight="bold">
            {ProductVariantFormatter.formatPrice(variant.price)}
          </Typography>
        </Box>

        {/* Description */}
        {variant.description && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mb: 2,
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
            }}
          >
            {variant.description}
          </Typography>
        )}

        {/* Additional Info */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1, mb: 2 }}>
          {variant.endow && Object.keys(variant.endow).length > 0 && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Typography variant="caption" color="text.secondary">
                Ưu đãi:
              </Typography>
              <Typography variant="caption">
                {ProductVariantFormatter.truncateText(
                  JSON.stringify(variant.endow),
                  30
                )}
              </Typography>
            </Box>
          )}

          {variant.option && Object.keys(variant.option).length > 0 && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Typography variant="caption" color="text.secondary">
                Tùy chọn:
              </Typography>
              <Typography variant="caption">
                {ProductVariantFormatter.truncateText(
                  JSON.stringify(variant.option),
                  30
                )}
              </Typography>
            </Box>
          )}
        </Box>

        {/* Footer with status and date */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Chip
            label={ProductVariantFormatter.getStatusLabel(variant.status)}
            color={getStatusColor(variant.status) as any}
            size="small"
          />
          <Typography variant="caption" color="text.secondary">
            {ProductVariantFormatter.formatDate(variant.createdAt)}
          </Typography>
        </Box>
      </CardContent>

      {/* Actions Menu */}
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleMenuClose}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem onClick={handleView}>
          <ListItemIcon>
            <Visibility fontSize="small" />
          </ListItemIcon>
          <ListItemText>Xem chi tiết</ListItemText>
        </MenuItem>

        <MenuItem onClick={handleEdit}>
          <ListItemIcon>
            <Edit fontSize="small" />
          </ListItemIcon>
          <ListItemText>Chỉnh sửa</ListItemText>
        </MenuItem>

        <MenuItem
          onClick={handleDuplicate}
          disabled={isLoading(variant.id, "duplicate")}
        >
          <ListItemIcon>
            {isLoading(variant.id, "duplicate") ? (
              <CircularProgress size={16} />
            ) : (
              <ContentCopy fontSize="small" />
            )}
          </ListItemIcon>
          <ListItemText>Sao chép</ListItemText>
        </MenuItem>

        <MenuItem
          onClick={handleStatusToggle}
          disabled={isLoading(variant.id, "status")}
        >
          <ListItemIcon>
            {isLoading(variant.id, "status") ? (
              <CircularProgress size={16} />
            ) : (
              <PowerSettingsNew fontSize="small" />
            )}
          </ListItemIcon>
          <ListItemText>
            {variant.status === "active" ? "Vô hiệu hóa" : "Kích hoạt"}
          </ListItemText>
        </MenuItem>

        <Divider />

        <MenuItem
          onClick={handleDelete}
          sx={{ color: "error.main" }}
          disabled={isLoading(variant.id, "delete")}
        >
          <ListItemIcon>
            {isLoading(variant.id, "delete") ? (
              <CircularProgress size={16} />
            ) : (
              <Delete fontSize="small" color="error" />
            )}
          </ListItemIcon>
          <ListItemText>Xóa</ListItemText>
        </MenuItem>
      </Menu>
    </Card>
  );
};
