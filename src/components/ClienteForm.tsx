'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { clienteSchema, ClienteForm as ClienteFormType } from '@/lib/schemas/cliente'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ClienteFormData } from '@/lib/types/cliente'

interface ClienteFormProps {
  onSubmit: (data: ClienteFormData) => void
  isLoading?: boolean
  initialData?: Partial<ClienteFormData>
  isEditing?: boolean
}

export function ClienteForm({ 
  onSubmit, 
  isLoading = false, 
  initialData,
  isEditing = false 
}: ClienteFormProps) {
  const [activeTab, setActiveTab] = useState('basico')

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch
  } = useForm<ClienteFormType>({
    resolver: zodResolver(clienteSchema),
    defaultValues: {
      nome: initialData?.nome || '',
      email: initialData?.email || '',
      telefone: initialData?.telefone || '',
      empresa: initialData?.empresa || '',
      setor: initialData?.setor || '',
      status: initialData?.status || 'prospecto',
      observacoes: initialData?.observacoes || '',
      endereco: initialData?.endereco || {
        rua: '',
        cidade: '',
        estado: '',
        cep: ''
      },
      redesSociais: initialData?.redesSociais || {
        instagram: '',
        facebook: '',
        linkedin: '',
        website: ''
      }
    }
  })

  const watchedStatus = watch('status')

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

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">
          {isEditing ? 'Editar Cliente' : 'Cadastrar Novo Cliente'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="basico">Dados Básicos</TabsTrigger>
              <TabsTrigger value="endereco">Endereço</TabsTrigger>
              <TabsTrigger value="redes">Redes Sociais</TabsTrigger>
            </TabsList>

            <TabsContent value="basico" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nome">Nome Completo *</Label>
                  <Input
                    id="nome"
                    placeholder="Digite o nome completo"
                    {...register('nome')}
                  />
                  {errors.nome && (
                    <p className="text-sm text-red-600">{errors.nome.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="exemplo@email.com"
                    {...register('email')}
                  />
                  {errors.email && (
                    <p className="text-sm text-red-600">{errors.email.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="telefone">Telefone *</Label>
                  <Input
                    id="telefone"
                    placeholder="(11) 99999-9999"
                    {...register('telefone')}
                  />
                  {errors.telefone && (
                    <p className="text-sm text-red-600">{errors.telefone.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="empresa">Empresa *</Label>
                  <Input
                    id="empresa"
                    placeholder="Nome da empresa"
                    {...register('empresa')}
                  />
                  {errors.empresa && (
                    <p className="text-sm text-red-600">{errors.empresa.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="setor">Setor *</Label>
                  <Input
                    id="setor"
                    placeholder="Ex: Tecnologia, Saúde, Educação"
                    {...register('setor')}
                  />
                  {errors.setor && (
                    <p className="text-sm text-red-600">{errors.setor.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Status *</Label>
                  <select
                    id="status"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                    {...register('status')}
                  >
                    <option value="prospecto">Prospecto</option>
                    <option value="ativo">Ativo</option>
                    <option value="inativo">Inativo</option>
                  </select>
                  {watchedStatus && (
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(watchedStatus)}`}>
                      {watchedStatus.charAt(0).toUpperCase() + watchedStatus.slice(1)}
                    </span>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="observacoes">Observações</Label>
                <Textarea
                  id="observacoes"
                  placeholder="Informações adicionais sobre o cliente..."
                  rows={3}
                  {...register('observacoes')}
                />
              </div>
            </TabsContent>

            <TabsContent value="endereco" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2 space-y-2">
                  <Label htmlFor="rua">Rua</Label>
                  <Input
                    id="rua"
                    placeholder="Nome da rua e número"
                    {...register('endereco.rua')}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cidade">Cidade</Label>
                  <Input
                    id="cidade"
                    placeholder="Nome da cidade"
                    {...register('endereco.cidade')}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="estado">Estado</Label>
                  <Input
                    id="estado"
                    placeholder="UF (ex: SP)"
                    maxLength={2}
                    {...register('endereco.estado')}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cep">CEP</Label>
                  <Input
                    id="cep"
                    placeholder="00000-000"
                    {...register('endereco.cep')}
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="redes" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="instagram">Instagram</Label>
                  <Input
                    id="instagram"
                    placeholder="https://instagram.com/usuario"
                    {...register('redesSociais.instagram')}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="facebook">Facebook</Label>
                  <Input
                    id="facebook"
                    placeholder="https://facebook.com/pagina"
                    {...register('redesSociais.facebook')}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="linkedin">LinkedIn</Label>
                  <Input
                    id="linkedin"
                    placeholder="https://linkedin.com/in/perfil"
                    {...register('redesSociais.linkedin')}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    placeholder="https://www.empresa.com.br"
                    {...register('redesSociais.website')}
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end space-x-4 pt-6 border-t">
            <Button 
              type="button" 
              variant="outline"
              onClick={() => setActiveTab('basico')}
            >
              Cancelar
            </Button>
            <Button 
              type="submit" 
              disabled={isLoading}
            >
              {isLoading ? 'Salvando...' : (isEditing ? 'Atualizar Cliente' : 'Cadastrar Cliente')}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
} 