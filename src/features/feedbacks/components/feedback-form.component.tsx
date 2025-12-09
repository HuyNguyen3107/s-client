import React, { useState, useRef } from "react";
import {
  Box,
  Button,
  Typography,
  Rating,
  Card,
  CardContent,
  Grid,
  IconButton,
  CircularProgress,
  Alert,
} from "@mui/material";
import { PhotoCamera, Close } from "@mui/icons-material";
import { useCreateFeedback } from "../hooks/use-create-feedback.hooks";
import { useUpdateFeedback } from "../hooks/use-update-feedback.hooks";
import { useImageUpload } from "../hooks/use-image-upload.hooks";
import FormInput from "../../../components/form-input.components";
import type { Feedback } from "../types/feedback.types";

interface FeedbackFormProps {
  feedback?: Feedback;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const FeedbackForm: React.FC<FeedbackFormProps> = ({
  feedback,
  onSuccess,
  onCancel,
}) => {
  const isEditing = !!feedback;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadError, setUploadError] = useState<string>("");

  const createFeedbackHook = useCreateFeedback();
  const updateFeedbackHook = useUpdateFeedback(feedback);
  const imageUploadHook = useImageUpload();

  const form = isEditing ? updateFeedbackHook : createFeedbackHook;
  const { control, handleSubmit, formState, watch, setValue, rules } = form;
  const watchedValues = watch();
  const rating = watchedValues?.rating;

  const handleImageSelect = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        setUploadError("");
        await imageUploadHook.uploadImage(file);
        setValue("imageUrl", imageUploadHook.uploadedImage);
      } catch (error) {
        setUploadError(
          error instanceof Error ? error.message : "Lỗi upload ảnh"
        );
      }
    }
  };

  const handleRemoveImage = () => {
    imageUploadHook.clearImage();
    setValue("imageUrl", "");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const onSubmit = () => {
    const imageUrl = imageUploadHook.uploadedImage || feedback?.imageUrl;

    if (!imageUrl) {
      setUploadError("Vui lòng chọn ảnh cho feedback");
      return;
    }

    setValue("imageUrl", imageUrl);
    form
      .onSubmit()
      .then(() => {
        onSuccess?.();
      })
      .catch((error) => {
        console.error("Error submitting feedback:", error);
      });
  };

  const isLoading = form.pending || imageUploadHook.uploading;
  const imagePreview = imageUploadHook.uploadedImage || feedback?.imageUrl;

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {isEditing ? "Chỉnh sửa feedback" : "Tạo feedback mới"}
        </Typography>

        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
          <Grid container spacing={3}>
            <Grid size={12}>
              <FormInput
                name="customerName"
                control={control}
                label="Tên khách hàng"
                rule={rules.customerName}
                fullWidth
                required
                disabled={isLoading}
              />
            </Grid>

            <Grid size={12}>
              <FormInput
                name="content"
                control={control}
                label="Nội dung feedback"
                rule={rules.content}
                fullWidth
                required
                multiline
                rows={4}
                disabled={isLoading}
              />
            </Grid>

            <Grid size={12}>
              <Box>
                <Typography component="legend" gutterBottom>
                  Đánh giá
                </Typography>
                <Rating
                  value={Number(rating) || 5}
                  onChange={(_, newValue) => {
                    setValue("rating", newValue || 1);
                  }}
                  size="large"
                  disabled={isLoading}
                />
              </Box>
            </Grid>

            <Grid size={12}>
              <Typography variant="subtitle1" gutterBottom>
                Hình ảnh
              </Typography>

              {uploadError && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {uploadError}
                </Alert>
              )}

              <Box sx={{ mb: 2 }}>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                  style={{ display: "none" }}
                  ref={fileInputRef}
                />
                <Button
                  variant="outlined"
                  component="span"
                  startIcon={<PhotoCamera />}
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isLoading}
                >
                  {imagePreview ? "Thay đổi ảnh" : "Chọn ảnh"}
                </Button>
              </Box>

              {imagePreview && (
                <Box position="relative" display="inline-block">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    style={{
                      maxWidth: "200px",
                      maxHeight: "200px",
                      objectFit: "cover",
                      borderRadius: "8px",
                    }}
                  />
                  <IconButton
                    size="small"
                    onClick={handleRemoveImage}
                    sx={{
                      position: "absolute",
                      top: 4,
                      right: 4,
                      backgroundColor: "rgba(0, 0, 0, 0.6)",
                      color: "white",
                      "&:hover": {
                        backgroundColor: "rgba(0, 0, 0, 0.8)",
                      },
                    }}
                    disabled={isLoading}
                  >
                    <Close fontSize="small" />
                  </IconButton>
                </Box>
              )}
            </Grid>

            <Grid size={12}>
              <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}>
                <Button
                  variant="outlined"
                  onClick={onCancel}
                  disabled={isLoading}
                >
                  Hủy
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={isLoading || !formState.isValid}
                  startIcon={isLoading ? <CircularProgress size={20} /> : null}
                >
                  {isEditing ? "Cập nhật" : "Tạo mới"}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </CardContent>
    </Card>
  );
};

export default FeedbackForm;
