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
} from "@mui/material";
import { Add as AddIcon, Delete as DeleteIcon } from "@mui/icons-material";

// Local interfaces
export interface PurchaseOption {
  id: string;
  content: string;
  price: number;
  isActive: boolean;
  priority: number;
}

interface PurchaseOptionsManagerProps {
  value?: PurchaseOption[];
  onChange: (value: PurchaseOption[]) => void;
  label?: string;
  disabled?: boolean;
}

const PurchaseOptionsManager: React.FC<PurchaseOptionsManagerProps> = ({
  value = [],
  onChange,
  label = "Option mua thêm",
  disabled = false,
}) => {
  const [newOptionContent, setNewOptionContent] = useState("");
  const [newOptionPrice, setNewOptionPrice] = useState<number>(0);

  const purchaseOptions: PurchaseOption[] = value || [];

  const addPurchaseOption = useCallback(() => {
    if (!newOptionContent.trim() || newOptionPrice <= 0) return;

    const newOption: PurchaseOption = {
      id: `option_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      content: newOptionContent.trim(),
      price: newOptionPrice,
      isActive: true,
      priority: purchaseOptions.length + 1,
    };

    onChange([...purchaseOptions, newOption]);
    setNewOptionContent("");
    setNewOptionPrice(0);
  }, [newOptionContent, newOptionPrice, purchaseOptions, onChange]);

  const removePurchaseOption = useCallback(
    (id: string) => {
      onChange(purchaseOptions.filter((item) => item.id !== id));
    },
    [purchaseOptions, onChange]
  );

  return (
    <Paper sx={{ p: 2 }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
        <Typography variant="h6">{label}</Typography>
        <Chip
          label={purchaseOptions.length}
          size="small"
          color="success"
          variant="outlined"
        />
      </Box>

      {/* Add Purchase Option Form */}
      <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
        <TextField
          sx={{ flex: 1 }}
          size="small"
          label="Nội dung option"
          value={newOptionContent}
          onChange={(e) => setNewOptionContent(e.target.value)}
          placeholder="Nhập nội dung option mua thêm..."
          disabled={disabled}
          onKeyPress={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              addPurchaseOption();
            }
          }}
          multiline
          maxRows={3}
        />
        <TextField
          type="number"
          size="small"
          label="Giá (VNĐ)"
          value={newOptionPrice}
          onChange={(e) =>
            setNewOptionPrice(Math.max(0, parseInt(e.target.value) || 0))
          }
          sx={{ width: 150 }}
          InputProps={{
            inputProps: { min: 0 },
          }}
          disabled={disabled}
        />
        <Button
          variant="contained"
          onClick={addPurchaseOption}
          disabled={disabled || !newOptionContent.trim() || newOptionPrice <= 0}
          sx={{ minWidth: "auto", px: 2 }}
        >
          <AddIcon />
        </Button>
      </Box>

      {/* Purchase Options Display */}
      {purchaseOptions.length > 0 ? (
        <List>
          {purchaseOptions.map((option) => (
            <ListItem
              key={option.id}
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
                  <Typography variant="body2" fontWeight="medium">
                    {option.content}
                  </Typography>
                }
                secondary={
                  <Typography variant="caption" color="text.secondary">
                    Giá:{" "}
                    {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(option.price)}
                  </Typography>
                }
              />
              <Box sx={{ mr: 1 }}>
                <Chip
                  label={new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(option.price)}
                  size="small"
                  color="success"
                  variant="outlined"
                />
              </Box>
              <ListItemSecondaryAction>
                <IconButton
                  edge="end"
                  onClick={() => removePurchaseOption(option.id)}
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
            Chưa có option mua thêm nào. Thêm option đầu tiên bằng cách nhập nội
            dung và giá ở trên.
          </Typography>
        </Box>
      )}
    </Paper>
  );
};

export default PurchaseOptionsManager;
