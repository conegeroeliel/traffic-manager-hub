'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Header } from '@/components/Header'
import { useTarefas } from '@/hooks/useTarefas'
import { TarefasStats } from '@/components/ui/tarefas-stats'
import { TarefasList } from '@/components/ui/tarefas-list'
import { TarefaViewModal } from '@/components/ui/tarefa-view-modal'
import { TarefaFormModal } from '@/components/ui/tarefa-form-modal'
import { 
  Plus, 
  Filter, 
  Search, 
  CheckSquare,
  Clock,
  TrendingUp,
  CheckCircle,
  XCircle
} from 'lucide-react'
import { Tarefa, TarefaStatus, TarefaPrioridade, TarefaCategoria, CriarTarefaData, AtualizarTarefaData } from '@/types/tarefa'
import { AnimatePresence } from 'framer-motion'

export default function TarefasPage() {
  const { 
    tarefas, 
    estatisticas, 
    loading, 
    error, 
    filtros, 
    criarTarefa, 
    atualizarTarefa, 
    deletarTarefa, 
    adicionarComentario,
    deletarComentario,
    getTarefasVencidas,
    exportarTarefas,
    aplicarFiltros, 
    limparFiltros 
  } = useTarefas()

  const [searchTerm, setSearchTerm] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [selectedStatus, setSelectedStatus] = useState<TarefaStatus[]>([])
  const [selectedPrioridade, setSelectedPrioridade] = useState<TarefaPrioridade[]>([])
  const [selectedCategoria, setSelectedCategoria] = useState<TarefaCategoria[]>([])
  
  // Estados para modais
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showViewModal, setShowViewModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedTarefa, setSelectedTarefa] = useState<Tarefa | null>(null)

  const handleSearch = (term: string) => {
    setSearchTerm(term)
    aplicarFiltros({ ...filtros, busca: term })
  }

  const handleStatusFilter = (status: TarefaStatus) => {
    const newStatus = selectedStatus.includes(status)
      ? selectedStatus.filter(s => s !== status)
      : [...selectedStatus, status]
    
    setSelectedStatus(newStatus)
    aplicarFiltros({ ...filtros, status: newStatus })
  }

  const handlePrioridadeFilter = (prioridade: TarefaPrioridade) => {
    const newPrioridade = selectedPrioridade.includes(prioridade)
      ? selectedPrioridade.filter(p => p !== prioridade)
      : [...selectedPrioridade, prioridade]
    
    setSelectedPrioridade(newPrioridade)
    aplicarFiltros({ ...filtros, prioridade: newPrioridade })
  }

  const handleCategoriaFilter = (categoria: TarefaCategoria) => {
    const newCategoria = selectedCategoria.includes(categoria)
      ? selectedCategoria.filter(c => c !== categoria)
      : [...selectedCategoria, categoria]
    
    setSelectedCategoria(newCategoria)
    aplicarFiltros({ ...filtros, categoria: newCategoria })
  }

  const handleClearFilters = () => {
    setSearchTerm('')
    setSelectedStatus([])
    setSelectedPrioridade([])
    setSelectedCategoria([])
    limparFiltros()
  }



  const handleCreateTarefa = async (data: CriarTarefaData | AtualizarTarefaData) => {
    try {
      await criarTarefa(data as CriarTarefaData)
      setShowCreateModal(false)
    } catch (error) {
      console.error('Erro ao criar tarefa:', error)
    }
  }

  const handleEdit = (tarefa: Tarefa) => {
    setSelectedTarefa(tarefa)
    setShowEditModal(true)
  }

  const handleUpdateTarefa = async (data: AtualizarTarefaData) => {
    if (!selectedTarefa) return
    
    try {
      await atualizarTarefa(selectedTarefa.id, data)
      setShowEditModal(false)
      setSelectedTarefa(null)
    } catch (error) {
      console.error('Erro ao atualizar tarefa:', error)
    }
  }

  const handleDelete = async (id: number) => {
    if (confirm('Tem certeza que deseja excluir esta tarefa?')) {
      try {
        await deletarTarefa(id)
        if (selectedTarefa?.id === id) {
          setShowViewModal(false)
          setShowEditModal(false)
          setSelectedTarefa(null)
        }
      } catch (error) {
        console.error('Erro ao deletar tarefa:', error)
      }
    }
  }

  const handleView = (tarefa: Tarefa) => {
    setSelectedTarefa(tarefa)
    setShowViewModal(true)
  }

  const handleStatusChange = async (id: number, status: TarefaStatus) => {
    try {
      await atualizarTarefa(id, { status })
      if (selectedTarefa?.id === id) {
        setSelectedTarefa(prev => prev ? { ...prev, status } : null)
      }
    } catch (error) {
      console.error('Erro ao atualizar status:', error)
    }
  }

  const handleAddComment = async (tarefaId: number, texto: string, arquivos: File[]) => {
    try {
      await adicionarComentario(tarefaId, texto, arquivos)
    } catch (error) {
      console.error('Erro ao adicionar comentário:', error)
    }
  }

  const handleDeleteComment = async (commentId: number) => {
    if (!selectedTarefa) return
    
    try {
      await deletarComentario(selectedTarefa.id, commentId.toString())
    } catch (error) {
      console.error('Erro ao deletar comentário:', error)
    }
  }

  const handleExportTarefas = async (formato: 'csv' | 'json' = 'csv') => {
    try {
      const data = await exportarTarefas(formato)
      const blob = new Blob([data], { 
        type: formato === 'csv' ? 'text/csv' : 'application/json' 
      })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `tarefas.${formato}`
      link.click()
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Erro ao exportar tarefas:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header />
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Header */}
          <motion.div 
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  Tarefas
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Gerencie suas tarefas e acompanhe o progresso
                </p>
              </div>
              
              <div className="flex items-center space-x-3">
                <motion.button
                  onClick={() => setShowCreateModal(true)}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Plus className="h-4 w-4" />
                  <span>Nova Tarefa</span>
                </motion.button>
                
                <motion.button
                  onClick={() => handleExportTarefas('csv')}
                  className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span>Exportar CSV</span>
                </motion.button>
              </div>
            </div>
          </motion.div>

          {/* Estatísticas */}
          {estatisticas && (
            <motion.div 
              className="mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <TarefasStats estatisticas={estatisticas} />
            </motion.div>
          )}

          {/* Filtros e Busca */}
          <motion.div 
            className="mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                {/* Busca */}
                <div className="flex-1 max-w-md">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Buscar tarefas..."
                      value={searchTerm}
                      onChange={(e) => handleSearch(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Botões de Filtro */}
                <div className="flex items-center space-x-3">
                  <motion.button
                    onClick={() => setShowFilters(!showFilters)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-colors ${
                      showFilters 
                        ? 'bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-900/20 dark:border-blue-700 dark:text-blue-400'
                        : 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Filter className="h-4 w-4" />
                    <span>Filtros</span>
                  </motion.button>

                  {(selectedStatus.length > 0 || selectedPrioridade.length > 0 || selectedCategoria.length > 0 || searchTerm) && (
                    <motion.button
                      onClick={handleClearFilters}
                      className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Limpar
                    </motion.button>
                  )}
                </div>
              </div>

              {/* Filtros Expandidos */}
              <AnimatePresence>
                {showFilters && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {/* Status */}
                      <div>
                        <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Status</h3>
                        <div className="space-y-2">
                          {(['pendente', 'em_andamento', 'concluida', 'cancelada'] as TarefaStatus[]).map((status) => (
                            <label key={status} className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                checked={selectedStatus.includes(status)}
                                onChange={() => handleStatusFilter(status)}
                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                              />
                              <span className="text-sm text-gray-700 dark:text-gray-300 capitalize">
                                {status.replace('_', ' ')}
                              </span>
                            </label>
                          ))}
                        </div>
                      </div>

                      {/* Prioridade */}
                      <div>
                        <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Prioridade</h3>
                        <div className="space-y-2">
                          {(['baixa', 'media', 'alta', 'urgente'] as TarefaPrioridade[]).map((prioridade) => (
                            <label key={prioridade} className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                checked={selectedPrioridade.includes(prioridade)}
                                onChange={() => handlePrioridadeFilter(prioridade)}
                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                              />
                              <span className="text-sm text-gray-700 dark:text-gray-300 capitalize">
                                {prioridade}
                              </span>
                            </label>
                          ))}
                        </div>
                      </div>

                      {/* Categoria */}
                      <div>
                        <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Categoria</h3>
                        <div className="space-y-2">
                          {(['cliente', 'campanha', 'relatorio', 'reuniao', 'outro'] as TarefaCategoria[]).map((categoria) => (
                            <label key={categoria} className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                checked={selectedCategoria.includes(categoria)}
                                onChange={() => handleCategoriaFilter(categoria)}
                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                              />
                              <span className="text-sm text-gray-700 dark:text-gray-300 capitalize">
                                {categoria}
                              </span>
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Lista de Tarefas */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <TarefasList
              tarefas={tarefas}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onView={handleView}
              onStatusChange={handleStatusChange}
            />
          </motion.div>
        </div>
      </main>

      {/* Modais */}
      <AnimatePresence>
        {/* Modal de Criação */}
        {showCreateModal && (
          <TarefaFormModal
            isOpen={showCreateModal}
            onClose={() => setShowCreateModal(false)}
            onSubmit={handleCreateTarefa}
            isEditing={false}
          />
        )}

        {/* Modal de Edição */}
        {showEditModal && selectedTarefa && (
          <TarefaFormModal
            tarefa={selectedTarefa}
            isOpen={showEditModal}
            onClose={() => {
              setShowEditModal(false)
              setSelectedTarefa(null)
            }}
            onSubmit={handleUpdateTarefa}
            isEditing={true}
          />
        )}

        {/* Modal de Visualização */}
        {showViewModal && selectedTarefa && (
          <TarefaViewModal
            tarefa={selectedTarefa}
            isOpen={showViewModal}
            onClose={() => {
              setShowViewModal(false)
              setSelectedTarefa(null)
            }}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onStatusChange={handleStatusChange}
            onAddComment={handleAddComment}
            onDeleteComment={handleDeleteComment}
            currentUserId={1} // TODO: Pegar do contexto de autenticação
          />
        )}
      </AnimatePresence>
    </div>
  )
}
