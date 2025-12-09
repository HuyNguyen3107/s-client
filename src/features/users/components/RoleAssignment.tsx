import React, { useState, useEffect, useMemo } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControlLabel,
  Checkbox,
  Box,
  Typography,
  Alert,
  CircularProgress,
  FormGroup,
  Divider,
} from "@mui/material";
import type { UserWithRelations } from "../types";
import { useRoles } from "../../roles/queries";
import { useUserRoles } from "../queries";

interface RoleAssignmentProps {
  open: boolean;
  user?: UserWithRelations;
  onClose: () => void;
  onAssignRoles: (userId: string, roleIds: string[]) => void;
  onRemoveRoles: (userId: string, roleIds: string[]) => void;
  isAssigning?: boolean;
  isRemoving?: boolean;
  error?: Error | null;
}

/**
 * Role Assignment Component - Following Single Responsibility Principle
 * Handles assigning and removing roles from users
 */
export const RoleAssignment: React.FC<RoleAssignmentProps> = ({
  open,
  user,
  onClose,
  onAssignRoles,
  onRemoveRoles,
  isAssigning = false,
  isRemoving = false,
  error,
}) => {
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const { data: rolesData, isLoading: rolesLoading } = useRoles();
  const {
    data: userRolesData,
    isLoading: userRolesLoading,
    refetch: refetchUserRoles,
  } = useUserRoles(user?.id || "", {
    enabled: !!user?.id && open, // Only fetch when dialog is open and user exists
  });

  const roles = rolesData?.data || [];
  const currentUserRoles = userRolesData?.data?.roles || [];

  // Memoize currentRoleIds to prevent infinite useEffect loop
  const currentRoleIds = useMemo(
    () => currentUserRoles.map((role: any) => role.id),
    [currentUserRoles]
  );

  // Initialize selected roles when modal opens or user roles data changes
  useEffect(() => {
    if (open && user?.id && !userRolesLoading) {
      setSelectedRoles([...currentRoleIds]);
    }
  }, [open, user?.id, currentRoleIds, userRolesLoading]);

  // Reset state when modal closes
  useEffect(() => {
    if (!open) {
      setSelectedRoles([]);
    }
  }, [open]);

  // Refetch user roles when dialog opens to ensure fresh data
  useEffect(() => {
    if (open && user?.id) {
      refetchUserRoles();
    }
  }, [open, user?.id, refetchUserRoles]);

  const handleRoleToggle = (roleId: string, isSystemRole: boolean) => {
    // Prevent toggling system roles (Super Admin)
    if (isSystemRole) {
      return;
    }

    setSelectedRoles((prev) =>
      prev.includes(roleId)
        ? prev.filter((id) => id !== roleId)
        : [...prev, roleId]
    );
  };

  const handleSubmit = () => {
    if (!user) return;

    const { rolesToAdd, rolesToRemove } = roleChanges;

    // Process role changes
    if (rolesToAdd.length > 0) {
      onAssignRoles(user.id, rolesToAdd);
    }
    if (rolesToRemove.length > 0) {
      onRemoveRoles(user.id, rolesToRemove);
    }

    // Close modal if no changes
    if (rolesToAdd.length === 0 && rolesToRemove.length === 0) {
      onClose();
    }
  };

  const handleSelectAll = () => {
    // Only select non-system roles
    const selectableRoleIds = roles
      .filter((role) => role.isDeletable !== false)
      .map((role) => role.id);
    setSelectedRoles(selectableRoleIds);
  };

  const handleDeselectAll = () => {
    setSelectedRoles([]);
  };

  const isLoading = rolesLoading || userRolesLoading;
  const isSubmitting = isAssigning || isRemoving;

  // Memoize expensive calculations
  const hasChanges = useMemo(() => {
    const sortedSelected = [...selectedRoles].sort();
    const sortedCurrent = [...currentRoleIds].sort();
    return JSON.stringify(sortedSelected) !== JSON.stringify(sortedCurrent);
  }, [selectedRoles, currentRoleIds]);

  // Memoize roles changes for summary
  const roleChanges = useMemo(() => {
    const rolesToAdd = selectedRoles.filter(
      (roleId: string) => !currentRoleIds.includes(roleId)
    );
    const rolesToRemove = currentRoleIds.filter(
      (roleId: string) => !selectedRoles.includes(roleId)
    );
    return { rolesToAdd, rolesToRemove };
  }, [selectedRoles, currentRoleIds]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: { minHeight: "400px" },
      }}
    >
      <DialogTitle>
        <Typography variant="h6" component="div">
          Gán vai trò cho người dùng
        </Typography>
        {user && (
          <Typography variant="body2" color="text.secondary">
            {user.name} ({user.email})
          </Typography>
        )}
      </DialogTitle>

      <DialogContent dividers>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error.message}
          </Alert>
        )}

        {/* Warning about system roles */}
        {roles.some((role) => role.isDeletable === false) && (
          <Alert severity="warning" sx={{ mb: 2 }}>
            Vai trò hệ thống (Super Admin) không thể được gán cho người dùng
            thường. Chỉ có thể tạo tài khoản Super Admin riêng biệt.
          </Alert>
        )}

        {isLoading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              minHeight: 200,
            }}
          >
            <CircularProgress />
          </Box>
        ) : (
          <>
            {/* Action Buttons */}
            <Box sx={{ mb: 2, display: "flex", gap: 1 }}>
              <Button
                size="small"
                variant="outlined"
                onClick={handleSelectAll}
                disabled={selectedRoles.length === roles.length}
              >
                Chọn tất cả
              </Button>
              <Button
                size="small"
                variant="outlined"
                onClick={handleDeselectAll}
                disabled={selectedRoles.length === 0}
              >
                Bỏ chọn tất cả
              </Button>
            </Box>

            <Divider sx={{ mb: 2 }} />

            {/* Roles List */}
            {roles.length === 0 ? (
              <Typography color="text.secondary" textAlign="center">
                Không có vai trò nào trong hệ thống
              </Typography>
            ) : (
              <FormGroup>
                {roles.map((role) => {
                  const isSystemRole = role.isDeletable === false;
                  const isSelected = selectedRoles.includes(role.id);
                  const wasSelected = currentRoleIds.includes(role.id);
                  const isNew = isSelected && !wasSelected;
                  const isRemoved = !isSelected && wasSelected;

                  return (
                    <Box key={role.id}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={isSelected}
                            onChange={() =>
                              handleRoleToggle(role.id, isSystemRole)
                            }
                            disabled={isSystemRole}
                          />
                        }
                        disabled={isSystemRole}
                        label={
                          <Box>
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                              }}
                            >
                              <Typography
                                variant="body1"
                                sx={{
                                  color: isSystemRole
                                    ? "text.disabled"
                                    : isNew
                                    ? "success.main"
                                    : isRemoved
                                    ? "error.main"
                                    : "text.primary",
                                }}
                              >
                                {role.name}
                                {isNew && " (Mới)"}
                                {isRemoved && " (Sẽ xóa)"}
                              </Typography>
                              {isSystemRole && (
                                <Box
                                  component="span"
                                  sx={{
                                    fontSize: "0.75rem",
                                    px: 1,
                                    py: 0.25,
                                    bgcolor: "warning.light",
                                    color: "warning.dark",
                                    borderRadius: 1,
                                    fontWeight: 600,
                                  }}
                                >
                                  Hệ thống
                                </Box>
                              )}
                            </Box>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              ID: {role.id.slice(0, 8)}...
                              {isSystemRole &&
                                " • Không thể gán cho người dùng"}
                            </Typography>
                          </Box>
                        }
                      />
                    </Box>
                  );
                })}
              </FormGroup>
            )}

            {/* Summary */}
            {hasChanges && (
              <Box sx={{ mt: 2, p: 2, bgcolor: "grey.50", borderRadius: 1 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Thay đổi sẽ được áp dụng:
                </Typography>
                <Box sx={{ pl: 2 }}>
                  {roleChanges.rolesToAdd.length > 0 && (
                    <Typography variant="body2" color="success.main">
                      • Thêm {roleChanges.rolesToAdd.length} vai trò
                    </Typography>
                  )}
                  {roleChanges.rolesToRemove.length > 0 && (
                    <Typography variant="body2" color="error.main">
                      • Xóa {roleChanges.rolesToRemove.length} vai trò
                    </Typography>
                  )}
                </Box>
              </Box>
            )}
          </>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} disabled={isSubmitting}>
          Hủy bỏ
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={!hasChanges || isSubmitting || isLoading}
          startIcon={isSubmitting ? <CircularProgress size={20} /> : undefined}
        >
          {isSubmitting
            ? "Đang cập nhật..."
            : hasChanges
            ? "Cập nhật vai trò"
            : "Không có thay đổi"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RoleAssignment;
