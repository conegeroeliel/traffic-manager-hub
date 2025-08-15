import { config as apiConfig } from '../config'

export interface User {
  id: string;
  email: string;
  nome: string;
  plano: 'free' | 'premium';
  dataCadastro: Date;
  ultimoLogin: Date;
}

export interface LoginData {
  email: string;
  senha: string;
}

export interface RegisterData {
  nome: string;
  email: string;
  senha: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    token: string;
    user: User;
  };
}

// Rate limiting simples
class RateLimiter {
  private attempts: Map<string, { count: number; lastAttempt: number }> = new Map();
  private readonly maxAttempts = 5;
  private readonly windowMs = 5 * 60 * 1000; // 5 minutos

  isBlocked(identifier: string): boolean {
    const now = Date.now();
    const attempt = this.attempts.get(identifier);

    if (!attempt) return false;

    // Reset se passou o tempo da janela
    if (now - attempt.lastAttempt > this.windowMs) {
      this.attempts.delete(identifier);
      return false;
    }

    return attempt.count >= this.maxAttempts;
  }

  recordAttempt(identifier: string): void {
    const now = Date.now();
    const attempt = this.attempts.get(identifier);

    if (attempt) {
      attempt.count++;
      attempt.lastAttempt = now;
    } else {
      this.attempts.set(identifier, { count: 1, lastAttempt: now });
    }
  }

  getRemainingTime(identifier: string): number {
    const attempt = this.attempts.get(identifier);
    if (!attempt) return 0;

    const now = Date.now();
    const timePassed = now - attempt.lastAttempt;
    return Math.max(0, this.windowMs - timePassed);
  }
}

const rateLimiter = new RateLimiter();

// Função para fazer requisições à API
const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  }

  const response = await fetch(`${apiConfig.apiUrl}${endpoint}`, config)
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Erro desconhecido' }))
    throw new Error(error.message || error.error || `Erro ${response.status}`)
  }

  return response.json()
}

// Função para obter o token de autenticação
const getAuthToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token')
  }
  return null
}

// Função para fazer requisições autenticadas
const authenticatedRequest = async (endpoint: string, options: RequestInit = {}) => {
  const token = getAuthToken()
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  }

  const response = await fetch(`${apiConfig.apiUrl}${endpoint}`, config)
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Erro desconhecido' }))
    throw new Error(error.message || error.error || `Erro ${response.status}`)
  }

  return response.json()
}

// Função para validar email
const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Função para validar senha
const validatePassword = (senha: string): { isValid: boolean; errors: string[] } => {
  const errors: string[] = []
  
  if (senha.length < 6) {
    errors.push('Senha deve ter pelo menos 6 caracteres')
  }
  
  if (!/[A-Z]/.test(senha)) {
    errors.push('Senha deve conter pelo menos uma letra maiúscula')
  }
  
  if (!/[a-z]/.test(senha)) {
    errors.push('Senha deve conter pelo menos uma letra minúscula')
  }
  
  if (!/\d/.test(senha)) {
    errors.push('Senha deve conter pelo menos um número')
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

export const authService = {
  // Login
  login: async (data: LoginData): Promise<AuthResponse> => {
    try {
      // Rate limiting
      const identifier = `login:${data.email}`
      if (rateLimiter.isBlocked(identifier)) {
        const remainingTime = rateLimiter.getRemainingTime(identifier)
        const minutes = Math.ceil(remainingTime / (1000 * 60))
        throw new Error(`Muitas tentativas. Tente novamente em ${minutes} minutos.`)
      }

      // Validação básica
      if (!validateEmail(data.email)) {
        throw new Error('Email inválido')
      }

      if (!data.senha || data.senha.length < 6) {
        throw new Error('Senha deve ter pelo menos 6 caracteres')
      }

      const response = await apiRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify(data)
      })

      // Salvar token no localStorage
      if (response.data?.token) {
        localStorage.setItem('token', response.data.token)
        localStorage.setItem('user', JSON.stringify(response.data.user))
        
        // Salvar timestamp do login
        localStorage.setItem('loginTime', Date.now().toString())
      }

      // Reset rate limiting em caso de sucesso
      rateLimiter.attempts.delete(identifier)

      return response
    } catch (error) {
      // Registrar tentativa falhada
      const identifier = `login:${data.email}`
      rateLimiter.recordAttempt(identifier)
      
      console.error('Erro no login:', error)
      throw error
    }
  },

  // Registro
  register: async (data: RegisterData): Promise<AuthResponse> => {
    try {
      // Validações
      if (!data.nome || data.nome.length < 2) {
        throw new Error('Nome deve ter pelo menos 2 caracteres')
      }

      if (!validateEmail(data.email)) {
        throw new Error('Email inválido')
      }

      const passwordValidation = validatePassword(data.senha)
      if (!passwordValidation.isValid) {
        throw new Error(passwordValidation.errors.join(', '))
      }

      const response = await apiRequest('/auth/register', {
        method: 'POST',
        body: JSON.stringify(data)
      })

      // Salvar token no localStorage
      if (response.data?.token) {
        localStorage.setItem('token', response.data.token)
        localStorage.setItem('user', JSON.stringify(response.data.user))
        localStorage.setItem('loginTime', Date.now().toString())
      }

      return response
    } catch (error) {
      console.error('Erro no registro:', error)
      throw error
    }
  },

  // Obter usuário atual
  getCurrentUser: async (): Promise<User | null> => {
    try {
      const response = await authenticatedRequest('/auth/me')
      return response.data?.user || null
    } catch (error) {
      console.error('Erro ao obter usuário atual:', error)
      return null
    }
  },

  // Logout
  logout: async (): Promise<void> => {
    try {
      await authenticatedRequest('/auth/logout', {
        method: 'POST'
      })
    } catch (error) {
      console.error('Erro no logout:', error)
    } finally {
      // Limpar dados locais
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      localStorage.removeItem('loginTime')
      localStorage.removeItem('rememberedEmail')
    }
  },

  // Verificar se está autenticado
  isAuthenticated: (): boolean => {
    if (typeof window === 'undefined') return false
    
    const token = localStorage.getItem('token')
    if (!token) return false

    // Verificar se o token não expirou (7 dias)
    const loginTime = localStorage.getItem('loginTime')
    if (loginTime) {
      const now = Date.now()
      const loginTimestamp = parseInt(loginTime)
      const sevenDays = 7 * 24 * 60 * 60 * 1000 // 7 dias em ms
      
      if (now - loginTimestamp > sevenDays) {
        // Token expirado, fazer logout
        authService.logout()
        return false
      }
    }

    return true
  },

  // Obter token
  getToken: (): string | null => {
    return getAuthToken()
  },

  // Obter usuário do localStorage
  getUser: (): User | null => {
    if (typeof window === 'undefined') return null
    const userStr = localStorage.getItem('user')
    if (!userStr) return null
    
    try {
      const user = JSON.parse(userStr)
      return {
        ...user,
        dataCadastro: new Date(user.dataCadastro),
        ultimoLogin: new Date(user.ultimoLogin)
      }
    } catch {
      return null
    }
  },

  // Verificar se o usuário tem plano premium
  isPremium: (): boolean => {
    const user = authService.getUser()
    return user?.plano === 'premium'
  },

  // Verificar se o token está próximo de expirar
  isTokenExpiringSoon: (): boolean => {
    const loginTime = localStorage.getItem('loginTime')
    if (!loginTime) return false

    const now = Date.now()
    const loginTimestamp = parseInt(loginTime)
    const sixDays = 6 * 24 * 60 * 60 * 1000 // 6 dias em ms
    
    return (now - loginTimestamp) > sixDays
  },

  // Renovar token (refresh)
  refreshToken: async (): Promise<boolean> => {
    try {
      const response = await authenticatedRequest('/auth/refresh', {
        method: 'POST'
      })

      if (response.data?.token) {
        localStorage.setItem('token', response.data.token)
        localStorage.setItem('loginTime', Date.now().toString())
        return true
      }

      return false
    } catch (error) {
      console.error('Erro ao renovar token:', error)
      return false
    }
  },

  // Verificar força da senha
  checkPasswordStrength: (senha: string): { score: number; feedback: string[] } => {
    let score = 0
    const feedback: string[] = []

    if (senha.length >= 8) score += 1
    else feedback.push('Adicione pelo menos 8 caracteres')

    if (/[a-z]/.test(senha)) score += 1
    else feedback.push('Adicione letras minúsculas')

    if (/[A-Z]/.test(senha)) score += 1
    else feedback.push('Adicione letras maiúsculas')

    if (/\d/.test(senha)) score += 1
    else feedback.push('Adicione números')

    if (/[^A-Za-z0-9]/.test(senha)) score += 1
    else feedback.push('Adicione caracteres especiais')

    return { score, feedback }
  }
}
