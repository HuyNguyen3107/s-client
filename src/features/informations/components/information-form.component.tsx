import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Alert,
  CircularProgress,
  Typography,
  Tabs,
  Tab,
} from "@mui/material";
import {
  useCreateInformationMutation,
  useUpdateInformationMutation,
} from "../mutations/information.mutations";
import type {
  Information,
  CreateInformationRequest,
} from "../types/information.types";
import { InformationConfigBuilder } from "./information-config-builder.component";

interface InformationFormProps {
  open: boolean;
  onClose: () => void;
  information?: Information | null;
  onSuccess?: () => void;
}

interface FormData extends CreateInformationRequest {
  id?: string;
  name?: string;
  description?: string;
}

interface FormErrors {
  config?: string;
  name?: string;
  description?: string;
}

export const InformationForm: React.FC<InformationFormProps> = ({
  open,
  onClose,
  information,
  onSuccess,
}) => {
  const [activeTab, setActiveTab] = useState(0);
  const [formData, setFormData] = useState<FormData>({
    config: {},
    name: "",
    description: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});

  const isEditing = !!information;

  // Hooks
  const createMutation = useCreateInformationMutation();
  const updateMutation = useUpdateInformationMutation();

  // Update form when information changes
  useEffect(() => {
    if (information) {
      setFormData({
        id: information.id,
        config: information.config || {},
        name: (information.config as any)?.name || "",
        description: (information.config as any)?.description || "",
      });
    } else {
      setFormData({
        config: {},
        name: "",
        description: "",
      });
    }
    setErrors({});
    setActiveTab(0);
  }, [information, open]);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.config || Object.keys(formData.config).length === 0) {
      newErrors.config = "Cấu hình không được để trống";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      // Include name and description in config
      const finalConfig = {
        ...formData.config,
        name: formData.name,
        description: formData.description,
      };

      const submitData = {
        config: finalConfig,
      };

      if (isEditing && formData.id) {
        await updateMutation.mutateAsync({
          id: formData.id,
          ...submitData,
        });
      } else {
        await createMutation.mutateAsync(submitData);
      }

      onSuccess?.();
      handleClose();
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const handleClose = () => {
    setFormData({
      config: {},
      name: "",
      description: "",
    });
    setErrors({});
    setActiveTab(0);
    onClose();
  };

  const handleInputChange =
    (field: keyof FormData) => (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      setFormData((prev) => ({ ...prev, [field]: value }));

      // Clear error when user starts typing
      if (errors[field as keyof FormErrors]) {
        setErrors((prev) => ({ ...prev, [field]: undefined }));
      }
    };

  const handleConfigChange = (config: Record<string, any>) => {
    setFormData((prev) => ({ ...prev, config }));
    if (errors.config) {
      setErrors((prev) => ({ ...prev, config: undefined }));
    }
  };

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          minHeight: "600px",
          borderRadius: 3,
          boxShadow: "0 20px 60px rgba(0,0,0,0.1)",
        },
      }}
    >
      <DialogTitle
        sx={{
          bgcolor: "primary.main",
          color: "white",
          py: 3,
          fontSize: "1.5rem",
          fontWeight: 600,
        }}
      >
        {isEditing ? "Chỉnh sửa Thông tin" : "Thêm Thông tin mới"}
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent
          dividers
          sx={{
            p: 0,
            bgcolor: "grey.50",
          }}
        >
          {/* Tabs */}
          <Box
            sx={{ borderBottom: 1, borderColor: "divider", bgcolor: "white" }}
          >
            <Tabs
              value={activeTab}
              onChange={(_, newValue) => setActiveTab(newValue)}
              sx={{ px: 4, pt: 2 }}
            >
              <Tab label="Thông tin cơ bản" />
              <Tab label="Cấu hình form" />
            </Tabs>
          </Box>

          {/* Tab Panel 0: Basic Info */}
          {activeTab === 0 && (
            <Box sx={{ p: 4 }}>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
                {/* Error Messages */}
                {(createMutation.error || updateMutation.error) && (
                  <Alert severity="error">
                    {createMutation.error?.message ||
                      updateMutation.error?.message ||
                      "Có lỗi xảy ra"}
                  </Alert>
                )}

                {/* Name Field */}
                <TextField
                  fullWidth
                  label="Tên cấu hình"
                  value={formData.name}
                  onChange={handleInputChange("name")}
                  error={Boolean(errors.name)}
                  helperText={errors.name}
                  placeholder="Nhập tên cấu hình (tùy chọn)"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      bgcolor: "white",
                      borderRadius: 2,
                    },
                  }}
                />

                {/* Description Field */}
                <TextField
                  fullWidth
                  label="Mô tả"
                  value={formData.description}
                  onChange={handleInputChange("description")}
                  error={Boolean(errors.description)}
                  helperText={errors.description}
                  multiline
                  rows={4}
                  placeholder="Nhập mô tả cấu hình (tùy chọn)"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      bgcolor: "white",
                      borderRadius: 2,
                    },
                  }}
                />
              </Box>
            </Box>
          )}

          {/* Tab Panel 1: Configuration */}
          {activeTab === 1 && (
            <Box sx={{ p: 4 }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Tạo cấu hình cho thông tin của bạn. Bạn có thể định nghĩa các
                trường form, validation rules, và metadata dưới dạng JSON.
              </Typography>

              <InformationConfigBuilder
                config={formData.config}
                onChange={handleConfigChange}
              />

              {errors.config && (
                <Typography
                  variant="caption"
                  color="error"
                  display="block"
                  sx={{ mt: 1 }}
                >
                  {errors.config}
                </Typography>
              )}
            </Box>
          )}
        </DialogContent>

        <DialogActions
          sx={{
            p: 4,
            gap: 2,
            bgcolor: "white",
            borderTop: "1px solid",
            borderColor: "divider",
          }}
        >
          <Button
            onClick={handleClose}
            disabled={isSubmitting}
            size="large"
            sx={{
              px: 3,
              py: 1.5,
              borderRadius: 2,
              fontWeight: 600,
            }}
          >
            Hủy
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={isSubmitting}
            startIcon={isSubmitting ? <CircularProgress size={20} /> : null}
            size="large"
            sx={{
              px: 4,
              py: 1.5,
              borderRadius: 2,
              fontWeight: 600,
              backgroundColor: "#731618",
              "&:hover": {
                backgroundColor: "#5f0d10",
                transform: "translateY(-1px)",
              },
            }}
          >
            {isSubmitting
              ? "Đang xử lý..."
              : isEditing
              ? "Cập nhật"
              : "Tạo mới"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
