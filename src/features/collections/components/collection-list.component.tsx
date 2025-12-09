import React, { useState, useEffect, useCallback } from "react";
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
  Fab,
  Tooltip,
} from "@mui/material";
import {
  Add,
  Search,
  Refresh,
  FilterList,
  Edit,
  Delete,
  CheckCircle,
  Cancel,
  ViewModule,
  ViewList,
  Star,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import { useCollectionList } from "../hooks/use-collection-list.hooks";
import { CollectionCard } from "./collection-card.component";
import { CollectionForm } from "./collection-form.component";
import type { Collection } from "../types/collection.types";
import { COLLECTION_CONSTANTS } from "../constants/collection.constants";

// Collection List Component - Open/Closed Principle (OCP)
const CollectionList: React.FC = () => {
  const [openForm, setOpenForm] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedCollection, setSelectedCollection] =
    useState<Collection | null>(null);
  const [searchValue, setSearchValue] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [hotFilter, setHotFilter] = useState<string>("");

  const {
    collections,
    pagination,
    isLoading,
    error,
    viewMode,
    params,
    updateParams,
    changeViewMode,
    goToPage,
    changePageSize,
    applyFilters,
    clearFilters,
    deleteCollection,
    toggleCollectionStatus,
    isOperating,
  } = useCollectionList();

  // Debounce search to avoid too many API calls
  const [debouncedSearchValue, setDebouncedSearchValue] = useState(searchValue);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchValue(searchValue);
    }, COLLECTION_CONSTANTS.DEBOUNCE_DELAY);

    return () => clearTimeout(timer);
  }, [searchValue]);

  // Auto apply search when debounced value changes
  useEffect(() => {
    if (debouncedSearchValue !== (params.search || "")) {
      applyFilters({ search: debouncedSearchValue || undefined });
    }
  }, [debouncedSearchValue, params.search, applyFilters]);

  // Sync local state with params (except search which is handled by debounce)
  useEffect(() => {
    setStatusFilter(
      params.isActive !== undefined ? String(params.isActive) : ""
    );
    setHotFilter(params.isHot !== undefined ? String(params.isHot) : "");
  }, [params.isActive, params.isHot]);

  // Sync search value when params change externally (like from clearFilters)
  useEffect(() => {
    if (params.search !== searchValue) {
      setSearchValue(params.search || "");
    }
  }, [params.search]); // Don't include searchValue to avoid infinite loop

  // Event Handlers - Strategy Pattern
  const handleSearch = useCallback(() => {
    applyFilters({ search: searchValue || undefined });
  }, [searchValue, applyFilters]);

  const handleClearFilters = useCallback(() => {
    clearFilters();
    // Local state will be synced via useEffect above
  }, [clearFilters]);

  const handleChangePage = (_: unknown, newPage: number) => {
    goToPage(newPage + 1);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    changePageSize(parseInt(event.target.value, 10));
  };

  const handleAdd = () => {
    setSelectedCollection(null);
    setOpenForm(true);
  };

  const handleEdit = (collection: Collection) => {
    setSelectedCollection(collection);
    setOpenForm(true);
  };

  const handleDelete = (collection: Collection) => {
    setSelectedCollection(collection);
    setOpenDeleteDialog(true);
  };

  const handleToggleStatus = async (collection: Collection) => {
    await toggleCollectionStatus(collection.id);
  };

  const handleView = (_collection: Collection) => {
    // Navigate to collection detail page
  };

  const handleConfirmDelete = async () => {
    if (selectedCollection) {
      await deleteCollection(selectedCollection.id);
      setOpenDeleteDialog(false);
      setSelectedCollection(null);
    }
  };

  const handleFormSuccess = () => {
    setOpenForm(false);
    setSelectedCollection(null);
  };

  // Handle filter changes with debounce for status and hot filters
  const handleStatusFilterChange = useCallback(
    (value: string) => {
      setStatusFilter(value);
      const filters: any = {};
      if (value !== "") filters.isActive = value === "true";
      if (hotFilter !== "") filters.isHot = hotFilter === "true";
      applyFilters(filters);
    },
    [hotFilter, applyFilters]
  );

  const handleHotFilterChange = useCallback(
    (value: string) => {
      setHotFilter(value);
      const filters: any = {};
      if (statusFilter !== "") filters.isActive = statusFilter === "true";
      if (value !== "") filters.isHot = value === "true";
      applyFilters(filters);
    },
    [statusFilter, applyFilters]
  );

  // Auto search on Enter key
  const handleSearchKeyPress = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === "Enter") {
        handleSearch();
      }
    },
    [handleSearch]
  );

  if (error) {
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        Có lỗi xảy ra khi tải dữ liệu: {error?.message || "Lỗi không xác định"}
      </Alert>
    );
  }

  return (
    <Box>
      <Card>
        <CardContent>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 3,
            }}
          >
            <Typography variant="h5" component="h1">
              Quản lý Bộ Sưu Tập
            </Typography>

            <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
              {/* View Mode Toggle */}
              <Box sx={{ display: "flex", gap: 1 }}>
                <Tooltip title="Dạng lưới">
                  <IconButton
                    onClick={() =>
                      changeViewMode(COLLECTION_CONSTANTS.VIEW_MODES.GRID)
                    }
                    color={
                      viewMode === COLLECTION_CONSTANTS.VIEW_MODES.GRID
                        ? "primary"
                        : "default"
                    }
                  >
                    <ViewModule />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Dạng bảng">
                  <IconButton
                    onClick={() =>
                      changeViewMode(COLLECTION_CONSTANTS.VIEW_MODES.TABLE)
                    }
                    color={
                      viewMode === COLLECTION_CONSTANTS.VIEW_MODES.TABLE
                        ? "primary"
                        : "default"
                    }
                  >
                    <ViewList />
                  </IconButton>
                </Tooltip>
              </Box>

              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={handleAdd}
              >
                Thêm Bộ Sưu Tập
              </Button>
            </Box>
          </Box>

          {/* Filters */}
          <Box>
            {/* Active Filters Indicator */}
            {(params.search ||
              params.isActive !== undefined ||
              params.isHot !== undefined) && (
              <Box
                sx={{
                  display: "flex",
                  gap: 1,
                  alignItems: "center",
                  mb: 2,
                  flexWrap: "wrap",
                }}
              >
                <Typography variant="body2" color="text.secondary">
                  Bộ lọc đang áp dụng:
                </Typography>
                {params.search && (
                  <Chip
                    label={`Tìm kiếm: "${params.search}"`}
                    size="small"
                    onDelete={() => applyFilters({ search: undefined })}
                  />
                )}
                {params.isActive !== undefined && (
                  <Chip
                    label={`Trạng thái: ${
                      params.isActive ? "Hoạt động" : "Tạm dừng"
                    }`}
                    size="small"
                    onDelete={() => applyFilters({ isActive: undefined })}
                  />
                )}
                {params.isHot !== undefined && (
                  <Chip
                    label={`Hot: ${params.isHot ? "Có" : "Không"}`}
                    size="small"
                    onDelete={() => applyFilters({ isHot: undefined })}
                  />
                )}
              </Box>
            )}

            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid size={{ xs: 12, md: 3 }}>
                <TextField
                  fullWidth
                  label="Tìm kiếm"
                  placeholder="Tìm theo tên, slug..."
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  onKeyPress={handleSearchKeyPress}
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

              <Grid size={{ xs: 12, md: 1.5 }}>
                <FormControl fullWidth>
                  <InputLabel>Trạng thái</InputLabel>
                  <Select
                    value={statusFilter}
                    label="Trạng thái"
                    onChange={(e) => handleStatusFilterChange(e.target.value)}
                  >
                    <MenuItem value="">Tất cả</MenuItem>
                    <MenuItem value="true">Hoạt động</MenuItem>
                    <MenuItem value="false">Tạm dừng</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid size={{ xs: 12, md: 1.5 }}>
                <FormControl fullWidth>
                  <InputLabel>Hot Collection</InputLabel>
                  <Select
                    value={hotFilter}
                    label="Hot Collection"
                    onChange={(e) => handleHotFilterChange(e.target.value)}
                  >
                    <MenuItem value="">Tất cả</MenuItem>
                    <MenuItem value="true">Hot</MenuItem>
                    <MenuItem value="false">Thường</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid size={{ xs: 12, md: 1.5 }}>
                <FormControl fullWidth>
                  <InputLabel>Sắp xếp</InputLabel>
                  <Select
                    value={params.sortBy || "createdAt"}
                    label="Sắp xếp"
                    onChange={(e) =>
                      updateParams({ sortBy: e.target.value as any, page: 1 })
                    }
                  >
                    {COLLECTION_CONSTANTS.SORT_OPTIONS.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid size={{ xs: 12, md: 1.5 }}>
                <FormControl fullWidth>
                  <InputLabel>Thứ tự</InputLabel>
                  <Select
                    value={params.sortOrder || "desc"}
                    label="Thứ tự"
                    onChange={(e) =>
                      updateParams({
                        sortOrder: e.target.value as any,
                        page: 1,
                      })
                    }
                  >
                    {COLLECTION_CONSTANTS.SORT_ORDER_OPTIONS.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid size={{ xs: 12, md: 2 }}>
                <Box
                  sx={{
                    display: "flex",
                    gap: 1,
                    height: "100%",
                    alignItems: "center",
                  }}
                >
                  <Tooltip title="Xóa bộ lọc">
                    <IconButton
                      onClick={handleClearFilters}
                      color={
                        params.search ||
                        params.isActive !== undefined ||
                        params.isHot !== undefined
                          ? "primary"
                          : "default"
                      }
                    >
                      <FilterList />
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
          </Box>

          {/* Content */}
          {isLoading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
              <CircularProgress />
            </Box>
          ) : viewMode === COLLECTION_CONSTANTS.VIEW_MODES.GRID ? (
            // Grid View
            <Grid container spacing={3}>
              {collections.length === 0 ? (
                <Grid size={{ xs: 12 }}>
                  <Box sx={{ textAlign: "center", py: 4 }}>
                    <Typography color="text.secondary">
                      Không có bộ sưu tập nào
                    </Typography>
                  </Box>
                </Grid>
              ) : (
                collections.map((collection) => (
                  <Grid
                    key={collection.id}
                    size={{ xs: 12, sm: 6, md: 4, lg: 3 }}
                  >
                    <CollectionCard
                      collection={collection}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                      onToggleStatus={handleToggleStatus}
                      onView={handleView}
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
                    <TableCell>Tên bộ sưu tập</TableCell>
                    <TableCell>Slug</TableCell>
                    <TableCell>Trạng thái</TableCell>
                    <TableCell>Hot</TableCell>
                    <TableCell>Sản phẩm</TableCell>
                    <TableCell>Thứ tự</TableCell>
                    <TableCell align="center">Thao tác</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {collections.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                        <Typography color="text.secondary">
                          Không có bộ sưu tập nào
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    collections.map((collection) => (
                      <TableRow key={collection.id} hover>
                        <TableCell>
                          <Typography variant="subtitle2">
                            {collection.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {collection.slug}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography
                            variant="body2"
                            sx={{
                              fontFamily: '"UTM-Avo", Arial, sans-serif',
                              color: "primary.main",
                            }}
                          >
                            {collection.slug}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={
                              collection.isActive ? "Hoạt động" : "Tạm dừng"
                            }
                            color={collection.isActive ? "success" : "default"}
                            size="small"
                            icon={
                              collection.isActive ? <CheckCircle /> : <Cancel />
                            }
                          />
                        </TableCell>
                        <TableCell>
                          {collection.isHot && (
                            <Chip
                              label="Hot"
                              color="warning"
                              size="small"
                              icon={<Star />}
                            />
                          )}
                        </TableCell>
                        <TableCell>{collection.productCount || 0}</TableCell>
                        <TableCell>{collection.sortOrder}</TableCell>
                        <TableCell align="center">
                          <IconButton
                            onClick={() => handleEdit(collection)}
                            color="primary"
                            size="small"
                          >
                            <Edit />
                          </IconButton>
                          <IconButton
                            onClick={() => handleToggleStatus(collection)}
                            color={collection.isActive ? "warning" : "success"}
                            size="small"
                            disabled={isOperating}
                          >
                            {collection.isActive ? (
                              <VisibilityOff />
                            ) : (
                              <Visibility />
                            )}
                          </IconButton>
                          <IconButton
                            onClick={() => handleDelete(collection)}
                            color="error"
                            size="small"
                            disabled={isOperating}
                          >
                            <Delete />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}

          {/* Pagination */}
          {pagination && (
            <TablePagination
              rowsPerPageOptions={
                COLLECTION_CONSTANTS.PAGINATION.PAGE_SIZE_OPTIONS
              }
              component="div"
              count={pagination.total}
              rowsPerPage={
                params.limit ||
                COLLECTION_CONSTANTS.PAGINATION.DEFAULT_PAGE_SIZE
              }
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
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>
          {selectedCollection ? "Chỉnh sửa Bộ Sưu Tập" : "Thêm Bộ Sưu Tập Mới"}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 1 }}>
            <CollectionForm
              collection={selectedCollection || undefined}
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
            Bạn có chắc chắn muốn xóa bộ sưu tập{" "}
            <strong>{selectedCollection?.name}</strong>?
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Hành động này không thể hoàn tác.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>Hủy</Button>
          <Button
            onClick={handleConfirmDelete}
            color="error"
            variant="contained"
            disabled={isOperating}
          >
            {isOperating ? "Đang xóa..." : "Xóa"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Floating Action Button for Quick Add (Mobile) */}
      <Fab
        color="primary"
        aria-label="add"
        onClick={handleAdd}
        sx={{
          position: "fixed",
          bottom: 16,
          right: 16,
          display: { xs: "flex", md: "none" },
        }}
      >
        <Add />
      </Fab>
    </Box>
  );
};

export { CollectionList };
