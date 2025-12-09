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
} from "@mui/icons-material";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { useProductList } from "../hooks";
import { ProductCard } from "./product-card.component";
import { ProductForm } from "./product-form.component";
import { useQuery } from "@tanstack/react-query";
import { API_PATHS } from "../../../constants/api-path.constants";
import http from "../../../libs/http.libs";
import type {
  ProductWithRelations,
  Collection,
  ApiResponse,
  ProductStatus,
} from "../types";
import { PRODUCT_CONSTANTS } from "../constants";

interface ProductListProps {
  initialViewMode?: "grid" | "table";
}

const ProductList: React.FC<ProductListProps> = ({
  initialViewMode = "grid",
}) => {
  const [openForm, setOpenForm] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedProduct, setSelectedProduct] =
    useState<ProductWithRelations | null>(null);
  const [searchValue, setSearchValue] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [collectionFilter, setCollectionFilter] = useState<string>("");
  const [viewMode, setViewMode] = useState<"grid" | "table">(initialViewMode);

  const {
    data: productData,
    isLoading,
    error,
    params,
    updateParams,
    deleteProduct,
    deleting,
    search,
    filterByStatus,
    filterByCollection,
  } = useProductList();

  // Fetch collections for filter dropdown
  const { data: collectionsData } = useQuery({
    queryKey: ["collections"],
    queryFn: async () => {
      const response = await http.get<ApiResponse<Collection[]>>(
        API_PATHS.COLLECTIONS
      );
      return response.data.data || [];
    },
  });

  const handleSearch = () => {
    search(searchValue);
  };

  const handleClearFilters = () => {
    setSearchValue("");
    setStatusFilter("");
    setCollectionFilter("");
    search("");
    filterByStatus(undefined);
    filterByCollection(undefined);
  };

  const handleChangePage = (_: unknown, newPage: number) => {
    updateParams({ page: newPage + 1 });
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    updateParams({
      limit: parseInt(event.target.value, 10),
      page: 1,
    });
  };

  const handleAdd = () => {
    setSelectedProduct(null);
    setOpenForm(true);
  };

  const handleEdit = (product: ProductWithRelations) => {
    setSelectedProduct(product);
    setOpenForm(true);
  };

  const handleDelete = (product: ProductWithRelations) => {
    setSelectedProduct(product);
    setOpenDeleteDialog(true);
  };

  const handleConfirmDelete = async () => {
    if (selectedProduct) {
      await deleteProduct(selectedProduct.id);
      setOpenDeleteDialog(false);
      setSelectedProduct(null);
    }
  };

  const handleFormSuccess = () => {
    setOpenForm(false);
    setSelectedProduct(null);
  };

  const getStatusInfo = (status?: ProductStatus) => {
    const statusOption = PRODUCT_CONSTANTS.STATUS_OPTIONS.find(
      (option) => option.value === status
    );
    return statusOption || PRODUCT_CONSTANTS.STATUS_OPTIONS[0];
  };

  if (error) {
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        Có lỗi xảy ra khi tải dữ liệu: {error.message}
      </Alert>
    );
  }

  return (
    <Box>
      <Card>
        <CardContent>
          {/* Header */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 3,
            }}
          >
            <Typography variant="h5" component="h1">
              Quản lý Sản phẩm
            </Typography>

            <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
              {/* View Mode Toggle */}
              <ToggleButtonGroup
                value={viewMode}
                exclusive
                onChange={(_, newMode) => newMode && setViewMode(newMode)}
                size="small"
              >
                <ToggleButton value="grid">
                  <Tooltip title="Dạng lưới">
                    <ViewModule />
                  </Tooltip>
                </ToggleButton>
                <ToggleButton value="table">
                  <Tooltip title="Dạng bảng">
                    <ViewList />
                  </Tooltip>
                </ToggleButton>
              </ToggleButtonGroup>

              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={handleAdd}
              >
                Thêm Sản phẩm
              </Button>
            </Box>
          </Box>

          {/* Filters */}
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid size={{ xs: 12, md: 3 }}>
              <TextField
                fullWidth
                label="Tìm kiếm"
                placeholder="Tìm theo tên sản phẩm..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={handleSearch} type="button">
                        <Search />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 3 }}>
              <FormControl fullWidth>
                <InputLabel>Bộ sưu tập</InputLabel>
                <Select
                  value={collectionFilter}
                  label="Bộ sưu tập"
                  onChange={(e) => {
                    setCollectionFilter(e.target.value);
                    filterByCollection(e.target.value || undefined);
                  }}
                >
                  <MenuItem value="">Tất cả</MenuItem>
                  {collectionsData?.map((collection) => (
                    <MenuItem key={collection.id} value={collection.id}>
                      {collection.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid size={{ xs: 12, md: 3 }}>
              <FormControl fullWidth>
                <InputLabel>Trạng thái</InputLabel>
                <Select
                  value={statusFilter}
                  label="Trạng thái"
                  onChange={(e) => {
                    setStatusFilter(e.target.value);
                    filterByStatus(e.target.value || undefined);
                  }}
                >
                  <MenuItem value="">Tất cả</MenuItem>
                  {PRODUCT_CONSTANTS.STATUS_OPTIONS.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid size={{ xs: 12, md: 3 }}>
              <Box
                sx={{
                  display: "flex",
                  gap: 1,
                  height: "100%",
                  alignItems: "center",
                }}
              >
                <Tooltip title="Xóa bộ lọc">
                  <IconButton onClick={handleClearFilters}>
                    <Clear />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Làm mới">
                  <IconButton onClick={() => window.location.reload()}>
                    <Refresh />
                  </IconButton>
                </Tooltip>
              </Box>
            </Grid>
          </Grid>

          {/* Content */}
          {isLoading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
              <CircularProgress />
            </Box>
          ) : viewMode === "grid" ? (
            // Grid View
            <Grid container spacing={3}>
              {!productData?.data.length ? (
                <Grid size={{ xs: 12 }}>
                  <Box sx={{ textAlign: "center", py: 4 }}>
                    <Typography color="text.secondary">
                      Không có sản phẩm nào
                    </Typography>
                  </Box>
                </Grid>
              ) : (
                productData.data.map((product) => (
                  <Grid key={product.id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                    <ProductCard
                      product={product}
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
                    <TableCell>Tên sản phẩm</TableCell>
                    <TableCell>Bộ sưu tập</TableCell>
                    <TableCell>Số biến thể</TableCell>
                    <TableCell>Trạng thái</TableCell>
                    <TableCell>Ngày tạo</TableCell>
                    <TableCell align="center">Thao tác</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {!productData?.data.length ? (
                    <TableRow>
                      <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                        <Typography color="text.secondary">
                          Không có sản phẩm nào
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    productData.data.map((product) => {
                      const statusInfo = getStatusInfo(
                        product.status as ProductStatus
                      );
                      return (
                        <TableRow key={product.id} hover>
                          <TableCell>
                            <Typography variant="subtitle2">
                              {product.name}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {product.collection.name}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {product.productVariants.length}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={statusInfo.label}
                              color={statusInfo.color}
                              size="small"
                            />
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {format(
                                new Date(product.createdAt),
                                "dd/MM/yyyy HH:mm",
                                { locale: vi }
                              )}
                            </Typography>
                          </TableCell>
                          <TableCell align="center">
                            <IconButton
                              onClick={() => handleEdit(product)}
                              color="primary"
                              size="small"
                            >
                              <Edit />
                            </IconButton>
                            <IconButton
                              onClick={() => handleDelete(product)}
                              color="error"
                              size="small"
                            >
                              <Delete />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}

          {/* Pagination */}
          {productData && (
            <TablePagination
              rowsPerPageOptions={
                PRODUCT_CONSTANTS.PAGINATION.PAGE_SIZE_OPTIONS
              }
              component="div"
              count={productData.meta.total}
              rowsPerPage={params.limit || 10}
              page={(params.page || 1) - 1}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              labelRowsPerPage="Số hàng mỗi trang:"
              labelDisplayedRows={({ from, to, count }) =>
                `${from}-${to} của ${count !== -1 ? count : `hơn ${to}`}`
              }
            />
          )}
        </CardContent>
      </Card>

      {/* Form Dialog */}
      <Dialog
        open={openForm}
        onClose={() => setOpenForm(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {selectedProduct ? "Chỉnh sửa Sản phẩm" : "Thêm Sản phẩm Mới"}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 1 }}>
            <ProductForm
              product={selectedProduct || undefined}
              onSuccess={handleFormSuccess}
              onCancel={() => setOpenForm(false)}
            />
          </Box>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
      >
        <DialogTitle>Xác nhận xóa</DialogTitle>
        <DialogContent>
          <Typography>
            Bạn có chắc chắn muốn xóa sản phẩm{" "}
            <strong>{selectedProduct?.name}</strong>?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>Hủy</Button>
          <Button
            onClick={handleConfirmDelete}
            color="error"
            variant="contained"
            disabled={deleting}
          >
            {deleting ? "Đang xóa..." : "Xóa"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export { ProductList };
