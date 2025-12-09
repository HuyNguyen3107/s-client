import React, { useState, useCallback } from "react";
import {
  Box,
  TextField,
  Button,
  IconButton,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Chip,
  Tabs,
  Tab,
  Autocomplete,
  Avatar,
} from "@mui/material";
import { Add as AddIcon, Delete as DeleteIcon } from "@mui/icons-material";
import { type ProductCustom } from "../services/product-customs.service";
import { useProductCustomsAutocomplete } from "../hooks/use-product-customs.hooks";

// Local interfaces

interface EndowCustomProduct {
  id: string;
  productCustomId: string;
  productCustom?: ProductCustom;
  quantity: number;
  isActive: boolean;
  priority: number;
}

interface EndowSystem {
  endows: string[];
  customProducts: EndowCustomProduct[];
}

interface EndowManagerProps {
  value?: EndowSystem;
  onChange: (value: EndowSystem) => void;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
}

const EndowManager: React.FC<EndowManagerProps> = ({
  value,
  onChange,
  label = "Quản lý ưu đãi",
  placeholder = "Nhập nội dung ưu đãi...",
  disabled = false,
}) => {
  const [activeTab, setActiveTab] = useState(0);
  const [newEndowContent, setNewEndowContent] = useState("");
  const [selectedProductCustom, setSelectedProductCustom] =
    useState<ProductCustom | null>(null);
  const [customProductQuantity, setCustomProductQuantity] = useState(1);

  // Use real API data
  const {
    inputValue: productSearchValue,
    setInputValue: setProductSearchValue,
    options: productCustomsOptions,
    loading: loadingProducts,
  } = useProductCustomsAutocomplete();

  const endowSystem: EndowSystem = {
    endows: value?.endows || [],
    customProducts: value?.customProducts || [],
  };

  // Handle text endows
  const addEndowItem = useCallback(() => {
    if (!newEndowContent.trim()) return;

    const updatedSystem: EndowSystem = {
      ...endowSystem,
      endows: [...endowSystem.endows, newEndowContent.trim()],
    };

    onChange(updatedSystem);
    setNewEndowContent("");
  }, [newEndowContent, endowSystem, onChange]);

  const removeEndowItem = useCallback(
    (index: number) => {
      const updatedSystem: EndowSystem = {
        ...endowSystem,
        endows: endowSystem.endows.filter((_, i) => i !== index),
      };
      onChange(updatedSystem);
    },
    [endowSystem, onChange]
  );

  // Handle custom products
  const addProductCustom = useCallback(() => {
    if (!selectedProductCustom) return;

    const newCustomProduct: EndowCustomProduct = {
      id: `custom_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      productCustomId: selectedProductCustom.id,
      productCustom: selectedProductCustom,
      quantity: customProductQuantity,
      isActive: true,
      priority: endowSystem.customProducts.length + 1,
    };

    const updatedSystem: EndowSystem = {
      ...endowSystem,
      customProducts: [...endowSystem.customProducts, newCustomProduct],
    };

    onChange(updatedSystem);
    setSelectedProductCustom(null);
    setCustomProductQuantity(1);
  }, [selectedProductCustom, customProductQuantity, endowSystem, onChange]);

  const removeProductCustom = useCallback(
    (id: string) => {
      const updatedSystem: EndowSystem = {
        ...endowSystem,
        customProducts: endowSystem.customProducts.filter(
          (item) => item.id !== id
        ),
      };
      onChange(updatedSystem);
    },
    [endowSystem, onChange]
  );

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        {label}
      </Typography>

      {/* Tabs */}
      <Tabs value={activeTab} onChange={handleTabChange} sx={{ mb: 2 }}>
        <Tab
          label={
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              Nội dung ưu đãi
              <Chip
                label={endowSystem.endows.length}
                size="small"
                color="primary"
                variant="outlined"
              />
            </Box>
          }
        />
        <Tab
          label={
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              Sản phẩm tùy chỉnh
              <Chip
                label={endowSystem.customProducts.length}
                size="small"
                color="secondary"
                variant="outlined"
              />
            </Box>
          }
        />
      </Tabs>

      {/* Tab Content */}
      {activeTab === 0 && (
        <>
          {/* Add New Endow */}
          <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
            <TextField
              fullWidth
              size="small"
              value={newEndowContent}
              onChange={(e) => setNewEndowContent(e.target.value)}
              placeholder={placeholder}
              disabled={disabled}
              onKeyPress={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  addEndowItem();
                }
              }}
              multiline
              maxRows={3}
            />
            <Button
              variant="contained"
              onClick={addEndowItem}
              disabled={disabled || !newEndowContent.trim()}
              sx={{ minWidth: "auto", px: 2 }}
            >
              <AddIcon />
            </Button>
          </Box>

          {/* Text Endows Display */}
          {endowSystem.endows.length > 0 ? (
            <List>
              {endowSystem.endows.map((endow, index) => (
                <ListItem
                  key={`endow-${index}-${endow.slice(0, 10)}`}
                  sx={{
                    border: "1px solid",
                    borderColor: "divider",
                    borderRadius: 1,
                    mb: 1,
                    bgcolor: "background.paper",
                  }}
                >
                  <ListItemText
                    primary={
                      <Typography variant="body2" sx={{ fontSize: "0.875rem" }}>
                        {endow}
                      </Typography>
                    }
                  />
                  <ListItemSecondaryAction>
                    <IconButton
                      edge="end"
                      onClick={() => removeEndowItem(index)}
                      disabled={disabled}
                      size="small"
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          ) : (
            <Box sx={{ textAlign: "center", py: 4, color: "text.secondary" }}>
              <Typography variant="body2">
                Chưa có ưu đãi nào. Thêm ưu đãi đầu tiên bằng cách nhập nội dung
                ở trên.
              </Typography>
            </Box>
          )}
        </>
      )}

      {activeTab === 1 && (
        <>
          {/* Add Custom Product */}
          <Box sx={{ mb: 2 }}>
            <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
              <Autocomplete
                sx={{ flex: 1 }}
                options={productCustomsOptions}
                getOptionLabel={(option) => option.name}
                value={selectedProductCustom}
                onChange={(_, newValue) => {
                  setSelectedProductCustom(newValue);
                  // If clearing selection, reset search to trigger loading initial options
                  if (!newValue) {
                    setProductSearchValue("");
                  }
                }}
                inputValue={productSearchValue}
                onInputChange={(_, newInputValue) =>
                  setProductSearchValue(newInputValue)
                }
                loading={loadingProducts}
                filterOptions={(x) => x} // Disable client-side filtering as we use server-side search
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Chọn sản phẩm tùy chỉnh"
                    size="small"
                    placeholder="Tìm kiếm sản phẩm..."
                  />
                )}
                renderOption={(props, option) => {
                  const { key, ...otherProps } = props;
                  return (
                    <Box
                      component="li"
                      key={key}
                      {...otherProps}
                      sx={{ display: "flex", alignItems: "center", gap: 1 }}
                    >
                      <Avatar
                        src={option.imageUrl}
                        sx={{ width: 24, height: 24 }}
                      >
                        {option.name[0]}
                      </Avatar>
                      <Box>
                        <Typography variant="body2">{option.name}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {new Intl.NumberFormat("vi-VN", {
                            style: "currency",
                            currency: "VND",
                          }).format(parseInt(option.price) || 0)}
                        </Typography>
                      </Box>
                    </Box>
                  );
                }}
              />
              <TextField
                type="number"
                size="small"
                label="Số lượng"
                value={customProductQuantity}
                onChange={(e) =>
                  setCustomProductQuantity(
                    Math.max(1, parseInt(e.target.value) || 1)
                  )
                }
                sx={{ width: 100 }}
                InputProps={{
                  inputProps: { min: 1 },
                }}
              />
              <Button
                variant="contained"
                onClick={addProductCustom}
                disabled={disabled || !selectedProductCustom}
                sx={{ minWidth: "auto", px: 2 }}
              >
                <AddIcon />
              </Button>
            </Box>
          </Box>

          {/* Custom Products Display */}
          {endowSystem.customProducts.length > 0 ? (
            <List>
              {endowSystem.customProducts.map((item) => (
                <ListItem
                  key={item.id}
                  sx={{
                    border: "1px solid",
                    borderColor: "divider",
                    borderRadius: 1,
                    mb: 1,
                    bgcolor: "background.paper",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                      width: "100%",
                    }}
                  >
                    <Avatar
                      src={item.productCustom?.imageUrl}
                      sx={{ width: 40, height: 40 }}
                    >
                      {item.productCustom?.name?.[0] || "?"}
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="body2" fontWeight="medium">
                        {item.productCustom?.name ||
                          `Sản phẩm ID: ${item.productCustomId}`}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {item.productCustom ? (
                          <>
                            {new Intl.NumberFormat("vi-VN", {
                              style: "currency",
                              currency: "VND",
                            }).format(
                              parseInt(item.productCustom.price || "0") || 0
                            )}
                            × {item.quantity} ={" "}
                            {new Intl.NumberFormat("vi-VN", {
                              style: "currency",
                              currency: "VND",
                            }).format(
                              (parseInt(item.productCustom.price || "0") || 0) *
                                item.quantity
                            )}
                          </>
                        ) : (
                          `Đang tải thông tin... (ID: ${item.productCustomId})`
                        )}
                      </Typography>
                    </Box>
                    <Chip
                      label={`×${item.quantity}`}
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                  </Box>
                  <ListItemSecondaryAction>
                    <IconButton
                      edge="end"
                      onClick={() => removeProductCustom(item.id)}
                      disabled={disabled}
                      size="small"
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          ) : (
            <Box sx={{ textAlign: "center", py: 4, color: "text.secondary" }}>
              <Typography variant="body2">
                Chưa có sản phẩm tùy chỉnh nào. Chọn sản phẩm từ danh sách ở
                trên.
              </Typography>
            </Box>
          )}
        </>
      )}
    </Paper>
  );
};

export default EndowManager;
