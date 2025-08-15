import { PlanLimits, User } from '@/types/user';

export const PLAN_LIMITS: PlanLimits = {
  FREE: {
    clientes: 3,
    diagnosticos: 1,
    tarefas: 10,
    reunioes: 5,
    diasTrial: 7,
  },
  TRIAL: {
    clientes: 10,
    diagnosticos: 5,
    tarefas: 50,
    reunioes: 20,
    diasTrial: 14,
  },
  PREMIUM: {
    clientes: -1, // ilimitado
    diagnosticos: -1, // ilimitado
    tarefas: -1, // ilimitado
    reunioes: -1, // ilimitado
    diasTrial: 0,
  },
};

export class PlanManager {
  /**
   * Verifica se o usuário pode criar mais clientes
   */
  static canCreateCliente(user: User): { allowed: boolean; message?: string } {
    const limit = PLAN_LIMITS[user.plano].clientes;
    
    if (limit === -1) return { allowed: true };
    
    if (user.totalClientes >= limit) {
      return {
        allowed: false,
        message: `Limite de ${limit} clientes atingido. Faça upgrade para criar mais.`
      };
    }
    
    return { allowed: true };
  }

  /**
   * Verifica se o usuário pode criar mais diagnósticos
   */
  static canCreateDiagnostico(user: User): { allowed: boolean; message?: string } {
    const limit = PLAN_LIMITS[user.plano].diagnosticos;
    
    if (limit === -1) return { allowed: true };
    
    if (user.totalDiagnosticos >= limit) {
      return {
        allowed: false,
        message: `Limite de ${limit} diagnósticos atingido. Faça upgrade para criar mais.`
      };
    }
    
    return { allowed: true };
  }

  /**
   * Verifica se o usuário pode criar mais tarefas
   */
  static canCreateTarefa(user: User): { allowed: boolean; message?: string } {
    const limit = PLAN_LIMITS[user.plano].tarefas;
    
    if (limit === -1) return { allowed: true };
    
    if (user.totalTarefas >= limit) {
      return {
        allowed: false,
        message: `Limite de ${limit} tarefas atingido. Faça upgrade para criar mais.`
      };
    }
    
    return { allowed: true };
  }

  /**
   * Verifica se o usuário pode criar mais reuniões
   */
  static canCreateReuniao(user: User): { allowed: boolean; message?: string } {
    const limit = PLAN_LIMITS[user.plano].reunioes;
    
    if (limit === -1) return { allowed: true };
    
    if (user.totalReunioes >= limit) {
      return {
        allowed: false,
        message: `Limite de ${limit} reuniões atingido. Faça upgrade para criar mais.`
      };
    }
    
    return { allowed: true };
  }

  /**
   * Verifica se o usuário tem acesso a funcionalidades premium
   */
  static hasPremiumAccess(user: User): boolean {
    return user.plano === 'premium' && user.statusPagamento === 'ativo';
  }

  /**
   * Verifica se o trial do usuário expirou
   */
  static isTrialExpired(user: User): boolean {
    if (user.plano !== 'trial') return false;
    
    if (!user.dataExpiracaoTrial) return false;
    
    return new Date() > user.dataExpiracaoTrial;
  }

  /**
   * Verifica se o premium do usuário expirou
   */
  static isPremiumExpired(user: User): boolean {
    if (user.plano !== 'premium') return false;
    
    if (!user.dataExpiracaoPremium) return false;
    
    return new Date() > user.dataExpiracaoPremium;
  }

  /**
   * Obtém os limites do plano atual do usuário
   */
  static getCurrentLimits(user: User) {
    return PLAN_LIMITS[user.plano];
  }

  /**
   * Obtém o uso atual do usuário
   */
  static getCurrentUsage(user: User) {
    return {
      clientes: user.totalClientes,
      diagnosticos: user.totalDiagnosticos,
      tarefas: user.totalTarefas,
      reunioes: user.totalReunioes,
    };
  }

  /**
   * Calcula a porcentagem de uso de cada recurso
   */
  static getUsagePercentage(user: User) {
    const limits = PLAN_LIMITS[user.plano];
    const usage = this.getCurrentUsage(user);
    
    return {
      clientes: limits.clientes === -1 ? 0 : Math.round((usage.clientes / limits.clientes) * 100),
      diagnosticos: limits.diagnosticos === -1 ? 0 : Math.round((usage.diagnosticos / limits.diagnosticos) * 100),
      tarefas: limits.tarefas === -1 ? 0 : Math.round((usage.tarefas / limits.tarefas) * 100),
      reunioes: limits.reunioes === -1 ? 0 : Math.round((usage.reunioes / limits.reunioes) * 100),
    };
  }
}
