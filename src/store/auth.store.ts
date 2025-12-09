import { create } from "zustand";
import { persist } from "zustand/middleware";

type userType = {
  id: string;
  email: string;
  name: string;
  phone: string;
  isActive: boolean;
  role?: string;
};

interface AuthState {
  token: string | null;
  refreshToken?: string | null;
  tokenExpires?: string | null;
  user?: userType | null;
  setToken: (token: string | null) => void;
  clearToken: () => void;
}

interface AuthActions {
  setToken: (token: string | null) => void;
  setUser: (user: userType | null) => void;
  setRefreshToken: (refreshToken: string | null) => void;
  setTokenExpires: (tokenExpires: string | null) => void;
  clearToken: () => void;
}

type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      token: null,
      refreshToken: null,
      tokenExpires: null,
      user: null,
      setToken: (token: string | null) => set({ token }),
      setUser: (user: userType | null) => set({ user }),
      setRefreshToken: (refreshToken: string | null) => set({ refreshToken }),
      setTokenExpires: (tokenExpires: string | null) => set({ tokenExpires }),
      clearToken: () =>
        set({
          token: null,
          refreshToken: null,
          tokenExpires: null,
          user: null,
        }),
    }),
    {
      name: "auth-storage",
    }
  )
);
