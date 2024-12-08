import { create } from 'zustand';
import { authService, User } from '@/services/auth.service';

type AuthStore = {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
};

export const useAuth = create<AuthStore>((set) => ({
  user: null,
  isLoading: false,
  error: null,

  login: async (username: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        throw new Error('Credenciais inválidas');
      }

      const data = await response.json();
      console.log('Login response:', data); // Debug

      // Garantir que os tokens sejam salvos
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);

      set({ 
        user: data.user, 
        isLoading: false 
      });

      // Verificar se os tokens foram salvos
      console.log('Tokens saved:', {
        access: localStorage.getItem('accessToken'),
        refresh: localStorage.getItem('refreshToken')
      });

    } catch (error) {
      console.error('Login error:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Erro ao fazer login', 
        isLoading: false 
      });
      throw error;
    }
  },

  logout: () => {
    authService.logout();
    set({ user: null, error: null });
  },

  checkAuth: async () => {
    set({ isLoading: true });
    try {
      const token = authService.getAccessToken();
      console.log('checkAuth token:', token);
      if (!token) {
        set({ user: null, isLoading: false });
        return;
      }
      
      const response = await fetch('/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      console.log('ME response status:', response.status);
      if (!response.ok) {
        const errorData = await response.json();
        console.log('ME error:', errorData);
        throw new Error();
      }
      
      const data = await response.json();
      set({ user: data.user, isLoading: false });
    } catch (error) {
      authService.logout();
      set({ user: null, isLoading: false });
    }
  }
}));