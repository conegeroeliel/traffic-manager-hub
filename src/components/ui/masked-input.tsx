import React from 'react'
import { Input } from './input'

interface MaskedInputProps {
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  placeholder?: string
  type?: string
  required?: boolean
  disabled?: boolean
  className?: string
}

// Função para aplicar máscara de telefone
const applyPhoneMask = (value: string): string => {
  const numbers = value.replace(/\D/g, '')
  if (numbers.length <= 2) {
    return `(${numbers}`
  } else if (numbers.length <= 6) {
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`
  } else if (numbers.length <= 10) {
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 6)}-${numbers.slice(6)}`
  } else {
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`
  }
}

// Função para aplicar máscara de CEP
const applyCEPMask = (value: string): string => {
  const numbers = value.replace(/\D/g, '')
  if (numbers.length <= 5) {
    return numbers
  } else {
    return `${numbers.slice(0, 5)}-${numbers.slice(5, 8)}`
  }
}

// Função para aplicar máscara de CPF
const applyCPFMask = (value: string): string => {
  const numbers = value.replace(/\D/g, '')
  if (numbers.length <= 3) {
    return numbers
  } else if (numbers.length <= 6) {
    return `${numbers.slice(0, 3)}.${numbers.slice(3)}`
  } else if (numbers.length <= 9) {
    return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6)}`
  } else {
    return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6, 9)}-${numbers.slice(9, 11)}`
  }
}

// Função para aplicar máscara de CNPJ
const applyCNPJMask = (value: string): string => {
  const numbers = value.replace(/\D/g, '')
  if (numbers.length <= 2) {
    return numbers
  } else if (numbers.length <= 5) {
    return `${numbers.slice(0, 2)}.${numbers.slice(2)}`
  } else if (numbers.length <= 8) {
    return `${numbers.slice(0, 2)}.${numbers.slice(2, 5)}.${numbers.slice(5)}`
  } else if (numbers.length <= 12) {
    return `${numbers.slice(0, 2)}.${numbers.slice(2, 5)}.${numbers.slice(5, 8)}/${numbers.slice(8)}`
  } else {
    return `${numbers.slice(0, 2)}.${numbers.slice(2, 5)}.${numbers.slice(5, 8)}/${numbers.slice(8, 12)}-${numbers.slice(12, 14)}`
  }
}

// Função para aplicar máscara de data
const applyDateMask = (value: string): string => {
  const numbers = value.replace(/\D/g, '')
  if (numbers.length <= 2) {
    return numbers
  } else if (numbers.length <= 4) {
    return `${numbers.slice(0, 2)}/${numbers.slice(2)}`
  } else {
    return `${numbers.slice(0, 2)}/${numbers.slice(2, 4)}/${numbers.slice(4, 8)}`
  }
}

// Componente base para inputs com máscara
const MaskedInput: React.FC<MaskedInputProps & { maskFunction: (value: string) => string }> = ({
  value,
  onChange,
  maskFunction,
  placeholder,
  type = 'text',
  required = false,
  disabled = false,
  className = ''
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value
    const maskedValue = maskFunction(rawValue)
    
    // Criar um novo evento com o valor mascarado
    const newEvent = {
      ...e,
      target: {
        ...e.target,
        value: maskedValue
      }
    } as React.ChangeEvent<HTMLInputElement>
    
    onChange(newEvent)
  }

  return (
    <Input
      type={type}
      value={value}
      onChange={handleChange}
      placeholder={placeholder}
      required={required}
      disabled={disabled}
      className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${className}`}
    />
  )
}

// Componentes pré-configurados para máscaras comuns
export const PhoneInput: React.FC<MaskedInputProps> = (props) => (
  <MaskedInput maskFunction={applyPhoneMask} {...props} type="tel" />
)

export const CEPInput: React.FC<MaskedInputProps> = (props) => (
  <MaskedInput maskFunction={applyCEPMask} {...props} />
)

export const CPFInput: React.FC<MaskedInputProps> = (props) => (
  <MaskedInput maskFunction={applyCPFMask} {...props} />
)

export const CNPJInput: React.FC<MaskedInputProps> = (props) => (
  <MaskedInput maskFunction={applyCNPJMask} {...props} />
)

export const DateInput: React.FC<MaskedInputProps> = (props) => (
  <MaskedInput maskFunction={applyDateMask} {...props} />
)

// Exportar o componente base também
export { MaskedInput } 