import React, { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Grid,
  IconButton,
  Menu,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Tooltip,
  Typography,
  InputAdornment,
  Alert,
  CircularProgress,
} from "@mui/material";
import {
  Add,
  Search,
  MoreVert,
  Edit,
  Delete,
  ViewModule,
  ViewList,
  Image as ImageIcon,
} from "@mui/icons-material";
import { useBackgrounds } from "../queries/background.queries";
import { useDeleteBackgroundMutation } from "../mutations/background.mutations";
import { BackgroundForm } from "./background-form.component";
import { DeleteConfirmDialog } from "./delete-confirm-dialog.component";
import { BACKGROUND_CONSTANTS } from "../constants/background.constants";
import type { Background, BackgroundViewMode } from "../types/background.types";

/**
 * Background List Component - Single Responsibility Principle (SRP)
 * Responsible only for displaying and managing the list of backgrounds
 */

interface BackgroundListProps {
  products?: any[];
}

export const BackgroundList: React.FC<BackgroundListProps> = ({
  products = [],
}) => {
  // State management
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(
    BACKGROUND_CONSTANTS.PAGINATION.DEFAULT_PAGE_SIZE
  );
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<BackgroundViewMode>("grid");
  const [selectedBackground, setSelectedBackground] =
    useState<Background | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [menuBackgroundId, setMenuBackgroundId] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [backgroundToDelete, setBackgroundToDelete] =
    useState<Background | null>(null);

  // Hooks
  const { data, isLoading, error, refetch } = useBackgrounds({
    page: page + 1,
    limit: rowsPerPage,
    search: search.trim() || undefined,
  });

  const deleteMutation = useDeleteBackgroundMutation();

  const backgrounds = data?.data || [];
  const totalCount = data?.total || 0;

  // Handlers
  const handlePageChange = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
    setPage(0);
  };

  const handleMenuOpen = (
    event: React.MouseEvent<HTMLElement>,
    backgroundId: string
  ) => {
    setAnchorEl(event.currentTarget);
    setMenuBackgroundId(backgroundId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setMenuBackgroundId(null);
  };

  const handleEdit = (background: Background) => {
    setSelectedBackground(background);
    setFormOpen(true);
    handleMenuClose();
  };

  const handleDelete = (backgroundId: string) => {
    const background = backgrounds.find((b) => b.id === backgroundId);
    if (background) {
      setBackgroundToDelete(background);
      setDeleteDialogOpen(true);
    }
    handleMenuClose();
  };

  const handleDeleteConfirm = async () => {
    if (!backgroundToDelete) return;

    try {
      await deleteMutation.mutateAsync(backgroundToDelete.id);
      refetch();
      setDeleteDialogOpen(false);
      setBackgroundToDelete(null);
    } catch (error) {
      console.error("Error deleting background:", error);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setBackgroundToDelete(null);
  };

  const handleFormClose = () => {
    setFormOpen(false);
    setSelectedBackground(null);
  };

  const handleFormSuccess = () => {
    refetch();
  };

  const getProductName = (productId: string) => {
    const product = products.find((p) => p.id === productId);
    return product?.name || "N/A";
  };

  // Render methods
  const renderGridView = () => (
    <Grid container spacing={3}>
      {backgrounds.map((background) => (
        <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={background.id}>
          <Card
            sx={{
              height: "100%",
              display: "flex",
              flexDirection: "column",
              transition: "all 0.3s ease-in-out",
              borderRadius: 2,
              overflow: "hidden",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              "&:hover": {
                transform: "translateY(-4px)",
                boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
              },
            }}
          >
            <Box sx={{ position: "relative", overflow: "hidden" }}>
              <CardMedia
                component="img"
                height="220"
                image={background.imageUrl}
                alt={background.name || "Background"}
                sx={{
                  objectFit: "cover",
                  backgroundColor: "grey.100",
                  transition: "transform 0.3s ease-in-out",
                  "&:hover": {
                    transform: "scale(1.05)",
                  },
                }}
              />
              <Box
                sx={{
                  position: "absolute",
                  top: 12,
                  right: 12,
                  bgcolor: "rgba(255,255,255,0.9)",
                  borderRadius: "50%",
                  p: 0.5,
                }}
              >
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleMenuOpen(e, background.id);
                  }}
                  sx={{ p: 1 }}
                >
                  <MoreVert fontSize="small" />
                </IconButton>
              </Box>
            </Box>
            <CardContent sx={{ flexGrow: 1, p: 3 }}>
              <Box sx={{ mb: 2 }}>
                <Typography
                  variant="h6"
                  component="h3"
                  sx={{
                    fontWeight: 600,
                    fontSize: "1.1rem",
                    lineHeight: 1.3,
                    mb: 0.5,
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}
                >
                  {background.name || "Untitled Background"}
                </Typography>
                <Typography
                  variant="body2"
                  color="primary.main"
                  sx={{ fontWeight: 500, fontSize: "0.875rem" }}
                >
                  {getProductName(background.productId)}
                </Typography>
              </Box>

              {background.description && (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    mb: 2,
                    display: "-webkit-box",
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                    lineHeight: 1.5,
                  }}
                >
                  {background.description}
                </Typography>
              )}

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mt: "auto",
                }}
              >
                <Chip
                  label={new Date(background.createdAt).toLocaleDateString(
                    "vi-VN"
                  )}
                  size="small"
                  variant="outlined"
                  sx={{
                    bgcolor: "grey.50",
                    borderColor: "grey.300",
                    fontSize: "0.75rem",
                  }}
                />
                <Button
                  size="small"
                  variant="text"
                  startIcon={<ImageIcon />}
                  onClick={() => window.open(background.imageUrl, "_blank")}
                  sx={{
                    color: "primary.main",
                    fontWeight: 500,
                    fontSize: "0.8rem",
                    "&:hover": {
                      bgcolor: "primary.50",
                    },
                  }}
                >
                  Xem ảnh
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );

  const renderTableView = () => (
    <TableContainer
      component={Paper}
      sx={{
        borderRadius: 3,
        overflow: "hidden",
        boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
      }}
    >
      <Table>
        <TableHead>
          <TableRow sx={{ bgcolor: "primary.50" }}>
            <TableCell sx={{ fontWeight: 600, py: 2 }}>Hình ảnh</TableCell>
            <TableCell sx={{ fontWeight: 600, py: 2 }}>Tên</TableCell>
            <TableCell sx={{ fontWeight: 600, py: 2 }}>Sản phẩm</TableCell>
            <TableCell sx={{ fontWeight: 600, py: 2 }}>Mô tả</TableCell>
            <TableCell sx={{ fontWeight: 600, py: 2 }}>Ngày tạo</TableCell>
            <TableCell align="center" sx={{ fontWeight: 600, py: 2 }}>
              Hành động
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {backgrounds.map((background) => (
            <TableRow
              key={background.id}
              hover
              sx={{
                "&:hover": {
                  bgcolor: "grey.50",
                  transform: "scale(1.001)",
                },
                transition: "all 0.2s ease",
                cursor: "pointer",
              }}
            >
              <TableCell sx={{ py: 2 }}>
                <Box
                  component="img"
                  src={background.imageUrl}
                  alt={background.name || "Background"}
                  sx={{
                    width: 80,
                    height: 80,
                    objectFit: "cover",
                    borderRadius: 2,
                    backgroundColor: "grey.100",
                    border: "2px solid",
                    borderColor: "grey.200",
                    transition: "transform 0.2s ease",
                    "&:hover": {
                      transform: "scale(1.05)",
                    },
                  }}
                />
              </TableCell>
              <TableCell sx={{ py: 2 }}>
                <Typography
                  variant="body1"
                  fontWeight="600"
                  sx={{
                    color: "text.primary",
                    mb: 0.5,
                  }}
                >
                  {background.name || "Untitled Background"}
                </Typography>
              </TableCell>
              <TableCell sx={{ py: 2 }}>
                <Chip
                  label={getProductName(background.productId)}
                  size="small"
                  color="primary"
                  variant="outlined"
                  sx={{
                    fontWeight: 500,
                    bgcolor: "primary.50",
                  }}
                />
              </TableCell>
              <TableCell sx={{ py: 2 }}>
                <Typography
                  variant="body2"
                  sx={{
                    maxWidth: 250,
                    color: "text.secondary",
                    lineHeight: 1.4,
                  }}
                  noWrap
                >
                  {background.description || "Không có mô tả"}
                </Typography>
              </TableCell>
              <TableCell sx={{ py: 2 }}>
                <Typography
                  variant="body2"
                  sx={{
                    color: "text.secondary",
                    fontFamily: '"UTM-Avo", Arial, sans-serif',
                  }}
                >
                  {new Date(background.createdAt).toLocaleDateString("vi-VN")}
                </Typography>
              </TableCell>
              <TableCell align="center">
                <IconButton
                  size="small"
                  onClick={(e) => handleMenuOpen(e, background.id)}
                >
                  <MoreVert />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        Có lỗi xảy ra khi tải dữ liệu: {error.message}
      </Alert>
    );
  }

  return (
    <Box>
      {/* Header Actions */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: { xs: "flex-start", sm: "center" },
          mb: 4,
          flexDirection: { xs: "column", sm: "row" },
          gap: 3,
        }}
      >
        <Box>
          <Typography
            variant="h4"
            component="h2"
            sx={{
              fontWeight: 700,
              color: "#731618",
              mb: 0.5,
            }}
          >
            Danh sách Hình nền
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Quản lý hình nền cho sản phẩm
          </Typography>
        </Box>
        <Box
          sx={{
            display: "flex",
            gap: 2,
            alignItems: "center",
            flexWrap: "wrap",
            width: { xs: "100%", sm: "auto" },
          }}
        >
          {/* Search */}
          <TextField
            size="medium"
            placeholder="Tìm kiếm background..."
            value={search}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search sx={{ color: "text.secondary" }} />
                </InputAdornment>
              ),
            }}
            sx={{
              minWidth: { xs: "100%", sm: 280 },
              "& .MuiOutlinedInput-root": {
                bgcolor: "background.paper",
                borderRadius: 2,
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "primary.main",
                },
              },
            }}
          />

          {/* View Mode Toggle */}
          <Box
            sx={{
              display: "flex",
              bgcolor: "grey.100",
              borderRadius: 1.5,
              p: 0.5,
            }}
          >
            <Tooltip title="Dạng lưới">
              <IconButton
                onClick={() => setViewMode("grid")}
                sx={{
                  borderRadius: 1,
                  bgcolor: viewMode === "grid" ? "primary.main" : "transparent",
                  color: viewMode === "grid" ? "white" : "text.secondary",
                  "&:hover": {
                    bgcolor: viewMode === "grid" ? "primary.dark" : "grey.200",
                  },
                }}
              >
                <ViewModule fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Dạng bảng">
              <IconButton
                onClick={() => setViewMode("table")}
                sx={{
                  borderRadius: 1,
                  bgcolor:
                    viewMode === "table" ? "primary.main" : "transparent",
                  color: viewMode === "table" ? "white" : "text.secondary",
                  "&:hover": {
                    bgcolor: viewMode === "table" ? "primary.dark" : "grey.200",
                  },
                }}
              >
                <ViewList fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>

          {/* Add Button */}
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setFormOpen(true)}
            size="large"
            sx={{
              borderRadius: 2,
              px: 3,
              py: 1.5,
              fontWeight: 600,
              backgroundColor: "#731618",
              "&:hover": {
                backgroundColor: "#5f0d10",
                transform: "translateY(-1px)",
              },
            }}
          >
            Thêm Hình nền
          </Button>
        </Box>
      </Box>

      {/* Loading State */}
      {isLoading && (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            py: 8,
            gap: 2,
          }}
        >
          <CircularProgress size={40} thickness={4} />
          <Typography variant="body1" color="text.secondary">
            Đang tải dữ liệu...
          </Typography>
        </Box>
      )}

      {/* Content */}
      {!isLoading && (
        <>
          {backgrounds.length === 0 ? (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                py: 8,
                px: 3,
                textAlign: "center",
                bgcolor: "grey.50",
                borderRadius: 3,
                border: "2px dashed",
                borderColor: "grey.300",
              }}
            >
              <ImageIcon
                sx={{
                  fontSize: 80,
                  color: "grey.400",
                  mb: 2,
                }}
              />
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 600,
                  mb: 1,
                  color: "text.secondary",
                }}
              >
                Chưa có background nào
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  mb: 3,
                  color: "text.secondary",
                  maxWidth: 400,
                }}
              >
                {search
                  ? `Không tìm thấy hình nền nào với từ khóa "${search}"`
                  : "Hãy thêm hình nền đầu tiên cho sản phẩm của bạn"}
              </Typography>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => setFormOpen(true)}
                size="large"
                sx={{
                  borderRadius: 2,
                  px: 4,
                  py: 1.5,
                  fontWeight: 600,
                }}
              >
                Thêm Hình nền Đầu Tiên
              </Button>
            </Box>
          ) : viewMode === "grid" ? (
            renderGridView()
          ) : (
            renderTableView()
          )}

          {/* Pagination */}
          {backgrounds.length > 0 && (
            <Box
              sx={{
                mt: 4,
                display: "flex",
                justifyContent: "center",
                "& .MuiTablePagination-root": {
                  bgcolor: "white",
                  borderRadius: 2,
                  border: "1px solid",
                  borderColor: "grey.200",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                },
              }}
            >
              <TablePagination
                component="div"
                count={totalCount}
                page={page}
                onPageChange={handlePageChange}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleRowsPerPageChange}
                rowsPerPageOptions={
                  BACKGROUND_CONSTANTS.PAGINATION.PAGE_SIZE_OPTIONS
                }
                labelRowsPerPage="Số lượng mỗi trang:"
                labelDisplayedRows={({ from, to, count }) =>
                  `${from}–${to} trong ${count !== -1 ? count : `hơn ${to}`}`
                }
                sx={{
                  "& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows":
                    {
                      fontWeight: 500,
                    },
                }}
              />
            </Box>
          )}
        </>
      )}

      {/* Context Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem
          onClick={() => {
            const background = backgrounds.find(
              (b) => b.id === menuBackgroundId
            );
            if (background) handleEdit(background);
          }}
        >
          <Edit fontSize="small" sx={{ mr: 1 }} />
          Chỉnh sửa
        </MenuItem>
        <MenuItem
          onClick={() => {
            if (menuBackgroundId) handleDelete(menuBackgroundId);
          }}
          sx={{ color: "error.main" }}
        >
          <Delete fontSize="small" sx={{ mr: 1 }} />
          Xóa
        </MenuItem>
      </Menu>

      {/* Form Dialog */}
      <BackgroundForm
        open={formOpen}
        onClose={handleFormClose}
        background={selectedBackground}
        onSuccess={handleFormSuccess}
        products={products}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Xác nhận xóa Hình nền"
        message="Bạn có chắc chắn muốn xóa hình nền này? Hành động này không thể hoàn tác."
        itemName={backgroundToDelete?.name || "Untitled Background"}
        isDeleting={deleteMutation.isPending}
      />
    </Box>
  );
};
