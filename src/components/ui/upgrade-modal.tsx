'use client'

import { useState, useEffect } from 'react'
import { Modal } from './modal'
import { Card, CardContent, CardHeader, CardTitle } from './card'
import { Button } from './button'
import { Badge } from './badge'
import { 
  Crown, 
  Zap, 
  Users, 
  Check, 
  X,
  CreditCard,
  QrCode,
  FileText
} from 'lucide-react'
import { planService, AvailablePlan, UpgradeRequest } from '@/lib/services/planService'

interface UpgradeModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

export function UpgradeModal({ isOpen, onClose, onSuccess }: UpgradeModalProps) {
  const [plans, setPlans] = useState<AvailablePlan[]>([])
  const [selectedPlan, setSelectedPlan] = useState<'trial' | 'premium' | null>(null)
  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'cartao' | 'boleto'>('pix')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (isOpen) {
      loadPlans()
    }
  }, [isOpen])

  const loadPlans = async () => {
    try {
      const data = await planService.getAvailablePlans()
      setPlans(data)
    } catch (err: any) {
      setError(err.message)
    }
  }

  const handleUpgrade = async () => {
    if (!selectedPlan) return

    try {
      setLoading(true)
      setError(null)

      const upgradeData: UpgradeRequest = {
        plano: selectedPlan,
        metodoPagamento: paymentMethod,
        valor: plans.find(p => p.id === selectedPlan)?.preco || 0
      }

      const response = await planService.upgrade(upgradeData)
      
      console.log('Upgrade realizado:', response)
      
      // Em produção, aqui você mostraria os dados de pagamento
      // (PIX, boleto, etc.)
      
      onSuccess?.()
      onClose()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const getPlanIcon = (planId: string) => {
    switch (planId) {
      case 'premium':
        return <Crown className="h-6 w-6 text-yellow-500" />
      case 'trial':
        return <Zap className="h-6 w-6 text-blue-500" />
      default:
        return <Users className="h-6 w-6 text-gray-500" />
    }
  }

  const getPlanColor = (planId: string) => {
    switch (planId) {
      case 'premium':
        return 'border-yellow-200 bg-yellow-50'
      case 'trial':
        return 'border-blue-200 bg-blue-50'
      default:
        return 'border-gray-200 bg-gray-50'
    }
  }

  const getPaymentIcon = (method: string) => {
    switch (method) {
      case 'pix':
        return <QrCode className="h-4 w-4" />
      case 'cartao':
        return <CreditCard className="h-4 w-4" />
      case 'boleto':
        return <FileText className="h-4 w-4" />
      default:
        return <CreditCard className="h-4 w-4" />
    }
  }

  if (!isOpen) return null

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Escolha seu Plano</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        {/* Planos disponíveis */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {plans.filter(p => p.id !== 'free').map((plan) => (
            <Card 
              key={plan.id}
              className={`cursor-pointer transition-all hover:shadow-md ${
                selectedPlan === plan.id 
                  ? 'ring-2 ring-blue-500 border-blue-500' 
                  : getPlanColor(plan.id)
              }`}
              onClick={() => setSelectedPlan(plan.id as 'trial' | 'premium')}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {getPlanIcon(plan.id)}
                    <div>
                      <CardTitle className="text-lg">{plan.nome}</CardTitle>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-2xl font-bold">
                          R$ {plan.preco}
                        </span>
                        {plan.periodo && (
                          <span className="text-sm text-gray-500">
                            /{plan.periodo}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  {selectedPlan === plan.id && (
                    <Check className="h-5 w-5 text-blue-500" />
                  )}
                </div>
              </CardHeader>
              
              <CardContent className="space-y-3">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Recursos incluídos:</h4>
                  <ul className="space-y-1">
                    {plan.recursos.map((recurso, index) => (
                      <li key={index} className="flex items-center gap-2 text-sm text-gray-600">
                        <Check className="h-3 w-3 text-green-500" />
                        {recurso}
                      </li>
                    ))}
                  </ul>
                </div>
                
                {plan.limitacoes.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Limitações:</h4>
                    <ul className="space-y-1">
                      {plan.limitacoes.map((limitacao, index) => (
                        <li key={index} className="flex items-center gap-2 text-sm text-gray-500">
                          <X className="h-3 w-3 text-red-500" />
                          {limitacao}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Método de pagamento */}
        {selectedPlan && (
          <div className="mb-6">
            <h3 className="font-medium text-gray-900 mb-3">Método de Pagamento</h3>
            <div className="grid grid-cols-3 gap-3">
              {[
                { id: 'pix', label: 'PIX', icon: <QrCode className="h-4 w-4" /> },
                { id: 'cartao', label: 'Cartão', icon: <CreditCard className="h-4 w-4" /> },
                { id: 'boleto', label: 'Boleto', icon: <FileText className="h-4 w-4" /> }
              ].map((method) => (
                <Button
                  key={method.id}
                  variant={paymentMethod === method.id ? 'default' : 'outline'}
                  className="flex items-center gap-2"
                  onClick={() => setPaymentMethod(method.id as 'pix' | 'cartao' | 'boleto')}
                >
                  {method.icon}
                  {method.label}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Resumo */}
        {selectedPlan && (
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="font-medium text-gray-900 mb-2">Resumo do Pedido</h3>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">
                {plans.find(p => p.id === selectedPlan)?.nome}
              </span>
              <span className="font-medium">
                R$ {plans.find(p => p.id === selectedPlan)?.preco}
              </span>
            </div>
            <div className="flex items-center justify-between mt-1">
              <span className="text-gray-600">
                Pagamento via {paymentMethod.toUpperCase()}
              </span>
            </div>
          </div>
        )}

        {/* Ações */}
        <div className="flex gap-3">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Cancelar
          </Button>
          <Button 
            onClick={handleUpgrade}
            disabled={!selectedPlan || loading}
            className="flex-1"
          >
            {loading ? 'Processando...' : 'Fazer Upgrade'}
          </Button>
        </div>
      </div>
    </Modal>
  )
}


