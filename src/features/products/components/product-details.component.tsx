import React from "react";
import {
  Box,
  Typography,
  Chip,
  Grid,
  Card,
  CardMedia,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Divider,
} from "@mui/material";
import { Category, Image, CheckCircle, Cancel } from "@mui/icons-material";
import type { ProductWithRelations } from "../types";

interface ProductDetailsProps {
  product: ProductWithRelations;
}

const ProductDetails: React.FC<ProductDetailsProps> = ({ product }) => {
  return (
    <Box sx={{ p: 2 }}>
      {/* Basic Info */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Thông tin cơ bản
          </Typography>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="body2" color="text.secondary">
                Tên sản phẩm
              </Typography>
              <Typography variant="body1" fontWeight="bold">
                {product.name}
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="body2" color="text.secondary">
                Bộ sưu tập
              </Typography>
              <Typography variant="body1">
                {product.collection?.name}
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="body2" color="text.secondary">
                Trạng thái
              </Typography>
              <Chip
                label={product.status || "active"}
                color={product.status === "active" ? "success" : "default"}
                size="small"
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="body2" color="text.secondary">
                Có background
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                {product.hasBg ? (
                  <CheckCircle color="success" />
                ) : (
                  <Cancel color="error" />
                )}
                <Typography variant="body1">
                  {product.hasBg ? "Có" : "Không"}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Categories */}
      {product.categories && product.categories.length > 0 && (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
              <Category color="primary" />
              <Typography variant="h6">Categories</Typography>
            </Box>
            <List>
              {product.categories.map((category, index) => (
                <React.Fragment key={category.id}>
                  <ListItem>
                    <ListItemText
                      primary={category.name}
                      secondary={`ID: ${category.id}`}
                    />
                  </ListItem>
                  {index < product.categories!.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          </CardContent>
        </Card>
      )}

      {/* Backgrounds */}
      {product.backgrounds && product.backgrounds.length > 0 && (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
              <Image color="primary" />
              <Typography variant="h6">Backgrounds</Typography>
            </Box>
            <Grid container spacing={2}>
              {product.backgrounds.map((background) => (
                <Grid size={{ xs: 12, sm: 6, md: 4 }} key={background.id}>
                  <Card variant="outlined">
                    <CardMedia
                      component="img"
                      height="140"
                      image={background.imageUrl}
                      alt={background.name || "Background"}
                      sx={{ objectFit: "cover" }}
                    />
                    <CardContent>
                      <Typography variant="subtitle2" gutterBottom>
                        {background.name || "Unnamed Background"}
                      </Typography>
                      {background.description && (
                        <Typography variant="body2" color="text.secondary">
                          {background.description}
                        </Typography>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>
      )}

      {/* Product Variants */}
      {product.productVariants && product.productVariants.length > 0 && (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Biến thể sản phẩm ({product.productVariants.length})
            </Typography>
            <List>
              {product.productVariants.map((variant, index) => (
                <React.Fragment key={variant.id}>
                  <ListItem>
                    <ListItemText
                      primary={variant.name}
                      secondary={
                        <Box>
                          <Typography variant="body2" component="span">
                            Giá: {variant.price.toLocaleString("vi-VN")} VNĐ
                          </Typography>
                          {variant.description && (
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{ mt: 0.5 }}
                            >
                              {variant.description}
                            </Typography>
                          )}
                          <Chip
                            label={variant.status || "active"}
                            color={
                              variant.status === "active"
                                ? "success"
                                : "default"
                            }
                            size="small"
                            sx={{ mt: 1 }}
                          />
                        </Box>
                      }
                    />
                  </ListItem>
                  {index < product.productVariants.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export { ProductDetails };
