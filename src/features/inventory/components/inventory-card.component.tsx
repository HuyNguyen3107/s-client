import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Box,
  Chip,
  IconButton,
  Button,
  Avatar,
  Tooltip,
  Menu,
  MenuItem,
  LinearProgress,
  Divider,
} from "@mui/material";
import {
  MoreVert,
  Edit,
  Delete,
  Add,
  Remove,
  BookmarkBorder,
  Bookmark,
} from "@mui/icons-material";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { StockLevelUtils, StatusUtils, FormatUtils } from "../utils";
import type { InventoryWithRelations } from "../types";

// Props interface following Interface Segregation Principle
interface InventoryCardProps {
  inventory: InventoryWithRelations;
  onEdit?: (inventory: InventoryWithRelations) => void;
  onDelete?: (id: string) => void;
  onAdjustStock?: (id: string, quantity: number, reason?: string) => void;
  onReserveStock?: (id: string, quantity: number, reason?: string) => void;
  onReleaseStock?: (id: string, quantity: number) => void;
  selected?: boolean;
  onSelect?: (id: string) => void;
  loading?: boolean;
}

const InventoryCard: React.FC<InventoryCardProps> = ({
  inventory,
  onEdit,
  onDelete,
  onAdjustStock,
  onReserveStock,
  onReleaseStock,
  selected = false,
  onSelect,
  loading = false,
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const stockLevel = StockLevelUtils.getStockLevel(inventory);
  const availableStock = StockLevelUtils.getAvailableStock(inventory);
  const statusColor = StatusUtils.getStatusColor(inventory.status);
  const statusLabel = StatusUtils.getStatusLabel(inventory.status);

  const stockPercentage = inventory.minStockAlert
    ? Math.min((inventory.currentStock / inventory.minStockAlert) * 100, 100)
    : 100;

  const productName = inventory.productCustom?.name || "Unknown Product";
  const productPrice = inventory.productCustom?.price || 0;
  const productImage = inventory.productCustom?.imageUrl;
  const totalValue = inventory.currentStock * productPrice;

  return (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        border: selected ? 2 : 1,
        borderColor: selected ? "primary.main" : "divider",
        transition: "all 0.2s ease-in-out",
        "&:hover": {
          boxShadow: 4,
          transform: "translateY(-2px)",
        },
        opacity: loading ? 0.7 : 1,
        position: "relative",
        overflow: "visible",
      }}
    >
      {loading && (
        <LinearProgress
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            zIndex: 1,
          }}
        />
      )}

      <CardContent sx={{ flexGrow: 1, pb: 1 }}>
        {/* Header with Product Info */}
        <Box display="flex" alignItems="flex-start" gap={2} mb={2}>
          <Avatar
            src={productImage}
            alt={productName}
            sx={{ width: 48, height: 48 }}
            variant="rounded"
          >
            {productName.charAt(0).toUpperCase()}
          </Avatar>

          <Box flexGrow={1} minWidth={0}>
            <Typography
              variant="h6"
              noWrap
              title={productName}
              sx={{ fontSize: "1rem", fontWeight: 600 }}
            >
              {productName}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {FormatUtils.formatCurrency(productPrice)}
            </Typography>
          </Box>

          <Box display="flex" alignItems="center" gap={0.5}>
            {onSelect && (
              <Tooltip title={selected ? "Bỏ chọn" : "Chọn"}>
                <IconButton
                  size="small"
                  onClick={() => onSelect(inventory.id)}
                  color={selected ? "primary" : "default"}
                >
                  {selected ? <Bookmark /> : <BookmarkBorder />}
                </IconButton>
              </Tooltip>
            )}

            <IconButton
              size="small"
              onClick={handleMenuClick}
              disabled={loading}
            >
              <MoreVert />
            </IconButton>
          </Box>
        </Box>

        {/* Status and Stock Level */}
        <Box display="flex" gap={1} mb={2} flexWrap="wrap">
          <Chip
            label={statusLabel}
            color={statusColor as any}
            size="small"
            variant="filled"
          />
          <Chip
            label={stockLevel.label}
            size="small"
            sx={{
              backgroundColor: stockLevel.color,
              color: "white",
            }}
          />
        </Box>

        {/* Stock Information */}
        <Box mb={2}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={1}
          >
            <Typography variant="body2" color="textSecondary">
              Tồn kho hiện tại
            </Typography>
            <Typography variant="h6" color="primary.main">
              {FormatUtils.formatStockNumber(inventory.currentStock)}
            </Typography>
          </Box>

          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={1}
          >
            <Typography variant="body2" color="textSecondary">
              Đã đặt chỗ
            </Typography>
            <Typography variant="body2" color="info.main">
              {FormatUtils.formatStockNumber(inventory.reservedStock)}
            </Typography>
          </Box>

          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={1}
          >
            <Typography variant="body2" color="textSecondary">
              Có sẵn
            </Typography>
            <Typography variant="body2" fontWeight="medium">
              {FormatUtils.formatStockNumber(availableStock)}
            </Typography>
          </Box>

          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={2}
          >
            <Typography variant="body2" color="textSecondary">
              Ngưỡng cảnh báo
            </Typography>
            <Typography variant="body2">
              {FormatUtils.formatStockNumber(inventory.minStockAlert)}
            </Typography>
          </Box>

          {/* Stock Level Progress */}
          <Box>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mb={0.5}
            >
              <Typography variant="caption" color="textSecondary">
                Mức độ tồn kho
              </Typography>
              <Typography variant="caption">
                {stockPercentage.toFixed(0)}%
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={stockPercentage}
              sx={{
                height: 6,
                borderRadius: 3,
                backgroundColor: "grey.200",
                "& .MuiLinearProgress-bar": {
                  backgroundColor: stockLevel.color,
                  borderRadius: 3,
                },
              }}
            />
          </Box>
        </Box>

        <Divider sx={{ my: 1 }} />

        {/* Value Information */}
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={1}
        >
          <Typography variant="body2" color="textSecondary">
            Giá trị tồn kho
          </Typography>
          <Typography variant="body2" fontWeight="medium" color="success.main">
            {FormatUtils.formatCurrency(totalValue)}
          </Typography>
        </Box>

        {/* Last Updated */}
        <Typography variant="caption" color="textSecondary">
          Cập nhật:{" "}
          {format(new Date(inventory.updatedAt), "dd/MM/yyyy HH:mm", {
            locale: vi,
          })}
        </Typography>
      </CardContent>

      {/* Actions */}
      <CardActions sx={{ justifyContent: "space-between", px: 2, py: 1 }}>
        <Box display="flex" gap={0.5}>
          {onAdjustStock && (
            <>
              <Tooltip title="Giảm tồn kho">
                <IconButton
                  size="small"
                  color="error"
                  onClick={() => onAdjustStock(inventory.id, -1)}
                  disabled={loading || inventory.currentStock <= 0}
                >
                  <Remove />
                </IconButton>
              </Tooltip>
              <Tooltip title="Tăng tồn kho">
                <IconButton
                  size="small"
                  color="success"
                  onClick={() => onAdjustStock(inventory.id, 1)}
                  disabled={loading}
                >
                  <Add />
                </IconButton>
              </Tooltip>
            </>
          )}
        </Box>

        <Button
          size="small"
          variant="outlined"
          onClick={() => onEdit?.(inventory)}
          disabled={loading}
          startIcon={<Edit />}
        >
          Chi tiết
        </Button>
      </CardActions>

      {/* Context Menu */}
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleMenuClose}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem
          onClick={() => {
            onEdit?.(inventory);
            handleMenuClose();
          }}
          disabled={loading}
        >
          <Edit fontSize="small" sx={{ mr: 1 }} />
          Chỉnh sửa
        </MenuItem>

        {onAdjustStock && (
          <MenuItem
            onClick={() => {
              onAdjustStock(inventory.id, 0); // Open adjustment dialog
              handleMenuClose();
            }}
            disabled={loading}
          >
            <Add fontSize="small" sx={{ mr: 1 }} />
            Điều chỉnh tồn kho
          </MenuItem>
        )}

        {onReserveStock && availableStock > 0 && (
          <MenuItem
            onClick={() => {
              onReserveStock(inventory.id, 0); // Open reserve dialog
              handleMenuClose();
            }}
            disabled={loading}
          >
            <BookmarkBorder fontSize="small" sx={{ mr: 1 }} />
            Đặt chỗ tồn kho
          </MenuItem>
        )}

        {onReleaseStock && inventory.reservedStock > 0 && (
          <MenuItem
            onClick={() => {
              onReleaseStock(inventory.id, 0); // Open release dialog
              handleMenuClose();
            }}
            disabled={loading}
          >
            <Bookmark fontSize="small" sx={{ mr: 1 }} />
            Giải phóng đặt chỗ
          </MenuItem>
        )}

        <Divider />

        <MenuItem
          onClick={() => {
            onDelete?.(inventory.id);
            handleMenuClose();
          }}
          disabled={loading}
          sx={{ color: "error.main" }}
        >
          <Delete fontSize="small" sx={{ mr: 1 }} />
          Xóa
        </MenuItem>
      </Menu>
    </Card>
  );
};

export default InventoryCard;
