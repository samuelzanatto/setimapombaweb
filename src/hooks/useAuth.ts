import { create } from 'zustand';
import { authService, User } from '@/services/auth.service';
import { useRouter } from 'next/navigation';

type AuthStore = {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
  isAuthenticated: boolean;
};

export const useAuth = create<AuthStore>((set) => ({
  user: null,
  isLoading: false,
  error: null,
  isAuthenticated: false,

  login: async (username: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      const user = await authService.login(username, password);
      set({ 
        user, 
        isLoading: false, 
        error: null,
        isAuthenticated: true 
      });
    } catch (error) {
      set({ 
        user: null, 
        isLoading: false,
        error: 'Erro ao fazer login',
        isAuthenticated: false
      });
      throw error;
    }
  },

  logout: () => {
    authService.logout();
    set({ user: null, error: null, isAuthenticated: false });
    window.location.href = '/login';
  },

  checkAuth: async () => {
    set({ isLoading: true });
    try {
      const token = authService.getAccessToken();
      if (!token) {
        set({ 
          user: null, 
          isLoading: false, 
          isAuthenticated: false 
        });
        return;
      }
      
      const response = await fetch('/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (!response.ok) {
        throw new Error();
      }
      
      const data = await response.json();
      set({ 
        user: data.user, 
        isLoading: false, 
        isAuthenticated: true 
      });
    } catch (error) {
      authService.logout();
      set({ user: null, isLoading: false, isAuthenticated: false });
    }
  }
}));