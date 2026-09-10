import { create } from 'zustand';

interface AuthState {
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: !!localStorage.getItem('admin_token'),

  login: (token) => {
    localStorage.setItem('admin_token', token);
    set({ isAuthenticated: true });
  },

  logout: () => {
    localStorage.removeItem('admin_token');
    set({ isAuthenticated: false });
  },
}));
