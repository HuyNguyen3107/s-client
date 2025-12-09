import React from "react";
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Chip,
  IconButton,
  Box,
  Tooltip,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import type { ProductWithRelations, ProductStatus } from "../types";
import { PRODUCT_CONSTANTS } from "../constants";

interface ProductCardProps {
  product: ProductWithRelations;
  onEdit?: (product: ProductWithRelations) => void;
  onDelete?: (product: ProductWithRelations) => void;
  isSelected?: boolean;
  onSelect?: (product: ProductWithRelations) => void;
  showActions?: boolean;
}

// Helper function following Single Responsibility Principle
const getStatusInfo = (status?: ProductStatus) => {
  const statusOption = PRODUCT_CONSTANTS.STATUS_OPTIONS.find(
    (option) => option.value === status
  );
  return statusOption || PRODUCT_CONSTANTS.STATUS_OPTIONS[0];
};

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onEdit,
  onDelete,
  isSelected = false,
  onSelect,
  showActions = true,
}) => {
  const statusInfo = getStatusInfo(product.status as ProductStatus);

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit?.(product);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete?.(product);
  };

  const handleCardClick = () => {
    onSelect?.(product);
  };

  return (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        cursor: onSelect ? "pointer" : "default",
        border: isSelected ? 2 : 1,
        borderColor: isSelected ? "primary.main" : "divider",
        transition: "all 0.2s ease-in-out",
        "&:hover": {
          boxShadow: 4,
          transform: "translateY(-2px)",
        },
      }}
      onClick={handleCardClick}
    >
      <CardContent sx={{ flexGrow: 1 }}>
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            mb: 2,
          }}
        >
          <Typography variant="h6" component="h3" sx={{ fontWeight: 600 }}>
            {product.name}
          </Typography>
          <Chip
            label={statusInfo.label}
            color={statusInfo.color}
            size="small"
          />
        </Box>

        {/* Collection Info */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Bộ sưu tập:
          </Typography>
          <Typography variant="body2" sx={{ fontWeight: 500 }}>
            {product.collection.name}
          </Typography>
        </Box>

        {/* Product Variants Count */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Số biến thể:{" "}
            <Typography
              component="span"
              variant="body2"
              sx={{ fontWeight: 600, color: "primary.main" }}
            >
              {product.productVariants.length}
            </Typography>
          </Typography>
        </Box>

        {/* Created Date */}
        <Typography variant="caption" color="text.secondary">
          Tạo:{" "}
          {format(new Date(product.createdAt), "dd/MM/yyyy HH:mm", {
            locale: vi,
          })}
        </Typography>
      </CardContent>

      {/* Actions */}
      {showActions && (
        <CardActions sx={{ justifyContent: "flex-end", pt: 0 }}>
          <Tooltip title="Chỉnh sửa">
            <IconButton size="small" color="primary" onClick={handleEdit}>
              <Edit />
            </IconButton>
          </Tooltip>

          <Tooltip title="Xóa">
            <IconButton size="small" color="error" onClick={handleDelete}>
              <Delete />
            </IconButton>
          </Tooltip>
        </CardActions>
      )}
    </Card>
  );
};

export { ProductCard };
