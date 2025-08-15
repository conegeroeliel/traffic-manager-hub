'use client'

import { useState, useEffect } from 'react'
import { Timeline } from '@/components/ui/timeline'
import { clienteService } from '@/lib/services/clienteService'
import { Cliente } from '@/lib/types/cliente'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Users, Calendar, TrendingUp } from 'lucide-react'

export default function TimelinePage() {
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [selectedClienteId, setSelectedClienteId] = useState<string | undefined>(undefined)
  const [selectedCliente, setSelectedCliente] = useState<Cliente | undefined>(undefined)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadClientes = async () => {
      try {
        setLoading(true)
        const clientesData = await clienteService.getAll()
        setClientes(clientesData)
        
                       // Selecionar o primeiro cliente por padrão
               if (clientesData.length > 0 && !selectedClienteId) {
                 setSelectedClienteId(clientesData[0].id)
                 setSelectedCliente(clientesData[0])
               }
      } catch (error) {
        console.error('Erro ao carregar clientes:', error)
      } finally {
        setLoading(false)
      }
    }

    loadClientes()
  }, [])

  // Removendo esta linha duplicada - já temos selectedCliente como state

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 mt-2">Carregando...</p>
        </div>
      </div>
    )
  }

  if (clientes.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-gray-500">
              <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-medium">Nenhum cliente encontrado</p>
              <p className="text-sm">
                Você precisa ter pelo menos um cliente para visualizar a timeline
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Linha do Tempo</h1>
        <p className="text-gray-600">
          Acompanhe todos os eventos e interações dos seus clientes em uma timeline visual
        </p>
      </div>

      {/* Seletor de Cliente */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Selecionar Cliente
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="flex-1">
                       <Select
           value={selectedClienteId || ''}
           onValueChange={(value) => {
             setSelectedClienteId(value)
             const cliente = clientes.find(c => c.id === value)
             setSelectedCliente(cliente)
           }}
         >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um cliente" />
                </SelectTrigger>
                <SelectContent>
                  {clientes.map((cliente) => (
                    <SelectItem key={cliente.id} value={cliente.id}>
                      <div className="flex items-center gap-2">
                        <span>{cliente.nome}</span>
                        <Badge variant={cliente.status === 'ativo' ? 'default' : 'secondary'}>
                          {cliente.status}
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {selectedCliente && (
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  Cliente desde {selectedCliente.dataCadastro.toLocaleDateString()}
                </div>
                <div className="flex items-center gap-1">
                  <TrendingUp className="w-4 h-4" />
                  {selectedCliente.setor}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Timeline do Cliente Selecionado */}
               {selectedClienteId ? (
           <Timeline 
             clienteId={selectedClienteId}
             cliente={selectedCliente}
             showStats={true}
             showActions={true}
           />
         ) : (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-gray-500">
              <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-medium">Selecione um cliente</p>
              <p className="text-sm">
                Escolha um cliente para visualizar sua timeline
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
