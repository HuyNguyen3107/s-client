import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Pagination,
  Skeleton,
  Alert,
  Chip,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
} from "@mui/material";
import {
  Search as SearchIcon,
  Add as AddIcon,
  Refresh as RefreshIcon,
  ViewModule as GridViewIcon,
  ViewList as ListViewIcon,
} from "@mui/icons-material";

// Types & Constants
import type {
  ProductCustom,
  ProductCustomQueryParams,
  ProductCustomStatusType,
} from "../types/product-custom.types";
import { PRODUCT_CUSTOM_CONSTANTS } from "../constants/product-custom.constants";

// Hooks
import { useProductCustomList } from "../hooks/use-product-custom-list.hooks";

// Store
import { useToastStore } from "../../../store/toast.store";

// Components
import { ProductCustomCard } from "./product-custom-card.component";
import { ProductCustomForm } from "./product-custom-form.component";

// Props interface following Interface Segregation Principle
interface ProductCustomListProps {
  onSelectItem?: (item: ProductCustom) => void;
  selectedItems?: string[];
  readonly?: boolean;
}

type ViewMode = "grid" | "list";

/**
 * ProductCustomList - Main list component for product customs management
 * Follows Single Responsibility Principle - handles listing, search, and pagination
 */
export const ProductCustomList: React.FC<ProductCustomListProps> = ({
  onSelectItem,
  readonly = false,
}) => {
  // Local state
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    ProductCustomStatusType | "all"
  >("all");
  const [sortBy, setSortBy] = useState<string>("createdAt_desc");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<ProductCustom | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<ProductCustom | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Toast hook
  const { showToast } = useToastStore();

  // Build query parameters
  const queryParams: ProductCustomQueryParams = {
    page: currentPage,
    limit: 12,
    search: searchTerm || undefined,
    status: statusFilter === "all" ? undefined : statusFilter,
    sortBy: getSortFieldFromValue(sortBy),
    sortOrder: getSortDirectionFromValue(sortBy),
  };

  // Helper functions to extract sort field and direction from value
  function getSortFieldFromValue(
    value: string
  ): "name" | "price" | "createdAt" | "updatedAt" | undefined {
    const sortOption = PRODUCT_CUSTOM_CONSTANTS.SORT_OPTIONS.find(
      (option) => option.value === value
    );
    return sortOption?.field as
      | "name"
      | "price"
      | "createdAt"
      | "updatedAt"
      | undefined;
  }

  function getSortDirectionFromValue(
    value: string
  ): "asc" | "desc" | undefined {
    const sortOption = PRODUCT_CUSTOM_CONSTANTS.SORT_OPTIONS.find(
      (option) => option.value === value
    );
    return sortOption?.direction;
  }

  // Use custom hook for list management
  const {
    data: listData,
    isLoading,
    error,
    refresh,
  } = useProductCustomList(queryParams);

  // Event handlers following Single Responsibility Principle
  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1); // Reset to first page when searching
  };

  const handleStatusFilter = (status: ProductCustomStatusType | "all") => {
    setStatusFilter(status);
    setCurrentPage(1);
  };

  const handleSortChange = (sort: string) => {
    setSortBy(sort);
    setCurrentPage(1);
  };

  const handlePageChange = (_: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
  };

  const handleCreateNew = () => {
    setEditingItem(null);
    setShowForm(true);
  };

  const handleEditItem = (item: ProductCustom) => {
    setEditingItem(item);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingItem(null);
  };

  const handleDeleteItem = (item: ProductCustom) => {
    setItemToDelete(item);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;

    setIsDeleting(true);
    try {
      const { deleteProductCustom } = await import(
        "../services/product-custom.service"
      );
      await deleteProductCustom(itemToDelete.id);
      refresh(); // Refresh the list after deletion
      setShowDeleteModal(false);
      setItemToDelete(null);
      showToast(
        `Đã xóa sản phẩm "${itemToDelete.name}" thành công!`,
        "success"
      );
    } catch (error) {
      console.error("Error deleting product custom:", error);
      showToast("Có lỗi xảy ra khi xóa sản phẩm!", "error");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setItemToDelete(null);
  };

  // Render loading skeleton
  const renderSkeleton = () => (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      {Array.from({ length: 6 }).map((_, index) => (
        <Skeleton
          key={index}
          variant="rectangular"
          height={viewMode === "grid" ? 280 : 120}
          sx={{ borderRadius: 2 }}
        />
      ))}
    </Box>
  );

  // Render empty state
  const renderEmptyState = () => (
    <Box
      sx={{
        textAlign: "center",
        py: 8,
        px: 2,
      }}
    >
      <Typography variant="h6" color="text.secondary" gutterBottom>
        {searchTerm || statusFilter !== "all"
          ? "Không tìm thấy sản phẩm tùy chỉnh nào"
          : "Chưa có sản phẩm tùy chỉnh nào"}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        {searchTerm || statusFilter !== "all"
          ? "Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm"
          : "Tạo sản phẩm tùy chỉnh đầu tiên của bạn"}
      </Typography>
      {!readonly && (
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleCreateNew}
          size="large"
        >
          Tạo sản phẩm tùy chỉnh
        </Button>
      )}
    </Box>
  );

  // Render product list in grid or list mode
  const renderProductList = () => {
    if (!listData?.data?.length) {
      return renderEmptyState();
    }

    if (viewMode === "grid") {
      return (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
              md: "repeat(3, 1fr)",
              lg: "repeat(4, 1fr)",
            },
            gap: 2,
          }}
        >
          {listData.data.map((item: ProductCustom) => (
            <ProductCustomCard
              key={item.id}
              productCustom={item as any}
              onEdit={readonly ? undefined : () => handleEditItem(item)}
              onDelete={readonly ? undefined : () => handleDeleteItem(item)}
              onView={onSelectItem ? () => onSelectItem(item) : undefined}
              showActions={!readonly}
            />
          ))}
        </Box>
      );
    }

    // List view (simplified cards in single column)
    return (
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {listData.data.map((item: ProductCustom) => (
          <ProductCustomCard
            key={item.id}
            productCustom={item as any}
            onEdit={readonly ? undefined : () => handleEditItem(item)}
            onDelete={readonly ? undefined : () => handleDeleteItem(item)}
            onView={onSelectItem ? () => onSelectItem(item) : undefined}
            showActions={!readonly}
            compact
          />
        ))}
      </Box>
    );
  };

  return (
    <Box>
      {/* Header with title and actions */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h5" component="h1">
          Quản lý sản phẩm tùy chỉnh
        </Typography>

        {!readonly && (
          <Box sx={{ display: "flex", gap: 1 }}>
            <Tooltip title="Làm mới">
              <IconButton onClick={() => refresh()}>
                <RefreshIcon />
              </IconButton>
            </Tooltip>

            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleCreateNew}
            >
              Tạo mới
            </Button>
          </Box>
        )}
      </Box>

      {/* Filters and search */}
      <Box sx={{ mb: 3 }}>
        <Box
          sx={{
            display: "flex",
            gap: 2,
            mb: 2,
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          {/* Search */}
          <TextField
            placeholder="Tìm kiếm theo tên..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{ minWidth: 250 }}
            size="small"
          />

          {/* Status Filter */}
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Trạng thái</InputLabel>
            <Select
              value={statusFilter}
              label="Trạng thái"
              onChange={(e) =>
                handleStatusFilter(
                  e.target.value as ProductCustomStatusType | "all"
                )
              }
            >
              <MenuItem value="all">Tất cả</MenuItem>
              {Object.entries(PRODUCT_CUSTOM_CONSTANTS.STATUS_LABELS).map(
                ([value, label]) => (
                  <MenuItem key={value} value={value}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Box
                        sx={{
                          width: 8,
                          height: 8,
                          borderRadius: "50%",
                          backgroundColor:
                            PRODUCT_CUSTOM_CONSTANTS.STATUS_COLORS[
                              value as keyof typeof PRODUCT_CUSTOM_CONSTANTS.STATUS_COLORS
                            ],
                        }}
                      />
                      {label}
                    </Box>
                  </MenuItem>
                )
              )}
            </Select>
          </FormControl>

          {/* Sort */}
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Sắp xếp</InputLabel>
            <Select
              value={sortBy}
              label="Sắp xếp"
              onChange={(e) => handleSortChange(e.target.value)}
            >
              {PRODUCT_CUSTOM_CONSTANTS.SORT_OPTIONS.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* View Mode Toggle */}
          <Box sx={{ display: "flex", ml: "auto" }}>
            <Tooltip title="Xem dạng lưới">
              <IconButton
                onClick={() => setViewMode("grid")}
                color={viewMode === "grid" ? "primary" : "default"}
              >
                <GridViewIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Xem dạng danh sách">
              <IconButton
                onClick={() => setViewMode("list")}
                color={viewMode === "list" ? "primary" : "default"}
              >
                <ListViewIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        {/* Active filters display */}
        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
          {statusFilter !== "all" && (
            <Chip
              label={`Trạng thái: ${PRODUCT_CUSTOM_CONSTANTS.STATUS_LABELS[statusFilter]}`}
              onDelete={() => handleStatusFilter("all")}
              size="small"
              color="primary"
              variant="outlined"
            />
          )}
          {searchTerm && (
            <Chip
              label={`Tìm kiếm: "${searchTerm}"`}
              onDelete={() => handleSearch("")}
              size="small"
              color="primary"
              variant="outlined"
            />
          )}
        </Box>
      </Box>

      {/* Error state */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error?.message ||
            "Đã xảy ra lỗi khi tải danh sách sản phẩm tùy chỉnh"}
        </Alert>
      )}

      {/* Loading state */}
      {isLoading && renderSkeleton()}

      {/* Product list */}
      {!isLoading && renderProductList()}

      {/* Pagination */}
      {listData && listData.meta && listData.meta.totalPages > 1 && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <Pagination
            count={listData.meta.totalPages}
            page={currentPage}
            onChange={handlePageChange}
            color="primary"
            size="large"
            showFirstButton
            showLastButton
          />
        </Box>
      )}

      {/* Results info */}
      {listData && (
        <Box sx={{ mt: 2, textAlign: "center" }}>
          <Typography variant="body2" color="text.secondary">
            Hiển thị {listData.data.length} trong tổng số{" "}
            {listData.meta?.total || 0} sản phẩm tùy chỉnh
            {listData.meta &&
              listData.meta.totalPages > 1 &&
              ` - Trang ${currentPage} / ${listData.meta.totalPages}`}
          </Typography>
        </Box>
      )}

      {/* Create/Edit Form Dialog */}
      <ProductCustomForm
        open={showForm}
        onClose={handleCloseForm}
        productCustom={editingItem as any}
        mode={editingItem ? "edit" : "create"}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={showDeleteModal}
        onClose={handleCancelDelete}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Xác nhận xóa sản phẩm</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Bạn có chắc chắn muốn xóa sản phẩm{" "}
            <strong>"{itemToDelete?.name}"</strong> không?
            <br />
            <br />
            Hành động này không thể hoàn tác.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button
            onClick={handleCancelDelete}
            variant="outlined"
            disabled={isDeleting}
          >
            Hủy
          </Button>
          <Button
            onClick={handleConfirmDelete}
            variant="contained"
            color="error"
            disabled={isDeleting}
            sx={{
              minWidth: 100,
            }}
          >
            {isDeleting ? "Đang xóa..." : "Xóa"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
