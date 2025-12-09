import React from "react";
import { useAuthStore } from "../store/auth.store";

interface DebugAuthProps {
  className?: string;
}

const DebugAuth: React.FC<DebugAuthProps> = ({ className }) => {
  const { token, user } = useAuthStore();

  // Only show in development
  if (process.env.NODE_ENV !== "development") {
    return null;
  }

  return (
    <div
      className={className}
      style={{
        position: "fixed",
        top: 0,
        right: 0,
        background: "rgba(0,0,0,0.8)",
        color: "white",
        padding: "8px",
        fontSize: "12px",
        zIndex: 9999,
        maxWidth: "200px",
        wordBreak: "break-all",
      }}
    >
      <div>
        <strong>Auth Debug:</strong>
      </div>
      <div>Token: {token ? "Present" : "None"}</div>
      <div>User: {user?.name || "None"}</div>
      <div>Authenticated: {!!token ? "Yes" : "No"}</div>
    </div>
  );
};

export default DebugAuth;
