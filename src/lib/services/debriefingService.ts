import { Debriefing, NovoDebriefing, AtualizarDebriefing } from '@/lib/types/debriefing';
import { config } from '../config';

const API_BASE_URL = config.apiUrl;

// Função para obter token de autenticação
const getAuthToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token');
  }
  return null;
};

// Função helper para fazer requisições autenticadas
const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const token = getAuthToken();
  
  const config: RequestInit = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Erro na requisição:', error);
    throw error;
  }
};

// Função para parsear datas
const parseDate = (dateString: string | Date): Date => {
  if (dateString instanceof Date) return dateString;
  const parsed = new Date(dateString);
  return isNaN(parsed.getTime()) ? new Date() : parsed;
};

export const debriefingService = {
  // Buscar todos os debriefings do usuário
  async getAll(): Promise<Debriefing[]> {
    const data = await apiRequest('/debriefing');
    return data.map((item: any) => ({
      ...item,
      createdAt: parseDate(item.createdAt),
      updatedAt: parseDate(item.updatedAt),
    }));
  },

  // Buscar debriefing por ID
  async getById(id: string): Promise<Debriefing> {
    const data = await apiRequest(`/debriefing/${id}`);
    return {
      ...data,
      createdAt: parseDate(data.createdAt),
      updatedAt: parseDate(data.updatedAt),
    };
  },

  // Buscar debriefing por cliente
  async getByCliente(clienteId: string): Promise<Debriefing> {
    const data = await apiRequest(`/debriefing/cliente/${clienteId}`);
    return {
      ...data,
      createdAt: parseDate(data.createdAt),
      updatedAt: parseDate(data.updatedAt),
    };
  },

  // Criar novo debriefing
  async create(debriefing: NovoDebriefing): Promise<Debriefing> {
    const data = await apiRequest('/debriefing', {
      method: 'POST',
      body: JSON.stringify(debriefing),
    });
    return {
      ...data,
      createdAt: parseDate(data.createdAt),
      updatedAt: parseDate(data.updatedAt),
    };
  },

  // Atualizar debriefing
  async update(id: string, debriefing: AtualizarDebriefing): Promise<Debriefing> {
    const data = await apiRequest(`/debriefing/${id}`, {
      method: 'PUT',
      body: JSON.stringify(debriefing),
    });
    return {
      ...data,
      createdAt: parseDate(data.createdAt),
      updatedAt: parseDate(data.updatedAt),
    };
  },

  // Deletar debriefing
  async delete(id: string): Promise<boolean> {
    await apiRequest(`/debriefing/${id}`, {
      method: 'DELETE',
    });
    return true;
  },
}; 