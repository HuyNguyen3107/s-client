/**
 * Profile Form Component
 * Following Single Responsibility Principle
 */

import React, { useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  Divider,
  IconButton,
  InputAdornment,
  Switch,
  FormControlLabel,
} from "@mui/material";
import {
  FaSave,
  FaUndo,
  FaEye,
  FaEyeSlash,
  FaLock,
  FaUser,
  FaEnvelope,
  FaPhone,
} from "react-icons/fa";
import { useProfileForm } from "../hooks";
import { PROFILE_SUCCESS_MESSAGES } from "../constants";

interface ProfileFormProps {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export const ProfileForm: React.FC<ProfileFormProps> = ({
  onSuccess,
  onError,
}) => {
  const {
    profile,
    formData,
    errors,
    isLoading,
    isUpdating,
    isEditingPassword,
    updateField,
    resetForm,
    resetPasswordFields,
    submitForm,
    setIsEditingPassword,
    updateFormFromProfile,
  } = useProfileForm();

  const [showCurrentPassword, setShowCurrentPassword] = React.useState(false);
  const [showNewPassword, setShowNewPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const [successMessage, setSuccessMessage] = React.useState<string>("");

  // Update form when profile is loaded
  useEffect(() => {
    if (profile) {
      updateFormFromProfile();
    }
  }, [profile, updateFormFromProfile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage("");

    const result = await submitForm();

    if (result.success) {
      setSuccessMessage(PROFILE_SUCCESS_MESSAGES.PROFILE_UPDATED);
      if (onSuccess) onSuccess();
    } else if (result.error) {
      if (onError) onError(result.error);
    }
  };

  const handleReset = () => {
    resetForm();
    setSuccessMessage("");
  };

  const handleTogglePasswordEdit = () => {
    if (isEditingPassword) {
      resetPasswordFields();
    }
    setIsEditingPassword(!isEditingPassword);
  };

  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: 400,
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Card>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
              Thông tin cá nhân
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Cập nhật thông tin tài khoản của bạn
            </Typography>
          </Box>

          {successMessage && (
            <Alert severity="success" sx={{ mb: 3 }}>
              {successMessage}
            </Alert>
          )}

          {/* Basic Information */}
          <Box sx={{ mb: 3 }}>
            <TextField
              fullWidth
              label="Họ và tên"
              value={formData.name || ""}
              onChange={(e) => updateField("name", e.target.value)}
              error={!!errors.name}
              helperText={errors.name}
              disabled={isUpdating}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <FaUser />
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              label="Email"
              type="email"
              value={formData.email || ""}
              disabled={true}
              helperText="Email không thể thay đổi"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <FaEnvelope />
                  </InputAdornment>
                ),
                readOnly: true,
              }}
              sx={{
                mb: 2,
                "& .MuiInputBase-input": {
                  color: "text.secondary",
                  cursor: "default",
                },
              }}
            />

            <TextField
              fullWidth
              label="Số điện thoại"
              value={formData.phone || ""}
              onChange={(e) => updateField("phone", e.target.value)}
              error={!!errors.phone}
              helperText={errors.phone}
              disabled={isUpdating}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <FaPhone />
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* Password Section */}
          <Box sx={{ mb: 3 }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                mb: 2,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <FaLock />
                <Typography variant="h6">Đổi mật khẩu</Typography>
              </Box>
              <FormControlLabel
                control={
                  <Switch
                    checked={isEditingPassword}
                    onChange={handleTogglePasswordEdit}
                    disabled={isUpdating}
                  />
                }
                label={isEditingPassword ? "Đang đổi" : "Không đổi"}
              />
            </Box>

            {isEditingPassword && (
              <>
                <TextField
                  fullWidth
                  label="Mật khẩu hiện tại"
                  type={showCurrentPassword ? "text" : "password"}
                  value={formData.currentPassword || ""}
                  onChange={(e) =>
                    updateField("currentPassword", e.target.value)
                  }
                  error={!!errors.currentPassword}
                  helperText={
                    errors.currentPassword ||
                    "Nhập mật khẩu hiện tại để xác nhận"
                  }
                  disabled={isUpdating}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() =>
                            setShowCurrentPassword(!showCurrentPassword)
                          }
                          edge="end"
                        >
                          {showCurrentPassword ? <FaEyeSlash /> : <FaEye />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{ mb: 2 }}
                />

                <TextField
                  fullWidth
                  label="Mật khẩu mới"
                  type={showNewPassword ? "text" : "password"}
                  value={formData.newPassword || ""}
                  onChange={(e) => updateField("newPassword", e.target.value)}
                  error={!!errors.newPassword}
                  helperText={errors.newPassword || "Tối thiểu 6 ký tự"}
                  disabled={isUpdating}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          edge="end"
                        >
                          {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{ mb: 2 }}
                />

                <TextField
                  fullWidth
                  label="Xác nhận mật khẩu mới"
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmPassword || ""}
                  onChange={(e) =>
                    updateField("confirmPassword", e.target.value)
                  }
                  error={!!errors.confirmPassword}
                  helperText={errors.confirmPassword || "Nhập lại mật khẩu mới"}
                  disabled={isUpdating}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                          edge="end"
                        >
                          {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </>
            )}
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* Action Buttons */}
          <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}>
            <Button
              variant="outlined"
              startIcon={<FaUndo />}
              onClick={handleReset}
              disabled={isUpdating}
            >
              Hủy bỏ
            </Button>
            <Button
              type="submit"
              variant="contained"
              startIcon={
                isUpdating ? <CircularProgress size={20} /> : <FaSave />
              }
              disabled={isUpdating}
            >
              {isUpdating ? "Đang lưu..." : "Lưu thay đổi"}
            </Button>
          </Box>
        </form>
      </CardContent>
    </Card>
  );
};

export default ProfileForm;
