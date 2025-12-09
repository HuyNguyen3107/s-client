import React, { useState, useMemo } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Checkbox,
  FormControlLabel,
  TextField,
  InputAdornment,
  Divider,
  Chip,
  Alert,
  CircularProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Tooltip,
  IconButton,
} from "@mui/material";
import {
  Search,
  Security,
  ExpandMore,
  Close,
  CheckBoxOutlineBlank,
  CheckBox,
  IndeterminateCheckBox,
} from "@mui/icons-material";
import { useAllPermissions, useRolePermissions } from "../queries";
import { useAssignPermissionsToRoleMutation } from "../mutations";
import type { RoleWithRelations } from "../types";
import {
  groupPermissionsByCategory,
  getPermissionCategoryName,
  formatPermissionName,
} from "../utils/role.utils";
import {
  getCategoryIcon,
  getActionIcon,
} from "../utils/permission-icons.utils";

interface RolePermissionsDialogProps {
  open: boolean;
  role: RoleWithRelations;
  onClose: () => void;
}

/**
 * Role Permissions Dialog Component - following Single Responsibility Principle
 * Responsible only for managing permissions for a specific role
 */
export const RolePermissionsDialog: React.FC<RolePermissionsDialogProps> = ({
  open,
  role,
  onClose,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);

  // Kiểm tra xem có phải là vai trò hệ thống không
  const isSystemRole = role.isDeletable === false;

  // Queries
  const {
    data: allPermissions = [],
    isLoading: isLoadingPermissions,
    error: permissionsError,
    isFetching: isFetchingPermissions,
  } = useAllPermissions();

  const { data: rolePermissions = [], isLoading: isLoadingRolePermissions } =
    useRolePermissions(role.id, {
      enabled: open,
    });

  // Debug logging
  React.useEffect(() => {
    if (open) {
      // Dialog opened
    }
  }, [
    open,
    allPermissions.length,
    isLoadingPermissions,
    isFetchingPermissions,
    rolePermissions.length,
    isLoadingRolePermissions,
  ]);

  // Mutation
  const assignPermissionsMutation = useAssignPermissionsToRoleMutation({
    onSuccess: () => {
      // Reset state and close dialog
      setSearchTerm("");
      setIsInitialized(false);
      onClose();
    },
  });

  // Initialize selected permissions when role permissions load
  React.useEffect(() => {
    if (rolePermissions.length > 0 && !isInitialized) {
      setSelectedPermissions(rolePermissions.map((p) => p.id));
      setIsInitialized(true);
    } else if (
      rolePermissions.length === 0 &&
      !isLoadingRolePermissions &&
      !isInitialized
    ) {
      setSelectedPermissions([]);
      setIsInitialized(true);
    }
  }, [rolePermissions, isLoadingRolePermissions, isInitialized]);

  // Reset state when dialog opens
  React.useEffect(() => {
    if (open) {
      setSearchTerm("");
      setIsInitialized(false);
      // Auto-expand first 3 categories by default
      const categories = Object.keys(
        groupPermissionsByCategory(allPermissions)
      );
      if (categories.length <= 3) {
        setExpandedCategories(categories);
      } else {
        setExpandedCategories(categories.slice(0, 3));
      }
    }
  }, [open, allPermissions]);

  // Filter permissions based on search term
  const filteredPermissions = useMemo(() => {
    if (!allPermissions || !Array.isArray(allPermissions)) return [];
    if (!searchTerm) return allPermissions;
    return allPermissions.filter((permission) =>
      permission.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [allPermissions, searchTerm]);

  // Group permissions by category using utility function
  const groupedPermissions = useMemo(() => {
    return groupPermissionsByCategory(filteredPermissions);
  }, [filteredPermissions]);

  const handlePermissionToggle = (permissionId: string) => {
    setSelectedPermissions((prev) =>
      prev.includes(permissionId)
        ? prev.filter((id) => id !== permissionId)
        : [...prev, permissionId]
    );
  };

  const handleSelectAll = () => {
    if (selectedPermissions.length === allPermissions.length) {
      setSelectedPermissions([]);
    } else {
      setSelectedPermissions(allPermissions.map((p) => p.id));
    }
  };

  const handleSelectCategory = (category: string) => {
    const categoryPermissions = groupedPermissions[category] || [];
    const categoryPermissionIds = categoryPermissions.map((p) => p.id);
    const allSelected = categoryPermissionIds.every((id) =>
      selectedPermissions.includes(id)
    );

    if (allSelected) {
      // Deselect all in category
      setSelectedPermissions((prev) =>
        prev.filter((id) => !categoryPermissionIds.includes(id))
      );
    } else {
      // Select all in category
      setSelectedPermissions((prev) => [
        ...prev.filter((id) => !categoryPermissionIds.includes(id)),
        ...categoryPermissionIds,
      ]);
    }
  };

  const getCategoryCheckboxState = (category: string) => {
    const categoryPermissions = groupedPermissions[category] || [];
    const categoryPermissionIds = categoryPermissions.map((p) => p.id);
    const selectedCount = categoryPermissionIds.filter((id) =>
      selectedPermissions.includes(id)
    ).length;

    if (selectedCount === 0) return "none";
    if (selectedCount === categoryPermissionIds.length) return "all";
    return "some";
  };

  const handleSave = () => {
    assignPermissionsMutation.mutate({
      roleId: role.id,
      data: { permissionIds: selectedPermissions },
    });
  };

  const handleClose = () => {
    if (!assignPermissionsMutation.isPending) {
      onClose();
    }
  };

  const isLoading = isLoadingPermissions || isLoadingRolePermissions;
  const hasChanges =
    JSON.stringify(selectedPermissions.sort()) !==
    JSON.stringify(rolePermissions.map((p) => p.id).sort());

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { height: "80vh", borderRadius: 2 },
      }}
    >
      <DialogTitle
        sx={{
          borderBottom: 1,
          borderColor: "divider",
          pb: 2,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 48,
                height: 48,
                borderRadius: 2,
                bgcolor: "primary.50",
                color: "primary.main",
              }}
            >
              <Security sx={{ fontSize: 28 }} />
            </Box>
            <Box>
              <Typography variant="h5" fontWeight="600">
                Quản lý quyền hạn
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Vai trò: <strong>{role.name}</strong>
              </Typography>
            </Box>
          </Box>

          <IconButton onClick={handleClose} size="small">
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ pb: 1 }}>
        {isSystemRole && (
          <Alert severity="warning" sx={{ mb: 2 }}>
            Đây là vai trò hệ thống (Super Admin). Quyền hạn của vai trò này
            không thể thay đổi.
          </Alert>
        )}

        {permissionsError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            Lỗi khi tải danh sách quyền hạn: {permissionsError.message}
          </Alert>
        )}

        {assignPermissionsMutation.isError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            Lỗi khi cập nhật quyền hạn:{" "}
            {assignPermissionsMutation.error?.message}
          </Alert>
        )}

        {isLoading ? (
          <Box sx={{ px: 2 }}>
            {/* Search skeleton */}
            <Box sx={{ mb: 3 }}>
              <Box
                sx={{
                  height: 40,
                  bgcolor: "grey.100",
                  borderRadius: 1,
                  mb: 2,
                  animation: "pulse 1.5s ease-in-out infinite",
                  "@keyframes pulse": {
                    "0%, 100%": { opacity: 1 },
                    "50%": { opacity: 0.5 },
                  },
                }}
              />
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Box
                  sx={{
                    height: 24,
                    width: 200,
                    bgcolor: "grey.100",
                    borderRadius: 1,
                    animation: "pulse 1.5s ease-in-out infinite",
                  }}
                />
                <Box
                  sx={{
                    height: 24,
                    width: 80,
                    bgcolor: "grey.100",
                    borderRadius: 1,
                    animation: "pulse 1.5s ease-in-out infinite",
                  }}
                />
              </Box>
            </Box>

            {/* Category skeletons */}
            {[1, 2, 3, 4].map((i) => (
              <Box
                key={i}
                sx={{
                  mb: 2,
                  p: 2,
                  border: 1,
                  borderColor: "grey.200",
                  borderRadius: 1,
                  animation: "pulse 1.5s ease-in-out infinite",
                  animationDelay: `${i * 0.1}s`,
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Box
                    sx={{
                      width: 36,
                      height: 36,
                      bgcolor: "grey.100",
                      borderRadius: 1,
                    }}
                  />
                  <Box sx={{ flex: 1 }}>
                    <Box
                      sx={{
                        height: 20,
                        width: "40%",
                        bgcolor: "grey.100",
                        borderRadius: 1,
                        mb: 0.5,
                      }}
                    />
                    <Box
                      sx={{
                        height: 14,
                        width: "20%",
                        bgcolor: "grey.100",
                        borderRadius: 1,
                      }}
                    />
                  </Box>
                  <Box
                    sx={{
                      height: 24,
                      width: 50,
                      bgcolor: "grey.100",
                      borderRadius: 1,
                    }}
                  />
                </Box>
              </Box>
            ))}

            <Box sx={{ textAlign: "center", py: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Đang tải quyền hạn...
              </Typography>
            </Box>
          </Box>
        ) : (
          <>
            {/* Search and Select All */}
            <Box sx={{ mb: 3 }}>
              <TextField
                placeholder="Tìm kiếm quyền hạn..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                fullWidth
                size="small"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search color="action" />
                    </InputAdornment>
                  ),
                }}
                sx={{ mb: 2 }}
              />

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={
                        selectedPermissions.length === allPermissions.length
                      }
                      indeterminate={
                        selectedPermissions.length > 0 &&
                        selectedPermissions.length < allPermissions.length
                      }
                      onChange={handleSelectAll}
                      disabled={isSystemRole}
                    />
                  }
                  label="Chọn tất cả quyền hạn"
                  disabled={isSystemRole}
                />

                <Chip
                  label={`${selectedPermissions.length}/${allPermissions.length} được chọn`}
                  color="primary"
                  variant="outlined"
                  size="small"
                />
              </Box>
            </Box>

            <Divider sx={{ mb: 2 }} />

            {/* Permissions List - Accordion Style */}
            <Box sx={{ maxHeight: "400px", overflow: "auto", pr: 1 }}>
              {Object.entries(groupedPermissions).map(
                ([category, permissions]) => {
                  const checkboxState = getCategoryCheckboxState(category);
                  const isExpanded = expandedCategories.includes(category);

                  return (
                    <Accordion
                      key={category}
                      expanded={isExpanded}
                      onChange={() => {
                        setExpandedCategories((prev) =>
                          prev.includes(category)
                            ? prev.filter((c) => c !== category)
                            : [...prev, category]
                        );
                      }}
                      sx={{
                        mb: 1,
                        "&:before": { display: "none" },
                        boxShadow: 1,
                      }}
                    >
                      <AccordionSummary
                        expandIcon={<ExpandMore />}
                        sx={{
                          "& .MuiAccordionSummary-content": {
                            alignItems: "center",
                            gap: 2,
                          },
                        }}
                      >
                        <Checkbox
                          checked={checkboxState === "all"}
                          indeterminate={checkboxState === "some"}
                          onChange={(e) => {
                            e.stopPropagation();
                            handleSelectCategory(category);
                          }}
                          onClick={(e) => e.stopPropagation()}
                          disabled={isSystemRole}
                          icon={<CheckBoxOutlineBlank />}
                          checkedIcon={<CheckBox />}
                          indeterminateIcon={<IndeterminateCheckBox />}
                        />

                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1.5,
                            flex: 1,
                          }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              width: 36,
                              height: 36,
                              borderRadius: 1,
                              bgcolor: "primary.50",
                              color: "primary.main",
                            }}
                          >
                            {getCategoryIcon(category, {
                              sx: { fontSize: 20 },
                            })}
                          </Box>

                          <Box sx={{ flex: 1 }}>
                            <Typography variant="subtitle1" fontWeight="600">
                              {getPermissionCategoryName(category)}
                            </Typography>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              {permissions.length} quyền
                            </Typography>
                          </Box>

                          <Chip
                            label={`${
                              permissions.filter((p) =>
                                selectedPermissions.includes(p.id)
                              ).length
                            }/${permissions.length}`}
                            size="small"
                            color={
                              checkboxState === "all" ? "success" : "default"
                            }
                            sx={{ minWidth: 50 }}
                          />
                        </Box>
                      </AccordionSummary>

                      <AccordionDetails sx={{ pt: 0 }}>
                        <Box
                          sx={{
                            display: "grid",
                            gridTemplateColumns:
                              "repeat(auto-fill, minmax(280px, 1fr))",
                            gap: 1,
                            pl: 6,
                          }}
                        >
                          {permissions.map((permission) => {
                            const parts = permission.name.split(".");
                            const action = parts[1] || "";

                            return (
                              <Tooltip
                                key={permission.id}
                                title={permission.name}
                                placement="top"
                              >
                                <FormControlLabel
                                  control={
                                    <Checkbox
                                      checked={selectedPermissions.includes(
                                        permission.id
                                      )}
                                      onChange={() =>
                                        handlePermissionToggle(permission.id)
                                      }
                                      size="small"
                                      disabled={isSystemRole}
                                    />
                                  }
                                  label={
                                    <Box
                                      sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 0.5,
                                      }}
                                    >
                                      {getActionIcon(action, {
                                        sx: {
                                          fontSize: 16,
                                          color: "text.secondary",
                                        },
                                      })}
                                      <Typography variant="body2">
                                        {formatPermissionName(permission.name)}
                                      </Typography>
                                    </Box>
                                  }
                                  disabled={isSystemRole}
                                  sx={{
                                    width: "100%",
                                    margin: 0,
                                    py: 0.5,
                                    px: 1,
                                    borderRadius: 1,
                                    "&:hover": {
                                      bgcolor: "action.hover",
                                    },
                                  }}
                                />
                              </Tooltip>
                            );
                          })}
                        </Box>
                      </AccordionDetails>
                    </Accordion>
                  );
                }
              )}
            </Box>

            {filteredPermissions.length === 0 && !isLoading && (
              <Box
                sx={{
                  textAlign: "center",
                  py: 8,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 2,
                }}
              >
                <Box
                  sx={{
                    width: 80,
                    height: 80,
                    borderRadius: "50%",
                    bgcolor: "grey.100",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Search sx={{ fontSize: 40, color: "text.secondary" }} />
                </Box>
                <Typography variant="h6" color="text.secondary">
                  {searchTerm
                    ? "Không tìm thấy quyền hạn nào"
                    : "Không có quyền hạn nào"}
                </Typography>
                {searchTerm && (
                  <Typography variant="body2" color="text.secondary">
                    Thử tìm kiếm với từ khóa khác
                  </Typography>
                )}
              </Box>
            )}
          </>
        )}
      </DialogContent>

      <DialogActions
        sx={{
          p: 3,
          pt: 2,
          gap: 1,
          borderTop: 1,
          borderColor: "divider",
          bgcolor: "grey.50",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
          }}
        >
          <Box>
            {!isSystemRole && hasChanges && (
              <Typography variant="body2" color="warning.main">
                ⚠️ Có thay đổi chưa lưu
              </Typography>
            )}
          </Box>

          <Box sx={{ display: "flex", gap: 1 }}>
            <Button
              onClick={handleClose}
              disabled={assignPermissionsMutation.isPending}
              color="inherit"
              size="large"
              sx={{ minWidth: 100 }}
            >
              {isSystemRole ? "Đóng" : "Hủy"}
            </Button>
            {!isSystemRole && (
              <Button
                onClick={handleSave}
                variant="contained"
                disabled={
                  !hasChanges ||
                  isLoading ||
                  assignPermissionsMutation.isPending
                }
                size="large"
                sx={{ borderRadius: 2, minWidth: 140 }}
                startIcon={
                  assignPermissionsMutation.isPending ? (
                    <CircularProgress size={20} color="inherit" />
                  ) : undefined
                }
              >
                {assignPermissionsMutation.isPending
                  ? "Đang lưu..."
                  : "Lưu thay đổi"}
              </Button>
            )}
          </Box>
        </Box>
      </DialogActions>
    </Dialog>
  );
};
