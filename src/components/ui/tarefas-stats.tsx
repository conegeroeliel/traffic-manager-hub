'use client'

import { motion } from 'framer-motion'
import { 
  CheckSquare, 
  Clock, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  TrendingUp,
  Calendar,
  Users,
  FileText,
  Settings
} from 'lucide-react'
import { EstatisticasTarefa } from '@/types/tarefa'

interface TarefasStatsProps {
  estatisticas: EstatisticasTarefa
}

const statusConfig = {
  pendentes: { icon: Clock, color: 'text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/30' },
  emAndamento: { icon: TrendingUp, color: 'text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/30' },
  concluidas: { icon: CheckCircle, color: 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/30' },
  canceladas: { icon: XCircle, color: 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/30' }
}

const categoriaConfig = {
  cliente: { icon: Users, color: 'text-blue-600' },
  campanha: { icon: TrendingUp, color: 'text-green-600' },
  relatorio: { icon: FileText, color: 'text-purple-600' },
  reuniao: { icon: Calendar, color: 'text-orange-600' },
  outro: { icon: Settings, color: 'text-gray-600' }
}

export function TarefasStats({ estatisticas }: TarefasStatsProps) {
  const calcularPorcentagem = (valor: number, total: number) => {
    return total > 0 ? Math.round((valor / total) * 100) : 0
  }

  const getStatusColor = (status: keyof typeof statusConfig) => {
    return statusConfig[status].color
  }

  const getCategoriaColor = (categoria: keyof typeof categoriaConfig) => {
    return categoriaConfig[categoria].color
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Status Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
            <Clock className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
          </div>
          <span className="text-2xl font-bold text-gray-900 dark:text-white">
            {estatisticas.pendentes}
          </span>
        </div>
        <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
          Pendentes
        </h3>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <motion.div
            className="bg-yellow-500 h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${calcularPorcentagem(estatisticas.pendentes, estatisticas.total)}%` }}
            transition={{ duration: 0.8, delay: 0.2 }}
          />
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
          {calcularPorcentagem(estatisticas.pendentes, estatisticas.total)}% do total
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
            <TrendingUp className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>
          <span className="text-2xl font-bold text-gray-900 dark:text-white">
            {estatisticas.emAndamento}
          </span>
        </div>
        <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
          Em Andamento
        </h3>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <motion.div
            className="bg-blue-500 h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${calcularPorcentagem(estatisticas.emAndamento, estatisticas.total)}%` }}
            transition={{ duration: 0.8, delay: 0.3 }}
          />
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
          {calcularPorcentagem(estatisticas.emAndamento, estatisticas.total)}% do total
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
            <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
          </div>
          <span className="text-2xl font-bold text-gray-900 dark:text-white">
            {estatisticas.concluidas}
          </span>
        </div>
        <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
          Concluídas
        </h3>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <motion.div
            className="bg-green-500 h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${calcularPorcentagem(estatisticas.concluidas, estatisticas.total)}%` }}
            transition={{ duration: 0.8, delay: 0.4 }}
          />
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
          {calcularPorcentagem(estatisticas.concluidas, estatisticas.total)}% do total
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-lg">
            <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
          </div>
          <span className="text-2xl font-bold text-gray-900 dark:text-white">
            {estatisticas.vencidas}
          </span>
        </div>
        <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
          Vencidas
        </h3>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <motion.div
            className="bg-red-500 h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${calcularPorcentagem(estatisticas.vencidas, estatisticas.total)}%` }}
            transition={{ duration: 0.8, delay: 0.5 }}
          />
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
          {calcularPorcentagem(estatisticas.vencidas, estatisticas.total)}% do total
        </p>
      </motion.div>
    </div>
  )
}
