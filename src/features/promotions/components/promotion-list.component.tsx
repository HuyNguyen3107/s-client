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
  Schedule,
} from "@mui/icons-material";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { usePromotionList } from "../hooks/use-promotion-list.hooks";
import { PromotionCard } from "./promotion-card.component";
import { PromotionForm } from "./promotion-form.component";
import { useToastStore } from "../../../store/toast.store";
import type { Promotion } from "../types/promotion.types";

interface PromotionListProps {
  viewMode?: "grid" | "table";
}

const PromotionList: React.FC<PromotionListProps> = ({ viewMode = "grid" }) => {
  const [openForm, setOpenForm] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedPromotion, setSelectedPromotion] = useState<Promotion | null>(
    null
  );
  const [searchValue, setSearchValue] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");

  const { showToast } = useToastStore();

  const {
    data: promotionData,
    isLoading,
    error,
    params,
    updateParams,
    deletePromotion,
    deleting,
  } = usePromotionList();

  const handleSearch = () => {
    // For now, we'll handle search client-side since the API doesn't support search
    // In a real implementation, you would pass search params to the API
  };

  const handleClearFilters = () => {
    setSearchValue("");
    setStatusFilter("");
    updateParams({
      page: 1,
      isActive: undefined,
    });
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
    setSelectedPromotion(null);
    setOpenForm(true);
  };

  const handleEdit = (promotion: Promotion) => {
    setSelectedPromotion(promotion);
    setOpenForm(true);
  };

  const handleDelete = (promotion: Promotion) => {
    setSelectedPromotion(promotion);
    setOpenDeleteDialog(true);
  };

  const handleConfirmDelete = async () => {
    if (selectedPromotion) {
      await deletePromotion(selectedPromotion.id);
      setOpenDeleteDialog(false);
      setSelectedPromotion(null);
    }
  };

  const handleFormSuccess = () => {
    setOpenForm(false);
    setSelectedPromotion(null);
  };

  const handleCopyCode = (promoCode: string) => {
    navigator.clipboard.writeText(promoCode);
    showToast("Đã sao chép mã giảm giá!", "success");
  };

  const getPromotionStatus = (promotion: Promotion) => {
    const now = new Date();
    const startDate = new Date(promotion.startDate);
    const endDate = promotion.endDate ? new Date(promotion.endDate) : null;

    if (!promotion.isActive) {
      return {
        status: "inactive",
        label: "Tạm dừng",
        color: "warning" as const,
      };
    }

    if (startDate > now) {
      return {
        status: "upcoming",
        label: "Sắp diễn ra",
        color: "info" as const,
      };
    }

    if (endDate && endDate < now) {
      return {
        status: "expired",
        label: "Đã hết hạn",
        color: "error" as const,
      };
    }

    return {
      status: "active",
      label: "Đang hoạt động",
      color: "success" as const,
    };
  };

  const filteredPromotions =
    promotionData?.data.filter((promotion) => {
      const searchMatch =
        !searchValue ||
        promotion.title.toLowerCase().includes(searchValue.toLowerCase()) ||
        promotion.promoCode.toLowerCase().includes(searchValue.toLowerCase()) ||
        promotion.description.toLowerCase().includes(searchValue.toLowerCase());

      const statusMatch =
        !statusFilter || getPromotionStatus(promotion).status === statusFilter;

      return searchMatch && statusMatch;
    }) || [];

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
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 3,
            }}
          >
            <Typography variant="h5" component="h1">
              Quản lý Mã Giảm Giá
            </Typography>
            <Button variant="contained" startIcon={<Add />} onClick={handleAdd}>
              Thêm Mã Giảm Giá
            </Button>
          </Box>

          {/* Filters */}
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                label="Tìm kiếm"
                placeholder="Tìm theo tên, mã hoặc mô tả..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
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
                <InputLabel>Trạng thái</InputLabel>
                <Select
                  value={statusFilter}
                  label="Trạng thái"
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <MenuItem value="">Tất cả</MenuItem>
                  <MenuItem value="active">Đang hoạt động</MenuItem>
                  <MenuItem value="inactive">Tạm dừng</MenuItem>
                  <MenuItem value="expired">Đã hết hạn</MenuItem>
                  <MenuItem value="upcoming">Sắp diễn ra</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, md: 3 }}>
              <FormControl fullWidth>
                <InputLabel>Trạng thái kích hoạt</InputLabel>
                <Select
                  value={
                    params.isActive === undefined
                      ? ""
                      : params.isActive.toString()
                  }
                  label="Trạng thái kích hoạt"
                  onChange={(e) => {
                    const value = e.target.value;
                    updateParams({
                      isActive: value === "" ? undefined : value === "true",
                      page: 1,
                    });
                  }}
                >
                  <MenuItem value="">Tất cả</MenuItem>
                  <MenuItem value="true">Đã kích hoạt</MenuItem>
                  <MenuItem value="false">Chưa kích hoạt</MenuItem>
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
                <IconButton onClick={handleClearFilters} title="Xóa bộ lọc">
                  <FilterList />
                </IconButton>
                <IconButton
                  onClick={() => window.location.reload()}
                  title="Làm mới"
                >
                  <Refresh />
                </IconButton>
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
              {filteredPromotions.length === 0 ? (
                <Grid size={{ xs: 12 }}>
                  <Box sx={{ textAlign: "center", py: 4 }}>
                    <Typography color="text.secondary">
                      Không có mã giảm giá nào
                    </Typography>
                  </Box>
                </Grid>
              ) : (
                filteredPromotions.map((promotion) => (
                  <Grid
                    key={promotion.id}
                    size={{ xs: 12, sm: 6, md: 4, lg: 3 }}
                  >
                    <PromotionCard
                      promotion={promotion}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                      onCopyCode={handleCopyCode}
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
                    <TableCell>Tiêu đề</TableCell>
                    <TableCell>Mã giảm giá</TableCell>
                    <TableCell>Loại</TableCell>
                    <TableCell>Giá trị</TableCell>
                    <TableCell>Trạng thái</TableCell>
                    <TableCell>Ngày tạo</TableCell>
                    <TableCell align="center">Thao tác</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredPromotions.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                        <Typography color="text.secondary">
                          Không có mã giảm giá nào
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredPromotions.map((promotion) => {
                      const statusInfo = getPromotionStatus(promotion);
                      return (
                        <TableRow key={promotion.id} hover>
                          <TableCell>
                            <Typography variant="subtitle2">
                              {promotion.title}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {promotion.description.substring(0, 50)}...
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography
                              variant="body2"
                              sx={{
                                fontFamily: '"UTM-Avo", Arial, sans-serif',
                                fontWeight: "bold",
                                color: "primary.main",
                              }}
                            >
                              {promotion.promoCode}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            {promotion.type === "PERCENTAGE"
                              ? "Phần trăm"
                              : "Số tiền cố định"}
                          </TableCell>
                          <TableCell>
                            {promotion.type === "PERCENTAGE"
                              ? `${promotion.value}%`
                              : `${promotion.value.toLocaleString(
                                  "vi-VN"
                                )} VND`}
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={statusInfo.label}
                              color={statusInfo.color}
                              size="small"
                              icon={
                                statusInfo.status === "active" ? (
                                  <CheckCircle />
                                ) : statusInfo.status === "expired" ? (
                                  <Cancel />
                                ) : statusInfo.status === "upcoming" ? (
                                  <Schedule />
                                ) : (
                                  <Cancel />
                                )
                              }
                            />
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {format(
                                new Date(promotion.createdAt),
                                "dd/MM/yyyy HH:mm",
                                { locale: vi }
                              )}
                            </Typography>
                          </TableCell>
                          <TableCell align="center">
                            <IconButton
                              onClick={() => handleEdit(promotion)}
                              color="primary"
                              size="small"
                            >
                              <Edit />
                            </IconButton>
                            <IconButton
                              onClick={() => handleDelete(promotion)}
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
          {promotionData && (
            <TablePagination
              rowsPerPageOptions={[5, 10, 25, 50]}
              component="div"
              count={promotionData.pagination.total}
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
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>
          {selectedPromotion ? "Chỉnh sửa Mã Giảm Giá" : "Thêm Mã Giảm Giá Mới"}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 1 }}>
            <PromotionForm
              promotion={selectedPromotion || undefined}
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
            Bạn có chắc chắn muốn xóa mã giảm giá{" "}
            <strong>{selectedPromotion?.promoCode}</strong>?
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

export { PromotionList };
