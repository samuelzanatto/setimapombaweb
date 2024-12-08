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

  private constructor() {}

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  async login(username: string, password: string) {
    const response = await axios.post('/api/auth/login', { username, password });
    const { user, accessToken, refreshToken } = response.data;
    console.log('Login tokens:', { accessToken, refreshToken });
    this.setTokens(accessToken, refreshToken);
    return user;
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
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    this.startRefreshTokenTimer(accessToken);
  }

  private startRefreshTokenTimer(accessToken: string) {
    const decoded = jwtDecode(accessToken);
    const expires = new Date(decoded.exp! * 1000);
    const timeout = expires.getTime() - Date.now() - (60 * 1000);
    this.refreshTokenTimeout = setTimeout(() => this.refreshToken(), timeout);
  }

  logout() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    if (this.refreshTokenTimeout) {
      clearTimeout(this.refreshTokenTimeout);
    }
  }

  getAccessToken() {
    return localStorage.getItem('accessToken');
  }
}

export const authService = AuthService.getInstance();