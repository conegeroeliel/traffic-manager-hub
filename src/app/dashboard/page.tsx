'use client'

import { useState, useEffect } from 'react'
import { Header } from '@/components/Header'
import { PlanStatusCard } from '@/components/ui/plan-status-card'
import { UpgradeModal } from '@/components/ui/upgrade-modal'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Modal } from '@/components/ui/modal'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  Users, 
  Brain, 
  CheckSquare, 
  Calendar,
  TrendingUp,
  Plus,
  Clock,
  X
} from 'lucide-react'
import Link from 'next/link'

export default function DashboardPage() {
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)
  const [showClienteModal, setShowClienteModal] = useState(false)
  const [showTarefaModal, setShowTarefaModal] = useState(false)
  const [showReuniaoModal, setShowReuniaoModal] = useState(false)

  const stats = [
    {
      title: 'Clientes',
      value: '12',
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      href: '/dashboard/clientes'
    },
    {
      title: 'Diagnósticos',
      value: '8',
      icon: Brain,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      href: '/dashboard/calculadora'
    },
    {
      title: 'Tarefas',
      value: '24',
      icon: CheckSquare,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      href: '/dashboard/tarefas'
    },
    {
      title: 'Reuniões',
      value: '5',
      icon: Calendar,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
      href: '/dashboard/reunioes'
    }
  ]

  const quickActions = [
    {
      title: 'Novo Cliente',
      description: 'Cadastrar novo cliente',
      icon: Plus,
      action: () => setShowClienteModal(true),
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Diagnóstico IA',
      description: 'Análise inteligente de nicho',
      icon: Brain,
      href: '/dashboard/debriefing',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      title: 'Nova Tarefa',
      description: 'Criar nova tarefa',
      icon: CheckSquare,
      action: () => setShowTarefaModal(true),
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Nova Reunião',
      description: 'Agendar reunião',
      icon: Calendar,
      action: () => setShowReuniaoModal(true),
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Dashboard
          </h1>
          <p className="text-gray-600">
            Gerencie seus clientes, diagnósticos e tarefas em um só lugar
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Coluna principal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Estatísticas */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {stats.map((stat) => (
                <Link key={stat.title} href={stat.href}>
                  <Card className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600">
                            {stat.title}
                          </p>
                          <p className="text-2xl font-bold text-gray-900">
                            {stat.value}
                          </p>
                        </div>
                        <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                          <stat.icon className={`h-5 w-5 ${stat.color}`} />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>

            {/* Ações rápidas */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Ações Rápidas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {quickActions.map((action) => (
                    <div key={action.title}>
                      {action.href ? (
                        <Link href={action.href}>
                          <div className={`p-4 rounded-lg border ${action.bgColor} hover:shadow-md transition-shadow cursor-pointer`}>
                            <div className="flex items-center gap-3">
                              <div className={`p-2 rounded-lg bg-white`}>
                                <action.icon className={`h-5 w-5 ${action.color}`} />
                              </div>
                              <div>
                                <h3 className="font-medium text-gray-900">
                                  {action.title}
                                </h3>
                                <p className="text-sm text-gray-600">
                                  {action.description}
                                </p>
                              </div>
                            </div>
                          </div>
                        </Link>
                      ) : (
                        <button
                          onClick={action.action}
                          className={`w-full p-4 rounded-lg border ${action.bgColor} hover:shadow-md transition-shadow cursor-pointer text-left`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg bg-white`}>
                              <action.icon className={`h-5 w-5 ${action.color}`} />
                            </div>
                            <div>
                              <h3 className="font-medium text-gray-900">
                                {action.title}
                              </h3>
                              <p className="text-sm text-gray-600">
                                {action.description}
                              </p>
                            </div>
                          </div>
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Timeline */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Linha do Tempo
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Users className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Novo cliente cadastrado</p>
                      <p className="text-sm text-gray-600">João Silva - há 2 horas</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <Brain className="h-4 w-4 text-purple-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Diagnóstico concluído</p>
                      <p className="text-sm text-gray-600">Restaurante ABC - há 4 horas</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <CheckSquare className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Tarefa concluída</p>
                      <p className="text-sm text-gray-600">Revisar campanha - há 6 horas</p>
                    </div>
                  </div>

                  <Link href="/dashboard/timeline">
                    <Button variant="outline" className="w-full">
                      Ver Timeline Completa
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Status do plano */}
            <PlanStatusCard onUpgradeClick={() => setShowUpgradeModal(true)} />

            {/* Próximas reuniões */}
            <Card>
              <CardHeader>
                <CardTitle>Próximas Reuniões</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 bg-orange-50 rounded-lg">
                    <p className="font-medium text-gray-900">Reunião com Cliente A</p>
                    <p className="text-sm text-gray-600">Hoje às 14:00</p>
                  </div>

                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="font-medium text-gray-900">Follow-up Cliente B</p>
                    <p className="text-sm text-gray-600">Amanhã às 10:00</p>
                  </div>

                  <Button variant="outline" className="w-full">
                    Ver todas
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Tarefas pendentes */}
            <Card>
              <CardHeader>
                <CardTitle>Tarefas Pendentes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">Urgente: Revisar campanha</p>
                      <p className="text-sm text-gray-600">Vence hoje</p>
                    </div>
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">Preparar relatório</p>
                      <p className="text-sm text-gray-600">Vence amanhã</p>
                    </div>
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  </div>

                  <Button variant="outline" className="w-full">
                    Ver todas
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Modal de upgrade */}
      <UpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        onSuccess={() => {
          window.location.reload()
        }}
      />

      {/* Modal Novo Cliente */}
      <Modal isOpen={showClienteModal} onClose={() => setShowClienteModal(false)} size="lg">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Novo Cliente</h2>
            <button
              onClick={() => setShowClienteModal(false)}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="nome">Nome do Cliente</Label>
              <Input id="nome" placeholder="Digite o nome completo" />
            </div>
            
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="cliente@exemplo.com" />
            </div>
            
            <div>
              <Label htmlFor="telefone">Telefone</Label>
              <Input id="telefone" placeholder="(11) 99999-9999" />
            </div>
            
            <div>
              <Label htmlFor="empresa">Empresa</Label>
              <Input id="empresa" placeholder="Nome da empresa" />
            </div>
            
            <div>
              <Label htmlFor="observacoes">Observações</Label>
              <Textarea id="observacoes" placeholder="Informações adicionais..." />
            </div>
          </div>
          
          <div className="flex gap-3 mt-6">
            <Button variant="outline" onClick={() => setShowClienteModal(false)}>
              Cancelar
            </Button>
            <Button>
              Cadastrar Cliente
            </Button>
          </div>
        </div>
      </Modal>

      {/* Modal Nova Tarefa */}
      <Modal isOpen={showTarefaModal} onClose={() => setShowTarefaModal(false)} size="lg">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Nova Tarefa</h2>
            <button
              onClick={() => setShowTarefaModal(false)}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="titulo">Título da Tarefa</Label>
              <Input id="titulo" placeholder="Digite o título da tarefa" />
            </div>
            
            <div>
              <Label htmlFor="descricao">Descrição</Label>
              <Textarea id="descricao" placeholder="Descreva a tarefa..." />
            </div>
            
            <div>
              <Label htmlFor="prioridade">Prioridade</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a prioridade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="baixa">Baixa</SelectItem>
                  <SelectItem value="media">Média</SelectItem>
                  <SelectItem value="alta">Alta</SelectItem>
                  <SelectItem value="urgente">Urgente</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="dataVencimento">Data de Vencimento</Label>
              <Input id="dataVencimento" type="date" />
            </div>
          </div>
          
          <div className="flex gap-3 mt-6">
            <Button variant="outline" onClick={() => setShowTarefaModal(false)}>
              Cancelar
            </Button>
            <Button>
              Criar Tarefa
            </Button>
          </div>
        </div>
      </Modal>

      {/* Modal Nova Reunião */}
      <Modal isOpen={showReuniaoModal} onClose={() => setShowReuniaoModal(false)} size="lg">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Nova Reunião</h2>
            <button
              onClick={() => setShowReuniaoModal(false)}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="tituloReuniao">Título da Reunião</Label>
              <Input id="tituloReuniao" placeholder="Digite o título da reunião" />
            </div>
            
            <div>
              <Label htmlFor="cliente">Cliente</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o cliente" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cliente1">Cliente A</SelectItem>
                  <SelectItem value="cliente2">Cliente B</SelectItem>
                  <SelectItem value="cliente3">Cliente C</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="dataReuniao">Data e Hora</Label>
              <Input id="dataReuniao" type="datetime-local" />
            </div>
            
            <div>
              <Label htmlFor="tipo">Tipo de Reunião</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="apresentacao">Apresentação</SelectItem>
                  <SelectItem value="followup">Follow-up</SelectItem>
                  <SelectItem value="estrategia">Estratégia</SelectItem>
                  <SelectItem value="revisao">Revisão</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="observacoesReuniao">Observações</Label>
              <Textarea id="observacoesReuniao" placeholder="Agenda ou observações..." />
            </div>
          </div>
          
          <div className="flex gap-3 mt-6">
            <Button variant="outline" onClick={() => setShowReuniaoModal(false)}>
              Cancelar
            </Button>
            <Button>
              Agendar Reunião
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
} 