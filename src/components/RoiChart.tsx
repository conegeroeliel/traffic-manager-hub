'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { ResultadoCompleto } from '@/lib/calc/previsibilidade'

interface RoiChartProps {
  dados: ResultadoCompleto[]
}

export function RoiChart({ dados }: RoiChartProps) {
  const chartData = dados.map(item => ({
    name: item.cenario.charAt(0).toUpperCase() + item.cenario.slice(1),
    roi: item.roi,
    lucro: item.lucroLiquido
  }))

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium">{label}</p>
          <p className="text-blue-600">ROI: {payload[0].value.toFixed(2)}%</p>
          <p className="text-green-600">Lucro: R$ {payload[1].value.toFixed(2)}</p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="w-full h-80 bg-white rounded-lg border p-4">
      <h3 className="text-lg font-semibold mb-4 text-center">ROI por Cenário</h3>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="roi" fill="#3b82f6" name="ROI (%)" />
          <Bar dataKey="lucro" fill="#10b981" name="Lucro (R$)" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
} 