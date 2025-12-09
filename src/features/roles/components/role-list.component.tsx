import React, { useState, useMemo } from "react";
import {
  Box,
  Paper,
  Typography,
  Button,
  TextField,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Pagination,
  Skeleton,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tooltip,
} from "@mui/material";
import {
  Search,
  Add,
  MoreVert,
  Edit,
  Delete,
  Security,
  People,
  FilterList,
} from "@mui/icons-material";
import { useRoles } from "../queries";
import {
  useCreateRoleMutation,
  useCreateRoleWithPermissionsMutation,
  useUpdateRoleMutation,
  useUpdateRoleWithPermissionsMutation,
  useDeleteRoleMutation,
} from "../mutations";
import type {
  RoleWithRelations,
  RoleQueryParams,
  RoleFormData,
} from "../types";
import { RoleForm } from "./role-form.component";

/**
 * Role List Component - following Single Responsibility Principle
 * Responsible only for displaying and managing the list of roles
 */
export const RoleList: React.FC = () => {
  // State
  const [queryParams, setQueryParams] = useState<RoleQueryParams>({
    page: 1,
    limit: 10,
    search: "",
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  const [selectedRole, setSelectedRole] = useState<RoleWithRelations | null>(
    null
  );
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<RoleWithRelations | null>(
    null
  );
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Queries
  const {
    data: rolesData,
    isLoading,
    error,
    isRefetching,
  } = useRoles(queryParams, {
    refetchOnMount: "always", // Always refetch when component mounts
  });

  // Mutations
  const createRoleMutation = useCreateRoleMutation({
    onSuccess: () => {
      setIsFormOpen(false);
      setEditingRole(null);
    },
  });

  const createRoleWithPermissionsMutation =
    useCreateRoleWithPermissionsMutation({
      onSuccess: () => {
        setIsFormOpen(false);
        setEditingRole(null);
      },
    });

  const updateRoleMutation = useUpdateRoleMutation({
    onSuccess: () => {
      setIsFormOpen(false);
      setEditingRole(null);
    },
  });

  const updateRoleWithPermissionsMutation =
    useUpdateRoleWithPermissionsMutation({
      onSuccess: () => {
        setIsFormOpen(false);
        setEditingRole(null);
      },
    });

  const deleteRoleMutation = useDeleteRoleMutation({
    onSuccess: () => {
      setIsDeleteDialogOpen(false);
      setSelectedRole(null);
    },
  });

  // Memoized values
  const filteredRoles = useMemo(() => {
    return rolesData?.data || [];
  }, [rolesData?.data]);

  // Event handlers
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQueryParams((prev) => ({
      ...prev,
      search: event.target.value,
      page: 1, // Reset to first page when searching
    }));
  };

  const handlePageChange = (_: React.ChangeEvent<unknown>, page: number) => {
    setQueryParams((prev) => ({ ...prev, page }));
  };

  const handleMenuOpen = (
    event: React.MouseEvent<HTMLElement>,
    role: RoleWithRelations
  ) => {
    setAnchorEl(event.currentTarget);
    setSelectedRole(role);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedRole(null);
  };

  const handleCreateRole = () => {
    setEditingRole(null);
    setIsFormOpen(true);
  };

  const handleEditRole = () => {
    setEditingRole(selectedRole);
    setIsFormOpen(true);
    handleMenuClose();
  };

  const handleDeleteRole = () => {
    setIsDeleteDialogOpen(true);
    handleMenuClose();
  };

  const handleFormSubmit = (data: RoleFormData) => {
    if (editingRole) {
      // Update role with permissions
      if (data.permissionIds !== undefined) {
        updateRoleWithPermissionsMutation.mutate({
          id: editingRole.id,
          roleData: { name: data.name },
          permissionIds: data.permissionIds,
        });
      } else {
        updateRoleMutation.mutate({
          id: editingRole.id,
          data: { name: data.name },
        });
      }
    } else {
      // Create new role with permissions if provided
      if (data.permissionIds && data.permissionIds.length > 0) {
        createRoleWithPermissionsMutation.mutate({
          roleData: { name: data.name },
          permissionIds: data.permissionIds,
        });
      } else {
        createRoleMutation.mutate({ name: data.name });
      }
    }
  };

  const handleConfirmDelete = () => {
    if (selectedRole) {
      deleteRoleMutation.mutate(selectedRole.id);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 3 }}>
        Có lỗi xảy ra khi tải danh sách vai trò: {error.message}
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
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Typography variant="h6">Danh sách Vai trò</Typography>
          {isRefetching && (
            <Chip
              label="Đang cập nhật..."
              size="small"
              color="primary"
              sx={{
                "@keyframes pulse": {
                  "0%, 100%": { opacity: 1 },
                  "50%": { opacity: 0.5 },
                },
                animation: "pulse 1s ease-in-out infinite",
              }}
            />
          )}
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleCreateRole}
          sx={{ borderRadius: 2 }}
        >
          Tạo vai trò mới
        </Button>
      </Box>

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
          <TextField
            placeholder="Tìm kiếm vai trò..."
            value={queryParams.search}
            onChange={handleSearchChange}
            size="small"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
            sx={{ flex: 1, maxWidth: 300 }}
          />
          <Button
            variant="outlined"
            startIcon={<FilterList />}
            size="small"
            sx={{ borderRadius: 2 }}
          >
            Bộ lọc
          </Button>
        </Box>
      </Paper>

      {/* Table */}
      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Tên vai trò</TableCell>
                <TableCell>Người dùng</TableCell>
                <TableCell>Quyền hạn</TableCell>
                <TableCell>Ngày tạo</TableCell>
                <TableCell align="center">Hành động</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading ? (
                // Loading skeleton
                Array.from(new Array(5)).map((_, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Skeleton variant="text" width={120} />
                    </TableCell>
                    <TableCell>
                      <Skeleton variant="rectangular" width={60} height={24} />
                    </TableCell>
                    <TableCell>
                      <Skeleton variant="rectangular" width={60} height={24} />
                    </TableCell>
                    <TableCell>
                      <Skeleton variant="text" width={100} />
                    </TableCell>
                    <TableCell align="center">
                      <Skeleton variant="circular" width={24} height={24} />
                    </TableCell>
                  </TableRow>
                ))
              ) : filteredRoles.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                    <Typography variant="body2" color="text.secondary">
                      {queryParams.search
                        ? "Không tìm thấy vai trò nào"
                        : "Chưa có vai trò nào"}
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredRoles.map((role) => {
                  const isSystemRole = role.isDeletable === false;
                  return (
                    <TableRow key={role.id} hover>
                      <TableCell>
                        <Box>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                            }}
                          >
                            <Typography variant="body2" fontWeight={500}>
                              {role.name}
                            </Typography>
                            {isSystemRole && (
                              <Chip
                                label="Hệ thống"
                                size="small"
                                color="warning"
                                sx={{ height: 20, fontSize: "0.7rem" }}
                              />
                            )}
                          </Box>
                          <Typography variant="caption" color="text.secondary">
                            ID: {role.id.slice(0, 8)}...
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={role.userCount}
                          size="small"
                          color={role.userCount > 0 ? "primary" : "default"}
                          icon={<People />}
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={role.permissionCount}
                          size="small"
                          color={
                            role.permissionCount > 0 ? "success" : "default"
                          }
                          icon={<Security />}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {formatDate(role.createdAt)}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Tooltip
                          title={
                            isSystemRole
                              ? "Không thể thao tác với vai trò hệ thống"
                              : "Thêm tùy chọn"
                          }
                        >
                          <span>
                            <IconButton
                              size="small"
                              onClick={(e) => handleMenuOpen(e, role)}
                              disabled={isSystemRole}
                            >
                              <MoreVert />
                            </IconButton>
                          </span>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Pagination */}
        {rolesData && rolesData.meta.totalPages > 1 && (
          <Box sx={{ p: 2, display: "flex", justifyContent: "center" }}>
            <Pagination
              count={rolesData.meta.totalPages}
              page={rolesData.meta.page}
              onChange={handlePageChange}
              color="primary"
              showFirstButton
              showLastButton
            />
          </Box>
        )}
      </Paper>

      {/* Action Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        {selectedRole?.isDeletable === false
          ? [
              <MenuItem key="edit" disabled>
                <Edit sx={{ mr: 2 }} />
                Chỉnh sửa
              </MenuItem>,
              <MenuItem key="delete" disabled sx={{ color: "error.main" }}>
                <Delete sx={{ mr: 2 }} />
                Xóa vai trò
              </MenuItem>,
              <Box key="info" sx={{ px: 2, py: 1 }}>
                <Typography variant="caption" color="text.secondary">
                  Vai trò hệ thống không thể chỉnh sửa
                </Typography>
              </Box>,
            ]
          : [
              <MenuItem key="edit" onClick={handleEditRole}>
                <Edit sx={{ mr: 2 }} />
                Chỉnh sửa
              </MenuItem>,
              <MenuItem
                key="delete"
                onClick={handleDeleteRole}
                sx={{ color: "error.main" }}
              >
                <Delete sx={{ mr: 2 }} />
                Xóa vai trò
              </MenuItem>,
            ]}
      </Menu>

      {/* Role Form Dialog */}
      <RoleForm
        open={isFormOpen}
        role={editingRole}
        onClose={() => {
          setIsFormOpen(false);
          setEditingRole(null);
        }}
        onSubmit={handleFormSubmit}
        isSubmitting={
          editingRole
            ? updateRoleMutation.isPending ||
              updateRoleWithPermissionsMutation.isPending
            : createRoleMutation.isPending ||
              createRoleWithPermissionsMutation.isPending
        }
      />

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Xác nhận xóa vai trò</DialogTitle>
        <DialogContent>
          <Typography>
            Bạn có chắc chắn muốn xóa vai trò "
            <strong>{selectedRole?.name}</strong>"?
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Hành động này không thể hoàn tác.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsDeleteDialogOpen(false)}>Hủy</Button>
          <Button
            onClick={handleConfirmDelete}
            color="error"
            variant="contained"
            disabled={deleteRoleMutation.isPending}
          >
            {deleteRoleMutation.isPending ? "Đang xóa..." : "Xóa"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
