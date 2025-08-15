import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Edit, Mail, Phone, MapPin, Building, Calendar, Tag, Save, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PhoneInput, CEPInput } from '@/components/ui/masked-input'
import { Cliente } from '@/lib/types/cliente'
import { clienteService } from '@/lib/services/clienteService'

interface ClienteDetalhesModalProps {
  cliente: Cliente | null
  onEdit: () => void
  onClose: () => void
  onUpdate: (cliente: Cliente) => void
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

export function ClienteDetalhesModal({ cliente, onEdit, onClose, onUpdate }: ClienteDetalhesModalProps) {
  const [isEditing, setIsEditing] = useState(false)
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

  // Carregar dados do formulário quando o cliente mudar
  React.useEffect(() => {
    if (cliente) {
      setFormData({
        nome: cliente.nome || '',
        email: cliente.email || '',
        telefone: cliente.telefone || '',
        empresa: cliente.empresa || '',
        setor: cliente.setor || '',
        status: cliente.status || 'prospecto',
        observacoes: cliente.observacoes || '',
        endereco: cliente.endereco || {
          rua: '',
          cidade: '',
          estado: '',
          cep: ''
        },
        redesSociais: cliente.redesSociais || {
          instagram: '',
          website: ''
        }
      })
    }
  }, [cliente])

  if (!cliente) return null

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

  const formatPhone = (phone: string) => {
    if (!phone) return '-'
    const numbers = phone.replace(/\D/g, '')
    if (numbers.length === 11) {
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7)}`
    }
    if (numbers.length === 10) {
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 6)}-${numbers.slice(6)}`
    }
    return phone
  }

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

  const handleSave = async () => {
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

      const clienteAtualizado = await clienteService.update(cliente.id, cleanFormData)
      if (clienteAtualizado) {
        onUpdate(clienteAtualizado)
        setIsEditing(false)
      }
    } catch (error) {
      console.error('Erro ao atualizar cliente:', error)
      alert('Erro ao atualizar cliente. Tente novamente.')
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancelEdit = () => {
    // Restaurar dados originais
    setFormData({
      nome: cliente.nome,
      email: cliente.email,
      telefone: cliente.telefone,
      empresa: cliente.empresa,
      setor: cliente.setor,
      status: cliente.status,
      observacoes: cliente.observacoes || '',
      endereco: cliente.endereco || {
        rua: '',
        cidade: '',
        estado: '',
        cep: ''
      },
      redesSociais: cliente.redesSociais || {
        instagram: '',
        website: ''
      }
    })
    setIsEditing(false)
  }

  const handleStartEdit = () => {
    setIsEditing(true)
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">
            {isEditing ? 'Editar Cliente' : (cliente.empresa || cliente.nome || 'Cliente')}
          </h1>
          <p className="text-gray-600">
            {isEditing ? 'Atualize os dados do cliente' : 'Detalhes completos do cliente'}
          </p>
        </div>
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <Button
                variant="outline"
                onClick={handleCancelEdit}
                disabled={isSaving}
              >
                <X className="h-4 w-4 mr-2" />
                Cancelar
              </Button>
              <Button
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center gap-2"
              >
                <Save className="h-4 w-4" />
                {isSaving ? 'Salvando...' : 'Salvar'}
              </Button>
            </>
          ) : (
            <Button
              onClick={handleStartEdit}
              className="flex items-center gap-2"
            >
              <Edit className="h-4 w-4" />
              Editar Cliente
            </Button>
          )}
        </div>
      </div>

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
              <label className="text-sm font-medium text-gray-500">Empresa</label>
              {isEditing ? (
                <Input
                  type="text"
                  value={formData.empresa}
                  onChange={(e) => handleInputChange('empresa', e.target.value)}
                  required
                  placeholder="Nome da empresa"
                />
              ) : (
                <p className="text-lg font-semibold">{cliente.empresa || '-'}</p>
              )}
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-500">Nome do Responsável</label>
              {isEditing ? (
                <Input
                  type="text"
                  value={formData.nome}
                  onChange={(e) => handleInputChange('nome', e.target.value)}
                  required
                  placeholder="Nome completo do responsável"
                />
              ) : (
                <p className="text-lg">{cliente.nome}</p>
              )}
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-500">Setor</label>
              {isEditing ? (
                <Input
                  type="text"
                  value={formData.setor}
                  onChange={(e) => handleInputChange('setor', e.target.value)}
                  required
                  placeholder="Ex: Tecnologia, Saúde, Educação"
                />
              ) : (
                <p className="text-lg">{cliente.setor || '-'}</p>
              )}
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-500">Status</label>
              {isEditing ? (
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
              ) : (
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(cliente.status)}`}>
                  {cliente.status.charAt(0).toUpperCase() + cliente.status.slice(1)}
                </span>
              )}
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-500">Data de Cadastro</label>
              <p className="text-lg flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                {formatDate(cliente.dataCadastro)}
              </p>
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
              <label className="text-sm font-medium text-gray-500">Email</label>
              {isEditing ? (
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  required
                  placeholder="email@exemplo.com"
                />
              ) : (
                <p className="text-lg flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  {cliente.email}
                </p>
              )}
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-500">Telefone</label>
              {isEditing ? (
                <PhoneInput
                  value={formData.telefone}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('telefone', e.target.value)}
                  required
                  placeholder="(11) 99999-9999"
                />
              ) : (
                <p className="text-lg flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  {formatPhone(cliente.telefone)}
                </p>
              )}
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-500">Endereço</label>
              {isEditing ? (
                <div className="space-y-2">
                  <Input
                    type="text"
                    value={formData.endereco?.rua || ''}
                    onChange={(e) => handleEnderecoChange('rua', e.target.value)}
                    placeholder="Rua, número"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      type="text"
                      value={formData.endereco?.cidade || ''}
                      onChange={(e) => handleEnderecoChange('cidade', e.target.value)}
                      placeholder="Cidade"
                    />
                    <Input
                      type="text"
                      value={formData.endereco?.estado || ''}
                      onChange={(e) => handleEnderecoChange('estado', e.target.value)}
                      placeholder="Estado"
                    />
                  </div>
                  <CEPInput
                    value={formData.endereco?.cep || ''}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleEnderecoChange('cep', e.target.value)}
                    placeholder="00000-000"
                  />
                </div>
              ) : (
                cliente.endereco && (
                  <div className="space-y-1">
                    {cliente.endereco.rua && (
                      <p className="text-lg">{cliente.endereco.rua}</p>
                    )}
                    <p className="text-lg flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      {cliente.endereco.cidade && cliente.endereco.estado && (
                        `${cliente.endereco.cidade}, ${cliente.endereco.estado}`
                      )}
                      {cliente.endereco.cep && (
                        ` - ${formatCEP(cliente.endereco.cep)}`
                      )}
                    </p>
                  </div>
                )
              )}
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
              {isEditing ? (
                <Input
                  type="url"
                  value={formData.redesSociais?.instagram || ''}
                  onChange={(e) => handleRedesSociaisChange('instagram', e.target.value)}
                  placeholder="https://instagram.com/empresa"
                />
              ) : (
                cliente.redesSociais?.instagram && (
                  <a 
                    href={cliente.redesSociais.instagram} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 text-lg block"
                  >
                    {cliente.redesSociais.instagram}
                  </a>
                )
              )}
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-500">Website</label>
              {isEditing ? (
                <Input
                  type="url"
                  value={formData.redesSociais?.website || ''}
                  onChange={(e) => handleRedesSociaisChange('website', e.target.value)}
                  placeholder="https://empresa.com.br"
                />
              ) : (
                cliente.redesSociais?.website && (
                  <a 
                    href={cliente.redesSociais.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 text-lg block"
                  >
                    {cliente.redesSociais.website}
                  </a>
                )
              )}
            </div>
          </CardContent>
        </Card>

        {/* Observações */}
        <Card>
          <CardHeader>
            <CardTitle>Observações</CardTitle>
          </CardHeader>
          <CardContent>
            {isEditing ? (
              <textarea
                value={formData.observacoes || ''}
                onChange={(e) => handleInputChange('observacoes', e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Informações adicionais sobre o cliente..."
              />
            ) : (
              cliente.observacoes && (
                <p className="text-gray-700 whitespace-pre-wrap">
                  {cliente.observacoes}
                </p>
              )
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 