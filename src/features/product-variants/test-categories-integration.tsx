import React from "react";
import {
  Box,
  Typography,
  CircularProgress,
  List,
  ListItem,
} from "@mui/material";
import { useProductCategoryList } from "../product-categories/hooks/use-product-category-list.hooks";

// Test component to verify product categories API integration
export const TestCategoriesIntegration: React.FC = () => {
  const {
    data: categoriesData,
    isLoading: categoriesLoading,
    error: categoriesError,
  } = useProductCategoryList({
    limit: 10, // Get first 10 categories for testing
    sortBy: "name",
    sortOrder: "asc",
  });

  if (categoriesLoading) {
    return (
      <Box sx={{ p: 2, textAlign: "center" }}>
        <CircularProgress />
        <Typography sx={{ mt: 1 }}>Loading categories...</Typography>
      </Box>
    );
  }

  if (categoriesError) {
    return (
      <Box sx={{ p: 2, color: "error.main" }}>
        <Typography>
          Error loading categories: {categoriesError.message}
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Product Categories Test ({categoriesData?.data?.length || 0} found)
      </Typography>

      {categoriesData?.data && categoriesData.data.length > 0 ? (
        <List>
          {categoriesData.data.map((category) => (
            <ListItem key={category.id}>
              <Typography>
                {category.name} (ID: {category.id})
              </Typography>
            </ListItem>
          ))}
        </List>
      ) : (
        <Typography color="text.secondary">No categories found</Typography>
      )}
    </Box>
  );
};
