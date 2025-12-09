import React from "react";
import {
  Box,
  Grid,
  TextField,
  FormControlLabel,
  Switch,
  Button,
  Typography,
  Card,
  CardContent,
  CardMedia,
  IconButton,
  LinearProgress,
  Chip,
  Alert,
  FormHelperText,
} from "@mui/material";
import {
  CloudUpload,
  Delete,
  PhotoLibrary,
  AutoAwesome,
} from "@mui/icons-material";
import { useCollectionForm } from "../hooks/use-collection-form.hooks";
import type { Collection } from "../types/collection.types";

interface CollectionFormProps {
  collection?: Collection;
  onSuccess?: () => void;
  onCancel?: () => void;
}

// Collection Form Component - Single Responsibility Principle (SRP)
const CollectionForm: React.FC<CollectionFormProps> = ({
  collection,
  onSuccess,
  onCancel,
}) => {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    errors,
    isEditMode,
    isValid,
    isDirty,
    isSubmitting,
    isUploading,
    uploadProgress,
    canSubmit,
    validationRules,
    handleCancel,
    handleImageUpload,
    generateSlug,
    watchedName,
    watchedSlug,
  } = useCollectionForm({
    collection,
    onSuccess,
    onCancel,
  });

  // Watch form values for UI updates
  const watchedImageUrl = watch("imageUrl");
  const watchedIsActive = watch("isActive");
  const watchedIsHot = watch("isHot");

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleImageUpload(file, "imageUrl");
    }
  };

  const handleRemoveImage = () => {
    setValue("imageUrl", "", { shouldValidate: true });
  };

  const handleGenerateSlug = () => {
    if (watchedName) {
      const slug = generateSlug(watchedName);
      setValue("slug", slug, { shouldValidate: true });
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate>
      <Grid container spacing={3}>
        {/* Basic Information */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Thông tin cơ bản
              </Typography>

              <Grid container spacing={2}>
                {/* Name */}
                <Grid size={{ xs: 12 }}>
                  <TextField
                    fullWidth
                    label="Tên bộ sưu tập"
                    placeholder="Nhập tên bộ sưu tập..."
                    error={!!errors.name}
                    helperText={errors.name?.message}
                    {...register("name", validationRules.name)}
                  />
                </Grid>

                {/* Slug */}
                <Grid size={{ xs: 12 }}>
                  <Box sx={{ display: "flex", gap: 1 }}>
                    <TextField
                      fullWidth
                      label="Đường dẫn (Slug)"
                      placeholder="duong-dan-bo-suu-tap"
                      error={!!errors.slug}
                      helperText={
                        errors.slug?.message ||
                        "Đường dẫn sẽ xuất hiện trong URL"
                      }
                      {...register("slug", validationRules.slug)}
                      InputProps={{
                        sx: { fontFamily: '"UTM-Avo", Arial, sans-serif' },
                      }}
                    />
                    <Button
                      variant="outlined"
                      onClick={handleGenerateSlug}
                      disabled={!watchedName}
                      startIcon={<AutoAwesome />}
                      sx={{ minWidth: 120 }}
                    >
                      Tự động
                    </Button>
                  </Box>
                  <Typography variant="caption" color="text.secondary">
                    Preview: /collections/{watchedSlug || "duong-dan"}
                  </Typography>
                </Grid>

                {/* Status Switches */}
                <Grid size={{ xs: 12 }}>
                  <Box
                    sx={{ display: "flex", flexDirection: "column", gap: 1 }}
                  >
                    <FormControlLabel
                      control={
                        <Switch
                          checked={watchedIsActive}
                          {...register("isActive")}
                        />
                      }
                      label="Kích hoạt bộ sưu tập"
                    />
                    <FormControlLabel
                      control={
                        <Switch checked={watchedIsHot} {...register("isHot")} />
                      }
                      label="Đánh dấu Hot"
                    />
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Images */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Hình ảnh
              </Typography>

              {/* Collection Image */}
              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  Ảnh bộ sưu tập
                </Typography>

                {watchedImageUrl ? (
                  <Card sx={{ position: "relative" }}>
                    <CardMedia
                      component="img"
                      height="200"
                      image={watchedImageUrl}
                      alt="Collection image"
                    />
                    <IconButton
                      sx={{
                        position: "absolute",
                        top: 8,
                        right: 8,
                        backgroundColor: "rgba(255, 255, 255, 0.9)",
                      }}
                      onClick={handleRemoveImage}
                    >
                      <Delete />
                    </IconButton>
                  </Card>
                ) : (
                  <Card
                    sx={{
                      height: 200,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      border: "2px dashed",
                      borderColor: "grey.300",
                      "&:hover": { borderColor: "primary.main" },
                    }}
                  >
                    <input
                      accept="image/*"
                      type="file"
                      id="image-upload"
                      style={{ display: "none" }}
                      onChange={handleFileUpload}
                    />
                    <label
                      htmlFor="image-upload"
                      style={{ cursor: "pointer", textAlign: "center" }}
                    >
                      <PhotoLibrary
                        sx={{ fontSize: 48, color: "grey.400", mb: 1 }}
                      />
                      <Typography variant="body2" color="text.secondary">
                        Chọn ảnh bộ sưu tập
                      </Typography>
                    </label>
                  </Card>
                )}

                {isUploading && (
                  <Box sx={{ mt: 1 }}>
                    <LinearProgress
                      variant="determinate"
                      value={uploadProgress}
                    />
                    <Typography variant="caption" color="text.secondary">
                      Đang tải lên... {uploadProgress}%
                    </Typography>
                  </Box>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Status Preview */}
        {(watchedIsActive || watchedIsHot) && (
          <Grid size={{ xs: 12 }}>
            <Alert severity="info" sx={{ mb: 2 }}>
              <Box
                sx={{
                  display: "flex",
                  gap: 1,
                  alignItems: "center",
                  flexWrap: "wrap",
                }}
              >
                <Typography variant="body2">Trạng thái:</Typography>
                {watchedIsActive && (
                  <Chip label="Hoạt động" color="success" size="small" />
                )}
                {watchedIsHot && (
                  <Chip label="Hot Collection" color="warning" size="small" />
                )}
              </Box>
            </Alert>
          </Grid>
        )}

        {/* Form Actions */}
        <Grid size={{ xs: 12 }}>
          <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}>
            <Button
              variant="outlined"
              onClick={handleCancel}
              disabled={isSubmitting}
            >
              Hủy
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={!canSubmit}
              startIcon={isSubmitting ? <CloudUpload /> : undefined}
            >
              {isSubmitting
                ? "Đang lưu..."
                : isEditMode
                ? "Cập nhật"
                : "Tạo mới"}
            </Button>
          </Box>

          {/* Form Status */}
          <Box sx={{ mt: 1 }}>
            {!isValid && isDirty && (
              <FormHelperText error>
                Vui lòng kiểm tra và sửa các lỗi trong form
              </FormHelperText>
            )}
            {!isDirty && <FormHelperText>Chưa có thay đổi nào</FormHelperText>}
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export { CollectionForm };
