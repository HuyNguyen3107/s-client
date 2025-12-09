import React, { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
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
  Tooltip,
  Typography,
  Alert,
  CircularProgress,
} from "@mui/material";
import {
  Add,
  MoreVert,
  Edit,
  Delete,
  ViewModule,
  ViewList,
  Settings as SettingsIcon,
} from "@mui/icons-material";
import { useInformations } from "../queries/information.queries";
import { useDeleteInformationMutation } from "../mutations/information.mutations";
import { InformationForm } from "./information-form.component";
import { DeleteConfirmDialog } from "./delete-confirm-dialog.component";
import { INFORMATION_CONSTANTS } from "../constants/information.constants";
import type {
  Information,
  InformationViewMode,
} from "../types/information.types";

export const InformationList: React.FC = () => {
  // State management
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(
    INFORMATION_CONSTANTS.PAGINATION.DEFAULT_PAGE_SIZE
  );
  const [viewMode, setViewMode] = useState<InformationViewMode>("grid");
  const [selectedInformation, setSelectedInformation] =
    useState<Information | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [menuInformationId, setMenuInformationId] = useState<string | null>(
    null
  );
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [informationToDelete, setInformationToDelete] =
    useState<Information | null>(null);

  // Hooks
  const { data, isLoading, error, refetch } = useInformations({
    page: page + 1,
    limit: rowsPerPage,
  });

  const deleteMutation = useDeleteInformationMutation();

  const informations = data?.data || [];
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

  const handleMenuOpen = (
    event: React.MouseEvent<HTMLElement>,
    informationId: string
  ) => {
    setAnchorEl(event.currentTarget);
    setMenuInformationId(informationId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setMenuInformationId(null);
  };

  const handleEdit = (information: Information) => {
    setSelectedInformation(information);
    setFormOpen(true);
    handleMenuClose();
  };

  const handleDelete = (informationId: string) => {
    const information = informations.find((i) => i.id === informationId);
    if (information) {
      setInformationToDelete(information);
      setDeleteDialogOpen(true);
    }
    handleMenuClose();
  };

  const handleDeleteConfirm = async () => {
    if (!informationToDelete) return;

    try {
      await deleteMutation.mutateAsync(informationToDelete.id);
      refetch();
      setDeleteDialogOpen(false);
      setInformationToDelete(null);
    } catch (error) {
      console.error("Error deleting information:", error);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setInformationToDelete(null);
  };

  const handleFormClose = () => {
    setFormOpen(false);
    setSelectedInformation(null);
  };

  const handleFormSuccess = () => {
    refetch();
  };

  // Render methods
  const renderGridView = () => (
    <Grid container spacing={3}>
      {informations.map((information) => (
        <Grid size={{ xs: 12, sm: 6, md: 4 }} key={information.id}>
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
            <Box
              sx={{
                p: 2,
                bgcolor: "primary.main",
                color: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <SettingsIcon />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Cấu hình #{information.id.substring(0, 8)}
                </Typography>
              </Box>
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  handleMenuOpen(e, information.id);
                }}
                sx={{ color: "white" }}
              >
                <MoreVert fontSize="small" />
              </IconButton>
            </Box>

            <CardContent sx={{ flexGrow: 1, p: 3 }}>
              <Box sx={{ mb: 2 }}>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 1, fontWeight: 500 }}
                >
                  Tên cấu hình:
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                  {(information.config as any)?.name || "(Chưa đặt tên)"}
                </Typography>

                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 1, fontWeight: 500 }}
                >
                  Số trường:
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 600 }}>
                  {(information.config as any)?.fields?.length || 0} trường
                </Typography>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mt: "auto",
                }}
              >
                <Chip
                  label={new Date(information.createdAt).toLocaleDateString(
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
            <TableCell sx={{ fontWeight: 600, py: 2 }}>ID</TableCell>
            <TableCell sx={{ fontWeight: 600, py: 2 }}>
              Tên & Số trường
            </TableCell>
            <TableCell sx={{ fontWeight: 600, py: 2 }}>Ngày tạo</TableCell>
            <TableCell sx={{ fontWeight: 600, py: 2 }}>
              Cập nhật lần cuối
            </TableCell>
            <TableCell align="center" sx={{ fontWeight: 600, py: 2 }}>
              Hành động
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {informations.map((information) => (
            <TableRow
              key={information.id}
              hover
              sx={{
                "&:hover": {
                  bgcolor: "grey.50",
                },
                transition: "all 0.2s ease",
                cursor: "pointer",
              }}
            >
              <TableCell sx={{ py: 2 }}>
                <Typography
                  variant="body2"
                  fontWeight="600"
                  sx={{ fontFamily: '"Courier New", monospace' }}
                >
                  {information.id.substring(0, 8)}...
                </Typography>
              </TableCell>
              <TableCell sx={{ py: 2 }}>
                <Box>
                  <Typography variant="body2" fontWeight="600" sx={{ mb: 0.5 }}>
                    {(information.config as any)?.name || "(Chưa đặt tên)"}
                  </Typography>
                  <Chip
                    label={`${
                      (information.config as any)?.fields?.length || 0
                    } trường`}
                    size="small"
                    color="primary"
                    variant="outlined"
                    sx={{
                      fontWeight: 500,
                      bgcolor: "primary.50",
                    }}
                  />
                </Box>
              </TableCell>
              <TableCell sx={{ py: 2 }}>
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  {new Date(information.createdAt).toLocaleDateString("vi-VN")}
                </Typography>
              </TableCell>
              <TableCell sx={{ py: 2 }}>
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  {new Date(information.updatedAt).toLocaleDateString("vi-VN")}
                </Typography>
              </TableCell>
              <TableCell align="center">
                <IconButton
                  size="small"
                  onClick={(e) => handleMenuOpen(e, information.id)}
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
            Danh sách Thông tin
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Quản lý cấu hình thông tin hệ thống
          </Typography>
        </Box>
        <Box
          sx={{
            display: "flex",
            gap: 2,
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
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
            Thêm Thông tin
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
          {informations.length === 0 ? (
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
              <SettingsIcon
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
                Chưa có thông tin cấu hình nào
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  mb: 3,
                  color: "text.secondary",
                  maxWidth: 400,
                }}
              >
                Hãy thêm cấu hình thông tin đầu tiên
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
                Thêm Thông tin Đầu Tiên
              </Button>
            </Box>
          ) : viewMode === "grid" ? (
            renderGridView()
          ) : (
            renderTableView()
          )}

          {/* Pagination */}
          {informations.length > 0 && (
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
                  INFORMATION_CONSTANTS.PAGINATION.PAGE_SIZE_OPTIONS
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
            const information = informations.find(
              (i) => i.id === menuInformationId
            );
            if (information) handleEdit(information);
          }}
        >
          <Edit fontSize="small" sx={{ mr: 1 }} />
          Chỉnh sửa
        </MenuItem>
        <MenuItem
          onClick={() => {
            if (menuInformationId) handleDelete(menuInformationId);
          }}
          sx={{ color: "error.main" }}
        >
          <Delete fontSize="small" sx={{ mr: 1 }} />
          Xóa
        </MenuItem>
      </Menu>

      {/* Form Dialog */}
      <InformationForm
        open={formOpen}
        onClose={handleFormClose}
        information={selectedInformation}
        onSuccess={handleFormSuccess}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Xác nhận xóa Thông tin"
        message="Bạn có chắc chắn muốn xóa thông tin cấu hình này? Hành động này không thể hoàn tác."
        itemName={`Thông tin #${informationToDelete?.id.substring(0, 8)}`}
        isDeleting={deleteMutation.isPending}
      />
    </Box>
  );
};
