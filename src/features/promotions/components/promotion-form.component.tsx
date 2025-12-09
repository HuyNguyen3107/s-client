import React from "react";
import {
  Box,
  TextField,
  Button,
  Grid,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  InputAdornment,
  Paper,
  FormHelperText,
} from "@mui/material";
import { Save, Cancel } from "@mui/icons-material";
import { usePromotionForm } from "../hooks/use-promotion-form.hooks";
import { PROMOTION_CONSTANTS } from "../constants/promotion.constants";
import type { Promotion } from "../types/promotion.types";
import { PromotionType } from "../types/promotion.types";

interface PromotionFormProps {
  promotion?: Promotion;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const PromotionForm: React.FC<PromotionFormProps> = ({
  promotion,
  onSuccess,
  onCancel,
}) => {
  const {
    formData,
    validationErrors,
    isEditing,
    isLoading,
    isSubmitting,
    updateField,
    submitForm,
  } = usePromotionForm(promotion?.id);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await submitForm(promotion?.id);
    if (success) {
      onSuccess?.();
    }
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5" component="h2" gutterBottom>
        {isEditing ? "Chỉnh sửa mã giảm giá" : "Tạo mã giảm giá mới"}
      </Typography>

      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
        <Grid container spacing={3}>
          {/* Basic Information */}
          <Grid size={{ xs: 12 }}>
            <Typography variant="h6" gutterBottom>
              Thông tin cơ bản
            </Typography>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              label="Tiêu đề"
              fullWidth
              value={formData.title}
              onChange={(e) => updateField("title", e.target.value)}
              error={!!validationErrors.title}
              helperText={validationErrors.title}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              label="Mã giảm giá"
              fullWidth
              value={formData.promoCode}
              onChange={(e) =>
                updateField("promoCode", e.target.value.toUpperCase())
              }
              error={!!validationErrors.promoCode}
              helperText={validationErrors.promoCode}
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <TextField
              label="Mô tả"
              multiline
              rows={3}
              fullWidth
              value={formData.description}
              onChange={(e) => updateField("description", e.target.value)}
              error={!!validationErrors.description}
              helperText={validationErrors.description}
            />
          </Grid>

          {/* Discount Configuration */}
          <Grid size={{ xs: 12 }}>
            <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
              Cấu hình giảm giá
            </Typography>
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <FormControl fullWidth error={!!validationErrors.type}>
              <InputLabel>Loại giảm giá</InputLabel>
              <Select
                label="Loại giảm giá"
                value={formData.type}
                onChange={(e) =>
                  updateField("type", e.target.value as PromotionType)
                }
              >
                {PROMOTION_CONSTANTS.PROMOTION_TYPES.map((type) => (
                  <MenuItem key={type.value} value={type.value}>
                    {type.label}
                  </MenuItem>
                ))}
              </Select>
              {validationErrors.type && (
                <FormHelperText>{validationErrors.type}</FormHelperText>
              )}
            </FormControl>
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <TextField
              label="Giá trị giảm"
              type="number"
              fullWidth
              value={formData.value}
              onChange={(e) => updateField("value", Number(e.target.value))}
              error={!!validationErrors.value}
              helperText={validationErrors.value}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    {formData.type === PromotionType.PERCENTAGE ? "%" : "VND"}
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <TextField
              label="Giảm tối đa"
              type="number"
              fullWidth
              value={formData.maxDiscountAmount}
              onChange={(e) => updateField("maxDiscountAmount", e.target.value)}
              error={!!validationErrors.maxDiscountAmount}
              helperText={
                validationErrors.maxDiscountAmount ||
                "Để trống nếu không giới hạn"
              }
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">VND</InputAdornment>
                ),
              }}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              label="Giá trị đơn hàng tối thiểu"
              type="number"
              fullWidth
              value={formData.minOrderValue}
              onChange={(e) => updateField("minOrderValue", e.target.value)}
              error={!!validationErrors.minOrderValue}
              helperText={
                validationErrors.minOrderValue ||
                "Để trống hoặc 0 nếu không yêu cầu tối thiểu"
              }
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">VND</InputAdornment>
                ),
              }}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              label="Giới hạn sử dụng"
              type="number"
              fullWidth
              value={formData.usageLimit || ""}
              onChange={(e) =>
                updateField(
                  "usageLimit",
                  e.target.value ? Number(e.target.value) : undefined
                )
              }
              error={!!validationErrors.usageLimit}
              helperText={
                validationErrors.usageLimit || "Để trống nếu không giới hạn"
              }
            />
          </Grid>

          {/* Date Configuration */}
          <Grid size={{ xs: 12 }}>
            <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
              Thời gian áp dụng
            </Typography>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              label="Ngày bắt đầu"
              type="datetime-local"
              fullWidth
              value={formData.startDate}
              onChange={(e) => updateField("startDate", e.target.value)}
              error={!!validationErrors.startDate}
              helperText={validationErrors.startDate}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              label="Ngày kết thúc"
              type="datetime-local"
              fullWidth
              value={formData.endDate}
              onChange={(e) => updateField("endDate", e.target.value)}
              error={!!validationErrors.endDate}
              helperText={
                validationErrors.endDate ||
                "Để trống nếu không giới hạn thời gian"
              }
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>

          {/* Status */}
          <Grid size={{ xs: 12 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={formData.isActive}
                  onChange={(e) => updateField("isActive", e.target.checked)}
                />
              }
              label="Kích hoạt mã giảm giá"
            />
          </Grid>

          {/* Actions */}
          <Grid size={{ xs: 12 }}>
            <Box sx={{ display: "flex", gap: 2, mt: 3 }}>
              <Button
                type="submit"
                variant="contained"
                disabled={isLoading || isSubmitting}
                startIcon={<Save />}
              >
                {isSubmitting
                  ? "Đang lưu..."
                  : isEditing
                  ? "Cập nhật"
                  : "Tạo mã giảm giá"}
              </Button>
              <Button
                type="button"
                variant="outlined"
                onClick={onCancel}
                disabled={isLoading || isSubmitting}
                startIcon={<Cancel />}
              >
                Hủy
              </Button>
            </Box>
          </Grid>
        </Grid>

        {/* Preview */}
        {Number(formData.value) > 0 && (
          <Box sx={{ mt: 4, p: 3, bgcolor: "grey.50", borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom>
              Xem trước
            </Typography>
            <Typography variant="body1">
              Mã giảm giá này sẽ giảm{" "}
              <strong>
                {formData.type === PromotionType.PERCENTAGE
                  ? `${Number(formData.value || 0)}%`
                  : `${Number(formData.value || 0).toLocaleString(
                      "vi-VN"
                    )} VND`}
              </strong>{" "}
              cho đơn hàng có giá trị từ{" "}
              <strong>
                {Number(formData.minOrderValue || 0).toLocaleString("vi-VN")}{" "}
                VND
              </strong>{" "}
              trở lên.
              {formData.maxDiscountAmount &&
                Number(formData.maxDiscountAmount) > 0 && (
                  <>
                    {" "}
                    Giảm tối đa{" "}
                    <strong>
                      {Number(formData.maxDiscountAmount).toLocaleString(
                        "vi-VN"
                      )}{" "}
                      VND
                    </strong>
                    .
                  </>
                )}
            </Typography>
          </Box>
        )}
      </Box>
    </Paper>
  );
};

export { PromotionForm };
