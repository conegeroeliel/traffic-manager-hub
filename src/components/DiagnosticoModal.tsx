import React from 'react'
import { motion } from 'framer-motion'
import { X, Brain, Target, TrendingUp, AlertTriangle, Lightbulb, BarChart3, Users, Globe, Copy, Shield } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DiagnosticoIA } from '@/lib/types/debriefing'

interface DiagnosticoModalProps {
  isOpen: boolean
  onClose: () => void
  diagnostico: DiagnosticoIA
  clienteNome: string
  segmento: string
  isPremium?: boolean
}

export function DiagnosticoModal({ isOpen, onClose, diagnostico, clienteNome, segmento, isPremium = false }: DiagnosticoModalProps) {
  if (!isOpen) return null

  const iconMap = {
    analiseGeral: Brain,
    perfilPublico: Users,
    canaisSugeridos: Globe,
    expectativas: BarChart3,
    riscos: AlertTriangle,
    dicasCopy: Copy,
    resumoEstrategico: Target
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Brain className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Diagnóstico Estratégico</h2>
                <p className="text-gray-600">{clienteNome} • {segmento}</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Badge de IA */}
          <div className="mb-6">
            {isPremium ? (
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                <Brain className="h-4 w-4" />
                Diagnóstico Gerado por IA Premium
              </div>
            ) : (
              <div className="inline-flex items-center gap-2 bg-gray-50 border border-gray-200 text-gray-600 px-3 py-1 rounded-full text-sm font-medium">
                <Brain className="h-4 w-4" />
                Diagnóstico Básico
              </div>
            )}
          </div>

          {/* Grid de Diagnósticos */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Análise Geral */}
            <Card className="border-l-4 border-l-blue-500">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Brain className="h-5 w-5 text-blue-500" />
                  Análise Geral
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">
                  {diagnostico.analiseGeral}
                </p>
              </CardContent>
            </Card>

            {/* Perfil do Público */}
            <Card className="border-l-4 border-l-green-500">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Users className="h-5 w-5 text-green-500" />
                  Perfil do Público
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">
                  {diagnostico.perfilPublico}
                </p>
              </CardContent>
            </Card>

            {/* Canais Sugeridos */}
            <Card className="border-l-4 border-l-purple-500">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Globe className="h-5 w-5 text-purple-500" />
                  Canais Recomendados
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {diagnostico.canaisSugeridos.split(',').map((canal, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <span className="text-gray-700 font-medium">
                        {canal.trim()}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Expectativas */}
            <Card className="border-l-4 border-l-orange-500">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <BarChart3 className="h-5 w-5 text-orange-500" />
                  Expectativas de Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {diagnostico.expectativas.split(',').map((expectativa, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-orange-500" />
                      <span className="text-gray-700">
                        {expectativa.trim()}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Riscos */}
            <Card className="border-l-4 border-l-red-500">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <AlertTriangle className="h-5 w-5 text-red-500" />
                  Riscos Identificados
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">
                  {diagnostico.riscos}
                </p>
              </CardContent>
            </Card>

            {/* Dicas de Copy */}
            <Card className="border-l-4 border-l-indigo-500">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Copy className="h-5 w-5 text-indigo-500" />
                  Dicas de Copy & Criativos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">
                  {diagnostico.dicasCopy}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Resumo Estratégico */}
          <Card className="mt-6 bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-xl text-blue-900">
                <Target className="h-6 w-6" />
                Resumo Estratégico
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-blue-800 text-lg leading-relaxed font-medium">
                {diagnostico.resumoEstrategico}
              </p>
            </CardContent>
          </Card>

          {/* Ações */}
          <div className="flex justify-between items-center mt-6 pt-6 border-t">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Shield className="h-4 w-4" />
              Diagnóstico baseado em dados do mercado brasileiro
            </div>
            
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={onClose}
              >
                Fechar
              </Button>
              <Button
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
              >
                <Lightbulb className="h-4 w-4 mr-2" />
                Aplicar Estratégia
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
} 