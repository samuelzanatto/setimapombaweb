import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

export type User = {
  id: number;
  username: string;
  name: string;
  email: string;
  avatar_url?: string;
};

class AuthService {
  private static instance: AuthService;
  private refreshTokenTimeout?: NodeJS.Timeout;

  private constructor() {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('accessToken');
      if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      }
    }
  }

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  private getStorageItem(key: string): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(key);
    }
    return null;
  }

  private setStorageItem(key: string, value: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(key, value);
    }
  }

  private removeStorageItem(key: string): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(key);
    }
  }

  async login(username: string, password: string) {
    try {
      const response = await axios.post('/api/auth/login', { username, password });
      const { user, accessToken, refreshToken } = response.data;
      
      // Armazenar tokens como cookies também
      document.cookie = `accessToken=${accessToken}; path=/`;
      document.cookie = `refreshToken=${refreshToken}; path=/`;
      
      // Armazenar no localStorage
      this.setTokens(accessToken, refreshToken);
      
      return user;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  async refreshToken() {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      const response = await axios.post('/api/auth/refresh', { refreshToken });
      this.setTokens(response.data.accessToken, response.data.refreshToken);
      return response.data.accessToken;
    } catch (error) {
      this.logout();
      throw error;
    }
  }

  private setTokens(accessToken: string, refreshToken: string) {
    this.setStorageItem('accessToken', accessToken);
    this.setStorageItem('refreshToken', refreshToken);
    axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
    this.startRefreshTokenTimer(accessToken);
  }

  private startRefreshTokenTimer(accessToken: string) {
    const decoded = jwtDecode(accessToken);
    const expires = new Date(decoded.exp! * 1000);
    const timeout = expires.getTime() - Date.now() - (60 * 1000);
    this.refreshTokenTimeout = setTimeout(() => this.refreshToken(), timeout);
  }

  logout() {
    this.removeStorageItem('accessToken');
    this.removeStorageItem('refreshToken');
    if (this.refreshTokenTimeout) {
      clearTimeout(this.refreshTokenTimeout);
    }
  }

  getAccessToken() {
    return this.getStorageItem('accessToken');
  }
}

export const authService = AuthService.getInstance();