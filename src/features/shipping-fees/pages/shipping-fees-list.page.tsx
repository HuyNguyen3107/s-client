import React, { useState, useCallback, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  Alert,
  Paper,
  Stack,
  IconButton,
  Tooltip,
  Divider,
  Breadcrumbs,
  Link,
} from "@mui/material";
import {
  Add as AddIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  Clear as ClearIcon,
  Delete as DeleteIcon,
  Refresh as RefreshIcon,
  TrendingUp as TrendingUpIcon,
  LocationOn as LocationIcon,
  LocalShipping as ShippingIcon,
  AttachMoney as MoneyIcon,
  Dashboard as DashboardIcon,
} from "@mui/icons-material";
import { Link as RouterLink } from "react-router-dom";
import { ROUTE_PATH } from "../../../constants/route-path.constants";
import {
  ShippingFeeTable,
  ShippingFeeForm,
  ShippingFeeDetailModal,
  ShippingFeeDeleteModal,
} from "../components";
import {
  useShippingFees,
  useShippingFeeAreas,
  useShippingFeeTypes,
  useShippingFeeStatistics,
} from "../queries";
import {
  useCreateShippingFee,
  useUpdateShippingFee,
  useDeleteShippingFee,
} from "../mutations";
import {
  useShippingFeeTable,
  useShippingFeeModal,
  useDebounce,
} from "../hooks";
import type {
  ShippingFee,
  CreateShippingFeeRequest,
  UpdateShippingFeeRequest,
  SortBy,
  SortOrder,
} from "../types";
import "./shipping-fees-list.page.scss";

/**
 * ShippingFeesListPage Component
 * Following Single Responsibility Principle - responsible for managing the shipping fees list page
 * Following Dependency Inversion Principle - depends on abstractions (hooks) not concrete implementations
 */
export const ShippingFeesListPage: React.FC = () => {
  // Set page title
  useEffect(() => {
    document.title = "Quản lý phí vận chuyển - Soligant";
  }, []);
  // State management using custom hooks
  const {
    filters,
    selectedRows,
    searchTerm,
    updateFilters,
    updatePagination,
    updateSort,
    updateSearch,
    resetFilters,
    clearSelection,
  } = useShippingFeeTable();

  const {
    isCreateModalOpen,
    isEditModalOpen,
    isDeleteModalOpen,
    isDetailModalOpen,
    selectedShippingFee,
    openCreateModal,
    openEditModal,
    openDeleteModal,
    closeAllModals,
  } = useShippingFeeModal();

  // Debounce search term to avoid too many API calls
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // Build query filters
  const queryFilters = {
    ...filters,
    ...(debouncedSearchTerm &&
      {
        // Add search functionality here based on API capabilities
      }),
  };

  // Data fetching hooks
  const {
    data: shippingFeesData,
    isLoading: isLoadingShippingFees,
    error: shippingFeesError,
    refetch: refetchShippingFees,
  } = useShippingFees(queryFilters);

  const { data: areas } = useShippingFeeAreas();
  const { data: shippingTypes } = useShippingFeeTypes();
  const { data: statistics } = useShippingFeeStatistics();

  // Mutation hooks
  const createMutation = useCreateShippingFee();
  const updateMutation = useUpdateShippingFee();
  const deleteMutation = useDeleteShippingFee();

  // Filter state
  const [filterArea, setFilterArea] = useState("");
  const [filterShippingType, setFilterShippingType] = useState("");

  // Event handlers
  const handleSearch = useCallback(
    (term: string) => {
      updateSearch(term);
    },
    [updateSearch]
  );

  const handleSort = useCallback(
    (sortBy: SortBy, sortOrder: SortOrder) => {
      updateSort(sortBy, sortOrder);
    },
    [updateSort]
  );

  const handlePaginationChange = useCallback(
    (page: number, pageSize: number) => {
      updatePagination(page, pageSize);
    },
    [updatePagination]
  );

  const handleFilterChange = useCallback(() => {
    updateFilters({
      area: filterArea || undefined,
      shippingType: filterShippingType || undefined,
      page: 1, // Reset to first page when filtering
    });
  }, [filterArea, filterShippingType, updateFilters]);

  const handleResetFilters = useCallback(() => {
    setFilterArea("");
    setFilterShippingType("");
    resetFilters();
  }, [resetFilters]);

  const handleCreate = useCallback(
    (data: CreateShippingFeeRequest | UpdateShippingFeeRequest) => {
      createMutation.mutate(data as CreateShippingFeeRequest, {
        onSuccess: () => {
          closeAllModals();
          refetchShippingFees();
        },
      });
    },
    [createMutation, closeAllModals, refetchShippingFees]
  );

  const handleUpdate = useCallback(
    (data: CreateShippingFeeRequest | UpdateShippingFeeRequest) => {
      if (!selectedShippingFee) return;

      updateMutation.mutate(
        {
          id: selectedShippingFee.id,
          data: data as UpdateShippingFeeRequest,
        },
        {
          onSuccess: () => {
            closeAllModals();
            refetchShippingFees();
          },
        }
      );
    },
    [selectedShippingFee, updateMutation, closeAllModals, refetchShippingFees]
  );

  const handleDelete = useCallback(
    async (shippingFee: ShippingFee) => {
      try {
        await deleteMutation.mutateAsync(shippingFee.id);
        closeAllModals();
        refetchShippingFees();
      } catch (error) {
        // Error is handled in the mutation hook
      }
    },
    [deleteMutation, closeAllModals, refetchShippingFees]
  );

  const handleBulkDelete = useCallback(async () => {
    if (selectedRows.length === 0) return;

    try {
      await Promise.all(
        selectedRows.map((id) => deleteMutation.mutateAsync(id))
      );
      clearSelection();
      refetchShippingFees();
    } catch (error) {
      // Error is handled in the mutation hook
    }
  }, [selectedRows, deleteMutation, clearSelection, refetchShippingFees]);

  const isLoading =
    isLoadingShippingFees ||
    createMutation.isPending ||
    updateMutation.isPending ||
    deleteMutation.isPending;

  return (
    <Container maxWidth="xl" className="shipping-fees-list-page">
      {/* Breadcrumbs */}
      <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
        <Link
          component={RouterLink}
          underline="hover"
          color="inherit"
          to={ROUTE_PATH.DASHBOARD}
          sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
        >
          <DashboardIcon fontSize="small" />
          Dashboard
        </Link>
        <Typography
          color="text.primary"
          sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
        >
          <ShippingIcon fontSize="small" />
          Phí vận chuyển
        </Typography>
      </Breadcrumbs>

      {/* Header Section */}
      <Paper elevation={0} className="shipping-fees-list-page__header">
        <Box className="shipping-fees-list-page__title-section">
          <Typography
            variant="h4"
            component="h1"
            className="shipping-fees-list-page__title"
            color="text.primary"
          >
            <ShippingIcon className="shipping-fees-list-page__title-icon" />
            Quản lý phí vận chuyển
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            className="shipping-fees-list-page__description"
          >
            Quản lý thông tin phí vận chuyển theo khu vực và loại dịch vụ
          </Typography>
        </Box>

        <Box className="shipping-fees-list-page__actions">
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={openCreateModal}
            className="shipping-fees-list-page__add-button"
            size="large"
          >
            Thêm phí vận chuyển
          </Button>
        </Box>
      </Paper>

      {/* Statistics Cards */}
      {statistics && (
        <Box className="shipping-fees-list-page__stats">
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "1fr 1fr",
                md: "1fr 1fr 1fr 1fr",
              },
              gap: 3,
            }}
          >
            <Card className="shipping-fees-list-page__stat-card">
              <CardContent>
                <Box className="shipping-fees-list-page__stat-content">
                  <Box className="shipping-fees-list-page__stat-icon total">
                    <TrendingUpIcon />
                  </Box>
                  <Box>
                    <Typography
                      variant="h4"
                      className="shipping-fees-list-page__stat-value"
                    >
                      {statistics.totalShippingFees}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Tổng số phí vận chuyển
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>

            <Card className="shipping-fees-list-page__stat-card">
              <CardContent>
                <Box className="shipping-fees-list-page__stat-content">
                  <Box className="shipping-fees-list-page__stat-icon areas">
                    <LocationIcon />
                  </Box>
                  <Box>
                    <Typography
                      variant="h4"
                      className="shipping-fees-list-page__stat-value"
                    >
                      {statistics.totalAreas}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Số khu vực
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>

            <Card className="shipping-fees-list-page__stat-card">
              <CardContent>
                <Box className="shipping-fees-list-page__stat-content">
                  <Box className="shipping-fees-list-page__stat-icon types">
                    <ShippingIcon />
                  </Box>
                  <Box>
                    <Typography
                      variant="h4"
                      className="shipping-fees-list-page__stat-value"
                    >
                      {statistics.totalShippingTypes}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Số loại vận chuyển
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>

            <Card className="shipping-fees-list-page__stat-card">
              <CardContent>
                <Box className="shipping-fees-list-page__stat-content">
                  <Box className="shipping-fees-list-page__stat-icon average">
                    <MoneyIcon />
                  </Box>
                  <Box>
                    <Typography
                      variant="h4"
                      className="shipping-fees-list-page__stat-value"
                    >
                      {new Intl.NumberFormat("vi-VN", {
                        notation: "compact",
                        compactDisplay: "short",
                      }).format(statistics.averageShippingFee)}
                      đ
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Phí trung bình
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Box>
        </Box>
      )}

      {/* Filters Section */}
      <Paper className="shipping-fees-list-page__filters">
        <Box className="shipping-fees-list-page__filters-header">
          <Typography variant="h6" component="h2">
            <FilterIcon className="shipping-fees-list-page__filter-icon" />
            Bộ lọc và tìm kiếm
          </Typography>
        </Box>

        <Divider />

        <Box className="shipping-fees-list-page__filters-content">
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "2fr 1fr 1fr auto" },
              gap: 3,
              alignItems: "start",
            }}
          >
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Tìm kiếm phí vận chuyển..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              InputProps={{
                startAdornment: (
                  <SearchIcon className="shipping-fees-list-page__search-icon" />
                ),
              }}
              className="shipping-fees-list-page__search-input"
            />

            <FormControl fullWidth variant="outlined">
              <InputLabel>Khu vực</InputLabel>
              <Select
                value={filterArea}
                onChange={(e) => setFilterArea(e.target.value)}
                label="Khu vực"
              >
                <MenuItem value="">Tất cả khu vực</MenuItem>
                {areas?.map((area) => (
                  <MenuItem key={area} value={area}>
                    {area}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth variant="outlined">
              <InputLabel>Loại vận chuyển</InputLabel>
              <Select
                value={filterShippingType}
                onChange={(e) => setFilterShippingType(e.target.value)}
                label="Loại vận chuyển"
              >
                <MenuItem value="">Tất cả loại vận chuyển</MenuItem>
                {shippingTypes?.map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Stack
              direction="row"
              spacing={1}
              className="shipping-fees-list-page__filter-actions"
            >
              <Button
                variant="contained"
                onClick={handleFilterChange}
                startIcon={<FilterIcon />}
                fullWidth
              >
                Lọc
              </Button>
              <Tooltip title="Đặt lại bộ lọc">
                <IconButton
                  onClick={handleResetFilters}
                  className="shipping-fees-list-page__reset-button"
                >
                  <ClearIcon />
                </IconButton>
              </Tooltip>
            </Stack>
          </Box>
        </Box>

        {/* Bulk Actions */}
        {selectedRows.length > 0 && (
          <Box className="shipping-fees-list-page__bulk-actions">
            <Chip
              label={`Đã chọn ${selectedRows.length} mục`}
              color="primary"
              variant="outlined"
              className="shipping-fees-list-page__selected-count"
            />
            <Stack direction="row" spacing={1}>
              <Button
                variant="contained"
                color="error"
                startIcon={<DeleteIcon />}
                onClick={handleBulkDelete}
                disabled={isLoading}
                size="small"
              >
                Xóa đã chọn
              </Button>
              <Button variant="outlined" onClick={clearSelection} size="small">
                Bỏ chọn
              </Button>
            </Stack>
          </Box>
        )}
      </Paper>

      {/* Error Alert */}
      {shippingFeesError && (
        <Alert
          severity="error"
          className="shipping-fees-list-page__error"
          action={
            <Button
              color="inherit"
              size="small"
              onClick={() => refetchShippingFees()}
              startIcon={<RefreshIcon />}
            >
              Thử lại
            </Button>
          }
        >
          Có lỗi xảy ra khi tải dữ liệu. Vui lòng thử lại.
        </Alert>
      )}

      {/* Table Section */}
      <Paper className="shipping-fees-list-page__content">
        <ShippingFeeTable
          data={shippingFeesData?.data || []}
          loading={isLoadingShippingFees}
          pagination={{
            current: filters.page || 1,
            pageSize: filters.limit || 10,
            total: shippingFeesData?.total || 0,
            onChange: handlePaginationChange,
          }}
          onEdit={openEditModal}
          onDelete={openDeleteModal}
          onSort={handleSort}
        />
      </Paper>

      {/* Modals */}
      {isCreateModalOpen && (
        <ShippingFeeForm
          mode="create"
          onSubmit={handleCreate}
          onCancel={closeAllModals}
          loading={createMutation.isPending}
        />
      )}

      {isEditModalOpen && selectedShippingFee && (
        <ShippingFeeForm
          mode="edit"
          initialData={selectedShippingFee}
          onSubmit={handleUpdate}
          onCancel={closeAllModals}
          loading={updateMutation.isPending}
        />
      )}

      <ShippingFeeDetailModal
        shippingFee={selectedShippingFee}
        isOpen={isDetailModalOpen}
        onClose={closeAllModals}
        onEdit={openEditModal}
        onDelete={openDeleteModal}
      />

      <ShippingFeeDeleteModal
        shippingFee={selectedShippingFee}
        isOpen={isDeleteModalOpen}
        onClose={closeAllModals}
        onConfirm={handleDelete}
        loading={deleteMutation.isPending}
      />
    </Container>
  );
};

export default ShippingFeesListPage;
