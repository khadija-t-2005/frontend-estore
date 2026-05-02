import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  token: string | null;
  user: { id: number; email: string; role: string } | null;
  setToken: (token: string) => void;
  setUser: (user: AuthState['user']) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user:  null,
      setToken: (token) => set({ token }),
      setUser:  (user)  => set({ user }),
      logout:   ()      => set({ token: null, user: null }),
    }),
    { name: 'auth-storage' }
  )
);
