'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Brain, Plus, Search, Filter, FileText, Users, Target, TrendingUp, MessageSquare } from 'lucide-react'
import { Header } from '@/components/Header'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { debriefingService } from '@/lib/services/debriefingService'
import { clienteService } from '@/lib/services/clienteService'
import { Debriefing } from '@/lib/types/debriefing'
import { Cliente } from '@/lib/types/cliente'
import { NovoDebriefingModalConversacional } from '@/components/NovoDebriefingModalConversacional'
import { DiagnosticoModal } from '@/components/DiagnosticoModal'
import { PerguntasRespostasModal } from '@/components/PerguntasRespostasModal'
import { TesteIAModal } from '@/components/TesteIAModal'

export default function DebriefingPage() {
  const [debriefings, setDebriefings] = useState<Debriefing[]>([])
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [filteredDebriefings, setFilteredDebriefings] = useState<Debriefing[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isNovoDebriefingModalOpen, setIsNovoDebriefingModalOpen] = useState(false)
  const [isDiagnosticoModalOpen, setIsDiagnosticoModalOpen] = useState(false)
  const [isPerguntasRespostasModalOpen, setIsPerguntasRespostasModalOpen] = useState(false)
  const [isTesteIAModalOpen, setIsTesteIAModalOpen] = useState(false)
  const [selectedDebriefing, setSelectedDebriefing] = useState<Debriefing | null>(null)

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    filterDebriefings()
  }, [debriefings, searchTerm])

  const loadData = async () => {
    setIsLoading(true)
    setError(null)
    try {
      console.log('🔄 Carregando dados...')
      const [allDebriefings, allClientes] = await Promise.all([
        debriefingService.getAll(),
        clienteService.getAll()
      ])
      console.log('📋 Clientes carregados:', allClientes.length, allClientes)
      setDebriefings(allDebriefings)
      setClientes(allClientes)
    } catch (error) {
      console.error('Erro ao carregar dados:', error)
      setError('Erro ao carregar dados. Verifique sua conexão.')
    } finally {
      setIsLoading(false)
    }
  }

  const filterDebriefings = () => {
    let filtered = debriefings

    if (searchTerm) {
      filtered = filtered.filter(debriefing => {
        const cliente = clientes.find(c => c.id === debriefing.clienteId)
        return (
          cliente?.empresa?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          cliente?.nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          debriefing.respostas.segmento?.toLowerCase().includes(searchTerm.toLowerCase())
        )
      })
    }

    setFilteredDebriefings(filtered)
  }

  const getClienteName = (clienteId: string) => {
    const cliente = clientes.find(c => c.id === clienteId)
    return cliente ? (cliente.empresa || cliente.nome) : 'Cliente não encontrado'
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR').format(new Date(date))
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completo':
        return 'bg-green-100 text-green-800'
      case 'em_andamento':
        return 'bg-yellow-100 text-yellow-800'
      case 'pendente':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const handleNovoDebriefingSuccess = () => {
    setIsNovoDebriefingModalOpen(false)
    loadData()
  }

  const handleViewDiagnostico = (debriefing: Debriefing) => {
    setSelectedDebriefing(debriefing)
    setIsDiagnosticoModalOpen(true)
  }

  const handleViewPerguntasRespostas = (debriefing: Debriefing) => {
    setSelectedDebriefing(debriefing)
    setIsPerguntasRespostasModalOpen(true)
  }

  // Verificar se o usuário é premium
  const isPremium = () => {
    if (typeof window !== 'undefined') {
      const userData = localStorage.getItem('user')
      if (userData) {
        try {
          const user = JSON.parse(userData)
          return user.type === 'PREMIUM'
        } catch (error) {
          return false
        }
      }
    }
    return false
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Diagnóstico Inteligente</h1>
                <p className="text-gray-600 mt-2">
                  Debriefing estratégico para análise de nicho e recomendações de campanha
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={() => setIsTesteIAModalOpen(true)}
                  variant="outline"
                  className="border-purple-200 text-purple-700 hover:bg-purple-50"
                >
                  <Brain className="h-4 w-4 mr-2" />
                  Testar IA
                </Button>
                <Button 
                  className="flex items-center gap-2"
                  onClick={() => setIsNovoDebriefingModalOpen(true)}
                >
                  <Plus className="h-4 w-4" />
                  Novo Debriefing
                </Button>
              </div>
            </div>
          </motion.div>



          {/* Filtros */}
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Buscar por cliente, segmento..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Mensagem de erro */}
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {/* Lista de Debriefings */}
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Carregando debriefings...</p>
            </div>
          ) : filteredDebriefings.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <Brain className="h-12 w-12 mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Nenhum debriefing encontrado
                </h3>
                <p className="text-gray-600 mb-4">
                  {searchTerm 
                    ? 'Tente ajustar os filtros de busca'
                    : 'Comece criando seu primeiro debriefing estratégico'
                  }
                </p>
                {!searchTerm && (
                  <Button onClick={() => setIsNovoDebriefingModalOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Criar Primeiro Debriefing
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDebriefings.map((debriefing, index) => (
                <motion.div
                  key={debriefing.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg mb-1">
                            {getClienteName(debriefing.clienteId)}
                          </CardTitle>
                          <p className="text-sm text-gray-600 mb-2">
                            {debriefing.respostas.segmento || 'Segmento não informado'}
                          </p>
                          <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor('completo')}`}>
                            Diagnóstico Completo
                          </span>
                        </div>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => handleViewDiagnostico(debriefing)}
                            title="Ver diagnóstico"
                          >
                            <FileText className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => handleViewPerguntasRespostas(debriefing)}
                            title="Ver perguntas e respostas"
                          >
                            <MessageSquare className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2 text-gray-600">
                          <Target className="h-4 w-4" />
                          <span className="truncate">
                            Ticket: R$ {debriefing.respostas.ticketMedio?.toLocaleString('pt-BR') || 'N/A'}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <TrendingUp className="h-4 w-4" />
                          <span>
                            {debriefing.respostas.faseNegocio ? debriefing.respostas.faseNegocio.charAt(0).toUpperCase() + debriefing.respostas.faseNegocio.slice(1) : 'Fase não informada'}
                          </span>
                        </div>
                        <div className="pt-2 border-t">
                          <p className="text-xs text-gray-500">
                            Criado em: {formatDate(debriefing.createdAt)}
                          </p>
                          <p className="text-xs text-gray-500">
                            Atualizado: {formatDate(debriefing.updatedAt)}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Modal de Novo Debriefing */}
      <NovoDebriefingModalConversacional
        isOpen={isNovoDebriefingModalOpen}
        onClose={() => setIsNovoDebriefingModalOpen(false)}
        onSuccess={handleNovoDebriefingSuccess}
        clientes={clientes}
      />

      {/* Modal de Diagnóstico */}
      {selectedDebriefing && (
        <DiagnosticoModal
          isOpen={isDiagnosticoModalOpen}
          onClose={() => {
            setIsDiagnosticoModalOpen(false)
            setSelectedDebriefing(null)
          }}
          diagnostico={selectedDebriefing.diagnostico}
          clienteNome={getClienteName(selectedDebriefing.clienteId)}
          segmento={selectedDebriefing.respostas.segmento || 'Não informado'}
          isPremium={isPremium()}
        />
      )}

      {/* Modal de Perguntas e Respostas */}
      {selectedDebriefing && (
        <PerguntasRespostasModal
          isOpen={isPerguntasRespostasModalOpen}
          onClose={() => {
            setIsPerguntasRespostasModalOpen(false)
            setSelectedDebriefing(null)
          }}
          perguntasRespostas={selectedDebriefing.perguntasRespostas || []}
          clienteNome={getClienteName(selectedDebriefing.clienteId)}
        />
      )}

      {/* Modal de Teste da IA */}
      <TesteIAModal
        isOpen={isTesteIAModalOpen}
        onClose={() => setIsTesteIAModalOpen(false)}
      />
    </div>
  )
} 