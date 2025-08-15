'use client'

import { Modal } from './modal'
import { Button } from './button'
import { AlertTriangle, CheckCircle, Info, XCircle } from 'lucide-react'

interface ConfirmModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  variant?: 'default' | 'destructive' | 'warning' | 'info'
  loading?: boolean
}

const variantConfig = {
  default: {
    icon: CheckCircle,
    iconColor: 'text-blue-600',
    buttonVariant: 'default' as const
  },
  destructive: {
    icon: XCircle,
    iconColor: 'text-red-600',
    buttonVariant: 'destructive' as const
  },
  warning: {
    icon: AlertTriangle,
    iconColor: 'text-yellow-600',
    buttonVariant: 'default' as const
  },
  info: {
    icon: Info,
    iconColor: 'text-blue-600',
    buttonVariant: 'default' as const
  }
}

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  variant = 'default',
  loading = false
}: ConfirmModalProps) {
  const config = variantConfig[variant]
  const Icon = config.icon

  const handleConfirm = () => {
    if (!loading) {
      onConfirm()
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <div className="space-y-6">
        <div className="flex items-start gap-4">
          <div className={`flex-shrink-0 ${config.iconColor}`}>
            <Icon className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <p className="text-gray-700 leading-relaxed">
              {message}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={loading}
          >
            {cancelText}
          </Button>
          <Button
            type="button"
            variant={config.buttonVariant}
            onClick={handleConfirm}
            disabled={loading}
          >
            {loading ? 'Processando...' : confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  )
} 