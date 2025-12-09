import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Alert,
  Typography,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  CircularProgress,
  Divider,
} from "@mui/material";
import { ExpandMore as ExpandMoreIcon } from "@mui/icons-material";
import { useForm, Controller } from "react-hook-form";
import type { RoleWithRelations, Permission, RoleFormData } from "../types";
import { useAllPermissions } from "../queries";
import {
  groupPermissionsByCategory,
  getPermissionCategoryName,
  formatPermissionName,
  getCategoryIcon,
  getActionIcon,
} from "../utils";

interface RoleFormProps {
  open: boolean;
  role?: RoleWithRelations | null;
  onClose: () => void;
  onSubmit: (data: RoleFormData) => void;
  isSubmitting?: boolean;
  allowPermissionAssignment?: boolean;
}

/**
 * Role Form Component - following Single Responsibility Principle
 * Responsible only for role creation and editing form
 */
export const RoleForm: React.FC<RoleFormProps> = ({
  open,
  role,
  onClose,
  onSubmit,
  isSubmitting = false,
  allowPermissionAssignment = true,
}) => {
  const [error, setError] = useState<string>("");
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);

  // Fetch permissions for both new and existing roles
  const {
    data: permissions = [],
    isLoading: permissionsLoading,
    error: permissionsError,
  } = useAllPermissions({
    enabled: open && allowPermissionAssignment,
  });

  const {
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<RoleFormData>({
    defaultValues: {
      name: "",
      permissionIds: [],
    },
  });

  const watchedPermissionIds = watch("permissionIds");

  // Reset form when dialog opens/closes or role changes
  useEffect(() => {
    if (open) {
      reset({
        name: role?.name || "",
        permissionIds: role?.permissions?.map((p) => p.id) || [],
      });
      setError("");
      setExpandedCategories([]);
    }
  }, [open, role, reset]);

  // Auto-expand categories when permissions are loaded
  useEffect(() => {
    if (permissions.length > 0 && expandedCategories.length === 0) {
      const categories = Object.keys(groupPermissionsByCategory(permissions));
      if (categories.length <= 3) {
        setExpandedCategories(categories);
      }
    }
  }, [permissions, expandedCategories.length]);

  const handleFormSubmit = async (data: RoleFormData) => {
    try {
      setError("");

      // Validate permissions for new roles
      if (
        !role &&
        allowPermissionAssignment &&
        (!data.permissionIds || data.permissionIds.length === 0)
      ) {
        setError("Vui lòng chọn ít nhất một quyền cho vai trò");
        return;
      }

      await onSubmit(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Có lỗi xảy ra");
    }
  };

  const handleCategoryToggle = (category: string) => {
    setExpandedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const handlePermissionChange = (permissionId: string, checked: boolean) => {
    const currentIds = watchedPermissionIds || [];
    const newIds = checked
      ? [...currentIds, permissionId]
      : currentIds.filter((id) => id !== permissionId);
    setValue("permissionIds", newIds);
  };

  const handleCategoryPermissionChange = (
    categoryPermissions: Permission[],
    checked: boolean
  ) => {
    const categoryIds = categoryPermissions.map((p) => p.id);
    const currentIds = watchedPermissionIds || [];
    const newIds = checked
      ? [...new Set([...currentIds, ...categoryIds])]
      : currentIds.filter((id) => !categoryIds.includes(id));
    setValue("permissionIds", newIds);
  };

  const isCategoryFullySelected = (
    categoryPermissions: Permission[]
  ): boolean => {
    const currentIds = watchedPermissionIds || [];
    return categoryPermissions.every((p) => currentIds.includes(p.id));
  };

  const isCategoryPartiallySelected = (
    categoryPermissions: Permission[]
  ): boolean => {
    const currentIds = watchedPermissionIds || [];
    return (
      categoryPermissions.some((p) => currentIds.includes(p.id)) &&
      !isCategoryFullySelected(categoryPermissions)
    );
  };

  const handleClose = () => {
    if (!isSubmitting) {
      reset();
      setError("");
      onClose();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 2, maxHeight: "90vh" },
      }}
    >
      <DialogTitle>
        {role ? "Chỉnh sửa vai trò" : "Tạo vai trò mới"}
        {role && (
          <Typography variant="body2" color="text.secondary">
            ID: {role.id}
          </Typography>
        )}
      </DialogTitle>

      <form
        onSubmit={handleSubmit(handleFormSubmit)}
        style={{ height: "100%", display: "flex", flexDirection: "column" }}
      >
        <DialogContent sx={{ flex: 1, overflow: "auto" }}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            {/* Role Name Input */}
            <Controller
              name="name"
              control={control}
              rules={{
                required: "Tên vai trò là bắt buộc",
                minLength: {
                  value: 2,
                  message: "Tên vai trò phải có ít nhất 2 ký tự",
                },
                maxLength: {
                  value: 50,
                  message: "Tên vai trò không được quá 50 ký tự",
                },
                pattern: {
                  value: /^[a-zA-Z0-9\s\u00C0-\u024F\u1E00-\u1EFF]+$/,
                  message:
                    "Tên vai trò chỉ được chứa chữ cái, số và khoảng trắng",
                },
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Tên vai trò"
                  placeholder="Nhập tên vai trò..."
                  fullWidth
                  error={Boolean(errors.name)}
                  helperText={errors.name?.message}
                  disabled={isSubmitting}
                  autoFocus
                />
              )}
            />

            {/* Permissions Section */}
            {allowPermissionAssignment && (
              <>
                <Divider />
                <Box>
                  <Box
                    sx={{
                      mb: 2,
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Typography variant="h6">
                      Chọn quyền hạn cho vai trò
                    </Typography>
                    <Chip
                      label={`${watchedPermissionIds?.length || 0}/${
                        permissions.length
                      } quyền`}
                      color={
                        watchedPermissionIds?.length ? "primary" : "default"
                      }
                      size="small"
                    />
                  </Box>

                  {!role && watchedPermissionIds?.length === 0 && (
                    <Alert severity="warning" sx={{ mb: 2 }}>
                      Vui lòng chọn ít nhất một quyền cho vai trò
                    </Alert>
                  )}

                  {permissionsLoading ? (
                    <Box
                      sx={{ display: "flex", justifyContent: "center", py: 4 }}
                    >
                      <CircularProgress />
                    </Box>
                  ) : permissions.length === 0 ? (
                    <Alert severity="info" sx={{ mb: 2 }}>
                      Không tìm thấy quyền hạn nào. Vui lòng kiểm tra kết nối
                      API.
                      <br />
                      <strong>Debug:</strong> Loading:{" "}
                      {permissionsLoading ? "true" : "false"}, Permissions:{" "}
                      {permissions.length}, Error:{" "}
                      {permissionsError ? permissionsError.message : "none"}
                    </Alert>
                  ) : (
                    <Box>
                      {Object.entries(
                        groupPermissionsByCategory(permissions || [])
                      ).map(([category, categoryPermissions]) => {
                        const isExpanded =
                          expandedCategories.includes(category);
                        const isFullySelected =
                          isCategoryFullySelected(categoryPermissions);
                        const isPartiallySelected =
                          isCategoryPartiallySelected(categoryPermissions);

                        return (
                          <Accordion
                            key={category}
                            expanded={isExpanded}
                            onChange={() => handleCategoryToggle(category)}
                            sx={{ mb: 1 }}
                          >
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 2,
                                  width: "100%",
                                }}
                              >
                                <FormControlLabel
                                  control={
                                    <Checkbox
                                      checked={isFullySelected}
                                      indeterminate={isPartiallySelected}
                                      onChange={(e) => {
                                        e.stopPropagation();
                                        handleCategoryPermissionChange(
                                          categoryPermissions,
                                          !isFullySelected
                                        );
                                      }}
                                    />
                                  }
                                  label={
                                    <Box
                                      sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 1,
                                      }}
                                    >
                                      {getCategoryIcon(category, {
                                        fontSize: "small",
                                      })}
                                      <Typography
                                        variant="body1"
                                        fontWeight={500}
                                      >
                                        {getPermissionCategoryName(category)}
                                      </Typography>
                                    </Box>
                                  }
                                  onClick={(e) => e.stopPropagation()}
                                />
                                <Chip
                                  label={`${
                                    categoryPermissions.filter((p) =>
                                      watchedPermissionIds?.includes(p.id)
                                    ).length
                                  }/${categoryPermissions.length}`}
                                  size="small"
                                  color={
                                    isFullySelected
                                      ? "success"
                                      : isPartiallySelected
                                      ? "warning"
                                      : "default"
                                  }
                                />
                              </Box>
                            </AccordionSummary>
                            <AccordionDetails>
                              <FormGroup>
                                {categoryPermissions.map((permission) => (
                                  <FormControlLabel
                                    key={permission.id}
                                    control={
                                      <Checkbox
                                        checked={
                                          watchedPermissionIds?.includes(
                                            permission.id
                                          ) || false
                                        }
                                        onChange={(e) =>
                                          handlePermissionChange(
                                            permission.id,
                                            e.target.checked
                                          )
                                        }
                                      />
                                    }
                                    label={
                                      <Box>
                                        <Box
                                          sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 1,
                                          }}
                                        >
                                          {getActionIcon(
                                            permission.name.split(".")[1] || "",
                                            {
                                              fontSize: "small",
                                              color: "action",
                                            }
                                          )}
                                          <Typography variant="body2">
                                            {formatPermissionName(
                                              permission.name
                                            )}
                                          </Typography>
                                        </Box>
                                        <Typography
                                          variant="caption"
                                          color="text.secondary"
                                          sx={{ ml: 3 }}
                                        >
                                          {permission.name}
                                        </Typography>
                                      </Box>
                                    }
                                  />
                                ))}
                              </FormGroup>
                            </AccordionDetails>
                          </Accordion>
                        );
                      })}
                    </Box>
                  )}
                </Box>
              </>
            )}

            {!allowPermissionAssignment && (
              <Typography variant="body2" color="text.secondary">
                {role
                  ? "Để quản lý quyền hạn, vui lòng sử dụng chức năng 'Chỉnh sửa' trong danh sách vai trò."
                  : "Sau khi tạo vai trò, bạn có thể gán quyền hạn cụ thể cho vai trò này."}
              </Typography>
            )}
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 3, pt: 2, gap: 1 }}>
          <Button onClick={handleClose} disabled={isSubmitting} color="inherit">
            Hủy
          </Button>

          <Button
            type="submit"
            variant="contained"
            disabled={isSubmitting}
            sx={{ borderRadius: 2 }}
          >
            {isSubmitting
              ? role
                ? "Đang cập nhật..."
                : "Đang tạo..."
              : role
              ? "Cập nhật"
              : "Tạo vai trò"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
