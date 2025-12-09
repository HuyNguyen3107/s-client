import React, { useMemo } from "react";
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Paper,
  IconButton,
  Typography,
  Chip,
  Box,
  Skeleton,
  TableSortLabel,
  Tooltip,
  Toolbar,
} from "@mui/material";
import {
  Edit,
  Delete,
  UnfoldMore,
  AttachMoney,
  Note,
} from "@mui/icons-material";
import type {
  ShippingFee,
  ShippingFeeTableProps,
  SortBy,
  SortOrder,
} from "../types";
import { SHIPPING_FEE_TABLE_COLUMNS } from "../constants";

/**
 * ShippingFeeTable Component
 * Following Single Responsibility Principle - only responsible for displaying table data
 * Following Open/Closed Principle - can be extended with new column types
 */
export const ShippingFeeTable: React.FC<ShippingFeeTableProps> = ({
  data,
  loading = false,
  pagination,
  onEdit,
  onDelete,
  onSort,
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
    }).format(new Date(dateString));
  };

  const handleSort = (sortBy: string) => {
    if (!onSort) return;
    const newSortOrder: SortOrder = "asc";
    onSort(sortBy as SortBy, newSortOrder);
  };

  const renderCellContent = (columnKey: string, record: ShippingFee) => {
    switch (columnKey) {
      case "shippingType":
        return (
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Typography variant="body2" fontWeight={500}>
              {record.shippingType}
            </Typography>
          </Box>
        );

      case "area":
        return (
          <Chip
            label={record.area}
            size="small"
            color="primary"
            variant="outlined"
          />
        );

      case "estimatedDeliveryTime":
        return (
          <Typography variant="body2" color="text.secondary">
            {record.estimatedDeliveryTime}
          </Typography>
        );

      case "shippingFee":
        return (
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <AttachMoney
              sx={{ fontSize: 16, color: "success.main", mr: 0.5 }}
            />
            <Typography variant="body2" color="success.main" fontWeight={600}>
              {formatCurrency(record.shippingFee)}
            </Typography>
          </Box>
        );

      case "notesOrRemarks":
        return record.notesOrRemarks ? (
          <Tooltip title={record.notesOrRemarks} arrow>
            <Box sx={{ display: "flex", alignItems: "center", maxWidth: 200 }}>
              <Note sx={{ fontSize: 16, color: "warning.main", mr: 0.5 }} />
              <Typography
                variant="body2"
                sx={{
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {record.notesOrRemarks.length > 30
                  ? `${record.notesOrRemarks.substring(0, 30)}...`
                  : record.notesOrRemarks}
              </Typography>
            </Box>
          </Tooltip>
        ) : (
          <Typography variant="body2" color="text.disabled">
            —
          </Typography>
        );

      case "createdAt":
        return (
          <Typography variant="caption" color="text.secondary">
            {formatDate(record.createdAt)}
          </Typography>
        );

      case "actions":
        return (
          <Box sx={{ display: "flex", gap: 0.5 }}>
            {onEdit && (
              <Tooltip title="Chỉnh sửa">
                <IconButton
                  size="small"
                  onClick={() => onEdit(record)}
                  color="primary"
                >
                  <Edit fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
            {onDelete && (
              <Tooltip title="Xóa">
                <IconButton
                  size="small"
                  onClick={() => onDelete(record)}
                  color="error"
                >
                  <Delete fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
          </Box>
        );

      default:
        return "";
    }
  };

  const tableColumns = useMemo(() => SHIPPING_FEE_TABLE_COLUMNS, []);

  if (loading) {
    return (
      <Paper sx={{ width: "100%", overflow: "hidden" }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Danh sách phí vận chuyển
          </Typography>
        </Toolbar>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                {tableColumns.map((column) => (
                  <TableCell key={column.key}>
                    <Skeleton variant="text" width={100} />
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {[...Array(5)].map((_, index) => (
                <TableRow key={index}>
                  {tableColumns.map((column) => (
                    <TableCell key={column.key}>
                      <Skeleton variant="text" />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Paper sx={{ width: "100%", overflow: "hidden" }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Danh sách phí vận chuyển
          </Typography>
        </Toolbar>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            py: 8,
          }}
        >
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Không có dữ liệu phí vận chuyển
          </Typography>
          <Typography variant="body2" color="text.disabled">
            Thêm phí vận chuyển mới để bắt đầu quản lý
          </Typography>
        </Box>
      </Paper>
    );
  }

  return (
    <Paper sx={{ width: "100%", overflow: "hidden" }}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Danh sách phí vận chuyển
        </Typography>
        {pagination && (
          <Typography variant="body2" color="text.secondary">
            {data.length} trên {pagination.total} mục
          </Typography>
        )}
      </Toolbar>

      <TableContainer sx={{ maxHeight: 600 }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              {tableColumns.map((column) => (
                <TableCell
                  key={column.key}
                  sx={{
                    fontWeight: 600,
                    backgroundColor: "grey.50",
                  }}
                >
                  {column.sortable ? (
                    <TableSortLabel
                      active={false}
                      direction="asc"
                      onClick={() => handleSort(column.key)}
                      IconComponent={UnfoldMore}
                    >
                      {column.label}
                    </TableSortLabel>
                  ) : (
                    <Typography variant="subtitle2" fontWeight={600}>
                      {column.label}
                    </Typography>
                  )}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((record) => (
              <TableRow
                key={record.id}
                hover
                sx={{
                  "&:nth-of-type(odd)": {
                    backgroundColor: "grey.25",
                  },
                  "&:hover": {
                    backgroundColor: "action.hover",
                  },
                }}
              >
                {tableColumns.map((column) => (
                  <TableCell key={`${record.id}-${column.key}`} sx={{ py: 2 }}>
                    {renderCellContent(column.key, record)}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {pagination && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            px: 2,
            py: 1,
            borderTop: "1px solid",
            borderColor: "divider",
          }}
        >
          <Typography variant="body2" color="text.secondary">
            Hiển thị {Math.min(pagination.pageSize, pagination.total)} trên{" "}
            {pagination.total} mục
          </Typography>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <IconButton
              onClick={() =>
                pagination.onChange(pagination.current - 1, pagination.pageSize)
              }
              disabled={pagination.current <= 1}
              size="small"
            >
              ←
            </IconButton>

            <Typography variant="body2">
              Trang {pagination.current} /{" "}
              {Math.ceil(pagination.total / pagination.pageSize)}
            </Typography>

            <IconButton
              onClick={() =>
                pagination.onChange(pagination.current + 1, pagination.pageSize)
              }
              disabled={
                pagination.current >=
                Math.ceil(pagination.total / pagination.pageSize)
              }
              size="small"
            >
              →
            </IconButton>
          </Box>
        </Box>
      )}
    </Paper>
  );
};

export default ShippingFeeTable;
