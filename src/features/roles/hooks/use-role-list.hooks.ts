import { useState, useCallback, useMemo } from "react";
import type { RoleQueryParams, RoleWithRelations } from "../types";
import { useRoles } from "../queries";
import { ROLE_CONSTANTS } from "../constants";

/**
 * Role List Hook - following Single Responsibility Principle
 * Handles role list state management, filtering, and pagination
 */
export const useRoleList = () => {
  const [queryParams, setQueryParams] = useState<RoleQueryParams>({
    page: 1,
    limit: ROLE_CONSTANTS.PAGINATION.DEFAULT_PAGE_SIZE,
    search: "",
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);

  // Fetch roles data
  const {
    data: rolesData,
    isLoading,
    isError,
    error,
    refetch,
  } = useRoles(queryParams);

  // Computed values
  const roles = useMemo(() => rolesData?.data || [], [rolesData?.data]);
  const meta = useMemo(() => rolesData?.meta, [rolesData?.meta]);

  // Update query params
  const updateQueryParams = useCallback((updates: Partial<RoleQueryParams>) => {
    setQueryParams((prev) => ({
      ...prev,
      ...updates,
      // Reset to first page when changing filters
      ...(updates.search !== undefined && { page: 1 }),
    }));
  }, []);

  // Search functionality
  const setSearch = useCallback(
    (search: string) => {
      updateQueryParams({ search });
    },
    [updateQueryParams]
  );

  // Pagination
  const setPage = useCallback(
    (page: number) => {
      updateQueryParams({ page });
    },
    [updateQueryParams]
  );

  const setPageSize = useCallback(
    (limit: number) => {
      updateQueryParams({ limit, page: 1 });
    },
    [updateQueryParams]
  );

  // Sorting
  const setSorting = useCallback(
    (
      sortBy: RoleQueryParams["sortBy"],
      sortOrder: RoleQueryParams["sortOrder"]
    ) => {
      updateQueryParams({ sortBy, sortOrder });
    },
    [updateQueryParams]
  );

  // Selection
  const toggleRoleSelection = useCallback((roleId: string) => {
    setSelectedRoles((prev) =>
      prev.includes(roleId)
        ? prev.filter((id) => id !== roleId)
        : [...prev, roleId]
    );
  }, []);

  const selectAllRoles = useCallback(() => {
    setSelectedRoles(roles.map((role) => role.id));
  }, [roles]);

  const clearSelection = useCallback(() => {
    setSelectedRoles([]);
  }, []);

  const isRoleSelected = useCallback(
    (roleId: string) => {
      return selectedRoles.includes(roleId);
    },
    [selectedRoles]
  );

  // Filtering
  const getFilteredRoles = useCallback(
    (searchTerm?: string) => {
      if (!searchTerm) return roles;

      const term = searchTerm.toLowerCase();
      return roles.filter(
        (role) =>
          role.name.toLowerCase().includes(term) ||
          role.id.toLowerCase().includes(term)
      );
    },
    [roles]
  );

  // Statistics
  const statistics = useMemo(() => {
    const totalRoles = roles.length;
    const totalUsers = roles.reduce(
      (sum, role) => sum + (role.userCount || 0),
      0
    );
    const totalPermissions = roles.reduce(
      (sum, role) => sum + (role.permissionCount || 0),
      0
    );
    const averagePermissionsPerRole =
      totalRoles > 0 ? Math.round(totalPermissions / totalRoles) : 0;

    return {
      totalRoles,
      totalUsers,
      totalPermissions,
      averagePermissionsPerRole,
      selectedCount: selectedRoles.length,
    };
  }, [roles, selectedRoles.length]);

  // Find role by ID
  const findRoleById = useCallback(
    (id: string): RoleWithRelations | undefined => {
      return roles.find((role) => role.id === id);
    },
    [roles]
  );

  // Refresh data
  const refresh = useCallback(() => {
    refetch();
  }, [refetch]);

  return {
    // Data
    roles,
    meta,
    queryParams,
    selectedRoles,
    statistics,

    // Loading states
    isLoading,
    isError,
    error,

    // Actions
    updateQueryParams,
    setSearch,
    setPage,
    setPageSize,
    setSorting,
    toggleRoleSelection,
    selectAllRoles,
    clearSelection,
    refresh,

    // Computed
    isRoleSelected,
    getFilteredRoles,
    findRoleById,
    hasSelectedRoles: selectedRoles.length > 0,
    isAllSelected: selectedRoles.length === roles.length && roles.length > 0,
    isPartiallySelected:
      selectedRoles.length > 0 && selectedRoles.length < roles.length,
  };
};
