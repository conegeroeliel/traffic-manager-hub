'use client'

import { ResultadoSimplificado } from '@/lib/calc/previsibilidade'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface ResultTableSimplificadaProps {
  resultado: ResultadoSimplificado
}

export function ResultTableSimplificada({ resultado }: ResultTableSimplificadaProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  const formatPercentage = (value: number) => {
    return `${value.toFixed(2)}%`
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl text-center">Resultados da Simulação</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">
              {formatCurrency(resultado.investimento)}
            </div>
            <div className="text-sm text-gray-600">Investimento</div>
          </div>
          
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              {resultado.leadsGerados.toFixed(0)}
            </div>
            <div className="text-sm text-gray-600">Leads Gerados</div>
          </div>
          
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">
              {resultado.vendasPrevistas.toFixed(0)}
            </div>
            <div className="text-sm text-gray-600">Vendas Previstas</div>
          </div>
          
          <div className="text-center p-4 bg-orange-50 rounded-lg">
            <div className="text-2xl font-bold text-orange-600">
              {formatCurrency(resultado.faturamentoPrevisto)}
            </div>
            <div className="text-sm text-gray-600">Faturamento Previsto</div>
          </div>
          
          <div className="text-center p-4 bg-red-50 rounded-lg">
            <div className="text-2xl font-bold text-red-600">
              {formatPercentage(resultado.roi)}
            </div>
            <div className="text-sm text-gray-600">ROI</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 