import { useEffect, useState } from "react";
import {
  Badge,
  IconButton,
  Menu,
  MenuItem,
  Typography,
  Box,
  Divider,
  Button,
  Chip,
  Avatar,
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import CloseIcon from "@mui/icons-material/Close";
import PersonIcon from "@mui/icons-material/Person";
import PhoneInTalkIcon from "@mui/icons-material/PhoneInTalk";
import ContactPhoneIcon from "@mui/icons-material/ContactPhone";
import { useOrderNotifications } from "../hooks/use-order-notifications.hook";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import { useNavigate } from "react-router-dom";
 
import { useToastStore } from "../store/toast.store";
import { useAssignConsultation } from "../hooks/use-consultations.hooks";
import { useAuthStore } from "../store/auth.store";

export const OrderNotificationBell = () => {
  const navigate = useNavigate();
  const { showToast } = useToastStore();
  const { user } = useAuthStore();
  const assignConsultationMutation = useAssignConsultation();

  const {
    notifications,
    unreadCount,
    isConnected,
    markAsRead,
    removeNotification,
    clearNotifications,
    updateNotificationAssignment,
    requestNotificationPermission,
    markNotificationRead,
  } = useOrderNotifications();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  
  const [assigningConsultations, setAssigningConsultations] = useState<
    Set<string>
  >(new Set());
  const open = Boolean(anchorEl);

  useEffect(() => {
    // Request notification permission when component mounts
    requestNotificationPermission();
  }, [requestNotificationPermission]);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    markAsRead();
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationClick = (notification: any) => {
    if (notification?.id) {
      markNotificationRead(notification.id);
    }
    if (notification.type === "new-consultation") {
      // Navigate to consultations management page
      navigate(`/dashboard/consultations`);
    } else {
      // Navigate to order detail
      navigate(`/dashboard/orders/${notification.data?.id || notification.id}`);
    }
    handleClose();
  };

  const handleRemoveNotification = (
    e: React.MouseEvent,
    notificationId: string
  ) => {
    e.stopPropagation();
    removeNotification(notificationId);
  };

  

  const handleAssignConsultation = async (
    e: React.MouseEvent,
    consultationId: string,
    notificationId: string
  ) => {
    e.stopPropagation();

    if (!user?.id || !user?.name) {
      showToast("Không thể xác định thông tin người dùng", "error");
      return;
    }

    setAssigningConsultations((prev) => new Set(prev).add(consultationId));

    try {
      await assignConsultationMutation.mutateAsync({
        consultationId,
        userId: user.id,
        userName: user.name,
      });

      // Update local notification state to show assignee immediately
      updateNotificationAssignment(notificationId, user.id, user.name);

      showToast("Đã nhận tư vấn thành công!", "success");

      // Close menu and navigate to consultations page
      handleClose();
      navigate("/dashboard/consultations");
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Không thể nhận tư vấn";
      showToast(errorMessage, "error");
    } finally {
      setAssigningConsultations((prev) => {
        const newSet = new Set(prev);
        newSet.delete(consultationId);
        return newSet;
      });
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  return (
    <>
      <IconButton
        onClick={handleClick}
        size="large"
        color="inherit"
        sx={{
          position: "relative",
        }}
      >
        <Badge badgeContent={unreadCount} color="error">
          {unreadCount > 0 ? (
            <NotificationsActiveIcon
              sx={{
                animation: "ring 4s ease-in-out infinite",
                "@keyframes ring": {
                  "0%": { transform: "rotate(0)" },
                  "5%": { transform: "rotate(15deg)" },
                  "10%": { transform: "rotate(-15deg)" },
                  "15%": { transform: "rotate(15deg)" },
                  "20%": { transform: "rotate(0)" },
                  "100%": { transform: "rotate(0)" },
                },
              }}
            />
          ) : (
            <NotificationsIcon />
          )}
        </Badge>
        {!isConnected && (
          <Box
            sx={{
              position: "absolute",
              bottom: 2,
              right: 2,
              width: 8,
              height: 8,
              borderRadius: "50%",
              bgcolor: "error.main",
              border: "2px solid white",
            }}
          />
        )}
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          sx: {
            width: 400,
            maxHeight: 600,
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <Box sx={{ p: 2, pb: 1 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="h6" fontWeight="bold">
              Thông báo
            </Typography>
            {notifications.length > 0 && (
              <Button size="small" onClick={clearNotifications}>
                Xóa tất cả
              </Button>
            )}
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 1 }}>
            <Chip
              label={isConnected ? "Đang kết nối" : "Mất kết nối"}
              size="small"
              color={isConnected ? "success" : "error"}
              variant="outlined"
            />
          </Box>
        </Box>

        <Divider />

        {notifications.length === 0 ? (
          <Box
            sx={{
              p: 4,
              textAlign: "center",
              color: "text.secondary",
            }}
          >
            <NotificationsIcon sx={{ fontSize: 48, opacity: 0.3, mb: 1 }} />
            <Typography variant="body2">Chưa có thông báo mới</Typography>
          </Box>
        ) : (
          <Box sx={{ maxHeight: 450, overflow: "auto" }}>
            {notifications.map((notification, index) => {
              const isConsultation = notification.type === "new-consultation";

              return (
                <MenuItem
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification)}
                  sx={{
                    py: 2,
                    px: 2,
                    borderBottom:
                      index < notifications.length - 1 ? "1px solid" : "none",
                    borderColor: "divider",
                    display: "block",
                    whiteSpace: "normal",
                    "&:hover": {
                      bgcolor: "action.hover",
                    },
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      gap: 2,
                      alignItems: "flex-start",
                    }}
                  >
                    <Avatar
                      sx={{
                        bgcolor: isConsultation ? "#ff9800" : "primary.main",
                        mt: 0.5,
                      }}
                    >
                      {isConsultation ? (
                        <ContactPhoneIcon />
                      ) : (
                        <ShoppingCartIcon />
                      )}
                    </Avatar>

                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                          mb: 0.5,
                        }}
                      >
                        <Typography
                          variant="subtitle2"
                          fontWeight="bold"
                          sx={{
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {notification.title ||
                            notification.message ||
                            "Thông báo mới"}
                        </Typography>
                        <IconButton
                          size="small"
                          onClick={(e) =>
                            handleRemoveNotification(e, notification.id)
                          }
                          sx={{ ml: 1 }}
                        >
                          <CloseIcon fontSize="small" />
                        </IconButton>
                      </Box>

                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mb: 0.5 }}
                      >
                        {notification.message}
                      </Typography>

                      {/* Consultation specific display */}
                      {isConsultation ? (
                        <>
                          <Typography variant="body2" color="text.secondary">
                            Khách hàng:{" "}
                            <strong>
                              {notification.data?.customerName || "N/A"}
                            </strong>
                          </Typography>

                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 0.5,
                            }}
                          >
                            <PhoneInTalkIcon sx={{ fontSize: 16 }} />
                            <strong style={{ color: "#ff9800" }}>
                              {notification.data?.phoneNumber || "N/A"}
                            </strong>
                          </Typography>

                          <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{ mt: 0.5, display: "block" }}
                          >
                            {formatDistanceToNow(
                              new Date(
                                notification.timestamp ||
                                  notification.data?.createdAt ||
                                  new Date()
                              ),
                              {
                                addSuffix: true,
                                locale: vi,
                              }
                            )}
                          </Typography>

                          {notification.assignedTo && (
                            <Chip
                              icon={<PersonIcon />}
                              label={`Đã nhận: ${notification.assignedTo.userName}`}
                              size="small"
                              sx={{
                                bgcolor: "#ff9800",
                                color: "white",
                                "& .MuiChip-icon": {
                                  color: "white",
                                },
                              }}
                            />
                          )}
                        </>
                      ) : (
                        <>
                          {/* Order specific display */}
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mb: 0.5 }}
                          >
                            Mã đơn:{" "}
                            <strong style={{ color: "#1976d2" }}>
                              {notification.data?.orderCode ||
                                notification.orderCode ||
                                "N/A"}
                            </strong>
                          </Typography>

                          {(notification.data?.customerInfo?.name ||
                            notification.customerInfo?.name) && (
                            <Typography variant="body2" color="text.secondary">
                              Khách hàng:{" "}
                              <strong>
                                {notification.data?.customerInfo?.name ||
                                  notification.customerInfo?.name}
                              </strong>
                            </Typography>
                          )}

                          {(notification.data?.customerInfo?.phone ||
                            notification.customerInfo?.phone) && (
                            <Typography variant="body2" color="text.secondary">
                              SĐT:{" "}
                              {notification.data?.customerInfo?.phone ||
                                notification.customerInfo?.phone}
                            </Typography>
                          )}

                          {(notification.data?.totalAmount ||
                            notification.totalAmount) && (
                            <Typography
                              variant="body2"
                              color="primary"
                              fontWeight="bold"
                              sx={{ mt: 0.5 }}
                            >
                              {formatCurrency(
                                notification.data?.totalAmount ||
                                  notification.totalAmount ||
                                  0
                              )}
                            </Typography>
                          )}

                          <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{ mt: 0.5, display: "block" }}
                          >
                            {formatDistanceToNow(
                              new Date(
                                notification.timestamp ||
                                  notification.data?.createdAt ||
                                  notification.createdAt ||
                                  new Date()
                              ),
                              {
                                addSuffix: true,
                                locale: vi,
                              }
                            )}
                          </Typography>

                          <Box sx={{ mt: 1.5 }}>
                            {notification.assignedTo && (
                              <Chip
                                icon={<PersonIcon />}
                                label={`Đã nhận: ${notification.assignedTo.userName}`}
                                size="small"
                                sx={{
                                  bgcolor: "#731618",
                                  color: "white",
                                  "& .MuiChip-icon": {
                                    color: "white",
                                  },
                                }}
                              />
                            )}
                          </Box>
                        </>
                      )}
                    </Box>
                  </Box>
                </MenuItem>
              );
            })}
          </Box>
        )}
      </Menu>
    </>
  );
};
