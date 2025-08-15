import { useState, useEffect } from 'react'

export interface DashboardStats {
  totalClientes: number
  roiMedio: number
  totalDiagnosticos: number
  tarefasPendentes: number
  receitaMensal: number
  clientesAtivos: number
  clientesInativos: number
  ultimasAtividades: Array<{
    id: number
    tipo: 'cliente' | 'diagnostico' | 'calculadora'
    titulo: string
    data: string
    status: 'success' | 'warning' | 'error' | 'info'
  }>
}

export interface Notification {
  id: number
  titulo: string
  mensagem: string
  tipo: 'info' | 'warning' | 'error' | 'success'
  lida: boolean
  data: string
}

export function useDashboardData() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('token')
      
      if (!token) {
        throw new Error('Token não encontrado')
      }

      // Buscar estatísticas do dashboard
      const statsResponse = await fetch('http://localhost:3001/api/dashboard/stats', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (!statsResponse.ok) {
        throw new Error('Erro ao buscar estatísticas')
      }

      const statsData = await statsResponse.json()
      setStats(statsData)

      // Buscar notificações
      const notificationsResponse = await fetch('http://localhost:3001/api/dashboard/notifications', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (notificationsResponse.ok) {
        const notificationsData = await notificationsResponse.json()
        setNotifications(notificationsData)
      }

    } catch (err) {
      console.error('Erro ao buscar dados do dashboard:', err)
      setError(err instanceof Error ? err.message : 'Erro desconhecido')
      
      // Dados mockados para desenvolvimento
      setStats({
        totalClientes: 12,
        roiMedio: 3.2,
        totalDiagnosticos: 8,
        tarefasPendentes: 5,
        receitaMensal: 45000,
        clientesAtivos: 10,
        clientesInativos: 2,
        ultimasAtividades: [
          {
            id: 1,
            tipo: 'cliente',
            titulo: 'Novo cliente cadastrado',
            data: '2024-01-15T10:30:00Z',
            status: 'success'
          },
          {
            id: 2,
            tipo: 'diagnostico',
            titulo: 'Diagnóstico concluído',
            data: '2024-01-15T09:15:00Z',
            status: 'info'
          },
          {
            id: 3,
            tipo: 'calculadora',
            titulo: 'ROI calculado',
            data: '2024-01-15T08:45:00Z',
            status: 'success'
          }
        ]
      })

      setNotifications([
        {
          id: 1,
          titulo: 'Novo cliente',
          mensagem: 'João Silva foi cadastrado como novo cliente',
          tipo: 'success',
          lida: false,
          data: '2024-01-15T10:30:00Z'
        },
        {
          id: 2,
          titulo: 'Diagnóstico pronto',
          mensagem: 'Diagnóstico do nicho "E-commerce" foi concluído',
          tipo: 'info',
          lida: false,
          data: '2024-01-15T09:15:00Z'
        },
        {
          id: 3,
          titulo: 'Reunião agendada',
          mensagem: 'Reunião com Maria Santos agendada para amanhã às 14h',
          tipo: 'warning',
          lida: true,
          data: '2024-01-15T08:00:00Z'
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  const markNotificationAsRead = async (notificationId: number) => {
    try {
      const token = localStorage.getItem('token')
      
      await fetch(`http://localhost:3001/api/dashboard/notifications/${notificationId}/read`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      setNotifications(prev => 
        prev.map(notification => 
          notification.id === notificationId 
            ? { ...notification, lida: true }
            : notification
        )
      )
    } catch (err) {
      console.error('Erro ao marcar notificação como lida:', err)
    }
  }

  const clearAllNotifications = async () => {
    try {
      const token = localStorage.getItem('token')
      
      await fetch('http://localhost:3001/api/dashboard/notifications/clear', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      setNotifications([])
    } catch (err) {
      console.error('Erro ao limpar notificações:', err)
    }
  }

  useEffect(() => {
    fetchDashboardData()
  }, [])

  return {
    stats,
    notifications,
    loading,
    error,
    refetch: fetchDashboardData,
    markNotificationAsRead,
    clearAllNotifications
  }
}
