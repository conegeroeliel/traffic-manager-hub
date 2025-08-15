import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { X, Brain, Building, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { debriefingService } from '@/lib/services/debriefingService'
import { Cliente } from '@/lib/types/cliente'
import { RespostasDebriefing } from '@/lib/types/debriefing'
import FormConversacional from './FormConversacional'

interface NovoDebriefingModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  clientes: Cliente[]
}

export function NovoDebriefingModalConversacional({ isOpen, onClose, onSuccess, clientes }: NovoDebriefingModalProps) {
  const [currentStep, setCurrentStep] = useState<'opcoes' | 'cliente' | 'formulario' | 'finalizado'>('opcoes')
  const [isSaving, setIsSaving] = useState(false)
  const [formData, setFormData] = useState<{
    clienteId: string
    respostas: RespostasDebriefing
    observacoes: string
  }>({
    clienteId: '',
    respostas: {},
    observacoes: ''
  })

  const handleClienteSelect = (clienteId: string) => {
    setFormData(prev => ({ ...prev, clienteId }))
    setCurrentStep('formulario')
  }

  const handleSemCliente = () => {
    setFormData(prev => ({ ...prev, clienteId: '' }))
    setCurrentStep('formulario')
  }

  const handleFormSubmit = async (respostas: RespostasDebriefing, perguntasRespostas: any[]) => {
    setIsSaving(true)
    try {
      await debriefingService.create({
        clienteId: formData.clienteId,
        respostas,
        perguntasRespostas,
        observacoes: formData.observacoes
      })
      
      setCurrentStep('finalizado')
    } catch (error) {
      console.error('Erro ao criar debriefing:', error)
      alert('Erro ao criar debriefing. Tente novamente.')
    } finally {
      setIsSaving(false)
    }
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

  const resetForm = () => {
    setFormData({
      clienteId: '',
      respostas: {},
      observacoes: ''
    })
    setCurrentStep('opcoes')
  }

  const handleClose = () => {
    resetForm()
    onClose()
  }

  const handleFinalizar = () => {
    onSuccess()
    resetForm()
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-3">
            <Brain className="h-6 w-6 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">
              Novo Debriefing Inteligente
            </h2>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6">
          {/* Step 1: Opções de Diagnóstico */}
          {currentStep === 'opcoes' && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Como você quer criar o diagnóstico?
                </h3>
                <p className="text-gray-600">
                  Escolha uma das opções abaixo para continuar
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Opção 1: Com Cliente */}
                <Card className="cursor-pointer hover:shadow-lg transition-shadow border-2 hover:border-blue-300">
                  <CardContent className="p-6 text-center">
                    <div className="mb-4">
                      <Building className="h-12 w-12 mx-auto text-blue-600" />
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">
                      Selecionar Cliente
                    </h4>
                    <p className="text-gray-600 mb-4">
                      Criar diagnóstico atrelado a um cliente existente
                    </p>
                    <Button 
                      onClick={() => setCurrentStep('cliente')}
                      className="w-full"
                      disabled={!clientes || clientes.length === 0}
                    >
                      {clientes && clientes.length > 0 ? 'Escolher Cliente' : 'Nenhum Cliente Disponível'}
                    </Button>
                    {(!clientes || clientes.length === 0) && (
                      <p className="text-sm text-red-500 mt-2">
                        Cadastre clientes primeiro
                      </p>
                    )}
                  </CardContent>
                </Card>

                {/* Opção 2: Sem Cliente */}
                <Card className="cursor-pointer hover:shadow-lg transition-shadow border-2 hover:border-green-300">
                  <CardContent className="p-6 text-center">
                    <div className="mb-4">
                      <Brain className="h-12 w-12 mx-auto text-green-600" />
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">
                      Diagnóstico Livre
                    </h4>
                    <p className="text-gray-600 mb-4">
                      Criar diagnóstico sem atrelar a cliente específico
                    </p>
                    <Button 
                      onClick={handleSemCliente}
                      variant="outline"
                      className="w-full border-green-300 text-green-700 hover:bg-green-50"
                    >
                      Criar Diagnóstico
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* Step 2: Seleção do Cliente */}
          {currentStep === 'cliente' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="h-5 w-5" />
                  Selecionar Cliente
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cliente *
                  </label>
                  <select
                    value={formData.clienteId}
                    onChange={(e) => handleClienteSelect(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="">Selecione um cliente</option>
                    {clientes && clientes.length > 0 ? (
                      clientes.map(cliente => (
                        <option key={cliente.id} value={cliente.id}>
                          {cliente.empresa || cliente.nome}
                        </option>
                      ))
                    ) : (
                      <option value="" disabled>Nenhum cliente encontrado</option>
                    )}
                  </select>
                  {clientes && clientes.length === 0 && (
                    <p className="text-sm text-red-500 mt-1">
                      Nenhum cliente cadastrado. Cadastre clientes primeiro.
                    </p>
                  )}
                </div>
                <div className="flex justify-between pt-4">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentStep('opcoes')}
                  >
                    ← Voltar
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 2: Formulário Conversacional */}
          {currentStep === 'formulario' && (
            <FormConversacional
              onSubmit={handleFormSubmit}
              isLoading={isSaving}
            />
          )}

          {/* Step 3: Finalizado */}
          {currentStep === 'finalizado' && (
            <Card>
              <CardContent className="text-center py-12">
                <div className="text-green-500 mb-4">
                  <CheckCircle className="h-16 w-16 mx-auto" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Debriefing Criado com Sucesso!
                </h3>
                <p className="text-gray-600 mb-6">
                  O diagnóstico inteligente foi gerado e está pronto para análise.
                </p>
                <Button onClick={handleFinalizar}>
                  Ver Diagnóstico
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="flex items-center justify-between p-6 border-t bg-gray-50">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Brain className="h-4 w-4" />
            {isPremium() ? (
              <span className="text-green-600 font-medium">Diagnóstico IA Premium Ativo</span>
            ) : (
              <span className="text-orange-600 font-medium">Diagnóstico IA Trial</span>
            )}
          </div>
          
          {currentStep === 'opcoes' && (
            <div className="text-sm text-gray-500">
              Escolha uma opção para criar o diagnóstico
            </div>
          )}
          {currentStep === 'cliente' && (
            <div className="text-sm text-gray-500">
              Selecione um cliente para começar o debriefing
            </div>
          )}
          {currentStep === 'formulario' && (
            <div className="text-sm text-gray-500">
              Preencha as informações para gerar o diagnóstico
            </div>
          )}
        </div>
      </motion.div>
    </div>
  )
} 