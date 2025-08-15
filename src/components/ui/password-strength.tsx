'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react'

interface PasswordStrengthProps {
  password: string
  showFeedback?: boolean
}

interface StrengthCriteria {
  label: string
  test: (password: string) => boolean
  icon: React.ReactNode
}

const criteria: StrengthCriteria[] = [
  {
    label: 'Pelo menos 8 caracteres',
    test: (password) => password.length >= 8,
    icon: <CheckCircle className="h-4 w-4" />
  },
  {
    label: 'Letra minúscula',
    test: (password) => /[a-z]/.test(password),
    icon: <CheckCircle className="h-4 w-4" />
  },
  {
    label: 'Letra maiúscula',
    test: (password) => /[A-Z]/.test(password),
    icon: <CheckCircle className="h-4 w-4" />
  },
  {
    label: 'Número',
    test: (password) => /\d/.test(password),
    icon: <CheckCircle className="h-4 w-4" />
  },
  {
    label: 'Caractere especial',
    test: (password) => /[^A-Za-z0-9]/.test(password),
    icon: <CheckCircle className="h-4 w-4" />
  }
]

export function PasswordStrength({ password, showFeedback = true }: PasswordStrengthProps) {
  const [strength, setStrength] = useState(0)
  const [feedback, setFeedback] = useState<string[]>([])

  useEffect(() => {
    if (!password) {
      setStrength(0)
      setFeedback([])
      return
    }

    let score = 0
    const newFeedback: string[] = []

    criteria.forEach((criterion) => {
      if (criterion.test(password)) {
        score++
      } else {
        newFeedback.push(criterion.label)
      }
    })

    setStrength(score)
    setFeedback(newFeedback)
  }, [password])

  const getStrengthColor = () => {
    if (strength <= 1) return 'bg-red-500'
    if (strength <= 2) return 'bg-orange-500'
    if (strength <= 3) return 'bg-yellow-500'
    if (strength <= 4) return 'bg-blue-500'
    return 'bg-green-500'
  }

  const getStrengthText = () => {
    if (strength <= 1) return 'Muito fraca'
    if (strength <= 2) return 'Fraca'
    if (strength <= 3) return 'Média'
    if (strength <= 4) return 'Forte'
    return 'Muito forte'
  }

  if (!password) return null

  return (
    <div className="space-y-3">
      {/* Barra de força */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Força da senha:</span>
          <span className={`font-medium ${
            strength <= 1 ? 'text-red-600' :
            strength <= 2 ? 'text-orange-600' :
            strength <= 3 ? 'text-yellow-600' :
            strength <= 4 ? 'text-blue-600' :
            'text-green-600'
          }`}>
            {getStrengthText()}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <motion.div
            className={`h-2 rounded-full ${getStrengthColor()}`}
            initial={{ width: 0 }}
            animate={{ width: `${(strength / 5) * 100}%` }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          />
        </div>
      </div>

      {/* Feedback detalhado */}
      {showFeedback && feedback.length > 0 && (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-2"
          >
            <p className="text-sm text-gray-600 font-medium">Para uma senha mais forte:</p>
            <div className="space-y-1">
              {feedback.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-2 text-sm text-red-600"
                >
                  <XCircle className="h-3 w-3 flex-shrink-0" />
                  {item}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      )}

      {/* Critérios atendidos */}
      {showFeedback && strength > 0 && (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-1"
          >
            {criteria.map((criterion, index) => {
              const isMet = criterion.test(password)
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`flex items-center gap-2 text-sm ${
                    isMet ? 'text-green-600' : 'text-gray-400'
                  }`}
                >
                  {isMet ? (
                    <CheckCircle className="h-3 w-3 flex-shrink-0" />
                  ) : (
                    <AlertCircle className="h-3 w-3 flex-shrink-0" />
                  )}
                  {criterion.label}
                </motion.div>
              )
            })}
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  )
}
