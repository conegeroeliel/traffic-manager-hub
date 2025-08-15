'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Plus, Search, Filter, Edit, Trash2, Mail, Phone, MapPin, Grid, List } from 'lucide-react'
import { Header } from '@/components/Header'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Modal } from '@/components/ui/modal'
import { ConfirmModal } from '@/components/ui/confirm-modal'
import { ClienteDetalhesModal } from '@/components/ClienteDetalhesModal'
import { clienteService } from '@/lib/services/clienteService'
import { Cliente } from '@/lib/types/cliente'
import { NovoClienteModal } from '@/components/NovoClienteModal'

export default function ClientesPage() {
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [filteredClientes, setFilteredClientes] = useState<Cliente[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('todos')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedCliente, setSelectedCliente] = useState<Cliente | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false)
  const [clienteToDelete, setClienteToDelete] = useState<string | null>(null)
  const [isNovoClienteModalOpen, setIsNovoClienteModalOpen] = useState(false)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  useEffect(() => {
    loadClientes()
  }, [])

  const filterClientes = useCallback(() => {
    let filtered = clientes

    // Filtrar por busca
    if (searchTerm) {
      filtered = filtered.filter(cliente =>
        cliente.empresa.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cliente.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cliente.email.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filtrar por status
    if (statusFilter !== 'todos') {
      filtered = filtered.filter(cliente => cliente.status === statusFilter)
    }

    setFilteredClientes(filtered)
  }, [clientes, searchTerm, statusFilter])

  useEffect(() => {
    filterClientes()
  }, [filterClientes])

  const loadClientes = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const allClientes = await clienteService.getAll()
      setClientes(allClientes)
    } catch (error) {
      console.error('Erro ao carregar clientes:', error)
      setError('Erro ao carregar clientes. Verifique sua conexão.')
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ativo':
        return 'bg-green-100 text-green-800'
      case 'inativo':
        return 'bg-red-100 text-red-800'
      case 'prospecto':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  // Função para formatar telefone
  const formatPhone = (phone: string) => {
    if (!phone) return '-'
    // Remove tudo que não é número
    const numbers = phone.replace(/\D/g, '')
    if (numbers.length === 11) {
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7)}`
    }
    if (numbers.length === 10) {
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 6)}-${numbers.slice(6)}`
    }
    return phone
  }

  // Função para formatar CEP
  const formatCEP = (cep: string) => {
    if (!cep) return '-'
    const numbers = cep.replace(/\D/g, '')
    if (numbers.length === 8) {
      return `${numbers.slice(0, 5)}-${numbers.slice(5)}`
    }
    return cep
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR').format(new Date(date))
  }

  const handleDeleteCliente = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation() // Previne que o modal abra
    setClienteToDelete(id)
    setIsConfirmModalOpen(true)
  }

  const confirmDeleteCliente = async () => {
    if (!clienteToDelete) return
    
    try {
      const success = await clienteService.delete(clienteToDelete)
      if (success) {
        await loadClientes()
      } else {
        alert('Erro ao excluir cliente')
      }
    } catch (error) {
      console.error('Erro ao excluir cliente:', error)
      alert('Erro ao excluir cliente')
    }
  }

  const handleEditCliente = (id: string, e: React.MouseEvent) => {
    e.stopPropagation() // Previne que o modal abra
    // Encontrar o cliente e abrir o modal em modo de edição
    const cliente = clientes.find(c => c.id === id)
    if (cliente) {
      setSelectedCliente(cliente)
      setIsModalOpen(true)
      // O modal será aberto e o usuário poderá clicar em "Editar Cliente" dentro dele
    }
  }

  const handleViewCliente = (cliente: Cliente) => {
    setSelectedCliente(cliente)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedCliente(null)
  }

  const handleUpdateCliente = (clienteAtualizado: Cliente) => {
    // Atualizar o cliente na lista
    setClientes(prev => prev.map(c => c.id === clienteAtualizado.id ? clienteAtualizado : c))
    // Atualizar o cliente selecionado no modal
    setSelectedCliente(clienteAtualizado)
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
                <h1 className="text-3xl font-bold text-gray-900">Gestão de Clientes</h1>
                <p className="text-gray-600 mt-2">
                  Gerencie seus clientes e acompanhe suas campanhas
                </p>
              </div>
              <Button 
                className="flex items-center gap-2"
                onClick={() => setIsNovoClienteModalOpen(true)}
              >
                <Plus className="h-4 w-4" />
                Novo Cliente
              </Button>
            </div>
          </motion.div>

          {/* Estatísticas - Movido para o topo */}
          {!isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mb-8"
            >
              <Card>
                <CardHeader>
                  <CardTitle>Resumo</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {clientes.length}
                      </div>
                      <div className="text-sm text-gray-600">Total de Clientes</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {clientes.filter(c => c.status === 'ativo').length}
                      </div>
                      <div className="text-sm text-gray-600">Clientes Ativos</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-yellow-600">
                        {clientes.filter(c => c.status === 'prospecto').length}
                      </div>
                      <div className="text-sm text-gray-600">Prospectos</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-red-600">
                        {clientes.filter(c => c.status === 'inativo').length}
                      </div>
                      <div className="text-sm text-gray-600">Inativos</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Filtros e Controles */}
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Buscar por nome, empresa ou email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-gray-400" />
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  >
                    <option value="todos">Todos os Status</option>
                    <option value="ativo">Ativo</option>
                    <option value="inativo">Inativo</option>
                    <option value="prospecto">Prospecto</option>
                  </select>
                </div>
                {/* Controles de Visualização */}
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">Visualizar:</span>
                  <div className="flex border rounded-md">
                    <Button
                      variant={viewMode === 'grid' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setViewMode('grid')}
                      className="rounded-r-none"
                    >
                      <Grid className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={viewMode === 'list' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setViewMode('list')}
                      className="rounded-l-none"
                    >
                      <List className="h-4 w-4" />
                    </Button>
                  </div>
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

          {/* Lista de Clientes */}
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Carregando clientes...</p>
            </div>
          ) : filteredClientes.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <Search className="h-12 w-12 mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Nenhum cliente encontrado
                </h3>
                <p className="text-gray-600">
                  {searchTerm || statusFilter !== 'todos' 
                    ? 'Tente ajustar os filtros de busca'
                    : 'Comece cadastrando seu primeiro cliente'
                  }
                </p>
              </CardContent>
            </Card>
          ) : viewMode === 'grid' ? (
            // Visualização em Grid (atual)
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredClientes.map((cliente, index) => (
                <motion.div
                  key={cliente.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card 
                    className="h-full hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => handleViewCliente(cliente)}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg mb-1">{cliente.empresa || cliente.nome || 'Cliente'}</CardTitle>
                          <p className="text-sm text-gray-600 mb-2">{cliente.empresa ? cliente.nome : ''}</p>
                          <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(cliente.status)}`}>
                            {cliente.status.charAt(0).toUpperCase() + cliente.status.slice(1)}
                          </span>
                        </div>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => handleEditCliente(cliente.id, e)}
                            className="h-8 w-8 p-0"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => handleDeleteCliente(cliente.id, e)}
                            className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2 text-gray-600">
                          <Mail className="h-4 w-4" />
                          <span className="truncate">{cliente.email}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <Phone className="h-4 w-4" />
                          <span>{formatPhone(cliente.telefone)}</span>
                        </div>
                        {cliente.endereco && (
                          <div className="flex items-center gap-2 text-gray-600">
                            <MapPin className="h-4 w-4" />
                            <span className="truncate">
                              {formatCEP(cliente.endereco.cep)}, {cliente.endereco.cidade}, {cliente.endereco.estado}
                            </span>
                          </div>
                        )}
                        <div className="pt-2 border-t">
                          <p className="text-xs text-gray-500">
                            Cadastrado em: {formatDate(cliente.dataCadastro)}
                          </p>
                          <p className="text-xs text-gray-500">
                            Setor: {cliente.setor}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          ) : (
            // Visualização em Lista
            <div className="space-y-4">
              {filteredClientes.map((cliente, index) => (
                <motion.div
                  key={cliente.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                >
                  <Card 
                    className="hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => handleViewCliente(cliente)}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 flex-1">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-lg font-semibold text-gray-900">{cliente.empresa || cliente.nome || 'Cliente'}</h3>
                              <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(cliente.status)}`}>
                                {cliente.status.charAt(0).toUpperCase() + cliente.status.slice(1)}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 mb-1">{cliente.empresa ? cliente.nome : ''}</p>
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                              <div className="flex items-center gap-1">
                                <Mail className="h-3 w-3" />
                                <span>{cliente.email}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Phone className="h-3 w-3" />
                                <span>{formatPhone(cliente.telefone)}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <span>Setor: {cliente.setor}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <span>Cadastrado: {formatDate(cliente.dataCadastro)}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => handleEditCliente(cliente.id, e)}
                            className="h-8 w-8 p-0"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => handleDeleteCliente(cliente.id, e)}
                            className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
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

      {/* Modal de Detalhes */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      >
        <ClienteDetalhesModal
          cliente={selectedCliente}
          onEdit={() => {}} // Função vazia pois não é mais usada
          onClose={handleCloseModal}
          onUpdate={handleUpdateCliente}
        />
      </Modal>

      {/* Modal de Confirmação */}
      <ConfirmModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={confirmDeleteCliente}
        title="Confirmar Exclusão"
        message="Tem certeza que deseja excluir este cliente?"
      />

      {/* Modal de Novo Cliente */}
      <NovoClienteModal
        isOpen={isNovoClienteModalOpen}
        onClose={() => setIsNovoClienteModalOpen(false)}
        onSuccess={() => {
          setIsNovoClienteModalOpen(false)
          loadClientes()
        }}
      />
    </div>
  )
} 