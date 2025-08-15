'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { calculadoraSimplificadaSchema, CalculadoraSimplificadaForm } from '@/lib/schemas'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface FormSimplificadoProps {
  onSubmit: (data: CalculadoraSimplificadaForm) => void
  isLoading?: boolean
}

export function FormSimplificado({ onSubmit, isLoading = false }: FormSimplificadoProps) {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<CalculadoraSimplificadaForm>({
    resolver: zodResolver(calculadoraSimplificadaSchema),
    defaultValues: {
      investimento: 1000,
      custoPorLead: 10,
      taxaConversao: 2,
      ticketMedio: 100
    }
  })

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Dados para Cálculo</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="investimento">Investimento (R$)</Label>
              <Input
                id="investimento"
                type="number"
                step="0.01"
                placeholder="1000.00"
                {...register('investimento', { valueAsNumber: true })}
              />
              {errors.investimento && (
                <p className="text-sm text-red-600">{errors.investimento.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="custoPorLead">Custo por Lead (R$)</Label>
              <Input
                id="custoPorLead"
                type="number"
                step="0.01"
                placeholder="10.00"
                {...register('custoPorLead', { valueAsNumber: true })}
              />
              {errors.custoPorLead && (
                <p className="text-sm text-red-600">{errors.custoPorLead.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="taxaConversao">Taxa de Conversão (%)</Label>
              <Input
                id="taxaConversao"
                type="number"
                step="0.01"
                placeholder="2.00"
                {...register('taxaConversao', { valueAsNumber: true })}
              />
              {errors.taxaConversao && (
                <p className="text-sm text-red-600">{errors.taxaConversao.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="ticketMedio">Ticket Médio (R$)</Label>
              <Input
                id="ticketMedio"
                type="number"
                step="0.01"
                placeholder="100.00"
                {...register('ticketMedio', { valueAsNumber: true })}
              />
              {errors.ticketMedio && (
                <p className="text-sm text-red-600">{errors.ticketMedio.message}</p>
              )}
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full" 
            disabled={isLoading}
          >
            {isLoading ? 'Calculando...' : 'Calcular'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
} 