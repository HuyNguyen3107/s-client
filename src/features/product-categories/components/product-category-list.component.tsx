import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Paper,
  InputAdornment,
  Tooltip,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import {
  Add,
  Search,
  Refresh,
  Edit,
  Delete,
  ViewModule,
  ViewList,
  Clear,
  Category,
  Inventory,
} from "@mui/icons-material";
import { useQuery } from "@tanstack/react-query";
import { useProductCategoryList } from "../hooks";
import { ProductCategoryCard } from "./product-category-card.component";
import { ProductCategoryForm } from "./product-category-form.component";
import type { ProductCategoryWithRelations } from "../types";
import { PRODUCT_CATEGORY_CONSTANTS } from "../constants";
import { ProductCategoryFormatter } from "../utils";
import { useProductCategoryForm } from "../hooks";
import { API_PATHS } from "../../../constants/api-path.constants";
import http from "../../../libs/http.libs";

interface Product {
  id: string;
  name: string;
}

interface ProductCategoryListProps {
  initialViewMode?: "grid" | "table";
  initialProductId?: string;
}

/**
 * Product Category List Component
 * Following Single Responsibility Principle - manages the display and interaction of category lists
 */
export const ProductCategoryList: React.FC<ProductCategoryListProps> = ({
  initialViewMode = "grid",
  initialProductId,
}) => {
  // UI State
  const [openForm, setOpenForm] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedCategory, setSelectedCategory] =
    useState<ProductCategoryWithRelations | null>(null);
  const [searchValue, setSearchValue] = useState("");
  const [productFilter, setProductFilter] = useState<string>(
    initialProductId || ""
  );
  const [viewMode, setViewMode] = useState<"grid" | "table">(initialViewMode);

  // Custom hooks
  const { data, isLoading, error, params, updateParams, refresh } =
    useProductCategoryList({
      search: searchValue,
      productId: productFilter || undefined,
    });

  const { deleteCategory } = useProductCategoryForm();

  // Fetch products for filter dropdown
  const { data: productsData } = useQuery({
    queryKey: ["products-for-filter"],
    queryFn: async () => {
      const response = await http.get<{ data: Product[] }>(API_PATHS.PRODUCTS, {
        params: { limit: 100 },
      });
      return response.data.data || [];
    },
  });

  // Event handlers
  const handleSearch = (value: string) => {
    setSearchValue(value);
    updateParams({ search: value || undefined, page: 1 });
  };

  const handleProductFilter = (productId: string) => {
    setProductFilter(productId);
    updateParams({ productId: productId || undefined, page: 1 });
  };

  const handleSort = (sortValue: string) => {
    const [sortBy, sortOrder] = sortValue.split("_") as [
      string,
      "asc" | "desc"
    ];
    updateParams({ sortBy: sortBy as any, sortOrder, page: 1 });
  };

  const handlePageChange = (_: unknown, newPage: number) => {
    updateParams({ page: newPage + 1 });
  };

  const handleRowsPerPageChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    updateParams({
      limit: parseInt(event.target.value, 10),
      page: 1,
    });
  };

  const handleAdd = () => {
    setSelectedCategory(null);
    setOpenForm(true);
  };

  const handleEdit = (category: ProductCategoryWithRelations) => {
    setSelectedCategory(category);
    setOpenForm(true);
  };

  const handleDelete = (category: ProductCategoryWithRelations) => {
    setSelectedCategory(category);
    setOpenDeleteDialog(true);
  };

  const handleConfirmDelete = async () => {
    if (selectedCategory) {
      await deleteCategory(selectedCategory.id);
      setOpenDeleteDialog(false);
      setSelectedCategory(null);
      refresh();
    }
  };

  const handleFormSuccess = () => {
    setOpenForm(false);
    setSelectedCategory(null);
    refresh();
  };

  const handleClearFilters = () => {
    setSearchValue("");
    setProductFilter("");
    updateParams({
      search: undefined,
      productId: undefined,
      page: 1,
    });
  };

  const currentSort = `${params.sortBy}_${params.sortOrder}`;
  const hasFilters = searchValue || productFilter;

  if (error) {
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        Có lỗi xảy ra khi tải dữ liệu: {error.message}
      </Alert>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h5" component="h2">
          Quản lý Thể loại Sản phẩm
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleAdd}
          size="large"
        >
          Thêm thể loại
        </Button>
      </Box>

      {/* Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            {/* Search */}
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                placeholder="Tìm kiếm theo tên thể loại..."
                value={searchValue}
                onChange={(e) => handleSearch(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            {/* Product Filter */}
            <Grid size={{ xs: 12, md: 3 }}>
              <FormControl fullWidth>
                <InputLabel>Sản phẩm</InputLabel>
                <Select
                  value={productFilter}
                  label="Sản phẩm"
                  onChange={(e) => handleProductFilter(e.target.value)}
                >
                  <MenuItem value="">Tất cả sản phẩm</MenuItem>
                  {productsData?.map((product) => (
                    <MenuItem key={product.id} value={product.id}>
                      {product.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Sort */}
            <Grid size={{ xs: 12, md: 3 }}>
              <FormControl fullWidth>
                <InputLabel>Sắp xếp</InputLabel>
                <Select
                  value={currentSort}
                  label="Sắp xếp"
                  onChange={(e) => handleSort(e.target.value)}
                >
                  {PRODUCT_CATEGORY_CONSTANTS.SORT_OPTIONS.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Actions */}
            <Grid size={{ xs: 12, md: 2 }}>
              <Box sx={{ display: "flex", gap: 1 }}>
                <Tooltip title="Làm mới">
                  <IconButton onClick={refresh} disabled={isLoading}>
                    <Refresh />
                  </IconButton>
                </Tooltip>
                {hasFilters && (
                  <Tooltip title="Xóa bộ lọc">
                    <IconButton onClick={handleClearFilters}>
                      <Clear />
                    </IconButton>
                  </Tooltip>
                )}
                <ToggleButtonGroup
                  value={viewMode}
                  exclusive
                  onChange={(_, newMode) => newMode && setViewMode(newMode)}
                  size="small"
                >
                  <ToggleButton value="grid">
                    <ViewModule />
                  </ToggleButton>
                  <ToggleButton value="table">
                    <ViewList />
                  </ToggleButton>
                </ToggleButtonGroup>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Loading */}
      {isLoading && (
        <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {/* Content */}
      {!isLoading && (
        <>
          {viewMode === "grid" ? (
            // Grid View
            <Grid container spacing={3}>
              {!data?.data.length ? (
                <Grid size={{ xs: 12 }}>
                  <Box sx={{ textAlign: "center", py: 4 }}>
                    <Category
                      sx={{ fontSize: 64, color: "text.secondary", mb: 2 }}
                    />
                    <Typography
                      variant="h6"
                      color="text.secondary"
                      gutterBottom
                    >
                      Không có thể loại nào
                    </Typography>
                    <Typography color="text.secondary">
                      {hasFilters
                        ? "Thử thay đổi bộ lọc để tìm thêm kết quả"
                        : "Hãy tạo thể loại sản phẩm đầu tiên"}
                    </Typography>
                  </Box>
                </Grid>
              ) : (
                data.data.map((category) => (
                  <Grid
                    key={category.id}
                    size={{ xs: 12, sm: 6, md: 4, lg: 3 }}
                  >
                    <ProductCategoryCard
                      category={category}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                    />
                  </Grid>
                ))
              )}
            </Grid>
          ) : (
            // Table View
            <TableContainer component={Paper} sx={{ overflowX: "auto" }}>
              <Table sx={{ minWidth: 650 }}>
                <TableHead>
                  <TableRow>
                    <TableCell>Tên thể loại</TableCell>
                    <TableCell>Sản phẩm</TableCell>
                    <TableCell>Bộ sưu tập</TableCell>
                    <TableCell align="center">Sản phẩm tùy chỉnh</TableCell>
                    <TableCell>Ngày tạo</TableCell>
                    <TableCell align="center">Thao tác</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {!data?.data.length ? (
                    <TableRow>
                      <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                        <Typography color="text.secondary">
                          {hasFilters
                            ? "Không tìm thấy thể loại nào phù hợp"
                            : "Chưa có thể loại nào"}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    data.data.map((category) => (
                      <TableRow key={category.id} hover>
                        <TableCell>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                            }}
                          >
                            <Category color="primary" />
                            <Typography fontWeight={500}>
                              {category.name}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>{category.product.name}</TableCell>
                        <TableCell>
                          {category.product.collection ? (
                            <Chip
                              size="small"
                              label={category.product.collection.name}
                              variant="outlined"
                            />
                          ) : (
                            <Typography variant="body2" color="text.secondary">
                              Không có
                            </Typography>
                          )}
                        </TableCell>
                        <TableCell align="center">
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              gap: 1,
                            }}
                          >
                            <Inventory
                              color={
                                category.productCustoms.length > 0
                                  ? "primary"
                                  : "disabled"
                              }
                            />
                            <Typography>
                              {category.productCustoms.length}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          {ProductCategoryFormatter.formatDate(
                            category.createdAt
                          )}
                        </TableCell>
                        <TableCell align="center">
                          <Tooltip title="Chỉnh sửa">
                            <IconButton
                              size="small"
                              onClick={() => handleEdit(category)}
                              sx={{ color: "primary.main" }}
                            >
                              <Edit />
                            </IconButton>
                          </Tooltip>
                          <Tooltip
                            title={
                              category.productCustoms.length > 0
                                ? "Không thể xóa - có sản phẩm tùy chỉnh"
                                : "Xóa"
                            }
                          >
                            <span>
                              <IconButton
                                size="small"
                                onClick={() => handleDelete(category)}
                                disabled={category.productCustoms.length > 0}
                                sx={{
                                  color:
                                    category.productCustoms.length > 0
                                      ? "grey.400"
                                      : "error.main",
                                  "&:disabled": { color: "grey.400" },
                                }}
                              >
                                <Delete />
                              </IconButton>
                            </span>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>

              {/* Pagination */}
              {data && data.meta.total > 0 && (
                <TablePagination
                  component="div"
                  count={data.meta.total}
                  page={data.meta.page - 1}
                  onPageChange={handlePageChange}
                  rowsPerPage={data.meta.limit}
                  onRowsPerPageChange={handleRowsPerPageChange}
                  rowsPerPageOptions={
                    PRODUCT_CATEGORY_CONSTANTS.ITEMS_PER_PAGE_OPTIONS
                  }
                  labelRowsPerPage="Số dòng mỗi trang:"
                  labelDisplayedRows={({ from, to, count }) =>
                    `${from}-${to} của ${count !== -1 ? count : `hơn ${to}`}`
                  }
                />
              )}
            </TableContainer>
          )}
        </>
      )}

      {/* Form Dialog */}
      <ProductCategoryForm
        open={openForm}
        onClose={() => setOpenForm(false)}
        onSuccess={handleFormSuccess}
        category={selectedCategory}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
      >
        <DialogTitle>Xác nhận xóa</DialogTitle>
        <DialogContent>
          <Typography>
            Bạn có chắc chắn muốn xóa thể loại "{selectedCategory?.name}"?
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Thao tác này không thể hoàn tác.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>Hủy</Button>
          <Button
            onClick={handleConfirmDelete}
            color="error"
            variant="contained"
          >
            Xóa
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
