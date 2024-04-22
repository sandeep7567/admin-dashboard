import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface Tenant {
  id: number;
  name: string;
  address: string;
}

export interface User {
  id: number;
  email: string;
  role: string;
  firstName: string;
  lastName: string;
  tenant?: Tenant;
}

interface AuthState {
  user: null | User;
  setUser: (user: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  devtools((set) => ({
    user: null,
    setUser: (user) => set({ user }),
    logout: () => set({ user: null }),
  }))
);
