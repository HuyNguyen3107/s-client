import React, { useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Switch,
  FormControlLabel,
  Box,
  Typography,
  Alert,
  CircularProgress,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import type { UserFormData, UserWithRelations, UserModalMode } from "../types";
import { USER_CONSTANTS } from "../constants";
import { UserValidator } from "../utils";

interface UserFormProps {
  open: boolean;
  mode: UserModalMode;
  user?: UserWithRelations;
  onClose: () => void;
  onSubmit: (data: UserFormData) => void;
  isSubmitting?: boolean;
  error?: Error | null;
}

/**
 * User Form Component - Following Single Responsibility Principle
 * Handles user creation and editing forms
 */
export const UserForm: React.FC<UserFormProps> = ({
  open,
  mode,
  user,
  onClose,
  onSubmit,
  isSubmitting = false,
  error,
}) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UserFormData>({
    defaultValues: USER_CONSTANTS.DEFAULT_USER_FORM,
  });

  // Get validation rules from centralized validator
  const validationRules = UserValidator.getReactHookFormRules();

  // Reset form when modal opens/closes or user changes
  useEffect(() => {
    if (open && user) {
      reset({
        name: user.name,
        email: user.email,
        phone: user.phone,
        password: "", // Always empty for security
        isActive: user.isActive,
      });
    } else if (open && !user) {
      reset(USER_CONSTANTS.DEFAULT_USER_FORM);
    }
  }, [open, user, reset]);

  const handleFormSubmit = (data: UserFormData) => {
    onSubmit(data);
  };

  const isEditing = mode === "edit";
  const isViewing = mode === "view";
  const title = isEditing
    ? "Cập nhật người dùng"
    : isViewing
    ? "Thông tin người dùng"
    : "Thêm người dùng mới";

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: { minHeight: "500px" },
      }}
    >
      <DialogTitle>
        <Typography variant="h6" component="div">
          {title}
        </Typography>
      </DialogTitle>

      <DialogContent dividers>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error.message}
          </Alert>
        )}

        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {/* Name Field */}
            <Controller
              name="name"
              control={control}
              rules={validationRules.name}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Tên người dùng"
                  fullWidth
                  variant="outlined"
                  error={!!errors.name}
                  helperText={errors.name?.message}
                  disabled={isViewing}
                />
              )}
            />

            {/* Email Field */}
            <Controller
              name="email"
              control={control}
              rules={validationRules.email}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Email"
                  type="email"
                  fullWidth
                  variant="outlined"
                  error={!!errors.email}
                  helperText={errors.email?.message}
                  disabled={isViewing}
                />
              )}
            />

            {/* Phone Field */}
            <Controller
              name="phone"
              control={control}
              rules={validationRules.phone}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Số điện thoại"
                  fullWidth
                  variant="outlined"
                  error={!!errors.phone}
                  helperText={errors.phone?.message}
                  disabled={isViewing}
                />
              )}
            />

            {/* Password Field */}
            {!isViewing && (
              <Controller
                name="password"
                control={control}
                rules={{
                  required: !isEditing ? "Mật khẩu là bắt buộc" : false,
                  ...validationRules.password,
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label={isEditing ? "Mật khẩu mới (tùy chọn)" : "Mật khẩu"}
                    type="password"
                    fullWidth
                    variant="outlined"
                    error={!!errors.password}
                    helperText={
                      errors.password?.message ||
                      (isEditing ? "Để trống nếu không muốn thay đổi" : "")
                    }
                    autoComplete="new-password"
                  />
                )}
              />
            )}

            {/* Status Field */}
            <Controller
              name="isActive"
              control={control}
              render={({ field }) => (
                <FormControlLabel
                  control={
                    <Switch
                      checked={field.value}
                      onChange={(e) => field.onChange(e.target.checked)}
                      disabled={isViewing}
                    />
                  }
                  label="Kích hoạt tài khoản"
                  sx={{ mt: 1 }}
                />
              )}
            />

            {/* User Roles Display (View mode only) */}
            {isViewing && user?.userRoles && user.userRoles.length > 0 && (
              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  Vai trò hiện tại:
                </Typography>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                  {user.userRoles.map((userRole: any) => (
                    <Typography
                      key={userRole.id}
                      variant="body2"
                      sx={{
                        backgroundColor: "primary.light",
                        color: "primary.contrastText",
                        px: 1,
                        py: 0.5,
                        borderRadius: 1,
                        fontSize: "0.75rem",
                      }}
                    >
                      {userRole.role.name}
                    </Typography>
                  ))}
                </Box>
              </Box>
            )}
          </Box>
        </form>
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} disabled={isSubmitting}>
          {isViewing ? "Đóng" : "Hủy bỏ"}
        </Button>

        {!isViewing && (
          <Button
            onClick={handleSubmit(handleFormSubmit)}
            variant="contained"
            disabled={isSubmitting}
            startIcon={
              isSubmitting ? <CircularProgress size={20} /> : undefined
            }
          >
            {isSubmitting
              ? isEditing
                ? "Đang cập nhật..."
                : "Đang tạo..."
              : isEditing
              ? "Cập nhật"
              : "Tạo người dùng"}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default UserForm;
