'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, AlertCircle, CheckCircle, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PasswordStrength } from '@/components/ui/password-strength'
import { authService } from '@/lib/services/authService'

interface ValidationErrors {
  nome?: string
  email?: string
  senha?: string
}

export default function RegisterPage() {
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [confirmarSenha, setConfirmarSenha] = useState('')
  const [tipo, setTipo] = useState('gestor')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({})
  const router = useRouter()

  // Validação em tempo real
  const validateField = (field: string, value: string): string | undefined => {
    switch (field) {
      case 'nome':
        if (!value) return 'Nome é obrigatório'
        if (value.length < 2) return 'Nome deve ter pelo menos 2 caracteres'
        return undefined
      case 'email':
        if (!value) return 'Email é obrigatório'
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Email inválido'
        return undefined
      case 'senha':
        if (!value) return 'Senha é obrigatória'
        if (value.length < 6) return 'Senha deve ter pelo menos 6 caracteres'
        return undefined
      case 'confirmarSenha':
        if (!value) return 'Confirme sua senha'
        if (value !== senha) return 'Senhas não coincidem'
        return undefined
      default:
        return undefined
    }
  }

  const handleFieldChange = (field: string, value: string) => {
    const error = validateField(field, value)
    setValidationErrors(prev => ({
      ...prev,
      [field]: error
    }))
  }

  const validateForm = (): boolean => {
    const nomeError = validateField('nome', nome)
    const emailError = validateField('email', email)
    const senhaError = validateField('senha', senha)
    const confirmarSenhaError = validateField('confirmarSenha', confirmarSenha)
    
    setValidationErrors({
      nome: nomeError,
      email: emailError,
      senha: senhaError,
      confirmarSenha: confirmarSenhaError
    })

    return !nomeError && !emailError && !senhaError && !confirmarSenhaError
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setIsLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const response = await authService.register({ nome, email, senha })
      
      if (response.success) {
        setSuccess('Conta criada com sucesso! Redirecionando...')
        console.log('✅ Registro realizado com sucesso:', response.data.user.nome)
        
        // Delay para mostrar mensagem de sucesso
        setTimeout(() => {
          router.push('/dashboard')
        }, 1500)
      }
    } catch (error: any) {
      console.error('❌ Erro no registro:', error)
      setError(error.message || 'Erro ao criar conta')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-md"
      >
        <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center pb-6">
            <motion.div
              initial={{ scale: 0.8, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center mb-4 shadow-lg"
            >
              <span className="text-white text-2xl font-bold">TM</span>
            </motion.div>
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Traffic Manager Hub
            </CardTitle>
            <p className="text-gray-600 mt-2">
              Crie sua conta gratuita
            </p>
          </CardHeader>

          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="nome" className="block text-sm font-medium text-gray-700 mb-2">
                  Nome Completo
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="nome"
                    type="text"
                    placeholder="João Silva"
                    value={nome}
                    onChange={(e) => {
                      setNome(e.target.value)
                      handleFieldChange('nome', e.target.value)
                    }}
                    onBlur={(e) => handleFieldChange('nome', e.target.value)}
                    className={`pl-10 transition-all duration-200 ${
                      validationErrors.nome ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'
                    }`}
                    required
                    disabled={isLoading}
                  />
                  <AnimatePresence>
                    {validationErrors.nome && (
                      <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2"
                      >
                        <AlertCircle className="h-4 w-4 text-red-500" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                <AnimatePresence>
                  {validationErrors.nome && (
                    <motion.p
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      className="text-red-500 text-xs mt-1 flex items-center gap-1"
                    >
                      <AlertCircle className="h-3 w-3" />
                      {validationErrors.nome}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value)
                      handleFieldChange('email', e.target.value)
                    }}
                    onBlur={(e) => handleFieldChange('email', e.target.value)}
                    className={`pl-10 transition-all duration-200 ${
                      validationErrors.email ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'
                    }`}
                    required
                    disabled={isLoading}
                  />
                  <AnimatePresence>
                    {validationErrors.email && (
                      <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2"
                      >
                        <AlertCircle className="h-4 w-4 text-red-500" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                <AnimatePresence>
                  {validationErrors.email && (
                    <motion.p
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      className="text-red-500 text-xs mt-1 flex items-center gap-1"
                    >
                      <AlertCircle className="h-3 w-3" />
                      {validationErrors.email}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

              <div>
                <label htmlFor="senha" className="block text-sm font-medium text-gray-700 mb-2">
                  Senha
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="senha"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={senha}
                    onChange={(e) => {
                      setSenha(e.target.value)
                      handleFieldChange('senha', e.target.value)
                    }}
                    onBlur={(e) => handleFieldChange('senha', e.target.value)}
                    className={`pl-10 pr-10 transition-all duration-200 ${
                      validationErrors.senha ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'
                    }`}
                    required
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    disabled={isLoading}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                  <AnimatePresence>
                    {validationErrors.senha && (
                      <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        className="absolute right-10 top-1/2 transform -translate-y-1/2"
                      >
                        <AlertCircle className="h-4 w-4 text-red-500" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                <AnimatePresence>
                  {validationErrors.senha && (
                    <motion.p
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      className="text-red-500 text-xs mt-1 flex items-center gap-1"
                    >
                      <AlertCircle className="h-3 w-3" />
                      {validationErrors.senha}
                    </motion.p>
                  )}
                </AnimatePresence>
                
                {/* Indicador de força da senha */}
                {senha && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-3"
                  >
                    <PasswordStrength password={senha} />
                  </motion.div>
                )}
              </div>

              <div>
                <label htmlFor="confirmarSenha" className="block text-sm font-medium text-gray-700 mb-2">
                  Confirmar Senha
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="confirmarSenha"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={confirmarSenha}
                    onChange={(e) => {
                      setConfirmarSenha(e.target.value)
                      handleFieldChange('confirmarSenha', e.target.value)
                    }}
                    onBlur={(e) => handleFieldChange('confirmarSenha', e.target.value)}
                    className={`pl-10 pr-10 transition-all duration-200 ${
                      validationErrors.confirmarSenha ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'
                    }`}
                    required
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    disabled={isLoading}
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                  <AnimatePresence>
                    {validationErrors.confirmarSenha && (
                      <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        className="absolute right-10 top-1/2 transform -translate-y-1/2"
                      >
                        <AlertCircle className="h-4 w-4 text-red-500" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                <AnimatePresence>
                  {validationErrors.confirmarSenha && (
                    <motion.p
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      className="text-red-500 text-xs mt-1 flex items-center gap-1"
                    >
                      <AlertCircle className="h-3 w-3" />
                      {validationErrors.confirmarSenha}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

              <div>
                <label htmlFor="tipo" className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de Conta
                </label>
                <select
                  id="tipo"
                  value={tipo}
                  onChange={(e) => setTipo(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  disabled={isLoading}
                >
                  <option value="gestor">Gestor de Tráfego</option>
                  <option value="agencia">Dono de Agência</option>
                  <option value="freelancer">Freelancer</option>
                </select>
              </div>

              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm flex items-center gap-2"
                  >
                    <AlertCircle className="h-4 w-4 flex-shrink-0" />
                    {error}
                  </motion.div>
                )}
                {success && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md text-sm flex items-center gap-2"
                  >
                    <CheckCircle className="h-4 w-4 flex-shrink-0" />
                    {success}
                  </motion.div>
                )}
              </AnimatePresence>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Criando conta...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    Criar Conta
                    <ArrowRight className="h-4 w-4" />
                  </div>
                )}
              </Button>
            </form>

            <div className="text-center">
              <p className="text-sm text-gray-600">
                Já tem uma conta?{' '}
                <Link
                  href="/login"
                  className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
                >
                  Faça login
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
} 