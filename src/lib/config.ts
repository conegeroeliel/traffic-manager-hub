interface FrontendConfig {
  apiUrl: string;
  backendPort: number;
  environment: string;
}

const getConfig = (): FrontendConfig => {
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  return {
    apiUrl: process.env.NEXT_PUBLIC_API_URL || 
            (isDevelopment ? 'http://localhost:3001/api' : '/api'),
    backendPort: parseInt(process.env.NEXT_PUBLIC_BACKEND_PORT || '3001', 10),
    environment: process.env.NODE_ENV || 'development'
  };
};

export const config = getConfig();

// URLs específicas para diferentes serviços
export const apiEndpoints = {
  auth: `${config.apiUrl}/auth`,
  clientes: `${config.apiUrl}/clientes`,
  debriefing: `${config.apiUrl}/debriefing`,
  reunioes: `${config.apiUrl}/reunioes`,
  tarefas: `${config.apiUrl}/tarefas`,
  health: `${config.apiUrl.replace('/api', '')}/api/health`
} as const;

// Configurações específicas por ambiente
export const isDevelopment = config.environment === 'development';
export const isProduction = config.environment === 'production'; 