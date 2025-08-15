'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './card'
import { Badge } from './badge'
import { Button } from './button'
import { Progress } from './progress'
import { 
  Crown, 
  Users, 
  Brain, 
  CheckSquare, 
  Calendar,
  AlertTriangle,
  Clock,
  Zap
} from 'lucide-react'
import { planService, PlanInfo } from '@/lib/services/planService'

interface PlanStatusCardProps {
  onUpgradeClick?: () => void
}

export function PlanStatusCard({ onUpgradeClick }: PlanStatusCardProps) {
  const [planInfo, setPlanInfo] = useState<PlanInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadPlanInfo()
  }, [])

  const loadPlanInfo = async () => {
    try {
      setLoading(true)
      const data = await planService.getLimits()
      setPlanInfo(data)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const getPlanIcon = (plano: string) => {
    switch (plano) {
      case 'premium':
        return <Crown className="h-5 w-5 text-yellow-500" />
      case 'trial':
        return <Zap className="h-5 w-5 text-blue-500" />
      default:
        return <Users className="h-5 w-5 text-gray-500" />
    }
  }

  const getPlanColor = (plano: string) => {
    switch (plano) {
      case 'premium':
        return 'bg-gradient-to-r from-yellow-400 to-orange-500'
      case 'trial':
        return 'bg-gradient-to-r from-blue-400 to-purple-500'
      default:
        return 'bg-gradient-to-r from-gray-400 to-gray-500'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ativo':
        return 'bg-green-100 text-green-800'
      case 'pendente':
        return 'bg-yellow-100 text-yellow-800'
      case 'cancelado':
        return 'bg-red-100 text-red-800'
      case 'expirado':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return null
    return new Date(dateString).toLocaleDateString('pt-BR')
  }

  const getUsageItem = (label: string, used: number, limit: number, icon: React.ReactNode) => {
    const percentage = limit === -1 ? 0 : Math.round((used / limit) * 100)
    const isUnlimited = limit === -1

    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {icon}
            <span className="text-sm font-medium text-gray-700">{label}</span>
          </div>
          <span className="text-sm text-gray-500">
            {used} {isUnlimited ? '' : `/ ${limit}`}
            {isUnlimited && <span className="text-green-600 ml-1">∞</span>}
          </span>
        </div>
        {!isUnlimited && (
          <Progress value={percentage} className="h-2" />
        )}
      </div>
    )
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/3"></div>
            <div className="space-y-2">
              <div className="h-3 bg-gray-200 rounded"></div>
              <div className="h-3 bg-gray-200 rounded w-2/3"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="h-4 w-4" />
            <span>Erro ao carregar informações do plano</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!planInfo) return null

  const isExpired = planInfo.statusPagamento === 'expirado'
  const isTrialExpired = planInfo.plano === 'trial' && planInfo.dataExpiracaoTrial && new Date(planInfo.dataExpiracaoTrial) < new Date()

  return (
    <Card className="border-l-4 border-l-blue-500">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {getPlanIcon(planInfo.plano)}
            <div>
              <CardTitle className="text-lg capitalize">
                Plano {planInfo.plano}
              </CardTitle>
              <div className="flex items-center gap-2 mt-1">
                <Badge className={getStatusColor(planInfo.statusPagamento)}>
                  {planInfo.statusPagamento}
                </Badge>
                {isExpired && (
                  <Badge className="bg-red-100 text-red-800">
                    Expirado
                  </Badge>
                )}
              </div>
            </div>
          </div>
          {planInfo.plano !== 'premium' && (
            <Button 
              onClick={onUpgradeClick}
              className={getPlanColor(planInfo.plano)}
              size="sm"
            >
              Upgrade
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Alertas */}
        {(isExpired || isTrialExpired) && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <div className="flex items-center gap-2 text-red-700">
              <AlertTriangle className="h-4 w-4" />
              <span className="text-sm font-medium">
                {isTrialExpired 
                  ? 'Seu período trial expirou. Faça upgrade para continuar.'
                  : 'Seu plano expirou. Renove para continuar.'
                }
              </span>
            </div>
          </div>
        )}

        {/* Data de expiração */}
        {(planInfo.dataExpiracaoTrial || planInfo.dataExpiracaoPremium) && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Clock className="h-4 w-4" />
            <span>
              {planInfo.plano === 'trial' 
                ? `Expira em ${formatDate(planInfo.dataExpiracaoTrial)}`
                : `Renova em ${formatDate(planInfo.dataExpiracaoPremium)}`
              }
            </span>
          </div>
        )}

        {/* Uso dos recursos */}
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900">Uso dos Recursos</h4>
          
          {getUsageItem(
            'Clientes',
            planInfo.uso.clientes,
            planInfo.limites.clientes,
            <Users className="h-4 w-4 text-blue-500" />
          )}
          
          {getUsageItem(
            'Diagnósticos',
            planInfo.uso.diagnosticos,
            planInfo.limites.diagnosticos,
            <Brain className="h-4 w-4 text-purple-500" />
          )}
          
          {getUsageItem(
            'Tarefas',
            planInfo.uso.tarefas,
            planInfo.limites.tarefas,
            <CheckSquare className="h-4 w-4 text-green-500" />
          )}
          
          {getUsageItem(
            'Reuniões',
            planInfo.uso.reunioes,
            planInfo.limites.reunioes,
            <Calendar className="h-4 w-4 text-orange-500" />
          )}
        </div>

        {/* Ações */}
        {planInfo.plano === 'premium' && (
          <div className="pt-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full"
              onClick={() => {
                // Implementar cancelamento
                console.log('Cancelar assinatura')
              }}
            >
              Cancelar Assinatura
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}


