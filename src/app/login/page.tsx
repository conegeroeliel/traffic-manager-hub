'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Eye, EyeOff, Mail, Lock, ArrowRight, AlertCircle, CheckCircle, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { authService } from '@/lib/services/authService'

interface ValidationErrors {
  email?: string
  senha?: string
}

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({})
  const [attempts, setAttempts] = useState(0)
  const router = useRouter()

  // Carregar dados salvos do "lembrar-me"
  useEffect(() => {
    const savedEmail = localStorage.getItem('rememberedEmail')
    if (savedEmail) {
      setEmail(savedEmail)
      setRememberMe(true)
    }
  }, [])

  // Validação em tempo real
  const validateField = (field: string, value: string): string | undefined => {
    switch (field) {
      case 'email':
        if (!value) return 'Email é obrigatório'
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Email inválido'
        return undefined
      case 'senha':
        if (!value) return 'Senha é obrigatória'
        if (value.length < 6) return 'Senha deve ter pelo menos 6 caracteres'
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
    const emailError = validateField('email', email)
    const senhaError = validateField('senha', senha)
    
    setValidationErrors({
      email: emailError,
      senha: senhaError
    })

    return !emailError && !senhaError
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    // Rate limiting básico
    if (attempts >= 5) {
      setError('Muitas tentativas. Aguarde 5 minutos antes de tentar novamente.')
      return
    }

    setIsLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const response = await authService.login({ email, senha })
      
      if (response.success) {
        // Salvar email se "lembrar-me" estiver ativo
        if (rememberMe) {
          localStorage.setItem('rememberedEmail', email)
        } else {
          localStorage.removeItem('rememberedEmail')
        }

        setSuccess('Login realizado com sucesso! Redirecionando...')
        console.log('✅ Login realizado com sucesso:', response.data.user.nome)
        
        // Delay para mostrar mensagem de sucesso
        setTimeout(() => {
          router.push('/dashboard')
        }, 1500)
      }
    } catch (error: any) {
      console.error('❌ Erro no login:', error)
      setError(error.message || 'Erro ao fazer login')
      setAttempts(prev => prev + 1)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDemoLogin = async () => {
    if (attempts >= 5) {
      setError('Muitas tentativas. Aguarde 5 minutos antes de tentar novamente.')
      return
    }

    setIsLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const response = await authService.login({
        email: 'admin@trafficmanager.com',
        senha: 'admin123'
      })
      
      if (response.success) {
        setSuccess('Login demo realizado com sucesso! Redirecionando...')
        console.log('✅ Login demo realizado com sucesso')
        
        setTimeout(() => {
          router.push('/dashboard')
        }, 1500)
      }
    } catch (error: any) {
      console.error('❌ Erro no login demo:', error)
      setError(error.message || 'Erro ao fazer login demo')
      setAttempts(prev => prev + 1)
    } finally {
      setIsLoading(false)
    }
  }

  const handleForgotPassword = () => {
    // TODO: Implementar sistema de recuperação de senha
    setError('Sistema de recuperação de senha será implementado em breve.')
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
              Faça login para acessar sua conta
            </p>
          </CardHeader>

          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
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
                    placeholder="Sua senha"
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
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    disabled={isLoading}
                  />
                  <span className="text-sm text-gray-600">Lembrar-me</span>
                </label>
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
                  disabled={isLoading}
                >
                  Esqueci minha senha
                </button>
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
                disabled={isLoading || attempts >= 5}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Entrando...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    Entrar
                    <ArrowRight className="h-4 w-4" />
                  </div>
                )}
              </Button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">ou</span>
              </div>
            </div>

            <Button
              onClick={handleDemoLogin}
              variant="outline"
              className="w-full border-gray-300 hover:bg-gray-50 transition-colors"
              disabled={isLoading || attempts >= 5}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Entrando...
                </div>
              ) : (
                'Entrar com Conta Demo'
              )}
            </Button>

            <div className="text-center">
              <p className="text-sm text-gray-600">
                Não tem uma conta?{' '}
                <a
                  href="/register"
                  className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
                >
                  Registre-se
                </a>
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 text-center">
          <p className="text-xs text-gray-500">
            <strong>Conta Demo:</strong><br />
            Email: admin@trafficmanager.com<br />
            Senha: admin123
          </p>
        </div>
      </motion.div>
    </div>
  )
} 