import { useState, useEffect, useCallback } from 'react'
import { 
  Tarefa, 
  CriarTarefaData, 
  AtualizarTarefaData, 
  FiltrosTarefa, 
  EstatisticasTarefa 
} from '@/types/tarefa'
import { tarefaService } from '@/lib/services/tarefaService'

export function useTarefas() {
  const [tarefas, setTarefas] = useState<Tarefa[]>([])
  const [estatisticas, setEstatisticas] = useState<EstatisticasTarefa | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filtros, setFiltros] = useState<FiltrosTarefa>({})

  // Dados mockados para desenvolvimento
  const mockTarefas: Tarefa[] = [
    {
      id: 1,
      titulo: 'Revisar campanha do cliente João Silva',
      descricao: 'Analisar performance da campanha de Facebook Ads e fazer ajustes necessários',
      status: 'pendente',
      prioridade: 'alta',
      categoria: 'campanha',
      clienteId: 1,
      clienteNome: 'João Silva',
      dataCriacao: '2024-01-15T10:00:00Z',
      dataVencimento: '2024-01-20T18:00:00Z',
      responsavelId: 1,
      responsavelNome: 'Gestor Principal',
      tags: ['facebook', 'performance', 'ajustes']
    },
    {
      id: 2,
      titulo: 'Preparar relatório mensal',
      descricao: 'Criar relatório de performance para todos os clientes do mês',
      status: 'em_andamento',
      prioridade: 'media',
      categoria: 'relatorio',
      dataCriacao: '2024-01-14T14:30:00Z',
      dataVencimento: '2024-01-18T17:00:00Z',
      responsavelId: 1,
      responsavelNome: 'Gestor Principal',
      tags: ['relatorio', 'mensal', 'performance']
    },
    {
      id: 3,
      titulo: 'Reunião com Maria Santos',
      descricao: 'Apresentar resultados da campanha e discutir próximos passos',
      status: 'pendente',
      prioridade: 'urgente',
      categoria: 'reuniao',
      clienteId: 2,
      clienteNome: 'Maria Santos',
      dataCriacao: '2024-01-15T09:00:00Z',
      dataVencimento: '2024-01-16T15:00:00Z',
      responsavelId: 1,
      responsavelNome: 'Gestor Principal',
      tags: ['reuniao', 'apresentacao', 'resultados']
    },
    {
      id: 4,
      titulo: 'Otimizar campanha Google Ads',
      descricao: 'Ajustar keywords e bids para melhorar ROI',
      status: 'concluida',
      prioridade: 'alta',
      categoria: 'campanha',
      clienteId: 3,
      clienteNome: 'Empresa ABC',
      dataCriacao: '2024-01-10T11:00:00Z',
      dataVencimento: '2024-01-12T18:00:00Z',
      dataConclusao: '2024-01-12T16:30:00Z',
      responsavelId: 1,
      responsavelNome: 'Gestor Principal',
      tags: ['google-ads', 'otimizacao', 'roi']
    },
    {
      id: 5,
      titulo: 'Atualizar planilha de controle',
      descricao: 'Incluir novos dados de campanhas e atualizar métricas',
      status: 'pendente',
      prioridade: 'baixa',
      categoria: 'outro',
      dataCriacao: '2024-01-15T16:00:00Z',
      dataVencimento: '2024-01-17T18:00:00Z',
      responsavelId: 1,
      responsavelNome: 'Gestor Principal',
      tags: ['planilha', 'controle', 'dados']
    }
  ]

  const mockEstatisticas: EstatisticasTarefa = {
    total: 5,
    pendentes: 3,
    emAndamento: 1,
    concluidas: 1,
    canceladas: 0,
    vencidas: 0,
    porPrioridade: {
      baixa: 1,
      media: 1,
      alta: 2,
      urgente: 1
    },
    porCategoria: {
      cliente: 0,
      campanha: 2,
      relatorio: 1,
      reuniao: 1,
      outro: 1
    }
  }

  const fetchTarefas = useCallback(async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('token')
      
      if (!token) {
        throw new Error('Token não encontrado')
      }

      // Tentar usar a API real primeiro
      try {
        const response = await tarefaService.getTarefas(filtros)
        setTarefas(response.tarefas)
        setEstatisticas({
          total: response.total,
          pendentes: response.resumo.pendente,
          emAndamento: response.resumo.em_andamento,
          concluidas: response.resumo.concluida,
          canceladas: response.resumo.cancelada,
          vencidas: 0, // Será calculado separadamente
          porPrioridade: { baixa: 0, media: 0, alta: 0, urgente: 0 },
          porCategoria: { cliente: 0, campanha: 0, relatorio: 0, reuniao: 0, outro: 0 }
        })
        setError(null)
      } catch (apiError) {
        console.warn('API não disponível, usando dados mockados:', apiError)
        // Fallback para dados mockados
        setTarefas(mockTarefas)
        setEstatisticas(mockEstatisticas)
      }
    } catch (err) {
      console.error('Erro ao buscar tarefas:', err)
      setError(err instanceof Error ? err.message : 'Erro desconhecido')
      setTarefas(mockTarefas)
      setEstatisticas(mockEstatisticas)
    } finally {
      setLoading(false)
    }
  }, [])

  const criarTarefa = useCallback(async (data: CriarTarefaData): Promise<Tarefa> => {
    try {
      const token = localStorage.getItem('token')
      
      if (!token) {
        throw new Error('Token não encontrado')
      }

      // Simular criação
      const novaTarefa: Tarefa = {
        id: Date.now(),
        titulo: data.titulo,
        descricao: data.descricao,
        status: 'pendente',
        prioridade: data.prioridade,
        categoria: data.categoria,
        clienteId: data.clienteId,
        dataCriacao: new Date().toISOString(),
        dataVencimento: data.dataVencimento,
        responsavelId: data.responsavelId,
        tags: data.tags || [],
        comentarios: [],
        anexos: []
      }

      setTarefas(prev => [novaTarefa, ...prev])
      return novaTarefa
    } catch (err) {
      console.error('Erro ao criar tarefa:', err)
      throw err
    }
  }, [])

  const atualizarTarefa = useCallback(async (id: number, data: AtualizarTarefaData): Promise<Tarefa> => {
    try {
      const token = localStorage.getItem('token')
      
      if (!token) {
        throw new Error('Token não encontrado')
      }

      setTarefas(prev => prev.map(tarefa => 
        tarefa.id === id 
          ? { 
              ...tarefa, 
              ...data,
              dataConclusao: data.status === 'concluida' ? new Date().toISOString() : tarefa.dataConclusao
            }
          : tarefa
      ))

      const tarefaAtualizada = tarefas.find(t => t.id === id)
      if (!tarefaAtualizada) {
        throw new Error('Tarefa não encontrada')
      }

      return { ...tarefaAtualizada, ...data }
    } catch (err) {
      console.error('Erro ao atualizar tarefa:', err)
      throw err
    }
  }, [tarefas])

  const deletarTarefa = useCallback(async (id: number): Promise<void> => {
    try {
      const token = localStorage.getItem('token')
      
      if (!token) {
        throw new Error('Token não encontrado')
      }

      setTarefas(prev => prev.filter(tarefa => tarefa.id !== id))
    } catch (err) {
      console.error('Erro ao deletar tarefa:', err)
      throw err
    }
  }, [])

  const aplicarFiltros = useCallback((novosFiltros: FiltrosTarefa) => {
    setFiltros(novosFiltros)
  }, [])

  const limparFiltros = useCallback(() => {
    setFiltros({})
  }, [])

  // Filtrar tarefas baseado nos filtros ativos
  const tarefasFiltradas = tarefas.filter(tarefa => {
    if (filtros.status && filtros.status.length > 0 && !filtros.status.includes(tarefa.status)) {
      return false
    }
    if (filtros.prioridade && filtros.prioridade.length > 0 && !filtros.prioridade.includes(tarefa.prioridade)) {
      return false
    }
    if (filtros.categoria && filtros.categoria.length > 0 && !filtros.categoria.includes(tarefa.categoria)) {
      return false
    }
    if (filtros.clienteId && tarefa.clienteId !== filtros.clienteId) {
      return false
    }
    if (filtros.responsavelId && tarefa.responsavelId !== filtros.responsavelId) {
      return false
    }
    if (filtros.busca) {
      const busca = filtros.busca.toLowerCase()
      return (
        tarefa.titulo.toLowerCase().includes(busca) ||
        tarefa.descricao?.toLowerCase().includes(busca) ||
        tarefa.clienteNome?.toLowerCase().includes(busca) ||
        tarefa.tags?.some(tag => tag.toLowerCase().includes(busca))
      )
    }
    return true
  })

  useEffect(() => {
    fetchTarefas()
  }, [fetchTarefas])

  // Funções para comentários
  const adicionarComentario = useCallback(async (tarefaId: number, texto: string, arquivos: File[] = []): Promise<any> => {
    try {
      const token = localStorage.getItem('token')
      
      if (!token) {
        throw new Error('Token não encontrado')
      }

      // Tentar usar a API real primeiro
      try {
        const comentario = await tarefaService.adicionarComentarioComAnexos(tarefaId, texto, arquivos)
        
        // Atualizar a tarefa localmente
        setTarefas(prev => prev.map(tarefa => 
          tarefa.id === tarefaId 
            ? { 
                ...tarefa, 
                comentarios: [...(tarefa.comentarios || []), comentario]
              }
            : tarefa
        ))
        
        return comentario
      } catch (apiError) {
        console.warn('API não disponível, simulando comentário:', apiError)
        // Simular comentário
        const novoComentario = {
          id: Date.now(),
          texto,
          autorId: 1,
          autorNome: 'Usuário',
          data: new Date().toISOString(),
          anexos: arquivos.map((file, index) => ({
            id: index + 1,
            nome: file.name,
            url: URL.createObjectURL(file),
            tipo: file.type,
            tamanho: file.size
          }))
        }
        
        setTarefas(prev => prev.map(tarefa => 
          tarefa.id === tarefaId 
            ? { 
                ...tarefa, 
                comentarios: [...(tarefa.comentarios || []), novoComentario]
              }
            : tarefa
        ))
        
        return novoComentario
      }
    } catch (err) {
      console.error('Erro ao adicionar comentário:', err)
      throw err
    }
  }, [])

  const deletarComentario = useCallback(async (tarefaId: number, comentarioId: string): Promise<void> => {
    try {
      const token = localStorage.getItem('token')
      
      if (!token) {
        throw new Error('Token não encontrado')
      }

      // Tentar usar a API real primeiro
      try {
        await tarefaService.deletarComentario(tarefaId, comentarioId)
      } catch (apiError) {
        console.warn('API não disponível, simulando exclusão:', apiError)
      }
      
      // Atualizar localmente
      setTarefas(prev => prev.map(tarefa => 
        tarefa.id === tarefaId 
          ? { 
              ...tarefa, 
              comentarios: tarefa.comentarios?.filter(c => c.id !== parseInt(comentarioId)) || []
            }
          : tarefa
      ))
    } catch (err) {
      console.error('Erro ao deletar comentário:', err)
      throw err
    }
  }, [])

  // Função para buscar tarefas vencidas
  const getTarefasVencidas = useCallback(async () => {
    try {
      const token = localStorage.getItem('token')
      
      if (!token) {
        throw new Error('Token não encontrado')
      }

      try {
        const response = await tarefaService.getTarefasVencidas()
        return response.tarefas
      } catch (apiError) {
        console.warn('API não disponível, calculando tarefas vencidas localmente:', apiError)
        const agora = new Date()
        return tarefas.filter(tarefa => 
          tarefa.dataVencimento && 
          new Date(tarefa.dataVencimento) < agora &&
          tarefa.status !== 'concluida' &&
          tarefa.status !== 'cancelada'
        )
      }
    } catch (err) {
      console.error('Erro ao buscar tarefas vencidas:', err)
      return []
    }
  }, [])

  // Função para exportar tarefas
  const exportarTarefas = useCallback(async (formato: 'csv' | 'json' = 'csv'): Promise<string> => {
    try {
      const token = localStorage.getItem('token')
      
      if (!token) {
        throw new Error('Token não encontrado')
      }

      try {
        return await tarefaService.exportarTarefas(formato)
      } catch (apiError) {
        console.warn('API não disponível, exportando localmente:', apiError)
        return tarefaService.exportarTarefas(formato)
      }
    } catch (err) {
      console.error('Erro ao exportar tarefas:', err)
      throw err
    }
  }, [])

  return {
    tarefas: tarefasFiltradas,
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
    limparFiltros,
    refetch: fetchTarefas
  }
}
