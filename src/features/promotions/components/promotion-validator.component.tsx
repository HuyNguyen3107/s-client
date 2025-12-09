import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Divider,
  Paper,
  Grid,
  Chip,
} from "@mui/material";
import { Check, Clear, LocalOffer } from "@mui/icons-material";
import { usePromotionValidator } from "../hooks/use-promotion-validator.hooks";
import type { ValidatePromotionRequest } from "../types/promotion.types";

interface PromotionValidatorComponentProps {
  onValidationResult?: (result: any) => void;
}

const PromotionValidatorComponent: React.FC<
  PromotionValidatorComponentProps
> = ({ onValidationResult }) => {
  const [formData, setFormData] = useState<ValidatePromotionRequest>({
    promoCode: "",
    orderValue: 0,
  });

  const { validationResult, validatePromotion, clearValidation, isValidating } =
    usePromotionValidator();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.promoCode.trim() || formData.orderValue <= 0) {
      return;
    }

    const result = await validatePromotion(formData);
    onValidationResult?.(result);
  };

  const handleClear = () => {
    setFormData({ promoCode: "", orderValue: 0 });
    clearValidation();
  };

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString("vi-VN") + " VND";
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" component="h2" gutterBottom>
          <LocalOffer sx={{ mr: 1, verticalAlign: "middle" }} />
          Kiểm tra Mã Giảm Giá
        </Typography>

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Mã giảm giá"
                placeholder="Nhập mã giảm giá"
                value={formData.promoCode}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    promoCode: e.target.value.toUpperCase(),
                  })
                }
                required
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                type="number"
                label="Giá trị đơn hàng"
                placeholder="Nhập giá trị đơn hàng"
                value={formData.orderValue || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    orderValue: Number(e.target.value),
                  })
                }
                required
                inputProps={{ min: 0 }}
              />
            </Grid>
          </Grid>

          <Box sx={{ display: "flex", gap: 2, mt: 3 }}>
            <Button
              type="submit"
              variant="contained"
              disabled={
                isValidating ||
                !formData.promoCode.trim() ||
                formData.orderValue <= 0
              }
              startIcon={
                isValidating ? <CircularProgress size={20} /> : <Check />
              }
            >
              {isValidating ? "Đang kiểm tra..." : "Kiểm tra"}
            </Button>
            <Button
              type="button"
              variant="outlined"
              onClick={handleClear}
              startIcon={<Clear />}
            >
              Xóa
            </Button>
          </Box>
        </Box>

        {/* Validation Result */}
        {validationResult && (
          <Box sx={{ mt: 3 }}>
            <Divider sx={{ mb: 2 }} />
            {validationResult.isValid ? (
              <Alert severity="success" sx={{ mb: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Mã giảm giá hợp lệ!
                </Typography>
                <Typography>
                  Bạn có thể sử dụng mã giảm giá này cho đơn hàng.
                </Typography>
              </Alert>
            ) : (
              <Alert severity="error" sx={{ mb: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Mã giảm giá không hợp lệ
                </Typography>
                <Typography>{validationResult.error}</Typography>
              </Alert>
            )}

            {/* Promotion Details */}
            {validationResult.isValid && validationResult.promotion && (
              <Paper sx={{ p: 3, bgcolor: "grey.50" }}>
                <Typography variant="h6" gutterBottom color="primary">
                  Chi tiết mã giảm giá
                </Typography>

                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Tiêu đề
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      {validationResult.promotion.title}
                    </Typography>

                    <Typography variant="subtitle2" gutterBottom sx={{ mt: 2 }}>
                      Mô tả
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {validationResult.promotion.description}
                    </Typography>
                  </Grid>

                  <Grid size={{ xs: 12, md: 6 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Loại giảm giá
                    </Typography>
                    <Chip
                      label={
                        validationResult.promotion.type === "PERCENTAGE"
                          ? "Phần trăm"
                          : "Số tiền cố định"
                      }
                      color="primary"
                      variant="outlined"
                      sx={{ mb: 2 }}
                    />

                    <Typography variant="subtitle2" gutterBottom>
                      Giá trị giảm
                    </Typography>
                    <Typography variant="h5" color="primary" gutterBottom>
                      {validationResult.promotion.type === "PERCENTAGE"
                        ? `${validationResult.promotion.value}%`
                        : formatCurrency(validationResult.promotion.value)}
                    </Typography>
                  </Grid>

                  <Grid size={{ xs: 12 }}>
                    <Divider sx={{ my: 2 }} />
                    <Grid container spacing={2}>
                      <Grid size={{ xs: 12, sm: 4 }}>
                        <Typography variant="subtitle2" gutterBottom>
                          Đơn hàng tối thiểu
                        </Typography>
                        <Typography variant="body1">
                          {formatCurrency(
                            validationResult.promotion.minOrderValue
                          )}
                        </Typography>
                      </Grid>
                      <Grid size={{ xs: 12, sm: 4 }}>
                        <Typography variant="subtitle2" gutterBottom>
                          Giảm tối đa
                        </Typography>
                        <Typography variant="body1">
                          {formatCurrency(
                            validationResult.promotion.maxDiscountAmount ?? 0
                          )}
                        </Typography>
                      </Grid>
                      <Grid size={{ xs: 12, sm: 4 }}>
                        <Typography variant="subtitle2" gutterBottom>
                          Số tiền được giảm
                        </Typography>
                        <Typography variant="h6" color="success.main">
                          {formatCurrency(validationResult.discountAmount || 0)}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Grid>

                  {validationResult.promotion.usageLimit && (
                    <Grid size={{ xs: 12 }}>
                      <Divider sx={{ my: 2 }} />
                      <Typography variant="subtitle2" gutterBottom>
                        Tình trạng sử dụng
                      </Typography>
                      <Typography variant="body1">
                        Đã sử dụng: {validationResult.promotion.usageCount || 0}
                        /{validationResult.promotion.usageLimit}
                      </Typography>
                    </Grid>
                  )}
                </Grid>
              </Paper>
            )}

            {/* Summary */}
            {validationResult.isValid && validationResult.discountAmount && (
              <Alert severity="info" sx={{ mt: 2 }}>
                <Typography variant="body1">
                  <strong>Tóm tắt:</strong> Với đơn hàng{" "}
                  {formatCurrency(formData.orderValue)}, bạn sẽ được giảm{" "}
                  <strong>
                    {formatCurrency(validationResult.discountAmount)}
                  </strong>
                  . Tổng thanh toán:{" "}
                  <strong>
                    {formatCurrency(
                      formData.orderValue - validationResult.discountAmount
                    )}
                  </strong>
                </Typography>
              </Alert>
            )}
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export { PromotionValidatorComponent };
