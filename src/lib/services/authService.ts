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

export const authService = {
  // Login
  login: async (data: LoginData): Promise<AuthResponse> => {
    try {
      const response = await apiRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify(data)
      })

      // Salvar token no localStorage
      if (response.data?.token) {
        localStorage.setItem('token', response.data.token)
        localStorage.setItem('user', JSON.stringify(response.data.user))
      }

      return response
    } catch (error) {
      console.error('Erro no login:', error)
      throw error
    }
  },

  // Registro
  register: async (data: RegisterData): Promise<AuthResponse> => {
    try {
      const response = await apiRequest('/auth/register', {
        method: 'POST',
        body: JSON.stringify(data)
      })

      // Salvar token no localStorage
      if (response.data?.token) {
        localStorage.setItem('token', response.data.token)
        localStorage.setItem('user', JSON.stringify(response.data.user))
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
    }
  },

  // Verificar se está autenticado
  isAuthenticated: (): boolean => {
    if (typeof window === 'undefined') return false
    return !!localStorage.getItem('token')
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
  }
}
