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
} from "@mui/material";
import { Warning, Delete } from "@mui/icons-material";

/**
 * Delete Confirm Dialog Component
 * Reusable confirmation dialog for delete actions
 */

interface DeleteConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
  itemName?: string;
  isDeleting?: boolean;
}

export const DeleteConfirmDialog: React.FC<DeleteConfirmDialogProps> = ({
  open,
  onClose,
  onConfirm,
  title = "Xác nhận xóa",
  message,
  itemName,
  isDeleting = false,
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          bgcolor: "error.50",
          color: "error.dark",
          py: 2.5,
          px: 3,
          fontWeight: 600,
          fontSize: "1.25rem",
        }}
      >
        <Warning sx={{ fontSize: 28 }} />
        {title}
      </DialogTitle>

      <DialogContent sx={{ p: 3, pt: 3 }}>
        <Box sx={{ mb: 2 }}>
          <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.6 }}>
            {message ||
              "Bạn có chắc chắn muốn xóa hình nền này? Hành động này không thể hoàn tác."}
          </Typography>

          {itemName && (
            <Alert
              severity="warning"
              icon={false}
              sx={{
                bgcolor: "warning.50",
                border: "1px solid",
                borderColor: "warning.200",
                borderRadius: 2,
                "& .MuiAlert-message": {
                  width: "100%",
                },
              }}
            >
              <Typography
                variant="body2"
                sx={{ fontWeight: 600, color: "warning.dark", mb: 0.5 }}
              >
                Hình nền sẽ bị xóa:
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  fontWeight: 700,
                  color: "text.primary",
                  mt: 0.5,
                  p: 1.5,
                  bgcolor: "white",
                  borderRadius: 1,
                  border: "1px solid",
                  borderColor: "grey.200",
                }}
              >
                {itemName}
              </Typography>
            </Alert>
          )}
        </Box>
      </DialogContent>

      <DialogActions
        sx={{
          p: 3,
          pt: 2,
          gap: 2,
          bgcolor: "grey.50",
          borderTop: "1px solid",
          borderColor: "divider",
        }}
      >
        <Button
          onClick={onClose}
          disabled={isDeleting}
          variant="outlined"
          size="large"
          sx={{
            px: 3,
            py: 1.5,
            borderRadius: 2,
            fontWeight: 600,
            borderColor: "grey.300",
            color: "text.primary",
            "&:hover": {
              borderColor: "grey.400",
              bgcolor: "grey.100",
            },
          }}
        >
          Hủy bỏ
        </Button>
        <Button
          onClick={onConfirm}
          disabled={isDeleting}
          variant="contained"
          color="error"
          startIcon={<Delete />}
          size="large"
          sx={{
            px: 3,
            py: 1.5,
            borderRadius: 2,
            fontWeight: 600,
            bgcolor: "error.main",
            "&:hover": {
              bgcolor: "error.dark",
              transform: "translateY(-1px)",
              boxShadow: "0 4px 12px rgba(211, 47, 47, 0.3)",
            },
          }}
        >
          {isDeleting ? "Đang xóa..." : "Xác nhận xóa"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
