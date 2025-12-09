import React, { useState } from "react";
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Button,
  Card,
  CardContent,
  Divider,
  Checkbox,
} from "@mui/material";
import {
  Close as CloseIcon,
  Delete as DeleteIcon,
  ShoppingCart as CartIcon,
  ArrowForward,
} from "@mui/icons-material";
import { useCartStore } from "../store/cart.store";
import { useNavigate } from "react-router-dom";

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ open, onClose }) => {
  const { items, removeItem, clearCart, getTotalAmount } = useCartStore();
  const navigate = useNavigate();
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const toggleItemSelection = (itemId: string) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(itemId)) {
      newSelected.delete(itemId);
    } else {
      newSelected.add(itemId);
    }
    setSelectedItems(newSelected);
  };

  const toggleSelectAll = () => {
    if (selectedItems.size === items.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(items.map((item: any) => item.id)));
    }
  };

  const getSelectedItemsTotal = () => {
    return items
      .filter((item: any) => selectedItems.has(item.id))
      .reduce((sum, item: any) => sum + item.total, 0);
  };

  const handleCheckoutItem = (itemId: string) => {
    const item = items.find((i: any) => i.id === itemId);
    if (item) {
      // Navigate to order page with saved data
      const orderDataString = encodeURIComponent(
        JSON.stringify(item.orderData)
      );
      navigate(`/order?data=${orderDataString}`);
      onClose();
    }
  };

  const handleCheckoutMultiple = () => {
    if (selectedItems.size === 0) return;

    // Get all selected items
    const selectedItemsList = items.filter((item: any) =>
      selectedItems.has(item.id)
    );

    if (selectedItemsList.length === 1) {
      // Single item - go to normal order page
      const orderDataString = encodeURIComponent(
        JSON.stringify(selectedItemsList[0].orderData)
      );
      navigate(`/order?data=${orderDataString}`);
    } else if (selectedItemsList.length > 1) {
      // Multiple items - go to batch checkout page
      const orderData = {
        items: selectedItemsList,
        totalAmount: getSelectedItemsTotal(),
      };
      const orderDataString = encodeURIComponent(JSON.stringify(orderData));
      navigate(`/batch-checkout?data=${orderDataString}`);
    }
    onClose();
  };

  const handleRemoveItem = (itemId: string) => {
    removeItem(itemId);
    // Remove from selection if it was selected
    const newSelected = new Set(selectedItems);
    newSelected.delete(itemId);
    setSelectedItems(newSelected);
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: { xs: "100%", sm: 500 },
          maxWidth: "100%",
        },
      }}
    >
      <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
        {/* Header */}
        <Box
          sx={{
            p: 3,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom: "1px solid",
            borderColor: "divider",
            bgcolor: "#731618",
            color: "white",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <CartIcon sx={{ fontSize: 28 }} />
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Giỏ hàng
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                {items.length} sản phẩm
                {selectedItems.size > 0 && ` (${selectedItems.size} được chọn)`}
              </Typography>
            </Box>
          </Box>
          <IconButton onClick={onClose} sx={{ color: "white" }}>
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Content */}
        <Box sx={{ flex: 1, overflow: "auto", p: 3 }}>
          {items.length === 0 ? (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
                textAlign: "center",
                py: 8,
              }}
            >
              <CartIcon sx={{ fontSize: 80, color: "grey.300", mb: 2 }} />
              <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
                Giỏ hàng trống
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Hãy thêm sản phẩm vào giỏ hàng
              </Typography>
            </Box>
          ) : (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {/* Select All */}
              {items.length > 1 && (
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    p: 1.5,
                    bgcolor: "grey.100",
                    borderRadius: 1,
                  }}
                >
                  <Checkbox
                    checked={selectedItems.size === items.length}
                    indeterminate={
                      selectedItems.size > 0 &&
                      selectedItems.size < items.length
                    }
                    onChange={toggleSelectAll}
                  />
                  <Typography variant="body2" fontWeight={600}>
                    Chọn tất cả ({items.length})
                  </Typography>
                </Box>
              )}

              {items.map((item: any, index: number) => (
                <Card
                  key={item.id}
                  sx={{
                    borderRadius: 2,
                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                    border: selectedItems.has(item.id)
                      ? "2px solid #731618"
                      : "none",
                    "&:hover": {
                      boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
                    },
                  }}
                >
                  <CardContent sx={{ p: 2 }}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        mb: 2,
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "flex-start",
                          gap: 1.5,
                          flex: 1,
                        }}
                      >
                        <Checkbox
                          checked={selectedItems.has(item.id)}
                          onChange={() => toggleItemSelection(item.id)}
                          sx={{ mt: 0.5 }}
                        />
                        <Box sx={{ flex: 1 }}>
                          <Typography
                            variant="subtitle2"
                            sx={{ fontWeight: 600, mb: 0.5 }}
                          >
                            Đơn hàng #{index + 1}
                          </Typography>
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            display="block"
                          >
                            {new Date(item.createdAt).toLocaleString("vi-VN")}
                          </Typography>
                        </Box>
                      </Box>
                      <IconButton
                        size="small"
                        onClick={() => handleRemoveItem(item.id)}
                        sx={{
                          color: "error.main",
                          "&:hover": {
                            bgcolor: "error.50",
                          },
                        }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>

                    <Divider sx={{ my: 1.5 }} />

                    <Box
                      sx={{ display: "flex", flexDirection: "column", gap: 1 }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <Typography variant="body2" color="text.secondary">
                          Tạm tính:
                        </Typography>
                        <Typography variant="body2">
                          {formatPrice(item.subtotal)}
                        </Typography>
                      </Box>

                      {item.discount > 0 && (
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <Typography variant="body2" color="text.secondary">
                            Giảm giá:
                          </Typography>
                          <Typography variant="body2" color="error">
                            -{formatPrice(item.discount)}
                          </Typography>
                        </Box>
                      )}

                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <Typography variant="body2" color="text.secondary">
                          Phí ship:
                        </Typography>
                        <Typography variant="body2">
                          {formatPrice(item.shippingFee)}
                        </Typography>
                      </Box>

                      <Divider sx={{ my: 0.5 }} />

                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <Typography variant="body1" fontWeight={600}>
                          Tổng cộng:
                        </Typography>
                        <Typography
                          variant="h6"
                          color="primary"
                          fontWeight={700}
                        >
                          {formatPrice(item.total)}
                        </Typography>
                      </Box>
                    </Box>

                    <Button
                      fullWidth
                      variant="contained"
                      endIcon={<ArrowForward />}
                      onClick={() => handleCheckoutItem(item.id)}
                      sx={{
                        mt: 2,
                        borderRadius: 1.5,
                        py: 1,
                        fontWeight: 600,
                        bgcolor: "#731618",
                        "&:hover": {
                          bgcolor: "#5f0d10",
                        },
                      }}
                    >
                      Tiếp tục xác nhận
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </Box>
          )}
        </Box>

        {/* Footer */}
        {items.length > 0 && (
          <Box
            sx={{
              p: 3,
              borderTop: "1px solid",
              borderColor: "divider",
              bgcolor: "grey.50",
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            <Box>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 1,
                }}
              >
                <Typography variant="body2" color="text.secondary">
                  Tổng giỏ hàng:
                </Typography>
                <Typography variant="h6" fontWeight={600}>
                  {formatPrice(getTotalAmount())}
                </Typography>
              </Box>

              {selectedItems.size > 0 && (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    p: 1.5,
                    bgcolor: "#731618",
                    borderRadius: 1,
                    color: "white",
                  }}
                >
                  <Typography variant="body2" fontWeight={600}>
                    {selectedItems.size} đơn hàng được chọn
                  </Typography>
                  <Typography variant="h6" fontWeight={700}>
                    {formatPrice(getSelectedItemsTotal())}
                  </Typography>
                </Box>
              )}
            </Box>

            <Button
              fullWidth
              variant="contained"
              disabled={selectedItems.size === 0}
              onClick={handleCheckoutMultiple}
              sx={{
                borderRadius: 1.5,
                py: 1.5,
                fontWeight: 600,
                bgcolor: "#731618",
                "&:hover": {
                  bgcolor: "#5f0d10",
                },
                "&:disabled": {
                  bgcolor: "grey.300",
                },
              }}
            >
              Xác nhận đơn hàng ({selectedItems.size})
            </Button>

            <Button
              fullWidth
              variant="outlined"
              color="error"
              onClick={clearCart}
              sx={{
                borderRadius: 1.5,
                py: 1,
                fontWeight: 600,
              }}
            >
              Xóa tất cả
            </Button>
          </Box>
        )}
      </Box>
    </Drawer>
  );
};
