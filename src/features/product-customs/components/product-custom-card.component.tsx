import React from "react";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Tooltip,
  CardActions,
} from "@mui/material";
import {
  MoreVert,
  Edit,
  Delete,
  Inventory,
  Warning,
} from "@mui/icons-material";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import type { ProductCustomWithRelations } from "../types";
import { ProductCustomFormatter } from "../utils";

interface ProductCustomCardProps {
  productCustom: ProductCustomWithRelations;
  onEdit?: (productCustom: ProductCustomWithRelations) => void;
  onDelete?: (productCustom: ProductCustomWithRelations) => void;
  onView?: (productCustom: ProductCustomWithRelations) => void;
  isLoading?: boolean;
  showActions?: boolean;
  compact?: boolean;
}

/**
 * Product Custom Card Component
 * Following Single Responsibility Principle - displays product custom in card format
 */
export const ProductCustomCard: React.FC<ProductCustomCardProps> = ({
  productCustom,
  onEdit,
  onDelete,
  onView,
  isLoading = false,
  showActions = true,
  compact = false,
}) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = () => {
    handleMenuClose();
    onEdit?.(productCustom);
  };

  const handleDelete = () => {
    handleMenuClose();
    onDelete?.(productCustom);
  };

  const handleCardClick = () => {
    if (!isLoading) {
      onView?.(productCustom);
    }
  };

  // Get inventory status
  const inventoryStatus =
    ProductCustomFormatter.getInventoryStatus(productCustom);

  return (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        cursor: onView ? "pointer" : "default",
        opacity: isLoading ? 0.7 : 1,
        transition: "all 0.2s",
        "&:hover": {
          transform: onView ? "translateY(-2px)" : "none",
          boxShadow: onView ? 3 : 1,
        },
      }}
      onClick={handleCardClick}
    >
      {/* Product Image */}
      <CardMedia
        component="img"
        height={compact ? 120 : 200}
        image={productCustom.imageUrl}
        alt={productCustom.name}
        sx={{
          objectFit: "cover",
          backgroundColor: "grey.100",
        }}
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          target.src = "/images/placeholder-product.png";
        }}
      />

      <CardContent sx={{ flexGrow: 1, p: compact ? 1.5 : 2 }}>
        {/* Product Custom Name */}
        <Typography
          variant={compact ? "body2" : "h6"}
          component="h3"
          gutterBottom
          sx={{
            fontWeight: 600,
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            minHeight: compact ? "auto" : "3.6em",
          }}
        >
          {productCustom.name}
        </Typography>

        {/* Category Path */}
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{
            display: "block",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            mb: 1,
          }}
        >
          {ProductCustomFormatter.formatCategoryName(productCustom)}
        </Typography>

        {/* Price */}
        <Typography
          variant={compact ? "body2" : "h6"}
          color="primary"
          sx={{ fontWeight: 600, mb: 1 }}
        >
          {ProductCustomFormatter.formatPrice(productCustom.price)}
        </Typography>

        {/* Status and Inventory Info */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
          <Chip
            label={ProductCustomFormatter.formatStatus(productCustom.status)}
            size="small"
            sx={{
              backgroundColor: ProductCustomFormatter.getStatusColor(
                productCustom.status
              ),
              color: "white",
              fontSize: "0.75rem",
            }}
          />

          {inventoryStatus.isLowStock && (
            <Tooltip title="Tồn kho thấp">
              <Warning color="warning" fontSize="small" />
            </Tooltip>
          )}
        </Box>

        {/* Inventory Status */}
        {!compact && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mb: 1 }}>
            <Inventory fontSize="small" color="action" />
            <Typography variant="caption" color="text.secondary">
              Có sẵn: {inventoryStatus.availableStock} / Tổng:{" "}
              {inventoryStatus.totalStock}
            </Typography>
          </Box>
        )}

        {/* Description */}
        {!compact && productCustom.description && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              mb: 1,
            }}
          >
            {productCustom.description}
          </Typography>
        )}

        {/* Created Date */}
        <Typography variant="caption" color="text.secondary">
          Tạo ngày:{" "}
          {format(new Date(productCustom.createdAt), "dd/MM/yyyy", {
            locale: vi,
          })}
        </Typography>
      </CardContent>

      {/* Actions */}
      {showActions && (
        <CardActions
          sx={{ pt: 0, px: compact ? 1.5 : 2, pb: compact ? 1.5 : 2 }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              width: "100%",
            }}
          >
            <IconButton
              size="small"
              onClick={handleMenuClick}
              disabled={isLoading}
            >
              <MoreVert />
            </IconButton>
          </Box>
        </CardActions>
      )}

      {/* Context Menu */}
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleMenuClose}
        onClick={(e) => e.stopPropagation()}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        {onEdit && (
          <MenuItem onClick={handleEdit}>
            <ListItemIcon>
              <Edit fontSize="small" />
            </ListItemIcon>
            <ListItemText>Chỉnh sửa</ListItemText>
          </MenuItem>
        )}

        {onDelete && (
          <MenuItem onClick={handleDelete} sx={{ color: "error.main" }}>
            <ListItemIcon>
              <Delete fontSize="small" color="error" />
            </ListItemIcon>
            <ListItemText>Xóa</ListItemText>
          </MenuItem>
        )}
      </Menu>
    </Card>
  );
};

/**
 * Skeleton Card Component for loading states
 */
export const ProductCustomCardSkeleton: React.FC<{ compact?: boolean }> = ({
  compact = false,
}) => {
  return (
    <Card sx={{ height: "100%" }}>
      <Box
        sx={{
          height: compact ? 120 : 200,
          backgroundColor: "grey.200",
          animation: "pulse 2s infinite",
        }}
      />
      <CardContent sx={{ p: compact ? 1.5 : 2 }}>
        <Box
          sx={{
            height: compact ? 16 : 24,
            backgroundColor: "grey.200",
            borderRadius: 1,
            mb: 1,
            animation: "pulse 2s infinite",
          }}
        />
        <Box
          sx={{
            height: 12,
            backgroundColor: "grey.200",
            borderRadius: 1,
            mb: 1,
            width: "60%",
            animation: "pulse 2s infinite",
          }}
        />
        <Box
          sx={{
            height: compact ? 16 : 20,
            backgroundColor: "grey.200",
            borderRadius: 1,
            mb: 1,
            width: "40%",
            animation: "pulse 2s infinite",
          }}
        />
      </CardContent>
      {!compact && (
        <CardActions sx={{ pt: 0, px: 2, pb: 2 }}>
          <Box
            sx={{
              height: 32,
              backgroundColor: "grey.200",
              borderRadius: 1,
              width: "100%",
              animation: "pulse 2s infinite",
            }}
          />
        </CardActions>
      )}
    </Card>
  );
};

export default ProductCustomCard;
