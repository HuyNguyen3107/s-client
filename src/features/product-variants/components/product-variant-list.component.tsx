import React, { useState, useMemo } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Chip,
  Pagination,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Tooltip,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import {
  Search,
  Add,
  ViewModule,
  ViewList,
  Refresh,
} from "@mui/icons-material";
import type {
  ProductVariantWithProduct,
  ProductVariantQueryParams,
  ProductVariantStatus,
} from "../types";
import { useProductVariantList } from "../hooks";
import { ProductVariantCard } from "./product-variant-card.component";
import { ProductVariantForm } from "./product-variant-form-simple.component";
import { PRODUCT_VARIANT_CONSTANTS } from "../constants";
import { ProductVariantFormatter } from "../utils";

interface ProductVariantListProps {
  initialViewMode?: "grid" | "table";
  initialProductId?: string;
}

/**
 * Product Variant List Component
 * Following Single Responsibility Principle - manages the display and interaction of variant lists
 */
export const ProductVariantList: React.FC<ProductVariantListProps> = ({
  initialViewMode = "grid",
  initialProductId,
}) => {
  // UI State
  const [openForm, setOpenForm] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openDetailDialog, setOpenDetailDialog] = useState(false);
  const [selectedVariant, setSelectedVariant] =
    useState<ProductVariantWithProduct | null>(null);
  // UI-only states for form controls (display purposes)
  const [searchValue, setSearchValue] = useState("");
  const [productFilter, setProductFilter] = useState<string>(
    initialProductId || ""
  );
  const [statusFilter, setStatusFilter] = useState<ProductVariantStatus | "">(
    ""
  );
  const [viewMode, setViewMode] = useState<"grid" | "table">(initialViewMode);

  // Data fetching - Initialize hook with initial params only
  const initialQueryParams: ProductVariantQueryParams = useMemo(
    () => ({
      search: undefined,
      productId: initialProductId || undefined,
      status: undefined,
      page: 1,
      limit: PRODUCT_VARIANT_CONSTANTS.DEFAULT_LIMIT,
      sortBy: "createdAt",
      sortOrder: "desc",
    }),
    [initialProductId] // Only depend on initial props
  );

  const { variants, meta, isLoading, error, refetch, updateParams } =
    useProductVariantList(initialQueryParams);

  // Event handlers
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newSearchValue = event.target.value;
    setSearchValue(newSearchValue);
    // Update hook params to trigger refetch
    updateParams({
      search: newSearchValue || undefined,
      page: 1,
    });
  };

  const handleProductFilterChange = (productId: string) => {
    setProductFilter(productId);
    // Update hook params to trigger refetch
    updateParams({
      productId: productId || undefined,
      page: 1,
    });
  };

  const handleStatusFilterChange = (status: ProductVariantStatus | "") => {
    setStatusFilter(status);
    // Update hook params to trigger refetch
    updateParams({
      status: status || undefined,
      page: 1,
    });
  };

  const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
    updateParams({ page: value });
  };

  const handleRefresh = () => {
    refetch();
  };

  const handleAdd = () => {
    setSelectedVariant(null);
    setOpenForm(true);
  };

  const handleEdit = (variant: ProductVariantWithProduct) => {
    setSelectedVariant(variant);
    setOpenForm(true);
  };

  const handleDelete = (variant: ProductVariantWithProduct) => {
    setSelectedVariant(variant);
    setOpenDeleteDialog(true);
  };

  const handleView = (variant: ProductVariantWithProduct) => {
    setSelectedVariant(variant);
    setOpenDetailDialog(true);
  };

  const handleFormClose = () => {
    setOpenForm(false);
    setSelectedVariant(null);
  };

  const handleFormSuccess = () => {
    refetch();
  };

  const handleDeleteConfirm = () => {
    // TODO: Implement delete functionality
    setOpenDeleteDialog(false);
    setSelectedVariant(null);
  };

  const handleDeleteCancel = () => {
    setOpenDeleteDialog(false);
    setSelectedVariant(null);
  };

  const handleDetailClose = () => {
    setOpenDetailDialog(false);
    setSelectedVariant(null);
  };

  // Get unique products for filter dropdown
  const productOptions = useMemo(() => {
    const products = new Map<string, string>();
    variants.forEach((variant) => {
      products.set(variant.product.id, variant.product.name);
    });
    return Array.from(products.entries()).map(([id, name]) => ({ id, name }));
  }, [variants]);

  if (error) {
    return (
      <Alert
        severity="error"
        sx={{ mb: 3 }}
        action={
          <Button color="inherit" size="small" onClick={handleRefresh}>
            Thử lại
          </Button>
        }
      >
        {error.message || PRODUCT_VARIANT_CONSTANTS.ERROR_MESSAGES.SERVER_ERROR}
      </Alert>
    );
  }

  return (
    <Box>
      {/* Header Controls */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            {/* Search */}
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                placeholder={PRODUCT_VARIANT_CONSTANTS.PLACEHOLDERS.SEARCH}
                value={searchValue}
                onChange={handleSearch}
                InputProps={{
                  startAdornment: (
                    <Search sx={{ mr: 1, color: "text.secondary" }} />
                  ),
                }}
              />
            </Grid>

            {/* Product Filter */}
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <FormControl fullWidth>
                <InputLabel>Sản phẩm</InputLabel>
                <Select
                  value={productFilter}
                  onChange={(e) => handleProductFilterChange(e.target.value)}
                  label="Sản phẩm"
                >
                  <MenuItem value="">Tất cả sản phẩm</MenuItem>
                  {productOptions.map((product) => (
                    <MenuItem key={product.id} value={product.id}>
                      {product.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Status Filter */}
            <Grid size={{ xs: 12, sm: 6, md: 2 }}>
              <FormControl fullWidth>
                <InputLabel>Trạng thái</InputLabel>
                <Select
                  value={statusFilter}
                  onChange={(e) =>
                    handleStatusFilterChange(
                      e.target.value as ProductVariantStatus | ""
                    )
                  }
                  label="Trạng thái"
                >
                  <MenuItem value="">Tất cả</MenuItem>
                  {PRODUCT_VARIANT_CONSTANTS.STATUS_OPTIONS.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      <Chip
                        label={option.label}
                        color={option.color as any}
                        size="small"
                      />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* View Mode Toggle */}
            <Grid size={{ xs: 12, md: 2 }}>
              <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
                <ToggleButtonGroup
                  value={viewMode}
                  exclusive
                  onChange={(_, newViewMode) => {
                    if (newViewMode !== null) {
                      setViewMode(newViewMode);
                    }
                  }}
                  size="small"
                >
                  <ToggleButton value="grid">
                    <Tooltip title="Xem dạng lưới">
                      <ViewModule />
                    </Tooltip>
                  </ToggleButton>
                  <ToggleButton value="table">
                    <Tooltip title="Xem dạng bảng">
                      <ViewList />
                    </Tooltip>
                  </ToggleButton>
                </ToggleButtonGroup>
              </Box>
            </Grid>

            {/* Action Buttons */}
            <Grid size={{ xs: 12, md: 1 }}>
              <Box sx={{ display: "flex", gap: 1, justifyContent: "flex-end" }}>
                <Tooltip title="Làm mới">
                  <span>
                    <IconButton onClick={handleRefresh} disabled={isLoading}>
                      <Refresh />
                    </IconButton>
                  </span>
                </Tooltip>
                <Tooltip title="Thêm biến thể">
                  <IconButton onClick={handleAdd} color="primary">
                    <Add />
                  </IconButton>
                </Tooltip>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Loading */}
      {isLoading && (
        <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {/* Content */}
      {!isLoading && (
        <>
          {/* Stats */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography variant="h6">
                  Tổng cộng: {meta.total.toLocaleString("vi-VN")} biến thể
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Trang {meta.page} / {meta.totalPages}
                </Typography>
              </Box>
            </CardContent>
          </Card>

          {/* Empty State */}
          {variants.length === 0 ? (
            <Card>
              <CardContent sx={{ textAlign: "center", py: 6 }}>
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  {searchValue || productFilter || statusFilter
                    ? "Không tìm thấy biến thể nào phù hợp"
                    : "Chưa có biến thể sản phẩm nào"}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 3 }}
                >
                  {searchValue || productFilter || statusFilter
                    ? "Hãy thử thay đổi bộ lọc hoặc từ khóa tìm kiếm"
                    : "Hãy tạo biến thể sản phẩm đầu tiên"}
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<Add />}
                  onClick={handleAdd}
                >
                  Thêm biến thể mới
                </Button>
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Grid View */}
              {viewMode === "grid" ? (
                <Grid container spacing={3}>
                  {variants.map((variant) => (
                    <Grid
                      key={variant.id}
                      size={{ xs: 12, sm: 6, md: 4, lg: 3 }}
                    >
                      <ProductVariantCard
                        variant={variant}
                        onView={handleView}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                      />
                    </Grid>
                  ))}
                </Grid>
              ) : (
                /* Table View */
                <TableContainer component={Paper} sx={{ overflowX: "auto" }}>
                  <Table sx={{ minWidth: 650 }}>
                    <TableHead>
                      <TableRow>
                        <TableCell>Tên biến thể</TableCell>
                        <TableCell>Sản phẩm</TableCell>
                        <TableCell align="right">Giá</TableCell>
                        <TableCell align="center">Trạng thái</TableCell>
                        <TableCell>Ngày tạo</TableCell>
                        <TableCell align="center">Thao tác</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {variants.map((variant) => (
                        <TableRow key={variant.id} hover>
                          <TableCell>
                            <Typography variant="subtitle2">
                              {variant.name}
                            </Typography>
                            {variant.description && (
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                {ProductVariantFormatter.truncateText(
                                  variant.description,
                                  50
                                )}
                              </Typography>
                            )}
                          </TableCell>
                          <TableCell>{variant.product.name}</TableCell>
                          <TableCell align="right">
                            <Typography variant="body2" fontWeight="medium">
                              {ProductVariantFormatter.formatPrice(
                                variant.price
                              )}
                            </Typography>
                          </TableCell>
                          <TableCell align="center">
                            <Chip
                              label={ProductVariantFormatter.getStatusLabel(
                                variant.status
                              )}
                              color={
                                ProductVariantFormatter.getStatusColor(
                                  variant.status
                                ) as any
                              }
                              size="small"
                            />
                          </TableCell>
                          <TableCell>
                            {ProductVariantFormatter.formatDate(
                              variant.createdAt
                            )}
                          </TableCell>
                          <TableCell align="center">
                            <Box
                              sx={{
                                display: "flex",
                                gap: 1,
                                justifyContent: "center",
                              }}
                            >
                              <Button
                                size="small"
                                onClick={() => handleEdit(variant)}
                              >
                                Sửa
                              </Button>
                              <Button
                                size="small"
                                color="error"
                                onClick={() => handleDelete(variant)}
                              >
                                Xóa
                              </Button>
                            </Box>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}

              {/* Pagination */}
              {meta.totalPages > 1 && (
                <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
                  <Pagination
                    count={meta.totalPages}
                    page={meta.page}
                    onChange={handlePageChange}
                    color="primary"
                    showFirstButton
                    showLastButton
                  />
                </Box>
              )}
            </>
          )}
        </>
      )}

      {/* Form Dialog */}
      <ProductVariantForm
        open={openForm}
        variant={selectedVariant || undefined}
        onClose={handleFormClose}
        onSuccess={handleFormSuccess}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={openDeleteDialog}
        onClose={handleDeleteCancel}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title">Xác nhận xóa</DialogTitle>
        <DialogContent id="delete-dialog-description">
          <Typography>
            Bạn có chắc chắn muốn xóa biến thể "{selectedVariant?.name}"?
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Hành động này không thể hoàn tác.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel}>Hủy</Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
          >
            Xóa
          </Button>
        </DialogActions>
      </Dialog>

      {/* Detail Dialog */}
      <Dialog
        open={openDetailDialog}
        onClose={handleDetailClose}
        maxWidth="md"
        fullWidth
        aria-labelledby="detail-dialog-title"
        aria-describedby="detail-dialog-description"
      >
        <DialogTitle id="detail-dialog-title">
          Chi tiết biến thể sản phẩm
        </DialogTitle>
        <DialogContent dividers id="detail-dialog-description">
          {selectedVariant && (
            <Grid container spacing={3}>
              {/* Basic Information */}
              <Grid size={12}>
                <Typography variant="h6" gutterBottom>
                  Thông tin cơ bản
                </Typography>
                <Box sx={{ pl: 2 }}>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Tên biến thể:</strong> {selectedVariant.name}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Sản phẩm:</strong> {selectedVariant.product.name}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Giá:</strong>{" "}
                    {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(selectedVariant.price)}
                  </Typography>
                  <Box
                    sx={{
                      mb: 1,
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    <Typography variant="body2" component="span">
                      <strong>Trạng thái:</strong>
                    </Typography>
                    <Chip
                      label={
                        selectedVariant.status === "active"
                          ? "Hoạt động"
                          : "Không hoạt động"
                      }
                      color={
                        selectedVariant.status === "active"
                          ? "success"
                          : "default"
                      }
                      size="small"
                    />
                  </Box>
                  {selectedVariant.description && (
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      <strong>Mô tả:</strong> {selectedVariant.description}
                    </Typography>
                  )}
                </Box>
              </Grid>

              {/* Endow Information */}
              {selectedVariant.endow && (
                <Grid size={12}>
                  <Typography variant="h6" gutterBottom>
                    Ưu đãi
                  </Typography>
                  <Box sx={{ pl: 2 }}>
                    {typeof selectedVariant.endow === "string" ? (
                      <Typography variant="body2">
                        {selectedVariant.endow}
                      </Typography>
                    ) : selectedVariant.endow.items ? (
                      selectedVariant.endow.items.map(
                        (item: any, index: number) => (
                          <Typography
                            key={index}
                            variant="body2"
                            sx={{ mb: 0.5 }}
                          >
                            • {item.content}
                          </Typography>
                        )
                      )
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        Chưa có ưu đãi nào
                      </Typography>
                    )}
                  </Box>
                </Grid>
              )}

              {/* Purchase Options */}
              {selectedVariant.option &&
                selectedVariant.option.purchaseOptions && (
                  <Grid size={12}>
                    <Typography variant="h6" gutterBottom>
                      Tùy chọn mua thêm
                    </Typography>
                    <Box sx={{ pl: 2 }}>
                      {selectedVariant.option.purchaseOptions.map(
                        (option: any, index: number) => (
                          <Box
                            key={index}
                            sx={{
                              mb: 1,
                              p: 1,
                              border: "1px solid",
                              borderColor: "divider",
                              borderRadius: 1,
                            }}
                          >
                            <Typography variant="body2">
                              <strong>{option.content}</strong>
                            </Typography>
                            <Typography variant="body2" color="primary">
                              +
                              {new Intl.NumberFormat("vi-VN", {
                                style: "currency",
                                currency: "VND",
                              }).format(option.price)}
                            </Typography>
                          </Box>
                        )
                      )}
                    </Box>
                  </Grid>
                )}

              {/* Configuration */}
              {selectedVariant.config && selectedVariant.config.items && (
                <Grid size={12}>
                  <Typography variant="h6" gutterBottom>
                    Cấu hình sản phẩm
                  </Typography>
                  <Box sx={{ pl: 2 }}>
                    {selectedVariant.config.items.map(
                      (item: any, index: number) => (
                        <Box
                          key={index}
                          sx={{
                            mb: 1,
                            p: 1,
                            border: "1px solid",
                            borderColor: "divider",
                            borderRadius: 1,
                          }}
                        >
                          <Typography variant="body2">
                            <strong>{item.name}</strong>
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Số lượng cơ bản: {item.baseQuantity} |
                            {item.isRequired ? " Bắt buộc" : " Tùy chọn"}
                          </Typography>
                        </Box>
                      )
                    )}
                    {selectedVariant.config.allowCustomQuantity && (
                      <Typography variant="body2" sx={{ mt: 1 }}>
                        <strong>Cho phép số lượng tùy ý:</strong> Có
                        {selectedVariant.config.minCustomQuantity &&
                          selectedVariant.config.maxCustomQuantity && (
                            <span>
                              {" "}
                              ({selectedVariant.config.minCustomQuantity} -{" "}
                              {selectedVariant.config.maxCustomQuantity})
                            </span>
                          )}
                      </Typography>
                    )}
                  </Box>
                </Grid>
              )}

              {/* Timestamps */}
              <Grid size={12}>
                <Typography variant="h6" gutterBottom>
                  Thông tin khác
                </Typography>
                <Box sx={{ pl: 2 }}>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Ngày tạo:</strong>{" "}
                    {new Date(selectedVariant.createdAt).toLocaleDateString(
                      "vi-VN",
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      }
                    )}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Cập nhật lần cuối:</strong>{" "}
                    {new Date(selectedVariant.updatedAt).toLocaleDateString(
                      "vi-VN",
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      }
                    )}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDetailClose}>Đóng</Button>
          <Button
            variant="contained"
            onClick={() => {
              handleDetailClose();
              if (selectedVariant) {
                handleEdit(selectedVariant);
              }
            }}
          >
            Chỉnh sửa
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
