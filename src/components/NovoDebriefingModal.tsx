import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { X, Brain, Building, Users, Target, TrendingUp, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
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

export function NovoDebriefingModal({ isOpen, onClose, onSuccess, clientes }: NovoDebriefingModalProps) {
  const [currentStep, setCurrentStep] = useState<number>(1)
  const [isSaving, setIsSaving] = useState(false)
  const totalSteps = 3
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
    setCurrentStep(2)
  }

  const handleFormSubmit = async (respostas: RespostasDebriefing) => {
    setIsSaving(true)
    try {
      await debriefingService.create({
        clienteId: formData.clienteId,
        respostas,
        perguntasRespostas: [],
        observacoes: formData.observacoes
      })
      
      setCurrentStep(3)
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
    setCurrentStep(1)
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

  const handleInputChange = (field: keyof RespostasDebriefing, value: any) => {
    setFormData(prev => ({
      ...prev,
      respostas: {
        ...prev.respostas,
        [field]: value
      }
    }))
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Brain className="h-6 w-6 text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-900">Novo Debriefing Estratégico</h2>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Passo {currentStep} de {totalSteps}</span>
              <span className="text-sm font-medium text-blue-600">
                {Math.round((currentStep / totalSteps) * 100)}% completo
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(currentStep / totalSteps) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Indicador de IA */}
          <div className="mb-6">
            {isPremium() ? (
              <div className="flex items-center gap-2 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 text-blue-700 px-3 py-2 rounded-lg">
                <Brain className="h-4 w-4" />
                <span className="text-sm font-medium">IA Premium Ativa</span>
                <span className="text-xs text-blue-600">Diagnóstico inteligente disponível</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 text-gray-600 px-3 py-2 rounded-lg">
                <Brain className="h-4 w-4" />
                <span className="text-sm font-medium">Versão Básica</span>
                <span className="text-xs text-gray-500">Faça upgrade para acessar IA</span>
              </div>
            )}
          </div>

          {/* Step 1: Seleção do Cliente */}
          {currentStep === 1 && (
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
                    onChange={(e) => setFormData(prev => ({ ...prev, clienteId: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="">Selecione um cliente</option>
                    {clientes.map(cliente => (
                      <option key={cliente.id} value={cliente.id}>
                        {cliente.empresa || cliente.nome}
                      </option>
                    ))}
                  </select>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 2: Contexto do Negócio */}
          {currentStep === 2 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="h-5 w-5" />
                  Contexto do Negócio
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Segmento ou Nicho *
                  </label>
                  <Input
                    type="text"
                    value={formData.respostas.segmento || ''}
                    onChange={(e) => handleInputChange('segmento', e.target.value)}
                    placeholder="Ex: Tecnologia, Saúde, Educação, E-commerce"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Localização
                  </label>
                  <Input
                    type="text"
                    value={formData.respostas.localizacao || ''}
                    onChange={(e) => handleInputChange('localizacao', e.target.value)}
                    placeholder="Ex: São Paulo, SP ou Online"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ticket Médio (R$)
                  </label>
                  <Input
                    type="number"
                    value={formData.respostas.ticketMedio || ''}
                    onChange={(e) => handleInputChange('ticketMedio', Number(e.target.value))}
                    placeholder="Ex: 5000"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Produto/Serviço *
                  </label>
                  <Input
                    type="text"
                    value={formData.respostas.produtoServico || ''}
                    onChange={(e) => handleInputChange('produtoServico', e.target.value)}
                    placeholder="O que exatamente é vendido?"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Modelo de Venda *
                  </label>
                  <select
                    value={formData.respostas.modeloVenda || ''}
                    onChange={(e) => handleInputChange('modeloVenda', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="">Selecione o modelo</option>
                    <option value="venda_direta">Venda Direta</option>
                    <option value="agendamento">Agendamento</option>
                    <option value="recorrencia">Recorrência</option>
                    <option value="outro">Outro</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fase do Negócio *
                  </label>
                  <select
                    value={formData.respostas.faseNegocio || ''}
                    onChange={(e) => handleInputChange('faseNegocio', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="">Selecione a fase</option>
                    <option value="comecando">Começando</option>
                    <option value="crescendo">Crescendo</option>
                    <option value="escalando">Escalando</option>
                    <option value="reestruturando">Reestruturando</option>
                  </select>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 3: Público-Alvo e Jornada */}
          {currentStep === 3 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Público-Alvo e Jornada
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cliente Ideal *
                  </label>
                  <textarea
                    value={formData.respostas.clienteIdeal || ''}
                    onChange={(e) => handleInputChange('clienteIdeal', e.target.value)}
                    placeholder="Descreva o cliente ideal: idade, sexo, renda, profissão, dores principais"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={3}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Momento da Jornada *
                  </label>
                  <select
                    value={formData.respostas.momentoJornada || ''}
                    onChange={(e) => handleInputChange('momentoJornada', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="">Selecione o momento</option>
                    <option value="descoberta">Descoberta</option>
                    <option value="consideracao">Consideração</option>
                    <option value="decisao">Decisão</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Principais Objeções
                  </label>
                  <textarea
                    value={formData.respostas.objecoes || ''}
                    onChange={(e) => handleInputChange('objecoes', e.target.value)}
                    placeholder="Quais objeções você escuta antes da venda?"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={3}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Conteúdo Pré-Venda
                  </label>
                  <Input
                    type="text"
                    value={formData.respostas.conteudoPreVenda || ''}
                    onChange={(e) => handleInputChange('conteudoPreVenda', e.target.value)}
                    placeholder="Ex: Vídeo, aula, PDF, demonstração"
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 4: Diferenciais e Experiência */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Diferenciais e Posicionamento
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Problema Principal Resolvido *
                    </label>
                    <textarea
                      value={formData.respostas.problemaResolvido || ''}
                      onChange={(e) => handleInputChange('problemaResolvido', e.target.value)}
                      placeholder="Qual o principal problema que você resolve?"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows={3}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Diferencial *
                    </label>
                    <textarea
                      value={formData.respostas.diferencial || ''}
                      onChange={(e) => handleInputChange('diferencial', e.target.value)}
                      placeholder="Por que alguém deveria escolher você?"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows={3}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Posicionamento Desejado
                    </label>
                    <select
                      value={formData.respostas.posicionamento || ''}
                      onChange={(e) => handleInputChange('posicionamento', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Selecione o posicionamento</option>
                      <option value="especialista">Especialista</option>
                      <option value="proxima">Próxima</option>
                      <option value="premium">Premium</option>
                      <option value="acessivel">Acessível</option>
                      <option value="tecnica">Técnica</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Concorrente que Admira
                    </label>
                    <Input
                      type="text"
                      value={formData.respostas.concorrenteAdmira || ''}
                      onChange={(e) => handleInputChange('concorrenteAdmira', e.target.value)}
                      placeholder="Ex: Empresa X, Startup Y"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Experiência com Tráfego Pago
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Já investiu em tráfego pago?
                    </label>
                    <div className="flex gap-4">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="jaInvestiu"
                          value="true"
                          checked={formData.respostas.jaInvestiu === true}
                          onChange={(e) => handleInputChange('jaInvestiu', e.target.value === 'true')}
                          className="mr-2"
                        />
                        Sim
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="jaInvestiu"
                          value="false"
                          checked={formData.respostas.jaInvestiu === false}
                          onChange={(e) => handleInputChange('jaInvestiu', e.target.value === 'true')}
                          className="mr-2"
                        />
                        Não
                      </label>
                    </div>
                  </div>

                  {formData.respostas.jaInvestiu && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Canais Testados
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          {['instagram', 'facebook', 'google', 'tiktok'].map(canal => (
                            <label key={canal} className="flex items-center">
                              <input
                                type="checkbox"
                                checked={formData.respostas.canaisTestados?.includes(canal) || false}
                                onChange={(e) => {
                                  const canais = formData.respostas.canaisTestados || []
                                  if (e.target.checked) {
                                    handleInputChange('canaisTestados', [...canais, canal])
                                  } else {
                                    handleInputChange('canaisTestados', canais.filter(c => c !== canal))
                                  }
                                }}
                                className="mr-2"
                              />
                              {canal.charAt(0).toUpperCase() + canal.slice(1)}
                            </label>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Resultados Anteriores
                        </label>
                        <textarea
                          value={formData.respostas.resultadosAnteriores || ''}
                          onChange={(e) => handleInputChange('resultadosAnteriores', e.target.value)}
                          placeholder="Descreva brevemente os resultados obtidos"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          rows={2}
                        />
                      </div>
                    </>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Equipe de Vendas
                    </label>
                    <Input
                      type="text"
                      value={formData.respostas.equipeVendas || ''}
                      onChange={(e) => handleInputChange('equipeVendas', e.target.value)}
                      placeholder="Ex: Equipe de 3 vendedores ou Atendimento próprio"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Observações Adicionais</CardTitle>
                </CardHeader>
                <CardContent>
                  <textarea
                    value={formData.observacoes}
                    onChange={(e) => setFormData(prev => ({ ...prev, observacoes: e.target.value }))}
                    placeholder="Observações complementares do gestor..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={3}
                  />
                </CardContent>
              </Card>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-6">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 1}
            >
              Anterior
            </Button>

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={handleClose}
                disabled={isSaving}
              >
                Cancelar
              </Button>

              {currentStep < totalSteps ? (
                <Button
                  onClick={nextStep}
                  disabled={isSaving}
                >
                  Próximo
                </Button>
              ) : (
                <Button
                  onClick={() => handleFormSubmit(formData.respostas)}
                  disabled={isSaving}
                  className="flex items-center gap-2"
                >
                  {isSaving ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Gerando...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-4 w-4" />
                      {isPremium() ? 'Gerar Diagnóstico com IA' : 'Gerar Diagnóstico'}
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
} 