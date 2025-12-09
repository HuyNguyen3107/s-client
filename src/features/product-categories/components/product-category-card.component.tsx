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
  Avatar,
  Stack,
} from "@mui/material";
import { Edit, Delete, Category, Inventory } from "@mui/icons-material";
import type { ProductCategoryWithRelations } from "../types";
import { ProductCategoryFormatter } from "../utils";

interface ProductCategoryCardProps {
  category: ProductCategoryWithRelations;
  onEdit?: (category: ProductCategoryWithRelations) => void;
  onDelete?: (category: ProductCategoryWithRelations) => void;
  showActions?: boolean;
}

/**
 * Product Category Card Component
 * Following Single Responsibility Principle - displays category information in card format
 */
export const ProductCategoryCard: React.FC<ProductCategoryCardProps> = ({
  category,
  onEdit,
  onDelete,
  showActions = true,
}) => {
  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit?.(category);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete?.(category);
  };

  const customsCount = category.productCustoms?.length || 0;
  const hasCustoms = customsCount > 0;

  return (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        transition: "all 0.2s ease-in-out",
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: (theme) => theme.shadows[8],
        },
      }}
    >
      <CardContent sx={{ flexGrow: 1, pb: 1 }}>
        {/* Header */}
        <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2, mb: 2 }}>
          <Avatar
            sx={{
              bgcolor: "primary.main",
              width: 40,
              height: 40,
            }}
          >
            <Category />
          </Avatar>
          <Box sx={{ flexGrow: 1, minWidth: 0 }}>
            <Typography
              variant="h6"
              component="h3"
              sx={{
                fontWeight: 600,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {category.name}
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {category.product.name}
            </Typography>
          </Box>
        </Box>

        {/* Collection Info */}
        {category.product.collection && (
          <Box sx={{ mb: 2 }}>
            <Chip
              size="small"
              label={category.product.collection.name}
              variant="outlined"
              color="secondary"
            />
          </Box>
        )}

        {/* Product Customs Count */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
          <Inventory
            fontSize="small"
            color={hasCustoms ? "primary" : "disabled"}
          />
          <Typography
            variant="body2"
            color={hasCustoms ? "text.primary" : "text.secondary"}
          >
            {customsCount} sản phẩm tùy chỉnh
          </Typography>
        </Box>

        {/* Recent Product Customs Preview */}
        {hasCustoms && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Gần đây:
            </Typography>
            <Stack spacing={1}>
              {category.productCustoms.slice(0, 2).map((custom) => (
                <Box
                  key={custom.id}
                  sx={{
                    p: 1,
                    bgcolor: "grey.50",
                    borderRadius: 1,
                    border: "1px solid",
                    borderColor: "grey.200",
                  }}
                >
                  <Typography variant="body2" fontWeight={500}>
                    {ProductCategoryFormatter.truncateText(custom.name, 30)}
                  </Typography>
                  {custom.price && (
                    <Typography variant="caption" color="text.secondary">
                      {ProductCategoryFormatter.formatPrice(custom.price)}
                    </Typography>
                  )}
                </Box>
              ))}
              {customsCount > 2 && (
                <Typography variant="caption" color="text.secondary">
                  +{customsCount - 2} sản phẩm khác
                </Typography>
              )}
            </Stack>
          </Box>
        )}

        {/* Metadata */}
        <Box sx={{ mt: "auto" }}>
          <Typography variant="caption" color="text.secondary">
            Tạo: {ProductCategoryFormatter.formatDate(category.createdAt)}
          </Typography>
          {category.updatedAt !== category.createdAt && (
            <Typography
              variant="caption"
              color="text.secondary"
              display="block"
            >
              Cập nhật:{" "}
              {ProductCategoryFormatter.formatDate(category.updatedAt)}
            </Typography>
          )}
        </Box>
      </CardContent>

      {/* Actions */}
      {showActions && (
        <CardActions sx={{ px: 2, py: 1, justifyContent: "flex-end" }}>
          <Tooltip title="Chỉnh sửa">
            <IconButton
              size="small"
              onClick={handleEdit}
              sx={{ color: "primary.main" }}
            >
              <Edit fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip
            title={hasCustoms ? "Không thể xóa - có sản phẩm tùy chỉnh" : "Xóa"}
          >
            <span>
              <IconButton
                size="small"
                onClick={handleDelete}
                disabled={hasCustoms}
                sx={{
                  color: hasCustoms ? "grey.400" : "error.main",
                  "&:disabled": {
                    color: "grey.400",
                  },
                }}
              >
                <Delete fontSize="small" />
              </IconButton>
            </span>
          </Tooltip>
        </CardActions>
      )}
    </Card>
  );
};
