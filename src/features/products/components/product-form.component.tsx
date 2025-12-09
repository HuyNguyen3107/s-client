import React from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Grid,
  Alert,
  CircularProgress,
  FormControlLabel,
  Switch,
} from "@mui/material";
import { Controller } from "react-hook-form";
import { useProductForm } from "../hooks";
import { useQuery } from "@tanstack/react-query";
import { API_PATHS } from "../../../constants/api-path.constants";
import http from "../../../libs/http.libs";
import type { ProductWithRelations, Collection, ApiResponse } from "../types";
import { PRODUCT_CONSTANTS } from "../constants";

interface ProductFormProps {
  product?: ProductWithRelations;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const ProductForm: React.FC<ProductFormProps> = ({
  product,
  onSuccess,
  onCancel,
}) => {
  const {
    form: {
      control,
      formState: { errors },
    },
    isEditing,
    isSubmitting,
    onSubmit,
    onCancel: handleCancel,
  } = useProductForm({ product, onSuccess });

  // Fetch collections for dropdown
  const { data: collectionsData, isLoading: collectionsLoading } = useQuery({
    queryKey: ["collections"],
    queryFn: async () => {
      const response = await http.get<ApiResponse<Collection[]>>(
        API_PATHS.COLLECTIONS
      );
      return response.data.data || [];
    },
  });

  const handleFormCancel = () => {
    handleCancel();
    onCancel?.();
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {isEditing ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm mới"}
        </Typography>

        <Box component="form" onSubmit={onSubmit} sx={{ mt: 2 }}>
          <Grid container spacing={3}>
            {/* Product Name */}
            <Grid size={{ xs: 12 }}>
              <Controller
                name="name"
                control={control}
                rules={{
                  required: "Tên sản phẩm là bắt buộc",
                  minLength: {
                    value: PRODUCT_CONSTANTS.VALIDATION.NAME_MIN_LENGTH,
                    message: `Tên sản phẩm phải có ít nhất ${PRODUCT_CONSTANTS.VALIDATION.NAME_MIN_LENGTH} ký tự`,
                  },
                  maxLength: {
                    value: PRODUCT_CONSTANTS.VALIDATION.NAME_MAX_LENGTH,
                    message: `Tên sản phẩm không được vượt quá ${PRODUCT_CONSTANTS.VALIDATION.NAME_MAX_LENGTH} ký tự`,
                  },
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Tên sản phẩm"
                    placeholder="Nhập tên sản phẩm..."
                    error={!!errors.name}
                    helperText={errors.name?.message}
                    disabled={isSubmitting}
                  />
                )}
              />
            </Grid>

            {/* Collection */}
            <Grid size={{ xs: 12 }}>
              <Controller
                name="collectionId"
                control={control}
                rules={{
                  required: "Bộ sưu tập là bắt buộc",
                }}
                render={({ field }) => (
                  <FormControl fullWidth error={!!errors.collectionId}>
                    <InputLabel>Bộ sưu tập</InputLabel>
                    <Select
                      {...field}
                      label="Bộ sưu tập"
                      disabled={isSubmitting || collectionsLoading}
                    >
                      {collectionsLoading ? (
                        <MenuItem disabled>
                          <CircularProgress size={20} sx={{ mr: 1 }} />
                          Đang tải...
                        </MenuItem>
                      ) : (
                        collectionsData?.map((collection) => (
                          <MenuItem key={collection.id} value={collection.id}>
                            {collection.name}
                          </MenuItem>
                        ))
                      )}
                    </Select>
                    {errors.collectionId && (
                      <Alert severity="error" sx={{ mt: 1 }}>
                        {errors.collectionId.message}
                      </Alert>
                    )}
                  </FormControl>
                )}
              />
            </Grid>

            {/* Status */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth>
                    <InputLabel>Trạng thái</InputLabel>
                    <Select
                      {...field}
                      label="Trạng thái"
                      disabled={isSubmitting}
                    >
                      {PRODUCT_CONSTANTS.STATUS_OPTIONS.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}
              />
            </Grid>

            {/* Has Background */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Controller
                name="hasBg"
                control={control}
                render={({ field }) => (
                  <FormControlLabel
                    control={
                      <Switch
                        checked={field.value || false}
                        onChange={(e) => field.onChange(e.target.checked)}
                        disabled={isSubmitting}
                      />
                    }
                    label="Có background"
                    sx={{ mt: 2 }}
                  />
                )}
              />
            </Grid>
          </Grid>

          {/* Form Actions */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              gap: 2,
              mt: 3,
            }}
          >
            <Button
              variant="outlined"
              onClick={handleFormCancel}
              disabled={isSubmitting}
            >
              Hủy
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={isSubmitting}
              sx={{ minWidth: 120 }}
            >
              {isSubmitting ? (
                <CircularProgress size={20} color="inherit" />
              ) : isEditing ? (
                "Cập nhật"
              ) : (
                "Tạo mới"
              )}
            </Button>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export { ProductForm };
