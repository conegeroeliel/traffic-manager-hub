import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { User, Mail, Phone, Building, MapPin, Instagram, Globe, FileText, Save, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PhoneInput, CEPInput } from '@/components/ui/masked-input'
import { clienteService } from '@/lib/services/clienteService'

interface NovoClienteModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

interface ClienteFormData {
  nome: string
  email: string
  telefone: string
  empresa: string
  setor: string
  status: 'ativo' | 'inativo' | 'prospecto'
  observacoes?: string
  endereco?: {
    rua?: string
    cidade?: string
    estado?: string
    cep?: string
  }
  redesSociais?: {
    instagram?: string
    website?: string
  }
}

export function NovoClienteModal({ isOpen, onClose, onSuccess }: NovoClienteModalProps) {
  const [isSaving, setIsSaving] = useState(false)
  const [formData, setFormData] = useState<ClienteFormData>({
    nome: '',
    email: '',
    telefone: '',
    empresa: '',
    setor: '',
    status: 'prospecto',
    observacoes: '',
    endereco: {
      rua: '',
      cidade: '',
      estado: '',
      cep: ''
    },
    redesSociais: {
      instagram: '',
      website: ''
    }
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleEnderecoChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      endereco: {
        ...prev.endereco,
        [field]: value
      }
    }))
  }

  const handleRedesSociaisChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      redesSociais: {
        ...prev.redesSociais,
        [field]: value
      }
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    try {
      // Limpar campos vazios do endereço e redes sociais
      const cleanFormData = {
        ...formData,
        endereco: Object.values(formData.endereco || {}).some(v => v) ? {
          rua: formData.endereco?.rua || '',
          cidade: formData.endereco?.cidade || '',
          estado: formData.endereco?.estado || '',
          cep: formData.endereco?.cep || ''
        } : undefined,
        redesSociais: Object.values(formData.redesSociais || {}).some(v => v) ? {
          instagram: formData.redesSociais?.instagram || '',
          website: formData.redesSociais?.website || ''
        } : undefined
      }

      const novoCliente = await clienteService.create(cleanFormData)
      if (novoCliente) {
        onSuccess()
        onClose()
        // Reset form
        setFormData({
          nome: '',
          email: '',
          telefone: '',
          empresa: '',
          setor: '',
          status: 'prospecto',
          observacoes: '',
          endereco: {
            rua: '',
            cidade: '',
            estado: '',
            cep: ''
          },
          redesSociais: {
            instagram: '',
            website: ''
          }
        })
      }
    } catch (error) {
      console.error('Erro ao criar cliente:', error)
      alert('Erro ao criar cliente. Tente novamente.')
    } finally {
      setIsSaving(false)
    }
  }

  if (!isOpen) return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ type: "spring", duration: 0.3 }}
        className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-3">
            <User className="h-6 w-6 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">Novo Cliente</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        
        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-120px)]">
          <form onSubmit={handleSubmit} className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Informações Básicas */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building className="h-5 w-5" />
                    Informações Básicas
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Empresa *</label>
                    <Input
                      type="text"
                      value={formData.empresa}
                      onChange={(e) => handleInputChange('empresa', e.target.value)}
                      required
                      placeholder="Nome da empresa"
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-500">Nome do Responsável *</label>
                    <Input
                      type="text"
                      value={formData.nome}
                      onChange={(e) => handleInputChange('nome', e.target.value)}
                      required
                      placeholder="Nome completo do responsável"
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-500">Setor *</label>
                    <Input
                      type="text"
                      value={formData.setor}
                      onChange={(e) => handleInputChange('setor', e.target.value)}
                      required
                      placeholder="Ex: Tecnologia, Saúde, Educação"
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-500">Status *</label>
                    <select
                      value={formData.status}
                      onChange={(e) => handleInputChange('status', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    >
                      <option value="prospecto">Prospecto</option>
                      <option value="ativo">Ativo</option>
                      <option value="inativo">Inativo</option>
                    </select>
                  </div>
                </CardContent>
              </Card>

              {/* Contato */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Mail className="h-5 w-5" />
                    Informações de Contato
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Email *</label>
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      required
                      placeholder="email@exemplo.com"
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-500">Telefone *</label>
                    <PhoneInput
                      value={formData.telefone}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('telefone', e.target.value)}
                      required
                      placeholder="(11) 99999-9999"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Endereço */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Endereço
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Rua</label>
                    <Input
                      type="text"
                      value={formData.endereco?.rua || ''}
                      onChange={(e) => handleEnderecoChange('rua', e.target.value)}
                      placeholder="Rua, número"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Cidade</label>
                      <Input
                        type="text"
                        value={formData.endereco?.cidade || ''}
                        onChange={(e) => handleEnderecoChange('cidade', e.target.value)}
                        placeholder="Cidade"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Estado</label>
                      <Input
                        type="text"
                        value={formData.endereco?.estado || ''}
                        onChange={(e) => handleEnderecoChange('estado', e.target.value)}
                        placeholder="Estado"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-500">CEP</label>
                    <CEPInput
                      value={formData.endereco?.cep || ''}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleEnderecoChange('cep', e.target.value)}
                      placeholder="00000-000"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Redes Sociais */}
              <Card>
                <CardHeader>
                  <CardTitle>Redes Sociais</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Instagram</label>
                    <Input
                      type="url"
                      value={formData.redesSociais?.instagram || ''}
                      onChange={(e) => handleRedesSociaisChange('instagram', e.target.value)}
                      placeholder="https://instagram.com/empresa"
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-500">Website</label>
                    <Input
                      type="url"
                      value={formData.redesSociais?.website || ''}
                      onChange={(e) => handleRedesSociaisChange('website', e.target.value)}
                      placeholder="https://empresa.com.br"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Observações */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Observações
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <textarea
                    value={formData.observacoes || ''}
                    onChange={(e) => handleInputChange('observacoes', e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Informações adicionais sobre o cliente..."
                  />
                </CardContent>
              </Card>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 mt-6 pt-6 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isSaving}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={isSaving}
                className="flex items-center gap-2"
              >
                <Save className="h-4 w-4" />
                {isSaving ? 'Salvando...' : 'Salvar Cliente'}
              </Button>
            </div>
          </form>
        </div>
      </motion.div>
    </motion.div>
  )
} 