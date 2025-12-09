import React, { useCallback } from "react";
import {
  Box,
  Button,
  Typography,
  Alert,
  Snackbar,
  Paper,
  Breadcrumbs,
  Link,
} from "@mui/material";
import {
  Add as AddIcon,
  Refresh as RefreshIcon,
  Dashboard as DashboardIcon,
  People as PeopleIcon,
} from "@mui/icons-material";
import { Link as RouterLink } from "react-router-dom";
import { ROUTE_PATH } from "../../../constants/route-path.constants";
import {
  UserForm,
  UserTable,
  UserFiltersComponent,
  RoleAssignment,
  DeleteConfirmation,
  UserPagination,
} from "../components";
import {
  useUserList,
  useUserModal,
  useUserForm,
  useUserOperations,
} from "../hooks";
import type { UserFormData, UserWithRelations } from "../types";
import { USER_SUCCESS_MESSAGES } from "../constants";

/**
 * User List Page Component - Following Single Responsibility Principle
 * Main page for user management with CRUD operations
 */
export const UserListPage: React.FC = () => {
  const {
    users,
    meta,
    isLoading,
    isError,
    error,
    filters,
    updateSearch,
    updatePage,
    updatePageSize,
    updateStatusFilter,
    updateRoleFilter,
    clearFilters,
    refetch,
  } = useUserList();

  const { modalState, openModal, closeModal } = useUserModal();
  const { resetForm } = useUserForm(modalState.user);

  const {
    createUser,
    updateUser,
    deleteUser,
    toggleUserStatus,
    assignRoles,
    removeRoles,
    isCreating,
    isUpdating,
    isDeleting,
    isAssigningRoles,
    isRemovingRoles,
    createError,
    updateError,
    deleteError,
    toggleError,
    assignError,
    removeError,
  } = useUserOperations();

  const [successMessage, setSuccessMessage] = React.useState<string>("");
  const [operationError, setOperationError] = React.useState<Error | null>(
    null
  );

  // Handle form submission
  const handleFormSubmit = useCallback(
    async (data: UserFormData) => {
      // No need to call validateForm() here as React Hook Form already validates
      // Use data directly from form instead of getRequestData()
      try {
        const requestData = {
          name: data.name.trim(),
          email: data.email.trim(),
          phone: data.phone.trim(),
          isActive: data.isActive,
          ...(data.password && { password: data.password }), // Only include password if provided
        };

        if (modalState.mode === "create") {
          await createUser(requestData as any);
          setSuccessMessage(USER_SUCCESS_MESSAGES.USER_CREATED);
        } else if (modalState.mode === "edit" && modalState.user) {
          await updateUser(modalState.user.id, requestData as any);
          setSuccessMessage(USER_SUCCESS_MESSAGES.USER_UPDATED);
        }
        closeModal();
        resetForm();
      } catch (error) {
        setOperationError(error as Error);
      }
    },
    [
      modalState.mode,
      modalState.user,
      createUser,
      updateUser,
      closeModal,
      resetForm,
    ]
  );

  // Handle user deletion
  const handleDeleteUser = useCallback(async () => {
    if (!modalState.user) return;

    try {
      await deleteUser(modalState.user.id);
      setSuccessMessage(USER_SUCCESS_MESSAGES.USER_DELETED);
      closeModal();
    } catch (error) {
      setOperationError(error as Error);
    }
  }, [modalState.user, deleteUser, closeModal]);

  // Handle status toggle
  const handleToggleStatus = useCallback(
    async (user: UserWithRelations) => {
      try {
        await toggleUserStatus(user.id);
        setSuccessMessage(USER_SUCCESS_MESSAGES.STATUS_UPDATED);
      } catch (error) {
        setOperationError(error as Error);
      }
    },
    [toggleUserStatus]
  );

  // Handle role assignment
  const handleAssignRoles = useCallback(
    async (userId: string, roleIds: string[]) => {
      try {
        await assignRoles(userId, roleIds);
        setSuccessMessage(USER_SUCCESS_MESSAGES.ROLES_ASSIGNED);
        closeModal();
      } catch (error) {
        setOperationError(error as Error);
      }
    },
    [assignRoles, closeModal]
  );

  // Handle role removal
  const handleRemoveRoles = useCallback(
    async (userId: string, roleIds: string[]) => {
      try {
        await removeRoles(userId, roleIds);
        setSuccessMessage(USER_SUCCESS_MESSAGES.ROLES_REMOVED);
      } catch (error) {
        setOperationError(error as Error);
      }
    },
    [removeRoles]
  );

  // Modal handlers
  const handleCreateUser = useCallback(() => {
    openModal("create");
    resetForm();
  }, [openModal, resetForm]);

  const handleEditUser = useCallback(
    (user: UserWithRelations) => {
      openModal("edit", user);
    },
    [openModal]
  );

  const handleViewUser = useCallback(
    (user: UserWithRelations) => {
      openModal("view", user);
    },
    [openModal]
  );

  const handleDeleteConfirm = useCallback(
    (user: UserWithRelations) => {
      openModal("delete", user);
    },
    [openModal]
  );

  const handleAssignRolesModal = useCallback(
    (user: UserWithRelations) => {
      openModal("assign-roles", user);
    },
    [openModal]
  );

  const handleCloseSnackbar = useCallback(() => {
    setSuccessMessage("");
    setOperationError(null);
  }, []);

  const currentError =
    operationError ||
    createError ||
    updateError ||
    deleteError ||
    toggleError ||
    assignError ||
    removeError;

  return (
    <Box sx={{ p: 3 }}>
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
          <PeopleIcon fontSize="small" />
          Quản lý người dùng
        </Typography>
      </Breadcrumbs>

      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: { xs: "flex-start", sm: "center" },
          mb: 3,
          flexDirection: { xs: "column", sm: "row" },
          gap: { xs: 2, sm: 0 },
        }}
      >
        <Typography
          variant="h4"
          component="h1"
          fontWeight="bold"
          sx={{ fontSize: { xs: "24px", sm: "32px", md: "2.125rem" } }}
        >
          Quản lý người dùng
        </Typography>

        <Box
          sx={{
            display: "flex",
            gap: 2,
            width: { xs: "100%", sm: "auto" },
            flexDirection: { xs: "column", sm: "row" },
          }}
        >
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={() => refetch()}
            sx={{ flex: { xs: 1, sm: "auto" } }}
          >
            Làm mới
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleCreateUser}
            sx={{ flex: { xs: 1, sm: "auto" } }}
          >
            Thêm người dùng
          </Button>
        </Box>
      </Box>

      {/* Error Display */}
      {isError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error?.message || "Có lỗi xảy ra khi tải dữ liệu"}
        </Alert>
      )}

      {/* Filters */}
      <UserFiltersComponent
        filters={filters}
        onSearchChange={updateSearch}
        onStatusChange={updateStatusFilter}
        onRoleChange={updateRoleFilter}
        onClearFilters={clearFilters}
      />

      {/* Statistics */}
      {meta && (
        <Paper sx={{ p: 2, mb: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Tìm thấy <strong>{meta.total}</strong> người dùng
            {filters.search && ` với từ khóa "${filters.search}"`}
            {filters.isActive !== null &&
              ` - Trạng thái: ${filters.isActive ? "Hoạt động" : "Tạm khóa"}`}
          </Typography>
        </Paper>
      )}

      {/* User Table */}
      <UserTable
        users={users}
        loading={isLoading}
        onEdit={handleEditUser}
        onDelete={handleDeleteConfirm}
        onView={handleViewUser}
        onAssignRoles={handleAssignRolesModal}
        onToggleStatus={handleToggleStatus}
      />

      {/* Pagination */}
      {meta && meta.totalPages > 1 && (
        <UserPagination
          currentPage={meta.page}
          totalPages={meta.totalPages}
          totalItems={meta.total}
          itemsPerPage={meta.limit}
          onPageChange={updatePage}
          onPageSizeChange={updatePageSize}
        />
      )}

      {/* User Form Modal */}
      <UserForm
        open={
          modalState.isOpen &&
          ["create", "edit", "view"].includes(modalState.mode)
        }
        mode={modalState.mode}
        user={modalState.user}
        onClose={closeModal}
        onSubmit={handleFormSubmit}
        isSubmitting={isCreating || isUpdating}
        error={currentError}
      />

      {/* Role Assignment Modal */}
      <RoleAssignment
        open={modalState.isOpen && modalState.mode === "assign-roles"}
        user={modalState.user}
        onClose={closeModal}
        onAssignRoles={handleAssignRoles}
        onRemoveRoles={handleRemoveRoles}
        isAssigning={isAssigningRoles}
        isRemoving={isRemovingRoles}
        error={currentError}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmation
        open={modalState.isOpen && modalState.mode === "delete"}
        user={modalState.user}
        onClose={closeModal}
        onConfirm={handleDeleteUser}
        isDeleting={isDeleting}
        error={currentError}
      />

      {/* Success/Error Snackbar */}
      <Snackbar
        open={!!successMessage || !!currentError}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={successMessage ? "success" : "error"}
          sx={{ width: "100%" }}
        >
          {successMessage || currentError?.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default UserListPage;
