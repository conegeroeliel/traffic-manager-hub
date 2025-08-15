'use client'

import { TimelineFilters as TimelineFiltersType, TimelineEventType, TimelineEventImportance, timelineEventConfig } from '@/lib/types/timeline'
import { Button } from './button'
import { Input } from './input'
import { Label } from './label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select'
import { Calendar, Filter, X, RefreshCw } from 'lucide-react'
import { useState } from 'react'

interface TimelineFiltersProps {
  filters: TimelineFiltersType
  onFiltersChange: (filters: TimelineFiltersType) => void
  onClearFilters: () => void
  onRefresh: () => void
  loading?: boolean
}

export function TimelineFilters({
  filters,
  onFiltersChange,
  onClearFilters,
  onRefresh,
  loading = false
}: TimelineFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const handleFilterChange = (key: keyof TimelineFiltersType, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value
    })
  }

  const hasActiveFilters = Object.values(filters).some(value => value !== undefined && value !== '')

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-gray-600" />
          <h3 className="font-semibold text-gray-900">Filtros</h3>
          {hasActiveFilters && (
            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
              Ativos
            </span>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onRefresh}
            disabled={loading}
          >
            <RefreshCw className={`w-4 h-4 mr-1 ${loading ? 'animate-spin' : ''}`} />
            Atualizar
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? 'Ocultar' : 'Expandir'}
          </Button>
        </div>
      </div>

      {/* Filtros rápidos sempre visíveis */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        <div>
          <Label htmlFor="tipo-filter">Tipo de Evento</Label>
          <Select
            value={filters.tipo || 'todos'}
            onValueChange={(value) => handleFilterChange('tipo', value === 'todos' ? undefined : value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Todos os tipos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos os tipos</SelectItem>
              {Object.entries(timelineEventConfig).map(([key, config]) => (
                <SelectItem key={key} value={key}>
                  <span className="flex items-center gap-2">
                    <span>{config.icon}</span>
                    <span>{config.label}</span>
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="importancia-filter">Importância</Label>
          <Select
            value={filters.importancia || 'todas'}
            onValueChange={(value) => handleFilterChange('importancia', value === 'todas' ? undefined : value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Todas as importâncias" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todas">Todas as importâncias</SelectItem>
              <SelectItem value="baixo">Baixo</SelectItem>
              <SelectItem value="medio">Médio</SelectItem>
              <SelectItem value="alto">Alto</SelectItem>
              <SelectItem value="critico">Crítico</SelectItem>
              <SelectItem value="celebrativo">Celebrativo</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="autor-filter">Autor</Label>
          <Input
            id="autor-filter"
            placeholder="Buscar por autor..."
            value={filters.autor || ''}
            onChange={(e) => handleFilterChange('autor', e.target.value)}
          />
        </div>

        <div className="flex items-end gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onClearFilters}
            disabled={!hasActiveFilters}
            className="w-full"
          >
            <X className="w-4 h-4 mr-1" />
            Limpar
          </Button>
        </div>
      </div>

      {/* Filtros expandidos */}
      {isExpanded && (
        <div className="border-t border-gray-200 pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="data-inicio">Data de Início</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="data-inicio"
                  type="date"
                  value={filters.dataInicio ? filters.dataInicio.toISOString().split('T')[0] : ''}
                  onChange={(e) => {
                    const date = e.target.value ? new Date(e.target.value) : undefined
                    handleFilterChange('dataInicio', date)
                  }}
                  className="pl-10"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="data-fim">Data de Fim</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="data-fim"
                  type="date"
                  value={filters.dataFim ? filters.dataFim.toISOString().split('T')[0] : ''}
                  onChange={(e) => {
                    const date = e.target.value ? new Date(e.target.value) : undefined
                    handleFilterChange('dataFim', date)
                  }}
                  className="pl-10"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filtros ativos */}
      {hasActiveFilters && (
        <div className="border-t border-gray-200 pt-4 mt-4">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm text-gray-600">Filtros ativos:</span>
            {filters.tipo && (
              <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full flex items-center gap-1">
                Tipo: {timelineEventConfig[filters.tipo]?.label}
                <button
                  onClick={() => handleFilterChange('tipo', undefined)}
                  className="ml-1 hover:text-blue-900"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {filters.importancia && (
              <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full flex items-center gap-1">
                Importância: {filters.importancia}
                <button
                  onClick={() => handleFilterChange('importancia', undefined)}
                  className="ml-1 hover:text-green-900"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {filters.autor && (
              <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full flex items-center gap-1">
                Autor: {filters.autor}
                <button
                  onClick={() => handleFilterChange('autor', undefined)}
                  className="ml-1 hover:text-purple-900"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {filters.dataInicio && (
              <span className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full flex items-center gap-1">
                De: {filters.dataInicio.toLocaleDateString()}
                <button
                  onClick={() => handleFilterChange('dataInicio', undefined)}
                  className="ml-1 hover:text-orange-900"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {filters.dataFim && (
              <span className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full flex items-center gap-1">
                Até: {filters.dataFim.toLocaleDateString()}
                <button
                  onClick={() => handleFilterChange('dataFim', undefined)}
                  className="ml-1 hover:text-orange-900"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
