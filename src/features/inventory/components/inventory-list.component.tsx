import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
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
  Typography,
  Checkbox,
  Toolbar,
  alpha,
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
  GetApp,
  Upload,
} from "@mui/icons-material";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { useInventoryList } from "../hooks";
import InventoryCard from "./inventory-card.component";
import InventoryForm from "./inventory-form.component";
import StockAdjustmentDialog from "./stock-adjustment-dialog.component";
import { StockLevelUtils, StatusUtils, FormatUtils } from "../utils";
import { INVENTORY_CONSTANTS } from "../constants";
import type { InventoryWithRelations, InventoryStatus } from "../types";

// Props interface
interface InventoryListProps {
  initialViewMode?: "grid" | "table";
  showActions?: boolean;
}

// Enhanced Toolbar Component
interface EnhancedToolbarProps {
  numSelected: number;
  onDeleteSelected: () => void;
  onExport?: () => void;
  onImport?: () => void;
}

const EnhancedToolbar: React.FC<EnhancedToolbarProps> = ({
  numSelected,
  onDeleteSelected,
  onExport,
  onImport,
}) => {
  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        ...(numSelected > 0 && {
          bgcolor: (theme) =>
            alpha(
              theme.palette.primary.main,
              theme.palette.action.activatedOpacity
            ),
        }),
      }}
    >
      {numSelected > 0 ? (
        <Typography
          sx={{ flex: "1 1 100%" }}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          Đã chọn {numSelected} mục
        </Typography>
      ) : (
        <Typography
          sx={{ flex: "1 1 100%" }}
          variant="h6"
          id="tableTitle"
          component="div"
        >
          Danh sách Inventory
        </Typography>
      )}

      {numSelected > 0 ? (
        <Tooltip title="Xóa các mục đã chọn">
          <IconButton onClick={onDeleteSelected} color="error">
            <Delete />
          </IconButton>
        </Tooltip>
      ) : (
        <Box display="flex" gap={1}>
          {onExport && (
            <Tooltip title="Xuất dữ liệu">
              <IconButton onClick={onExport}>
                <GetApp />
              </IconButton>
            </Tooltip>
          )}
          {onImport && (
            <Tooltip title="Nhập dữ liệu">
              <IconButton onClick={onImport}>
                <Upload />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      )}
    </Toolbar>
  );
};

const InventoryList: React.FC<InventoryListProps> = ({
  initialViewMode = "table",
  showActions = true,
}) => {
  const [openForm, setOpenForm] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openStockDialog, setOpenStockDialog] = useState(false);
  const [selectedInventory, setSelectedInventory] =
    useState<InventoryWithRelations | null>(null);
  const [stockOperation, setStockOperation] = useState<
    "adjust" | "reserve" | "release"
  >("adjust");
  const [searchValue, setSearchValue] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [viewMode, setViewMode] = useState<"grid" | "table">(initialViewMode);

  const {
    data: inventoryData,
    isLoading,
    error,
    params,
    uiState,
    updateUIState,
    search,
    filterByStatus,
    changePage,
    changeLimit,
    deleteInventory,
    deleteSelectedInventory,
    adjustStock,
    reserveStock,
    releaseReservedStock,
    toggleSelectInventory,
    selectAllInventory,
    deselectAllInventory,
    deleting,
    adjustingStock,
    reservingStock,
    releasingStock,
    refetch,
  } = useInventoryList();

  // Handle search
  const handleSearch = () => {
    search(searchValue);
  };

  const handleClearSearch = () => {
    setSearchValue("");
    search("");
  };

  // Handle filter
  const handleStatusFilter = (status: string) => {
    setStatusFilter(status);
    filterByStatus(status as InventoryStatus);
  };

  const handleClearFilters = () => {
    setStatusFilter("");
    filterByStatus();
  };

  // Handle view mode change
  const handleViewModeChange = (
    _: React.MouseEvent<HTMLElement>,
    newMode: "grid" | "table"
  ) => {
    if (newMode !== null) {
      setViewMode(newMode);
      updateUIState({ viewMode: newMode });
    }
  };

  // Handle inventory operations
  const handleEditInventory = (inventory: InventoryWithRelations) => {
    setSelectedInventory(inventory);
    setOpenForm(true);
  };

  const handleDeleteInventory = (id: string) => {
    const inventory = inventoryData?.data.find((item) => item.id === id);
    setSelectedInventory(inventory || null);
    setOpenDeleteDialog(true);
  };

  const handleStockOperation = (
    inventory: InventoryWithRelations,
    operation: "adjust" | "reserve" | "release"
  ) => {
    setSelectedInventory(inventory);
    setStockOperation(operation);
    setOpenStockDialog(true);
  };

  const confirmDelete = async () => {
    if (selectedInventory) {
      await deleteInventory(selectedInventory.id);
      setOpenDeleteDialog(false);
      setSelectedInventory(null);
    }
  };

  const confirmDeleteSelected = async () => {
    await deleteSelectedInventory();
    setOpenDeleteDialog(false);
  };

  // Handle bulk selection
  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      selectAllInventory();
    } else {
      deselectAllInventory();
    }
  };

  const isSelected = (id: string) => uiState.selectedInventory.includes(id);
  const isIndeterminate =
    uiState.selectedInventory.length > 0 &&
    uiState.selectedInventory.length < (inventoryData?.data.length || 0);
  const isAllSelected =
    uiState.selectedInventory.length === (inventoryData?.data.length || 0) &&
    (inventoryData?.data.length || 0) > 0;

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" py={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert
        severity="error"
        action={
          <Button onClick={() => refetch()} size="small">
            Thử lại
          </Button>
        }
      >
        Không thể tải danh sách inventory. Vui lòng thử lại sau.
      </Alert>
    );
  }

  return (
    <Box>
      {/* Toolbar */}
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            {/* Search */}
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                size="small"
                placeholder="Tìm kiếm inventory..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                  endAdornment: searchValue && (
                    <InputAdornment position="end">
                      <IconButton size="small" onClick={handleClearSearch}>
                        <Clear />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            {/* Status Filter */}
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <FormControl fullWidth size="small">
                <InputLabel>Trạng thái</InputLabel>
                <Select
                  value={statusFilter}
                  onChange={(e) => handleStatusFilter(e.target.value)}
                  label="Trạng thái"
                >
                  <MenuItem value="">Tất cả</MenuItem>
                  {INVENTORY_CONSTANTS.STATUS_OPTIONS.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      <Chip
                        label={option.label}
                        size="small"
                        color={option.color as any}
                        variant="outlined"
                      />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Actions */}
            <Grid size={{ xs: 12, sm: 6, md: 5 }}>
              <Box
                display="flex"
                gap={1}
                justifyContent="flex-end"
                flexWrap="wrap"
              >
                {/* Clear Filters */}
                {(searchValue || statusFilter) && (
                  <Button
                    size="small"
                    onClick={handleClearFilters}
                    startIcon={<Clear />}
                  >
                    Xóa bộ lọc
                  </Button>
                )}

                {/* Refresh */}
                <IconButton onClick={() => refetch()} size="small">
                  <Refresh />
                </IconButton>

                {/* View Mode Toggle */}
                <ToggleButtonGroup
                  value={viewMode}
                  exclusive
                  onChange={handleViewModeChange}
                  size="small"
                >
                  <ToggleButton value="grid" aria-label="grid view">
                    <ViewModule />
                  </ToggleButton>
                  <ToggleButton value="table" aria-label="table view">
                    <ViewList />
                  </ToggleButton>
                </ToggleButtonGroup>

                {/* Add New */}
                {showActions && (
                  <Button
                    variant="contained"
                    size="small"
                    onClick={() => {
                      setSelectedInventory(null);
                      setOpenForm(true);
                    }}
                    startIcon={<Add />}
                  >
                    Thêm mới
                  </Button>
                )}
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Enhanced Toolbar for bulk actions */}
      {viewMode === "table" && (
        <Paper sx={{ mb: 2 }}>
          <EnhancedToolbar
            numSelected={uiState.selectedInventory.length}
            onDeleteSelected={() => setOpenDeleteDialog(true)}
          />
        </Paper>
      )}

      {/* Content */}
      {viewMode === "grid" ? (
        // Grid View
        <Grid container spacing={2}>
          {inventoryData?.data.map((inventory) => (
            <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={inventory.id}>
              <InventoryCard
                inventory={inventory}
                onEdit={handleEditInventory}
                onDelete={handleDeleteInventory}
                onAdjustStock={(_id) =>
                  handleStockOperation(inventory, "adjust")
                }
                onReserveStock={(_id) =>
                  handleStockOperation(inventory, "reserve")
                }
                onReleaseStock={(_id) =>
                  handleStockOperation(inventory, "release")
                }
                selected={isSelected(inventory.id)}
                onSelect={toggleSelectInventory}
                loading={
                  deleting || adjustingStock || reservingStock || releasingStock
                }
              />
            </Grid>
          ))}
        </Grid>
      ) : (
        // Table View
        <Card>
          <TableContainer>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell padding="checkbox">
                    <Checkbox
                      color="primary"
                      indeterminate={isIndeterminate}
                      checked={isAllSelected}
                      onChange={handleSelectAllClick}
                      inputProps={{
                        "aria-label": "select all inventory items",
                      }}
                    />
                  </TableCell>
                  <TableCell>Sản phẩm</TableCell>
                  <TableCell align="right">Tồn kho hiện tại</TableCell>
                  <TableCell align="right">Đã đặt chỗ</TableCell>
                  <TableCell align="right">Có sẵn</TableCell>
                  <TableCell align="right">Ngưỡng cảnh báo</TableCell>
                  <TableCell>Mức độ</TableCell>
                  <TableCell>Trạng thái</TableCell>
                  <TableCell>Cập nhật</TableCell>
                  <TableCell align="center">Thao tác</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {inventoryData?.data.map((inventory) => {
                  const isItemSelected = isSelected(inventory.id);
                  const stockLevel = StockLevelUtils.getStockLevel(inventory);
                  const availableStock =
                    StockLevelUtils.getAvailableStock(inventory);

                  return (
                    <TableRow
                      key={inventory.id}
                      selected={isItemSelected}
                      hover
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          color="primary"
                          checked={isItemSelected}
                          onChange={() => toggleSelectInventory(inventory.id)}
                          inputProps={{
                            "aria-labelledby": `enhanced-table-checkbox-${inventory.id}`,
                          }}
                        />
                      </TableCell>

                      <TableCell component="th" scope="row">
                        <Box>
                          <Typography variant="body2" fontWeight="medium">
                            {inventory.productCustom?.name || "N/A"}
                          </Typography>
                          <Typography variant="caption" color="textSecondary">
                            {FormatUtils.formatCurrency(
                              inventory.productCustom?.price || 0
                            )}
                          </Typography>
                        </Box>
                      </TableCell>

                      <TableCell align="right">
                        <Typography variant="body2" fontWeight="medium">
                          {FormatUtils.formatStockNumber(
                            inventory.currentStock
                          )}
                        </Typography>
                      </TableCell>

                      <TableCell align="right">
                        <Typography variant="body2" color="info.main">
                          {FormatUtils.formatStockNumber(
                            inventory.reservedStock
                          )}
                        </Typography>
                      </TableCell>

                      <TableCell align="right">
                        <Typography
                          variant="body2"
                          color="success.main"
                          fontWeight="medium"
                        >
                          {FormatUtils.formatStockNumber(availableStock)}
                        </Typography>
                      </TableCell>

                      <TableCell align="right">
                        <Typography variant="body2">
                          {FormatUtils.formatStockNumber(
                            inventory.minStockAlert
                          )}
                        </Typography>
                      </TableCell>

                      <TableCell>
                        <Chip
                          label={stockLevel.label}
                          size="small"
                          sx={{
                            backgroundColor: stockLevel.color,
                            color: "white",
                          }}
                        />
                      </TableCell>

                      <TableCell>
                        <Chip
                          label={StatusUtils.getStatusLabel(inventory.status)}
                          size="small"
                          color={
                            StatusUtils.getStatusColor(inventory.status) as any
                          }
                          variant="outlined"
                        />
                      </TableCell>

                      <TableCell>
                        <Typography variant="caption">
                          {format(new Date(inventory.updatedAt), "dd/MM/yyyy", {
                            locale: vi,
                          })}
                        </Typography>
                      </TableCell>

                      <TableCell align="center">
                        <Box display="flex" gap={0.5} justifyContent="center">
                          <Tooltip title="Chỉnh sửa">
                            <IconButton
                              size="small"
                              onClick={() => handleEditInventory(inventory)}
                            >
                              <Edit fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Xóa">
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() =>
                                handleDeleteInventory(inventory.id)
                              }
                            >
                              <Delete fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    </TableRow>
                  );
                })}

                {inventoryData?.data.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={10} align="center" sx={{ py: 4 }}>
                      <Typography color="textSecondary">
                        Không tìm thấy inventory nào
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Pagination */}
          <TablePagination
            rowsPerPageOptions={
              INVENTORY_CONSTANTS.PAGINATION.PAGE_SIZE_OPTIONS
            }
            component="div"
            count={inventoryData?.pagination.total || 0}
            rowsPerPage={
              params.limit || INVENTORY_CONSTANTS.PAGINATION.DEFAULT_PAGE_SIZE
            }
            page={(params.page || 1) - 1}
            onPageChange={(_, newPage) => changePage(newPage + 1)}
            onRowsPerPageChange={(e) =>
              changeLimit(parseInt(e.target.value, 10))
            }
            labelRowsPerPage="Số dòng mỗi trang:"
            labelDisplayedRows={({ from, to, count }) =>
              `${from}-${to} của ${count !== -1 ? count : `hơn ${to}`}`
            }
          />
        </Card>
      )}

      {/* Empty State */}
      {inventoryData?.data.length === 0 && (
        <Card sx={{ textAlign: "center", py: 6 }}>
          <CardContent>
            <Typography variant="h6" color="textSecondary" gutterBottom>
              Chưa có inventory nào
            </Typography>
            <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
              Bắt đầu bằng cách thêm inventory đầu tiên
            </Typography>
            {showActions && (
              <Button
                variant="contained"
                onClick={() => {
                  setSelectedInventory(null);
                  setOpenForm(true);
                }}
                startIcon={<Add />}
              >
                Thêm Inventory
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Dialogs */}
      <InventoryForm
        open={openForm}
        onClose={() => {
          setOpenForm(false);
          setSelectedInventory(null);
        }}
        inventory={selectedInventory}
      />

      <StockAdjustmentDialog
        open={openStockDialog}
        onClose={() => {
          setOpenStockDialog(false);
          setSelectedInventory(null);
        }}
        inventory={selectedInventory}
        operation={stockOperation}
        onConfirm={async (quantity: number, reason?: string) => {
          if (!selectedInventory) return;

          if (stockOperation === "adjust") {
            await adjustStock(selectedInventory.id, quantity, reason);
          } else if (stockOperation === "reserve") {
            await reserveStock(selectedInventory.id, quantity, reason);
          } else if (stockOperation === "release") {
            await releaseReservedStock(selectedInventory.id, quantity);
          }

          setOpenStockDialog(false);
          setSelectedInventory(null);
        }}
      />

      {/* Delete Confirmation */}
      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
      >
        <DialogTitle>Xác nhận xóa</DialogTitle>
        <DialogContent>
          <Typography>
            {uiState.selectedInventory.length > 0
              ? `Bạn có chắc chắn muốn xóa ${uiState.selectedInventory.length} inventory đã chọn?`
              : selectedInventory
              ? `Bạn có chắc chắn muốn xóa inventory "${selectedInventory.productCustom?.name}"?`
              : "Bạn có chắc chắn muốn xóa inventory này?"}
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
            Hành động này không thể hoàn tác.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>Hủy</Button>
          <Button
            onClick={
              uiState.selectedInventory.length > 0
                ? confirmDeleteSelected
                : confirmDelete
            }
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

export default InventoryList;
