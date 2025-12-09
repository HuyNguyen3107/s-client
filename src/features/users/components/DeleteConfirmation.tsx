import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Alert,
  CircularProgress,
} from "@mui/material";
import { Warning as WarningIcon } from "@mui/icons-material";
import type { UserWithRelations } from "../types";

interface DeleteConfirmationProps {
  open: boolean;
  user?: UserWithRelations;
  onClose: () => void;
  onConfirm: () => void;
  isDeleting?: boolean;
  error?: Error | null;
}

/**
 * Delete Confirmation Component - Following Single Responsibility Principle
 * Handles user deletion confirmation dialog
 */
export const DeleteConfirmation: React.FC<DeleteConfirmationProps> = ({
  open,
  user,
  onClose,
  onConfirm,
  isDeleting = false,
  error,
}) => {
  if (!user) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <WarningIcon color="warning" />
          <Typography variant="h6" component="div">
            Xác nhận xóa người dùng
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error.message}
          </Alert>
        )}

        <Typography variant="body1" sx={{ mb: 2 }}>
          Bạn có chắc chắn muốn xóa người dùng này không? Hành động này không
          thể hoàn tác.
        </Typography>

        <Box
          sx={{
            bgcolor: "grey.100",
            p: 2,
            borderRadius: 1,
            border: "1px solid",
            borderColor: "grey.300",
          }}
        >
          <Typography variant="subtitle2" gutterBottom>
            Thông tin người dùng sẽ bị xóa:
          </Typography>
          <Box sx={{ pl: 2 }}>
            <Typography variant="body2">
              <strong>Tên:</strong> {user.name}
            </Typography>
            <Typography variant="body2">
              <strong>Email:</strong> {user.email}
            </Typography>
            <Typography variant="body2">
              <strong>Số điện thoại:</strong> {user.phone}
            </Typography>
            {user.userRoles && user.userRoles.length > 0 && (
              <Typography variant="body2">
                <strong>Vai trò:</strong>{" "}
                {user.userRoles.map((ur: any) => ur.role.name).join(", ")}
              </Typography>
            )}
          </Box>
        </Box>

        <Alert severity="warning" sx={{ mt: 2 }}>
          <Typography variant="body2">
            <strong>Lưu ý:</strong> Việc xóa người dùng sẽ:
          </Typography>
          <Box component="ul" sx={{ pl: 2, mb: 0 }}>
            <li>Xóa vĩnh viễn tất cả thông tin của người dùng</li>
            <li>Xóa tất cả vai trò được gán cho người dùng</li>
            <li>Người dùng sẽ không thể đăng nhập vào hệ thống</li>
            <li>Hành động này không thể hoàn tác</li>
          </Box>
        </Alert>
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} disabled={isDeleting} variant="outlined">
          Hủy bỏ
        </Button>
        <Button
          onClick={onConfirm}
          color="error"
          variant="contained"
          disabled={isDeleting}
          startIcon={isDeleting ? <CircularProgress size={20} /> : undefined}
        >
          {isDeleting ? "Đang xóa..." : "Xóa người dùng"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteConfirmation;
