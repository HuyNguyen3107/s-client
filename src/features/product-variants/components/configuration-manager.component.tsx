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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Card,
  CardContent,
  Divider,
  Stack,
  CircularProgress,
} from "@mui/material";
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Settings as SettingsIcon,
} from "@mui/icons-material";
import { useProductCategoryList } from "../../product-categories/hooks/use-product-category-list.hooks";

// Configuration System Interfaces
export interface ConfigurationItem {
  id: string;
  name: string;
  baseQuantity: number;
  isRequired: boolean;
  priceRules: PriceRule[];
  categoryRules: CategoryRule[];
  isActive: boolean;
  priority: number;
}

export interface PriceRule {
  id: string;
  condition: "greater_than" | "equal_to" | "between";
  minQuantity?: number;
  maxQuantity?: number;
  pricePerUnit: number;
  description: string;
}

export interface CategoryRule {
  id: string;
  categoryId: string;
  categoryName: string;
  isRequired: boolean;
  maxSelections?: number;
  allowedProducts?: string[];
}

export interface ConfigurationSystem {
  items: ConfigurationItem[];
  globalCategoryRules: CategoryRule[]; // Giữ lại để tương thích ngược
  variantCategoryRules: CategoryRule[]; // Quy tắc cho biến thể cụ thể
  allowCustomQuantity: boolean;
  minCustomQuantity?: number;
  maxCustomQuantity?: number;
}

interface ConfigurationManagerProps {
  value?: ConfigurationSystem;
  onChange: (value: ConfigurationSystem) => void;
  label?: string;
  disabled?: boolean;
}

const ConfigurationManager: React.FC<ConfigurationManagerProps> = ({
  value,
  onChange,
  label = "Cấu hình sản phẩm",
  disabled = false,
}) => {
  const [activeTab, setActiveTab] = useState(0);

  // Form states
  const [newItemName, setNewItemName] = useState("");
  const [newItemBaseQuantity, setNewItemBaseQuantity] = useState(1);
  const [newItemRequired, setNewItemRequired] = useState(false);
  const [isEditingMode, setIsEditingMode] = useState(false);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);

  const [newPriceCondition, setNewPriceCondition] = useState<
    "greater_than" | "equal_to" | "between"
  >("greater_than");
  const [newPriceMinQuantity, setNewPriceMinQuantity] = useState(2);
  const [newPricePerUnit, setNewPricePerUnit] = useState(0);
  const [newPriceDescription, setNewPriceDescription] = useState("");

  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [newCategoryRequired, setNewCategoryRequired] = useState(true);
  const [newCategoryMaxSelections, setNewCategoryMaxSelections] = useState<
    number | ""
  >("");

  // Real categories data from API
  const {
    data: categoriesData,
    isLoading: categoriesLoading,
    error: categoriesError,
  } = useProductCategoryList({
    limit: 100, // Get a reasonable number of categories
    sortBy: "name",
    sortOrder: "asc",
  });

  const configurationSystem: ConfigurationSystem = {
    items: [],
    globalCategoryRules: [],
    variantCategoryRules: [],
    allowCustomQuantity: true,
    minCustomQuantity: 1,
    maxCustomQuantity: 100,
    ...value,
  };

  configurationSystem.allowCustomQuantity =
    configurationSystem.allowCustomQuantity ?? true;
  configurationSystem.minCustomQuantity =
    configurationSystem.minCustomQuantity ?? 1;
  configurationSystem.maxCustomQuantity = Math.max(
    configurationSystem.maxCustomQuantity ?? 100,
    configurationSystem.minCustomQuantity
  );

  const generateId = () =>
    `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  // Configuration Items Management
  const addConfigurationItem = useCallback(() => {
    if (!newItemName.trim()) return;

    const newItem: ConfigurationItem = {
      id: generateId(),
      name: newItemName.trim(),
      baseQuantity: newItemBaseQuantity,
      isRequired: newItemRequired,
      priceRules: [],
      categoryRules: [],
      isActive: true,
      priority: (configurationSystem.items?.length || 0) + 1,
    };

    onChange({
      ...configurationSystem,
      items: [...(configurationSystem.items || []), newItem],
    });

    // Chuyển sang chế độ chỉnh sửa item vừa tạo
    setIsEditingMode(true);
    setEditingItemId(newItem.id);
    // Không reset form để có thể tiếp tục chỉnh sửa
  }, [
    newItemName,
    newItemBaseQuantity,
    newItemRequired,
    configurationSystem,
    onChange,
  ]);

  const removeConfigurationItem = useCallback(
    (id: string) => {
      onChange({
        ...configurationSystem,
        items: (configurationSystem.items || []).filter(
          (item) => item.id !== id
        ),
      });

      // Nếu đang edit item này thì thoát chế độ edit
      if (editingItemId === id) {
        setIsEditingMode(false);
        setEditingItemId(null);
        setNewItemName("");
        setNewItemBaseQuantity(1);
        setNewItemRequired(false);
      }
    },
    [configurationSystem, onChange, editingItemId]
  );

  const updateConfigurationItem = useCallback(() => {
    if (!newItemName.trim() || !editingItemId) return;

    onChange({
      ...configurationSystem,
      items: (configurationSystem.items || []).map((item) =>
        item.id === editingItemId
          ? {
              ...item,
              name: newItemName.trim(),
              baseQuantity: newItemBaseQuantity,
              isRequired: newItemRequired,
            }
          : item
      ),
    });

    // Thoát chế độ chỉnh sửa
    setIsEditingMode(false);
    setEditingItemId(null);
    setNewItemName("");
    setNewItemBaseQuantity(1);
    setNewItemRequired(false);
  }, [
    newItemName,
    newItemBaseQuantity,
    newItemRequired,
    editingItemId,
    configurationSystem,
    onChange,
  ]);

  const cancelEditing = useCallback(() => {
    setIsEditingMode(false);
    setEditingItemId(null);
    setNewItemName("");
    setNewItemBaseQuantity(1);
    setNewItemRequired(false);
  }, []);

  // Price Rules Management
  const addPriceRule = useCallback(
    (itemId: string) => {
      if (newPricePerUnit <= 0) return;

      const newRule: PriceRule = {
        id: generateId(),
        condition: newPriceCondition,
        minQuantity: newPriceMinQuantity,
        pricePerUnit: newPricePerUnit,
        description:
          newPriceDescription ||
          `Giá ${newPricePerUnit.toLocaleString(
            "vi-VN"
          )}đ/đơn vị khi > ${newPriceMinQuantity}`,
      };

      onChange({
        ...configurationSystem,
        items: (configurationSystem.items || []).map((item) =>
          item.id === itemId
            ? { ...item, priceRules: [...(item.priceRules || []), newRule] }
            : item
        ),
      });

      setNewPriceMinQuantity(2);
      setNewPricePerUnit(0);
      setNewPriceDescription("");
    },
    [
      newPriceCondition,
      newPriceMinQuantity,
      newPricePerUnit,
      newPriceDescription,
      configurationSystem,
      onChange,
    ]
  );

  const removePriceRule = useCallback(
    (itemId: string, ruleId: string) => {
      onChange({
        ...configurationSystem,
        items: (configurationSystem.items || []).map((item) =>
          item.id === itemId
            ? {
                ...item,
                priceRules: (item.priceRules || []).filter(
                  (rule) => rule.id !== ruleId
                ),
              }
            : item
        ),
      });
    },
    [configurationSystem, onChange]
  );

  // Variant-specific Category Rules Management
  const addVariantCategoryRule = useCallback(() => {
    if (!selectedCategory) return;

    const newRule: CategoryRule = {
      id: generateId(),
      categoryId: selectedCategory.id,
      categoryName: selectedCategory.name,
      isRequired: newCategoryRequired,
      maxSelections: newCategoryMaxSelections
        ? Number(newCategoryMaxSelections)
        : undefined,
    };

    // Thêm quy tắc vào variantCategoryRules thay vì globalCategoryRules
    onChange({
      ...configurationSystem,
      variantCategoryRules: [
        ...(configurationSystem.variantCategoryRules || []),
        newRule,
      ],
    });

    setSelectedCategory(null);
    setNewCategoryRequired(true);
    setNewCategoryMaxSelections("");
  }, [
    selectedCategory,
    newCategoryRequired,
    newCategoryMaxSelections,
    configurationSystem,
    onChange,
  ]);

  const removeCategoryRule = useCallback(
    (ruleId: string) => {
      // Xóa quy tắc thể loại biến thể
      onChange({
        ...configurationSystem,
        variantCategoryRules: (
          configurationSystem.variantCategoryRules || []
        ).filter((rule) => rule.id !== ruleId),
      });
    },
    [configurationSystem, onChange]
  );

  const toggleCustomQuantity = useCallback(() => {
    onChange({
      ...configurationSystem,
      allowCustomQuantity: !configurationSystem.allowCustomQuantity,
    });
  }, [configurationSystem, onChange]);

  const updateMinCustomQuantity = useCallback(
    (value: number) => {
      const nextMin = Math.max(1, value);
      const nextMax = Math.max(
        configurationSystem.maxCustomQuantity ?? nextMin,
        nextMin
      );

      onChange({
        ...configurationSystem,
        minCustomQuantity: nextMin,
        maxCustomQuantity: nextMax,
      });
    },
    [configurationSystem, onChange]
  );

  const updateMaxCustomQuantity = useCallback(
    (value: number) => {
      const parsedValue = Math.max(1, value);
      const nextMax = Math.max(
        parsedValue,
        configurationSystem.minCustomQuantity ?? parsedValue
      );

      onChange({
        ...configurationSystem,
        maxCustomQuantity: nextMax,
      });
    },
    [configurationSystem, onChange]
  );

  return (
    <Paper sx={{ p: 2 }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
        <SettingsIcon />
        <Typography variant="h6">{label}</Typography>
        <Chip
          label={`${configurationSystem.items?.length || 0} items`}
          size="small"
          color="primary"
          variant="outlined"
        />
      </Box>

      {/* Global Settings */}
      <Card sx={{ mb: 2, bgcolor: "background.default" }}>
        <CardContent>
          <Typography variant="subtitle1" gutterBottom>
            Cài đặt số lượng tùy chỉnh
          </Typography>
          <Stack spacing={2}>
            <FormControlLabel
              control={
                <Switch
                  checked={Boolean(configurationSystem.allowCustomQuantity)}
                  onChange={toggleCustomQuantity}
                  disabled={disabled}
                />
              }
              label="Cho phép người dùng chọn số lượng tùy ý"
            />
            {configurationSystem.allowCustomQuantity && (
              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <TextField
                  size="small"
                  type="number"
                  label="Số lượng tối thiểu"
                  value={configurationSystem.minCustomQuantity ?? 1}
                  onChange={(e) =>
                    updateMinCustomQuantity(
                      Math.max(1, parseInt(e.target.value) || 1)
                    )
                  }
                  InputProps={{ inputProps: { min: 1 } }}
                  disabled={disabled}
                  sx={{ width: 200 }}
                />
                <TextField
                  size="small"
                  type="number"
                  label="Số lượng tối đa"
                  value={configurationSystem.maxCustomQuantity ?? 100}
                  onChange={(e) =>
                    updateMaxCustomQuantity(parseInt(e.target.value) || 100)
                  }
                  InputProps={{
                    inputProps: {
                      min: configurationSystem.minCustomQuantity ?? 1,
                    },
                  }}
                  disabled={disabled}
                  sx={{ width: 200 }}
                />
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    color: "text.secondary",
                  }}
                >
                  <Typography variant="body2">
                    Người dùng có thể chọn từ{" "}
                    {configurationSystem.minCustomQuantity ?? 1} đến{" "}
                    {configurationSystem.maxCustomQuantity ?? 100} sản phẩm
                  </Typography>
                </Box>
              </Stack>
            )}
          </Stack>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs
        value={activeTab}
        onChange={(_, newValue) => setActiveTab(newValue)}
        sx={{ mb: 2 }}
      >
        <Tab label="Quản lý Items" />
        <Tab label="Quy tắc thể loại" />
        <Tab label="Tổng quan cấu hình" />
      </Tabs>

      {/* Tab Content */}
      {activeTab === 0 && (
        <>
          {/* Add/Edit Configuration Item */}
          {((configurationSystem.items?.length || 0) === 0 ||
            isEditingMode) && (
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="subtitle1" gutterBottom>
                  {isEditingMode
                    ? "Chỉnh sửa Item Cấu hình"
                    : "Thêm Item Cấu hình Mới"}
                </Typography>
                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  spacing={2}
                  sx={{ mb: 2 }}
                >
                  <TextField
                    size="small"
                    label="Tên item"
                    value={newItemName}
                    onChange={(e) => setNewItemName(e.target.value)}
                    placeholder="VD: Lego, Phụ kiện..."
                    disabled={disabled}
                    sx={{ flex: 1 }}
                  />
                  <TextField
                    size="small"
                    type="number"
                    label="SL cơ bản"
                    value={newItemBaseQuantity}
                    onChange={(e) =>
                      setNewItemBaseQuantity(
                        Math.max(0, parseInt(e.target.value) || 0)
                      )
                    }
                    InputProps={{ inputProps: { min: 0 } }}
                    disabled={disabled}
                    sx={{ width: 100 }}
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={newItemRequired}
                        onChange={(e) => setNewItemRequired(e.target.checked)}
                        disabled={disabled}
                      />
                    }
                    label="Bắt buộc"
                  />
                  {isEditingMode ? (
                    <>
                      <Button
                        variant="contained"
                        onClick={updateConfigurationItem}
                        disabled={disabled || !newItemName.trim()}
                        startIcon={<SettingsIcon />}
                      >
                        Cập nhật
                      </Button>
                      <Button
                        variant="outlined"
                        onClick={cancelEditing}
                        disabled={disabled}
                      >
                        Hủy
                      </Button>
                    </>
                  ) : (
                    <Button
                      variant="contained"
                      onClick={addConfigurationItem}
                      disabled={disabled || !newItemName.trim()}
                      startIcon={<AddIcon />}
                    >
                      Thêm
                    </Button>
                  )}
                </Stack>
              </CardContent>
            </Card>
          )}

          {/* Configuration Items List */}
          {(configurationSystem.items || []).map((item) => (
            <Card key={item.id} sx={{ mb: 2 }}>
              <CardContent>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    mb: 2,
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Typography variant="subtitle1" fontWeight="medium">
                      {item.name}
                    </Typography>
                    <Chip
                      label={`SL: ${item.baseQuantity}`}
                      size="small"
                      variant="outlined"
                    />
                    {item.isRequired && (
                      <Chip
                        label="Bắt buộc"
                        size="small"
                        color="error"
                        variant="outlined"
                      />
                    )}
                  </Box>
                  <Box sx={{ display: "flex", gap: 1 }}>
                    <Button
                      variant="outlined"
                      onClick={() => {
                        setIsEditingMode(true);
                        setEditingItemId(item.id);
                        setNewItemName(item.name);
                        setNewItemBaseQuantity(item.baseQuantity);
                        setNewItemRequired(item.isRequired);
                      }}
                      startIcon={<SettingsIcon />}
                      size="small"
                    >
                      Chỉnh sửa
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={() => removeConfigurationItem(item.id)}
                      startIcon={<DeleteIcon />}
                      size="small"
                    >
                      Xóa
                    </Button>
                  </Box>
                </Box>

                {/* Price Rules - Only show when custom quantity is enabled */}
                {configurationSystem.allowCustomQuantity && (
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="h6" gutterBottom>
                      Quy tắc giá theo số lượng
                    </Typography>
                    <Stack
                      direction={{ xs: "column", sm: "row" }}
                      spacing={2}
                      sx={{ mb: 2 }}
                    >
                      <FormControl size="small" sx={{ minWidth: 120 }}>
                        <InputLabel>Điều kiện</InputLabel>
                        <Select
                          value={newPriceCondition}
                          label="Điều kiện"
                          onChange={(e) =>
                            setNewPriceCondition(
                              e.target.value as
                                | "greater_than"
                                | "equal_to"
                                | "between"
                            )
                          }
                        >
                          <MenuItem value="greater_than">Lớn hơn</MenuItem>
                          <MenuItem value="equal_to">Bằng</MenuItem>
                          <MenuItem value="between">Trong khoảng</MenuItem>
                        </Select>
                      </FormControl>
                      <TextField
                        size="small"
                        type="number"
                        label="Từ SL"
                        value={newPriceMinQuantity}
                        onChange={(e) =>
                          setNewPriceMinQuantity(
                            Math.max(1, parseInt(e.target.value) || 1)
                          )
                        }
                        sx={{ width: 100 }}
                      />
                      <TextField
                        size="small"
                        type="number"
                        label="Giá/đơn vị"
                        value={newPricePerUnit}
                        onChange={(e) =>
                          setNewPricePerUnit(
                            Math.max(0, parseInt(e.target.value) || 0)
                          )
                        }
                        sx={{ width: 120 }}
                      />
                      <TextField
                        size="small"
                        label="Mô tả (tùy chọn)"
                        value={newPriceDescription}
                        onChange={(e) => setNewPriceDescription(e.target.value)}
                        sx={{ flex: 1 }}
                      />
                      <Button
                        variant="outlined"
                        onClick={() => addPriceRule(item.id)}
                        disabled={newPricePerUnit <= 0}
                        startIcon={<AddIcon />}
                      >
                        Thêm
                      </Button>
                    </Stack>

                    {(item.priceRules?.length || 0) > 0 ? (
                      <List
                        sx={{ bgcolor: "background.paper", borderRadius: 1 }}
                      >
                        {(item.priceRules || []).map((rule) => (
                          <ListItem key={rule.id} divider>
                            <ListItemText
                              primary={rule.description}
                              secondary={`Khi số lượng > ${
                                rule.minQuantity
                              } → +${rule.pricePerUnit.toLocaleString(
                                "vi-VN"
                              )}đ/đơn vị`}
                            />
                            <ListItemSecondaryAction>
                              <IconButton
                                edge="end"
                                onClick={() =>
                                  removePriceRule(item.id, rule.id)
                                }
                                color="error"
                                size="small"
                              >
                                <DeleteIcon />
                              </IconButton>
                            </ListItemSecondaryAction>
                          </ListItem>
                        ))}
                      </List>
                    ) : (
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ textAlign: "center", py: 2 }}
                      >
                        Chưa có quy tắc giá nào
                      </Typography>
                    )}
                  </Box>
                )}
              </CardContent>
            </Card>
          ))}

          {(configurationSystem.items?.length || 0) === 0 && (
            <Box sx={{ textAlign: "center", py: 4, color: "text.secondary" }}>
              <Typography variant="body2">
                Chưa có item cấu hình nào. Thêm item đầu tiên ở trên.
              </Typography>
            </Box>
          )}
        </>
      )}

      {activeTab === 1 && (
        <>
          {/* Variant Category Rules */}
          <Typography variant="h6" gutterBottom>
            Quy tắc thể loại áp dụng cho biến thể này
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Các quy tắc này chỉ áp dụng cho biến thể hiện tại và có thể tùy
            chỉnh riêng cho từng biến thể
          </Typography>

          {categoriesError && (
            <Typography variant="body2" color="error" sx={{ mb: 2 }}>
              Lỗi khi tải danh sách thể loại: {categoriesError.message}
            </Typography>
          )}

          <Card sx={{ mb: 2, bgcolor: "primary.50" }}>
            <CardContent>
              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <Autocomplete
                  options={categoriesData?.data || []}
                  getOptionLabel={(option) => option.name}
                  value={selectedCategory}
                  onChange={(_, newValue) => setSelectedCategory(newValue)}
                  loading={categoriesLoading}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Chọn thể loại"
                      size="small"
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                          <>
                            {categoriesLoading ? (
                              <CircularProgress color="inherit" size={20} />
                            ) : null}
                            {params.InputProps.endAdornment}
                          </>
                        ),
                      }}
                    />
                  )}
                  sx={{ flex: 1 }}
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={newCategoryRequired}
                      onChange={(e) => setNewCategoryRequired(e.target.checked)}
                    />
                  }
                  label="Bắt buộc"
                />
                <TextField
                  size="small"
                  type="number"
                  label="Max selections"
                  value={newCategoryMaxSelections}
                  onChange={(e) =>
                    setNewCategoryMaxSelections(parseInt(e.target.value) || "")
                  }
                  placeholder="Không giới hạn"
                  sx={{ width: 140 }}
                />
                <Button
                  variant="contained"
                  onClick={() => addVariantCategoryRule()}
                  disabled={!selectedCategory}
                  startIcon={<AddIcon />}
                >
                  Áp dụng cho biến thể
                </Button>
              </Stack>
            </CardContent>
          </Card>

          {(configurationSystem.variantCategoryRules?.length || 0) > 0 ? (
            <List>
              {(configurationSystem.variantCategoryRules || []).map((rule) => (
                <ListItem
                  key={rule.id}
                  sx={{
                    border: "1px solid",
                    borderColor: "primary.main",
                    borderRadius: 1,
                    mb: 1,
                    bgcolor: "background.paper",
                  }}
                >
                  <ListItemText
                    primary={
                      <Typography variant="body1" fontWeight="medium">
                        {rule.categoryName}
                      </Typography>
                    }
                    secondary={`${rule.isRequired ? "Bắt buộc" : "Tùy chọn"}${
                      rule.maxSelections
                        ? ` • Tối đa ${rule.maxSelections} sản phẩm`
                        : " • Không giới hạn"
                    }`}
                  />
                  <Chip
                    label="Biến thể"
                    size="small"
                    color="secondary"
                    variant="outlined"
                    sx={{ mr: 1 }}
                  />
                  <Chip
                    label={rule.isRequired ? "Bắt buộc" : "Tùy chọn"}
                    size="small"
                    color={rule.isRequired ? "error" : "default"}
                    variant="outlined"
                    sx={{ mr: 1 }}
                  />
                  <ListItemSecondaryAction>
                    <IconButton
                      edge="end"
                      onClick={() => removeCategoryRule(rule.id)}
                      color="error"
                      size="small"
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
                Chưa có quy tắc thể loại nào cho biến thể này. Thêm quy tắc đầu
                tiên ở trên.
              </Typography>
            </Box>
          )}
        </>
      )}

      {activeTab === 2 && (
        <>
          {/* Configuration Overview */}
          <Typography variant="h6" gutterBottom>
            Tổng quan cấu hình biến thể
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Xem tổng thể về tất cả các cài đặt và quy tắc đã thiết lập cho biến
            thể này
          </Typography>

          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              gap: 3,
              mb: 3,
            }}
          >
            <Card sx={{ flex: 1 }}>
              <CardContent>
                <Typography variant="subtitle1" gutterBottom color="primary">
                  Cài đặt chung
                </Typography>
                <Stack spacing={2}>
                  <Box>
                    <Typography variant="body2" sx={{ mb: 0.5 }}>
                      <strong>Cho phép chọn số lượng tùy ý:</strong>
                    </Typography>
                    <Chip
                      label={
                        configurationSystem.allowCustomQuantity ? "Có" : "Không"
                      }
                      color={
                        configurationSystem.allowCustomQuantity
                          ? "success"
                          : "default"
                      }
                      size="small"
                      variant="outlined"
                    />
                  </Box>
                  {configurationSystem.allowCustomQuantity && (
                    <Box>
                      <Typography variant="body2" sx={{ mb: 0.5 }}>
                        <strong>Giới hạn số lượng:</strong>
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Từ {configurationSystem.minCustomQuantity ?? 1} đến{" "}
                        {configurationSystem.maxCustomQuantity ?? 100} sản phẩm
                      </Typography>
                    </Box>
                  )}
                  <Divider />
                  <Box>
                    <Typography variant="body2" sx={{ mb: 0.5 }}>
                      <strong>Tổng số items cấu hình:</strong>
                    </Typography>
                    <Typography variant="h6" color="primary.main">
                      {configurationSystem.items?.length || 0} items
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" sx={{ mb: 0.5 }}>
                      <strong>Quy tắc thể loại:</strong>
                    </Typography>
                    <Typography variant="h6" color="secondary.main">
                      {configurationSystem.variantCategoryRules?.length || 0}{" "}
                      quy tắc
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>

            <Card sx={{ flex: 1 }}>
              <CardContent>
                <Typography variant="subtitle1" gutterBottom color="primary">
                  Thống kê chi tiết
                </Typography>
                <Stack spacing={2}>
                  <Box>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      <strong>Danh sách items:</strong>
                    </Typography>
                    {(configurationSystem.items || []).length > 0 ? (
                      <Stack spacing={1}>
                        {(configurationSystem.items || []).map((item) => (
                          <Box
                            key={item.id}
                            sx={{
                              p: 1,
                              bgcolor: "grey.50",
                              borderRadius: 1,
                              border: "1px solid",
                              borderColor: "grey.200",
                            }}
                          >
                            <Typography variant="body2">
                              <strong>{item.name}</strong>
                            </Typography>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              SL mặc định: {item.baseQuantity} •
                              {item.isRequired ? "Bắt buộc" : "Tùy chọn"} • Quy
                              tắc giá: {item.priceRules?.length || 0} • Thể
                              loại: {item.categoryRules?.length || 0}
                            </Typography>
                          </Box>
                        ))}
                      </Stack>
                    ) : (
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          textAlign: "center",
                          py: 2,
                          fontStyle: "italic",
                        }}
                      >
                        Chưa có item nào được cấu hình
                      </Typography>
                    )}
                  </Box>
                  <Divider />
                  <Box sx={{ display: "flex", gap: 3 }}>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="body2" sx={{ mb: 0.5 }}>
                        <strong>Items bắt buộc:</strong>
                      </Typography>
                      <Typography variant="h6" color="error.main">
                        {
                          (configurationSystem.items || []).filter(
                            (item) => item.isRequired
                          ).length
                        }
                      </Typography>
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="body2" sx={{ mb: 0.5 }}>
                        <strong>Items tùy chọn:</strong>
                      </Typography>
                      <Typography variant="h6" color="info.main">
                        {
                          (configurationSystem.items || []).filter(
                            (item) => !item.isRequired
                          ).length
                        }
                      </Typography>
                    </Box>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Box>

          {/* Variant Category Rules Overview */}
          {(configurationSystem.variantCategoryRules?.length || 0) > 0 && (
            <Card sx={{ mb: 3, bgcolor: "secondary.50" }}>
              <CardContent>
                <Typography variant="subtitle1" gutterBottom color="secondary">
                  Quy tắc thể loại cho biến thể này
                </Typography>
                <Stack spacing={1}>
                  {(configurationSystem.variantCategoryRules || []).map(
                    (rule) => (
                      <Box
                        key={rule.id}
                        sx={{
                          p: 1.5,
                          bgcolor: "background.paper",
                          borderRadius: 1,
                          border: "1px solid",
                          borderColor: "secondary.200",
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            flexWrap: "wrap",
                          }}
                        >
                          <Typography
                            variant="body2"
                            component="span"
                            sx={{ fontWeight: "bold" }}
                          >
                            {rule.categoryName}
                          </Typography>
                          <Chip
                            label={rule.isRequired ? "Bắt buộc" : "Tùy chọn"}
                            size="small"
                            color={rule.isRequired ? "error" : "default"}
                            variant="outlined"
                          />
                          {rule.maxSelections && (
                            <Chip
                              label={`Tối đa ${rule.maxSelections} lựa chọn`}
                              size="small"
                              color="info"
                              variant="outlined"
                            />
                          )}
                        </Box>
                      </Box>
                    )
                  )}
                </Stack>
              </CardContent>
            </Card>
          )}

          {/* Individual Items Details */}
          {(configurationSystem.items || []).length > 0 && (
            <Typography variant="h6" gutterBottom sx={{ mt: 3, mb: 2 }}>
              Chi tiết các items đã cấu hình
            </Typography>
          )}
          {(configurationSystem.items || []).map((item, index) => (
            <Card
              key={item.id}
              variant="outlined"
              sx={{ mb: 2, bgcolor: "grey.50" }}
            >
              <CardContent>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 2,
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Chip
                      label={`#${index + 1}`}
                      size="small"
                      color="primary"
                      variant="filled"
                    />
                    <Typography variant="subtitle1" fontWeight="medium">
                      {item.name}
                    </Typography>
                    {item.isRequired && (
                      <Chip
                        label="Bắt buộc"
                        size="small"
                        color="error"
                        variant="outlined"
                      />
                    )}
                    {item.isActive && (
                      <Chip
                        label="Kích hoạt"
                        size="small"
                        color="success"
                        variant="outlined"
                      />
                    )}
                  </Box>
                  <Typography variant="caption" color="text.secondary">
                    Ưu tiên: {item.priority}
                  </Typography>
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Số lượng cơ bản:</strong> {item.baseQuantity} items
                  </Typography>

                  {configurationSystem.allowCustomQuantity && (
                    <Box sx={{ mb: 1 }}>
                      <Typography variant="body2">
                        <strong>Quy tắc giá:</strong>{" "}
                        {item.priceRules?.length || 0} quy tắc
                      </Typography>
                      {(item.priceRules?.length || 0) > 0 && (
                        <Box sx={{ ml: 2, mt: 0.5 }}>
                          {item.priceRules?.map((rule) => (
                            <Typography
                              key={rule.id}
                              variant="caption"
                              color="text.secondary"
                              sx={{ display: "block" }}
                            >
                              •{" "}
                              {rule.condition === "greater_than"
                                ? `Từ ${rule.minQuantity}+`
                                : rule.condition === "equal_to"
                                ? `Đúng ${rule.minQuantity}`
                                : `Từ ${rule.minQuantity} đến ${rule.maxQuantity}`}
                              : {rule.pricePerUnit}đ/item
                            </Typography>
                          ))}
                        </Box>
                      )}
                    </Box>
                  )}

                  <Box sx={{ mb: 1 }}>
                    <Typography variant="body2" component="div">
                      <strong>Quy tắc thể loại:</strong>{" "}
                      {item.categoryRules?.length || 0} quy tắc
                    </Typography>
                    {(item.categoryRules?.length || 0) > 0 && (
                      <Box sx={{ ml: 2, mt: 0.5 }}>
                        {item.categoryRules?.map((rule) => (
                          <Chip
                            key={rule.id}
                            label={`${rule.categoryName}${
                              rule.maxSelections
                                ? ` (max: ${rule.maxSelections})`
                                : ""
                            }`}
                            size="small"
                            color={rule.isRequired ? "error" : "default"}
                            variant="outlined"
                            sx={{ mr: 0.5, mb: 0.5 }}
                          />
                        ))}
                      </Box>
                    )}
                  </Box>
                </Box>

                <Divider sx={{ my: 1 }} />
                <Typography variant="caption" color="text.secondary">
                  Tổng quy tắc:{" "}
                  {(item.priceRules?.length || 0) +
                    (item.categoryRules?.length || 0)}
                </Typography>
              </CardContent>
            </Card>
          ))}

          {/* Summary Statistics */}
          {((configurationSystem.items?.length || 0) > 0 ||
            (configurationSystem.variantCategoryRules?.length || 0) > 0) && (
            <Card
              sx={{
                mt: 3,
                bgcolor: "primary.50",
                border: "2px solid",
                borderColor: "primary.200",
              }}
            >
              <CardContent>
                <Typography variant="h6" gutterBottom color="primary.main">
                  Tổng kết cấu hình biến thể
                </Typography>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
                  <Chip
                    label={`${configurationSystem.items?.length || 0} Items`}
                    color="primary"
                    variant="filled"
                    size="medium"
                  />
                  <Chip
                    label={`${
                      (configurationSystem.items || []).filter(
                        (item) => item.isRequired
                      ).length
                    } Bắt buộc`}
                    color="error"
                    variant="outlined"
                    size="medium"
                  />
                  <Chip
                    label={`${(configurationSystem.items || []).reduce(
                      (total, item) => total + (item.priceRules?.length || 0),
                      0
                    )} Quy tắc giá`}
                    color="success"
                    variant="outlined"
                    size="medium"
                  />
                  <Chip
                    label={`${(configurationSystem.items || []).reduce(
                      (total, item) =>
                        total + (item.categoryRules?.length || 0),
                      0
                    )} Quy tắc thể loại item`}
                    color="warning"
                    variant="outlined"
                    size="medium"
                  />
                  <Chip
                    label={`${
                      configurationSystem.variantCategoryRules?.length || 0
                    } Quy tắc thể loại biến thể`}
                    color="secondary"
                    variant="outlined"
                    size="medium"
                  />
                </Box>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 2 }}
                >
                  Biến thể này đã được cấu hình đầy đủ với tổng cộng{" "}
                  <strong>
                    {(configurationSystem.items?.length || 0) +
                      (configurationSystem.variantCategoryRules?.length || 0)}
                  </strong>{" "}
                  thành phần cấu hình.
                </Typography>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </Paper>
  );
};

export default ConfigurationManager;
