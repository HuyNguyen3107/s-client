import { useEffect, useState, useCallback } from "react";
import { socketService } from "../services/socket.service";

interface OrderNotification {
  id: string;
  type?: "new-order" | "order-status-update" | "new-consultation" | "other";
  title?: string;
  message?: string;
  timestamp?: string;
  read?: boolean;
  assignedTo?: {
    userId: string;
    userName: string;
  } | null;
  data?: {
    id?: string;
    orderCode?: string;
    status?: string;
    createdAt?: Date;
    customerInfo?: {
      name: string;
      phone: string;
      email: string;
    };
    totalAmount?: number;
    products?: string;
    // Consultation specific fields
    consultationId?: string;
    customerName?: string;
    phoneNumber?: string;
  };
  // Legacy fields for backward compatibility
  orderCode?: string;
  status?: string;
  createdAt?: Date;
  customerInfo?: {
    name: string;
    phone: string;
    email: string;
  };
  totalAmount?: number;
  products?: string;
}

export const useOrderNotifications = () => {
  const [notifications, setNotifications] = useState<OrderNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Connect to socket
    const socket = socketService.connect();

    // Listen for connection status
    const handleConnect = () => {
      setIsConnected(true);

      // Join admin room after connection established
      socketService.joinAdmin();
      socketService.getUnreadNotifications();
    };

    const handleDisconnect = () => {
      setIsConnected(false);
    };

    socket?.on("connect", handleConnect);
    socket?.on("disconnect", handleDisconnect);

    // If already connected, join admin room immediately
    if (socketService.isSocketConnected()) {
      setIsConnected(true);
      socketService.joinAdmin();
    }

    // Cleanup - only clean up event listeners, don't disconnect socket
    return () => {
      socket?.off("connect", handleConnect);
      socket?.off("disconnect", handleDisconnect);
      socketService.leaveAdmin();
      // Don't disconnect socket on unmount to prevent premature closure
      // socketService.disconnect();
    };
  }, []);

  const handleNewOrder = useCallback((notification: OrderNotification) => {
    setNotifications((prev) => {
      const exists = prev.find((n) => n.id === notification.id);
      if (exists) {
        return [notification, ...prev.filter((n) => n.id !== notification.id)];
      }
      return [notification, ...prev];
    });
    setUnreadCount((prev) => prev + 1);

    // Extract data for notification display
    const orderCode =
      notification.data?.orderCode || notification.orderCode || "N/A";
    const customerName =
      notification.data?.customerInfo?.name ||
      notification.customerInfo?.name ||
      "Khách hàng";

    // Show browser notification if permission granted
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification(notification.title || "Đơn hàng mới!", {
        body:
          notification.message ||
          `${customerName} đã đặt đơn hàng ${orderCode}`,
        tag: notification.id,
      });
    }
  }, []);

  const handleNewConsultation = useCallback(
    (notification: OrderNotification) => {
      setNotifications((prev) => {
        const exists = prev.find((n) => n.id === notification.id);
        if (exists) {
          return [notification, ...prev.filter((n) => n.id !== notification.id)];
        }
        return [notification, ...prev];
      });
      setUnreadCount((prev) => prev + 1);

      // Extract data for notification display
      const customerName = notification.data?.customerName || "Khách hàng";
      const phoneNumber = notification.data?.phoneNumber || "";

      // Show browser notification if permission granted
      if ("Notification" in window && Notification.permission === "granted") {
        new Notification(notification.title || "Yêu cầu tư vấn mới!", {
          body:
            notification.message ||
            `${customerName} (${phoneNumber}) đã yêu cầu tư vấn`,
          tag: notification.id,
        });
      }
    },
    []
  );

  const handleNotificationsHistory = useCallback(
    (history: OrderNotification[]) => {
      // Replace with de-duplicated list by id, newest first
      const seen = new Set<string>();
      const deduped: OrderNotification[] = [];
      for (const n of history) {
        if (n && !seen.has(n.id)) {
          seen.add(n.id);
          deduped.push(n);
        }
      }
      setNotifications(deduped);

      // Count unread notifications
      const unread = history.filter((n) => !n.read).length;
      setUnreadCount(unread);
    },
    []
  );

  const handleOrderAssigned = useCallback((data: any) => {
    // Update notification to show assignee
    setNotifications((prev) =>
      prev.map((n) => {
        if (n.id === data.orderId || n.data?.id === data.orderId) {
          return {
            ...n,
            assignedTo: data.assignedTo,
          };
        }
        return n;
      })
    );
  }, []);

  useEffect(() => {
    socketService.onNewOrder(handleNewOrder);
    socketService.onNewConsultation(handleNewConsultation);

    // Listen for notifications history
    const socket = socketService.getSocket();
    if (socket) {
      socket.on("notifications-history", handleNotificationsHistory);
      socket.on("order-assigned", handleOrderAssigned);
      socket.on("notification-marked-read", (data: any) => {
        if (data?.notificationId && data?.success) {
          setNotifications((prev) =>
            prev.map((n) =>
              n.id === data.notificationId ? { ...n, read: true } : n
            )
          );
          setUnreadCount((prev) => Math.max(0, prev - 1));
        }
      });
      socket.on("all-notifications-marked-read", () => {
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
        setUnreadCount(0);
      });
      socket.on("unread-notifications", (list: OrderNotification[]) => {
        setUnreadCount(Array.isArray(list) ? list.length : 0);
      });
    }

    return () => {
      socketService.offNewOrder(handleNewOrder);
      socketService.offNewConsultation(handleNewConsultation);
      if (socket) {
        socket.off("notifications-history", handleNotificationsHistory);
        socket.off("order-assigned", handleOrderAssigned);
        socket.off("notification-marked-read");
        socket.off("all-notifications-marked-read");
        socket.off("unread-notifications");
      }
    };
  }, [
    handleNewOrder,
    handleNewConsultation,
    handleNotificationsHistory,
    handleOrderAssigned,
  ]);

  const clearNotifications = useCallback(() => {
    setNotifications([]);
    setUnreadCount(0);
  }, []);

  const markAsRead = useCallback(() => {
    setUnreadCount(0);
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    socketService.markAllNotificationsAsRead();
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== id));
    setUnreadCount((prev) => Math.max(0, prev - 1));
  }, []);

  const updateNotificationAssignment = useCallback(
    (notificationId: string, userId: string, userName: string) => {
      setNotifications((prev) =>
        prev.map((notif) =>
          notif.id === notificationId
            ? { ...notif, assignedTo: { userId, userName } }
            : notif
        )
      );
    },
    []
  );

  const markNotificationRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));
    socketService.markNotificationAsRead(id);
  }, []);

  // Request notification permission
  const requestNotificationPermission = useCallback(async () => {
    if ("Notification" in window && Notification.permission === "default") {
      const permission = await Notification.requestPermission();
      return permission === "granted";
    }
    return Notification.permission === "granted";
  }, []);

  return {
    notifications,
    unreadCount,
    isConnected,
    clearNotifications,
    markAsRead,
    removeNotification,
    updateNotificationAssignment,
    requestNotificationPermission,
    markNotificationRead,
  };
};
