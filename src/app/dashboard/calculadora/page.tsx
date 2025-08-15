'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Header } from '@/components/Header'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { FormSimplificado } from '@/components/FormSimplificado'
import { FormCompleto } from '@/components/FormCompleto'
import { ResultTableSimplificada } from '@/components/ResultTableSimplificada'
import { ResultTableCompleta } from '@/components/ResultTableCompleta'
import { RoiChart } from '@/components/RoiChart'
import { calcularSimplificada, calcularCompleta, ResultadoSimplificado, ResultadoCompleto } from '@/lib/calc/previsibilidade'
import { CalculadoraSimplificadaForm, CalculadoraCompletaForm } from '@/lib/schemas'

export default function CalculadoraPage() {
  const [resultadoSimplificado, setResultadoSimplificado] = useState<ResultadoSimplificado | null>(null)
  const [resultadosCompletos, setResultadosCompletos] = useState<ResultadoCompleto[] | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleSimplificadaSubmit = (data: CalculadoraSimplificadaForm) => {
    setIsLoading(true)
    try {
      const resultado = calcularSimplificada(data)
      setResultadoSimplificado(resultado)
      setResultadosCompletos(null)
    } catch (error) {
      console.error('Erro ao calcular:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCompletaSubmit = (data: CalculadoraCompletaForm) => {
    setIsLoading(true)
    try {
      const resultados = calcularCompleta(data)
      setResultadosCompletos(resultados)
      setResultadoSimplificado(null)
    } catch (error) {
      console.error('Erro ao calcular:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-8"
          >
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Calculadora de Previsibilidade
            </h1>
            <p className="text-lg text-gray-600">
              Simule cenários de marketing digital e calcule o ROI esperado
            </p>
          </motion.div>

          <Tabs defaultValue="simplificada" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="simplificada">Versão Simplificada</TabsTrigger>
              <TabsTrigger value="completa">Versão Completa</TabsTrigger>
            </TabsList>

            <TabsContent value="simplificada" className="space-y-6">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <FormSimplificado onSubmit={handleSimplificadaSubmit} isLoading={isLoading} />
              </motion.div>

              {resultadoSimplificado && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <ResultTableSimplificada resultado={resultadoSimplificado} />
                </motion.div>
              )}
            </TabsContent>

            <TabsContent value="completa" className="space-y-6">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <FormCompleto onSubmit={handleCompletaSubmit} isLoading={isLoading} />
              </motion.div>

              {resultadosCompletos && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="space-y-6"
                >
                  <ResultTableCompleta resultados={resultadosCompletos} />
                  <RoiChart dados={resultadosCompletos} />
                </motion.div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
} 