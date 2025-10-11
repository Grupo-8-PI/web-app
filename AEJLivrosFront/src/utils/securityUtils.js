import DOMPurify from 'dompurify';

export const sanitizeText = (text) => {
  if (!text) return '';
  return text
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
};

export const validateInput = (input, type = 'text') => {
  if (!input) return { valid: false, error: 'Campo obrigatório' };
  
  const validations = {
    email: {
      regex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      error: 'Email inválido'
    },
    password: {
      regex: /^.{6,}$/,
      error: 'Senha deve ter no mínimo 6 caracteres'
    }
  };
  
  const validation = validations[type] || { regex: /.*/, error: '' };
  
  if (!validation.regex.test(input)) {
    return { valid: false, error: validation.error };
  }
  
  return { valid: true };
};

class RateLimiter {
  constructor(maxAttempts = 5, timeWindow = 60000) {
    this.maxAttempts = maxAttempts;
    this.timeWindow = timeWindow;
    this.attempts = new Map();
  }
  
  canAttempt(key) {
    const now = Date.now();
    const userAttempts = this.attempts.get(key) || [];
    const recentAttempts = userAttempts.filter(time => now - time < this.timeWindow);
    
    if (recentAttempts.length >= this.maxAttempts) {
      return false;
    }
    
    recentAttempts.push(now);
    this.attempts.set(key, recentAttempts);
    return true;
  }
  
  reset(key) {
    this.attempts.delete(key);
  }
}

export const loginRateLimiter = new RateLimiter(5, 60000);

export const isValidJwtFormat = (token) => {
  if (!token || typeof token !== 'string') return false;
  const parts = token.split('.');
  if (parts.length !== 3) return false;
  try {
    parts.forEach(part => atob(part.replace(/-/g, '+').replace(/_/g, '/')));
    return true;
  } catch {
    return false;
  }
};