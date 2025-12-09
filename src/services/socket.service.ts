import { io, Socket } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

class SocketService {
  private socket: Socket | null = null;
  private isConnected: boolean = false;

  connect() {
    if (this.socket && this.isConnected) {
      return this.socket;
    }

    this.socket = io(`${SOCKET_URL}/notifications`, {
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
    });

    this.socket.on("connect", () => {
      this.isConnected = true;
    });

    this.socket.on("disconnect", () => {
      this.isConnected = false;
    });

    this.socket.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
      this.isConnected = false;
    });

    return this.socket;
  }

  disconnect() {
    if (this.socket && this.isConnected) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
    }
  }

  joinAdmin() {
    if (this.socket && this.isConnected) {
      this.socket.emit("join-admin");
    }
  }

  leaveAdmin() {
    if (this.socket && this.isConnected) {
      this.socket.emit("leave-admin");
    }
  }

  onNewOrder(callback: (data: any) => void) {
    if (this.socket) {
      this.socket.on("new-order", callback);
    }
  }

  offNewOrder(callback?: (data: any) => void) {
    if (this.socket) {
      if (callback) {
        this.socket.off("new-order", callback);
      } else {
        this.socket.off("new-order");
      }
    }
  }

  onNewConsultation(callback: (data: any) => void) {
    if (this.socket) {
      this.socket.on("new-consultation", callback);
    }
  }

  offNewConsultation(callback?: (data: any) => void) {
    if (this.socket) {
      if (callback) {
        this.socket.off("new-consultation", callback);
      } else {
        this.socket.off("new-consultation");
      }
    }
  }

  onOrderStatusUpdate(callback: (data: any) => void) {
    if (this.socket) {
      this.socket.on("order-status-updated", callback);
    }
  }

  offOrderStatusUpdate(callback?: (data: any) => void) {
    if (this.socket) {
      if (callback) {
        this.socket.off("order-status-updated", callback);
      } else {
        this.socket.off("order-status-updated");
      }
    }
  }

  getSocket() {
    return this.socket;
  }

  isSocketConnected() {
    return this.isConnected;
  }

  // Notification management methods
  markNotificationAsRead(notificationId: string) {
    if (this.socket && this.isConnected) {
      this.socket.emit("mark-notification-read", notificationId);
    }
  }

  markAllNotificationsAsRead() {
    if (this.socket && this.isConnected) {
      this.socket.emit("mark-all-notifications-read");
    }
  }

  deleteNotification(notificationId: string) {
    if (this.socket && this.isConnected) {
      this.socket.emit("delete-notification", notificationId);
    }
  }

  clearAllNotifications() {
    if (this.socket && this.isConnected) {
      this.socket.emit("clear-all-notifications");
    }
  }

  getAllNotifications() {
    if (this.socket && this.isConnected) {
      this.socket.emit("get-all-notifications");
    }
  }

  getUnreadNotifications() {
    if (this.socket && this.isConnected) {
      this.socket.emit("get-unread-notifications");
    }
  }
}

export const socketService = new SocketService();
