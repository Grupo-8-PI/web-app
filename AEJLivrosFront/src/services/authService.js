import { isValidJwtFormat } from '../utils/securityUtils';

class AuthService {
  constructor() {
    this.storage = sessionStorage;
    this.TOKEN_KEY = 'auth_token';
    this.USER_KEY = 'auth_user';
  }

  setToken(token, userData = null) {
    if (!token || !isValidJwtFormat(token)) {
      console.error('Token inválido ou formato incorreto');
      return false;
    }

    try {
      this.clearAuth();
      const payload = this.decodeToken(token);
      
      console.log('🔍 Payload do token:', payload); // DEBUG
      console.log('🔍 Token expira em:', new Date(payload.exp * 1000)); // DEBUG
      console.log('🔍 Token está expirado?', this.isTokenExpired(payload)); // DEBUG

      this.storage.setItem(this.TOKEN_KEY, token);
      
      if (userData) {
        this.storage.setItem(this.USER_KEY, JSON.stringify(userData));
      }

      if (payload.exp) {
        this.scheduleTokenCleanup(payload.exp);
      }
      
      return true;
    } catch (erro) {
      console.error('Erro ao salvar token:', erro);
      return false;
    }
  }

  getToken() {
    const token = this.storage.getItem(this.TOKEN_KEY);
    if (!token) return null;

    try {
      const payload = this.decodeToken(token);
      
      if (this.isTokenExpired(payload)) {
        console.log('Token expirado ao tentar usar');
        this.clearAuth();
        return null;
      }
      return token;
    } catch {
      this.clearAuth();
      return null;
    }
  }

  getUser() {
    const userData = this.storage.getItem(this.USER_KEY);
    if (!userData) return null;
    try {
      return JSON.parse(userData);
    } catch {
      return null;
    }
  }

  decodeToken(token) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  }

  isTokenExpired(payload) {
    if (!payload.exp) return false;
    
    const now = Math.floor(Date.now() / 1000);
    return payload.exp < (now + 5);
  }

  scheduleTokenCleanup(expirationTime) {
    const now = Math.floor(Date.now() / 1000);
    const timeUntilExpiration = (expirationTime - now) * 1000;

    if (timeUntilExpiration > 0) {
      console.log(`⏰ Token expira em ${timeUntilExpiration / 1000} segundos`);
      setTimeout(() => {
        console.log('Token expirou - fazendo logout');
        this.logout();
      }, timeUntilExpiration);
    }
  }

  clearAuth() {
    this.storage.removeItem(this.TOKEN_KEY);
    this.storage.removeItem(this.USER_KEY);
  }

  isAuthenticated() {
    return this.getToken() !== null;
  }

  logout() {
    this.clearAuth();
    window.location.href = '/';
  }

  getUserId() {
    const user = this.getUser();
    if (user && user.id) {
        return user.id;
    }

    const token = this.getToken();
    if (token) {
        try {
            const payload = this.decodeToken(token);
            return payload.id || payload.sub || payload.userId || null;
        } catch {
            return null;
        }
    }

    return null;
}
}

export const authService = new AuthService();