'use client'

import { ResultadoCompleto } from '@/lib/calc/previsibilidade'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface ResultTableCompletaProps {
  resultados: ResultadoCompleto[]
}

export function ResultTableCompleta({ resultados }: ResultTableCompletaProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  const formatPercentage = (value: number) => {
    return `${value.toFixed(2)}%`
  }

  const getCenarioColor = (cenario: string) => {
    switch (cenario) {
      case 'pessimista':
        return 'bg-red-50 text-red-600'
      case 'realista':
        return 'bg-blue-50 text-blue-600'
      case 'otimista':
        return 'bg-green-50 text-green-600'
      default:
        return 'bg-gray-50 text-gray-600'
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl text-center">Resultados por Cenário</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left p-3 font-semibold">Cenário</th>
                <th className="text-center p-3 font-semibold">Leads</th>
                <th className="text-center p-3 font-semibold">Vendas</th>
                <th className="text-center p-3 font-semibold">Faturamento</th>
                <th className="text-center p-3 font-semibold">CAC</th>
                <th className="text-center p-3 font-semibold">LTV</th>
                <th className="text-center p-3 font-semibold">Lucro Líquido</th>
                <th className="text-center p-3 font-semibold">ROI</th>
              </tr>
            </thead>
            <tbody>
              {resultados.map((resultado, index) => (
                <tr key={index} className="border-b hover:bg-gray-50">
                  <td className="p-3">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getCenarioColor(resultado.cenario)}`}>
                      {resultado.cenario.charAt(0).toUpperCase() + resultado.cenario.slice(1)}
                    </span>
                  </td>
                  <td className="text-center p-3 font-medium">
                    {resultado.leads.toFixed(0)}
                  </td>
                  <td className="text-center p-3 font-medium">
                    {resultado.vendas.toFixed(0)}
                  </td>
                  <td className="text-center p-3 font-medium">
                    {formatCurrency(resultado.faturamento)}
                  </td>
                  <td className="text-center p-3 font-medium">
                    {formatCurrency(resultado.cac)}
                  </td>
                  <td className="text-center p-3 font-medium">
                    {formatCurrency(resultado.ltv)}
                  </td>
                  <td className={`text-center p-3 font-medium ${resultado.lucroLiquido >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {formatCurrency(resultado.lucroLiquido)}
                  </td>
                  <td className={`text-center p-3 font-medium ${resultado.roi >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {formatPercentage(resultado.roi)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
} 