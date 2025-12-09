import { useState, useCallback, useMemo } from "react";
import { useUsers, useUser, useUserRoles } from "../queries";
import {
  useCreateUser,
  useUpdateUser,
  useDeleteUser,
  useToggleUserStatus,
  useAssignRolesToUser,
  useRemoveRolesFromUser,
} from "../mutations";
import { USER_CONSTANTS } from "../constants";
import { UserValidator } from "../utils";
import type {
  UserQueryParams,
  UserFilters,
  UserModalState,
  UserModalMode,
  UserFormData,
  UserFormErrors,
  UserWithRelations,
  CreateUserRequest,
  UpdateUserRequest,
} from "../types";

/**
 * Custom hook for user list management
 * Following Single Responsibility Principle
 */
export const useUserList = () => {
  const [filters, setFilters] = useState<UserFilters>({
    search: "",
    isActive: null,
    roleId: null,
    page: 1,
    limit: USER_CONSTANTS.DEFAULT_PAGE_SIZE,
  });

  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  // Build query parameters
  const queryParams = useMemo<UserQueryParams>(() => {
    const params: UserQueryParams = {
      page: filters.page,
      limit: filters.limit,
    };

    if (filters.search) {
      params.search = filters.search;
    }

    if (filters.isActive !== null) {
      params.isActive = filters.isActive;
    }

    if (filters.roleId) {
      params.roleId = filters.roleId;
    }

    return params;
  }, [filters]);

  // Fetch users data
  const {
    data: usersData,
    isLoading,
    isError,
    error,
    refetch,
  } = useUsers(queryParams);

  // Filter update functions
  const updateSearch = useCallback((search: string) => {
    setFilters((prev) => ({
      ...prev,
      search,
      page: 1, // Reset to first page when searching
    }));
  }, []);

  const updatePage = useCallback((page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  }, []);

  const updatePageSize = useCallback((limit: number) => {
    setFilters((prev) => ({
      ...prev,
      limit,
      page: 1, // Reset to first page when changing page size
    }));
  }, []);

  const updateStatusFilter = useCallback((isActive: boolean | null) => {
    setFilters((prev) => ({
      ...prev,
      isActive,
      page: 1, // Reset to first page when filtering
    }));
  }, []);

  const updateRoleFilter = useCallback((roleId: string | null) => {
    setFilters((prev) => ({
      ...prev,
      roleId,
      page: 1, // Reset to first page when filtering
    }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({
      search: "",
      isActive: null,
      roleId: null,
      page: 1,
      limit: USER_CONSTANTS.DEFAULT_PAGE_SIZE,
    });
  }, []);

  // Selection functions
  const selectUser = useCallback((userId: string) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  }, []);

  const selectAllUsers = useCallback(() => {
    const userIds = usersData?.data?.map((user) => user.id) || [];
    setSelectedUsers(selectedUsers.length === userIds.length ? [] : userIds);
  }, [usersData?.data, selectedUsers.length]);

  const clearSelection = useCallback(() => {
    setSelectedUsers([]);
  }, []);

  return {
    // Data
    users: usersData?.data || [],
    meta: usersData?.meta,

    // Loading states
    isLoading,
    isError,
    error,

    // Filters
    filters,
    updateSearch,
    updatePage,
    updatePageSize,
    updateStatusFilter,
    updateRoleFilter,
    clearFilters,

    // Selection
    selectedUsers,
    selectUser,
    selectAllUsers,
    clearSelection,

    // Actions
    refetch,
  };
};

/**
 * Custom hook for user modal management
 */
export const useUserModal = () => {
  const [modalState, setModalState] = useState<UserModalState>({
    isOpen: false,
    mode: "create",
    user: undefined,
  });

  const openModal = useCallback(
    (mode: UserModalMode, user?: UserWithRelations) => {
      setModalState({
        isOpen: true,
        mode,
        user,
      });
    },
    []
  );

  const closeModal = useCallback(() => {
    setModalState({
      isOpen: false,
      mode: "create",
      user: undefined,
    });
  }, []);

  return {
    modalState,
    openModal,
    closeModal,
  };
};

/**
 * Custom hook for user form management
 */
export const useUserForm = (initialData?: UserWithRelations) => {
  const [formData, setFormData] = useState<UserFormData>(() => ({
    name: initialData?.name || "",
    email: initialData?.email || "",
    phone: initialData?.phone || "",
    password: "",
    isActive: initialData?.isActive ?? true,
  }));

  const [errors, setErrors] = useState<UserFormErrors>({});

  const updateField = useCallback(
    <K extends keyof UserFormData>(field: K, value: UserFormData[K]) => {
      setFormData((prev) => ({ ...prev, [field]: value }));

      // Clear error when field is updated
      if (errors[field]) {
        setErrors((prev) => ({ ...prev, [field]: undefined }));
      }
    },
    [errors]
  );

  const validateForm = useCallback((): boolean => {
    const errors = UserValidator.validateForm(formData, !!initialData);
    setErrors(errors);
    return Object.keys(errors).length === 0;
  }, [formData, initialData]);

  const resetForm = useCallback(() => {
    setFormData({
      name: initialData?.name || "",
      email: initialData?.email || "",
      phone: initialData?.phone || "",
      password: "",
      isActive: initialData?.isActive ?? true,
    });
    setErrors({});
  }, [initialData]);

  const getRequestData = useCallback(():
    | CreateUserRequest
    | UpdateUserRequest => {
    const data: any = {
      name: formData.name.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      isActive: formData.isActive,
    };

    if (formData.password) {
      data.password = formData.password;
    }

    return data;
  }, [formData]);

  return {
    formData,
    errors,
    updateField,
    validateForm,
    resetForm,
    getRequestData,
  };
};

/**
 * Custom hook for user operations
 */
export const useUserOperations = () => {
  const createUserMutation = useCreateUser();
  const updateUserMutation = useUpdateUser();
  const deleteUserMutation = useDeleteUser();
  const toggleStatusMutation = useToggleUserStatus();
  const assignRolesMutation = useAssignRolesToUser();
  const removeRolesMutation = useRemoveRolesFromUser();

  const createUser = useCallback(
    async (data: CreateUserRequest) => {
      return createUserMutation.mutateAsync(data);
    },
    [createUserMutation]
  );

  const updateUser = useCallback(
    async (id: string, data: UpdateUserRequest) => {
      return updateUserMutation.mutateAsync({ id, data });
    },
    [updateUserMutation]
  );

  const deleteUser = useCallback(
    async (id: string) => {
      return deleteUserMutation.mutateAsync(id);
    },
    [deleteUserMutation]
  );

  const toggleUserStatus = useCallback(
    async (id: string) => {
      return toggleStatusMutation.mutateAsync(id);
    },
    [toggleStatusMutation]
  );

  const assignRoles = useCallback(
    async (userId: string, roleIds: string[]) => {
      return assignRolesMutation.mutateAsync({ userId, roleIds });
    },
    [assignRolesMutation]
  );

  const removeRoles = useCallback(
    async (userId: string, roleIds: string[]) => {
      return removeRolesMutation.mutateAsync({ userId, data: { roleIds } });
    },
    [removeRolesMutation]
  );

  return {
    // Operations
    createUser,
    updateUser,
    deleteUser,
    toggleUserStatus,
    assignRoles,
    removeRoles,

    // Loading states
    isCreating: createUserMutation.isPending,
    isUpdating: updateUserMutation.isPending,
    isDeleting: deleteUserMutation.isPending,
    isTogglingStatus: toggleStatusMutation.isPending,
    isAssigningRoles: assignRolesMutation.isPending,
    isRemovingRoles: removeRolesMutation.isPending,

    // Error states
    createError: createUserMutation.error,
    updateError: updateUserMutation.error,
    deleteError: deleteUserMutation.error,
    toggleError: toggleStatusMutation.error,
    assignError: assignRolesMutation.error,
    removeError: removeRolesMutation.error,
  };
};

/**
 * Custom hook for user details management
 */
export const useUserDetails = (userId: string) => {
  const {
    data: user,
    isLoading: isLoadingUser,
    error: userError,
  } = useUser(userId);

  const {
    data: userRoles,
    isLoading: isLoadingRoles,
    error: rolesError,
  } = useUserRoles(userId);

  const isLoading = isLoadingUser || isLoadingRoles;
  const error = userError || rolesError;

  return {
    user,
    userRoles: userRoles?.data,
    isLoading,
    error,
  };
};
