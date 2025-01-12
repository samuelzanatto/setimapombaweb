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
  private initializePromise: Promise<void> | null = null;

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

  async initialize() {
    if (this.initializePromise) return this.initializePromise;

    this.initializePromise = new Promise(async (resolve) => {
      try {
        console.log('[AuthService] Iniciando...');
        const token = this.getStorageItem('accessToken');
        const userId = this.getStorageItem('userId');

        if (token && userId) {
          console.log('[AuthService] Tokens encontrados, configurando axios...');
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          this.startRefreshTokenTimer(token);
        }
      } catch (error) {
        console.error('[AuthService] Erro na inicialização:', error);
      }
      resolve();
    });

    return this.initializePromise;
  }

  async login(username: string, password: string) {
    try {
      console.log('[AuthService] Iniciando login...');
      const response = await axios.post('/api/auth/login', { username, password });
      const { user, accessToken, refreshToken } = response.data;
  
      // Salvar tokens
      this.setStorageItem('accessToken', accessToken);
      this.setStorageItem('refreshToken', refreshToken);
      this.setStorageItem('userId', user.id.toString());
  
      // Configurar axios
      axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
      
      // Iniciar timer de refresh
      this.startRefreshTokenTimer(accessToken);
  
      console.log('[AuthService] Login bem sucedido');
      return user;
    } catch (error) {
      console.error('[AuthService] Erro no login:', error);
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

  private async setTokens(accessToken: string, refreshToken: string) {
    this.setStorageItem('accessToken', accessToken);
    this.setStorageItem('refreshToken', refreshToken);
    axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
    await this.startRefreshTokenTimer(accessToken);
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
    this.removeStorageItem('userId');
    if (this.refreshTokenTimeout) {
      clearTimeout(this.refreshTokenTimeout);
    }
  }

  getAccessToken() {
    return this.getStorageItem('accessToken');
  }
}

export const authService = AuthService.getInstance();