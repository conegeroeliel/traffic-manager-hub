'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { calculadoraCompletaSchema, CalculadoraCompletaForm } from '@/lib/schemas'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface FormCompletoProps {
  onSubmit: (data: CalculadoraCompletaForm) => void
  isLoading?: boolean
}

export function FormCompleto({ onSubmit, isLoading = false }: FormCompletoProps) {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<CalculadoraCompletaForm>({
    resolver: zodResolver(calculadoraCompletaSchema),
    defaultValues: {
      investimento: 1000,
      custoPorLead: 10,
      taxaConversao: 2,
      ticketMedio: 100,
      margemLucro: 30,
      repeticaoCompras: 2.5
    }
  })

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Dados para Cálculo Completo</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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

            <div className="space-y-2">
              <Label htmlFor="margemLucro">Margem de Lucro (%)</Label>
              <Input
                id="margemLucro"
                type="number"
                step="0.01"
                placeholder="30.00"
                {...register('margemLucro', { valueAsNumber: true })}
              />
              {errors.margemLucro && (
                <p className="text-sm text-red-600">{errors.margemLucro.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="repeticaoCompras">Repetição de Compras</Label>
              <Input
                id="repeticaoCompras"
                type="number"
                step="0.1"
                placeholder="2.5"
                {...register('repeticaoCompras', { valueAsNumber: true })}
              />
              {errors.repeticaoCompras && (
                <p className="text-sm text-red-600">{errors.repeticaoCompras.message}</p>
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