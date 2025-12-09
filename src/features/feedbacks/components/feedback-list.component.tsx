import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  CircularProgress,
  Alert,
  Rating,
  Grid,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import {
  Edit,
  Delete,
  Add,
  Search,
  Refresh,
  FilterList,
  Visibility,
} from "@mui/icons-material";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { useFeedbackList } from "../hooks/use-feedback-list.hooks";
import { useSearchForm } from "../hooks/use-search-form.hooks";
import FormInput from "../../../components/form-input.components";
import FeedbackForm from "./feedback-form.component";
import type { Feedback } from "../types/feedback.types";

const FeedbackList: React.FC = () => {
  const [openForm, setOpenForm] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(
    null
  );

  const {
    data: feedbackData,
    isLoading,
    error,
    params,
    updateParams,
    deleteFeedback,
    deleting,
  } = useFeedbackList();

  const searchForm = useSearchForm(params.search || "");
  const [ratingFilter, setRatingFilter] = useState<number | "">(
    params.rating || ""
  );

  const handleSearch = () => {
    updateParams({ search: searchForm.searchValue || undefined, page: 1 });
  };

  const handleClearFilters = () => {
    searchForm.clearSearch();
    setRatingFilter("");
    updateParams({
      search: undefined,
      rating: undefined,
      sortBy: "createdAt",
      sortOrder: "desc",
      page: 1,
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

  const handleEdit = (feedback: Feedback) => {
    setSelectedFeedback(feedback);
    setOpenForm(true);
  };

  const handleView = (feedback: Feedback) => {
    setSelectedFeedback(feedback);
    setOpenViewDialog(true);
  };

  const handleDelete = (feedback: Feedback) => {
    setSelectedFeedback(feedback);
    setOpenDeleteDialog(true);
  };

  const handleConfirmDelete = async () => {
    if (selectedFeedback) {
      await deleteFeedback(selectedFeedback.id);
      setOpenDeleteDialog(false);
      setSelectedFeedback(null);
    }
  };

  const handleFormSuccess = () => {
    setOpenForm(false);
    setSelectedFeedback(null);
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
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 3,
            }}
          >
            <Typography variant="h5" component="h1">
              Quản lý Feedbacks
            </Typography>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => {
                setSelectedFeedback(null);
                setOpenForm(true);
              }}
            >
              Thêm Feedback
            </Button>
          </Box>

          {/* Filters */}
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid size={{ xs: 12, md: 4 }}>
              <Box
                component="form"
                onSubmit={searchForm.onSubmit(handleSearch)}
              >
                <FormInput
                  name="search"
                  control={searchForm.control}
                  label="Tìm kiếm"
                  placeholder="Tìm theo tên khách hàng hoặc nội dung..."
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleSearch();
                    }
                  }}
                  InputProps={{
                    endAdornment: (
                      <IconButton onClick={handleSearch} type="button">
                        <Search />
                      </IconButton>
                    ),
                  }}
                />
              </Box>
            </Grid>
            <Grid size={{ xs: 12, md: 2 }}>
              <FormControl fullWidth>
                <InputLabel>Đánh giá</InputLabel>
                <Select
                  value={ratingFilter}
                  label="Đánh giá"
                  onChange={(e) => {
                    const value = e.target.value as number | "";
                    setRatingFilter(value);
                    updateParams({ rating: value || undefined });
                  }}
                >
                  <MenuItem value="">Tất cả</MenuItem>
                  <MenuItem value={5}>5 sao</MenuItem>
                  <MenuItem value={4}>4 sao</MenuItem>
                  <MenuItem value={3}>3 sao</MenuItem>
                  <MenuItem value={2}>2 sao</MenuItem>
                  <MenuItem value={1}>1 sao</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, md: 2 }}>
              <FormControl fullWidth>
                <InputLabel>Sắp xếp theo</InputLabel>
                <Select
                  value={params.sortBy}
                  label="Sắp xếp theo"
                  onChange={(e) =>
                    updateParams({ sortBy: e.target.value as any })
                  }
                >
                  <MenuItem value="createdAt">Ngày tạo</MenuItem>
                  <MenuItem value="rating">Đánh giá</MenuItem>
                  <MenuItem value="customerName">Tên khách hàng</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, md: 2 }}>
              <FormControl fullWidth>
                <InputLabel>Thứ tự</InputLabel>
                <Select
                  value={params.sortOrder}
                  label="Thứ tự"
                  onChange={(e) =>
                    updateParams({
                      sortOrder: e.target.value as "asc" | "desc",
                    })
                  }
                >
                  <MenuItem value="desc">Giảm dần</MenuItem>
                  <MenuItem value="asc">Tăng dần</MenuItem>
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

          {/* Table */}
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Hình ảnh</TableCell>
                  <TableCell>Khách hàng</TableCell>
                  <TableCell>Nội dung</TableCell>
                  <TableCell>Đánh giá</TableCell>
                  <TableCell>Ngày tạo</TableCell>
                  <TableCell align="center">Thao tác</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                      <CircularProgress />
                    </TableCell>
                  </TableRow>
                ) : feedbackData?.data.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                      <Typography color="text.secondary">
                        Không có feedback nào
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  feedbackData?.data.map((feedback) => (
                    <TableRow key={feedback.id} hover>
                      <TableCell>
                        <Avatar
                          src={feedback.imageUrl}
                          variant="rounded"
                          sx={{ width: 60, height: 60 }}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="subtitle2">
                          {feedback.customerName}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography
                          variant="body2"
                          sx={{
                            maxWidth: 300,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                          }}
                        >
                          {feedback.content}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          <Rating
                            value={feedback.rating}
                            readOnly
                            size="small"
                          />
                          <Chip
                            label={`${feedback.rating}/5`}
                            size="small"
                            color={
                              feedback.rating >= 4
                                ? "success"
                                : feedback.rating >= 3
                                ? "warning"
                                : "error"
                            }
                          />
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {format(
                            new Date(feedback.createdAt),
                            "dd/MM/yyyy HH:mm",
                            {
                              locale: vi,
                            }
                          )}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <IconButton
                          onClick={() => handleView(feedback)}
                          color="info"
                          size="small"
                        >
                          <Visibility />
                        </IconButton>
                        <IconButton
                          onClick={() => handleEdit(feedback)}
                          color="primary"
                          size="small"
                        >
                          <Edit />
                        </IconButton>
                        <IconButton
                          onClick={() => handleDelete(feedback)}
                          color="error"
                          size="small"
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

          {/* Pagination */}
          {feedbackData && (
            <TablePagination
              rowsPerPageOptions={[5, 10, 25, 50]}
              component="div"
              count={feedbackData.total}
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
          {selectedFeedback ? "Chỉnh sửa Feedback" : "Thêm Feedback Mới"}
        </DialogTitle>
        <DialogContent dividers>
          <Box sx={{ mt: 1 }}>
            <FeedbackForm
              feedback={selectedFeedback || undefined}
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
            Bạn có chắc chắn muốn xóa feedback của khách hàng{" "}
            <strong>{selectedFeedback?.customerName}</strong>?
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

      {/* View Feedback Dialog */}
      <Dialog
        open={openViewDialog}
        onClose={() => setOpenViewDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Tin nhắn Feedback</DialogTitle>
        <DialogContent>
          {selectedFeedback && (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Avatar
                  src={selectedFeedback.imageUrl}
                  sx={{ width: 56, height: 56 }}
                />
                <Box sx={{ flex: 1 }}>
                  <Typography variant="subtitle1">
                    {selectedFeedback.customerName}
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Rating value={selectedFeedback.rating} readOnly size="small" />
                    <Chip
                      label={`${selectedFeedback.rating}/5`}
                      size="small"
                      color={
                        selectedFeedback.rating >= 4
                          ? "success"
                          : selectedFeedback.rating >= 3
                          ? "warning"
                          : "error"
                      }
                    />
                  </Box>
                  <Typography variant="caption" color="text.secondary">
                    {format(new Date(selectedFeedback.createdAt), "dd/MM/yyyy HH:mm", { locale: vi })}
                  </Typography>
                </Box>
              </Box>
              {selectedFeedback.imageUrl && (
                <Box sx={{ borderRadius: 2, overflow: "hidden" }}>
                  <img
                    src={selectedFeedback.imageUrl}
                    alt={selectedFeedback.customerName}
                    loading="lazy"
                    decoding="async"
                    style={{ width: "100%", height: "auto" }}
                  />
                </Box>
              )}
              <Box sx={{ px: 0.5 }}>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  Nội dung
                </Typography>
                <Typography sx={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
                  {selectedFeedback.content}
                </Typography>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenViewDialog(false)}>Đóng</Button>
          {selectedFeedback && (
            <Button
              onClick={() => {
                setOpenViewDialog(false);
                setOpenForm(true);
              }}
              variant="contained"
            >
              Chỉnh sửa
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default FeedbackList;
