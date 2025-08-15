'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Brain, Loader2, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface TesteIAModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function TesteIAModal({ isOpen, onClose }: TesteIAModalProps) {
  const [empresa, setEmpresa] = useState('');
  const [cidadeEstado, setCidadeEstado] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [respostaIA, setRespostaIA] = useState('');
  const [copied, setCopied] = useState(false);

  const handleTeste = async () => {
    if (!empresa.trim() || !cidadeEstado.trim()) {
      alert('Por favor, preencha o nome da empresa e a cidade/estado!');
      return;
    }

    setIsLoading(true);
    setLoadingProgress(0);
    setRespostaIA('');

    // Simular progresso de loading
    const progressInterval = setInterval(() => {
      setLoadingProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + Math.random() * 15;
      });
    }, 200);

    try {
      // Dados para análise de empresa
      const dadosTeste = {
        nomeEmpresa: empresa,
        cidadeEstado: cidadeEstado
      };

      const response = await fetch('/api/debriefing/teste-ia', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ dados: dadosTeste }),
      });

      if (!response.ok) {
        throw new Error('Erro na requisição');
      }

      const data = await response.json();
      setRespostaIA(data.resposta || 'Nenhuma resposta recebida');
      
      // Finalizar progresso
      setLoadingProgress(100);
      setTimeout(() => {
        setIsLoading(false);
        setLoadingProgress(0);
      }, 500);
    } catch (error) {
      console.error('Erro no teste:', error);
      setRespostaIA('Erro ao testar a IA. Verifique se o backend está rodando e a chave da OpenAI está configurada.');
      setIsLoading(false);
      setLoadingProgress(0);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(respostaIA);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Erro ao copiar:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-3">
            <Brain className="h-6 w-6 text-purple-600" />
                         <h2 className="text-xl font-semibold text-gray-900">
               Análise Estratégica de Empresa - IA
             </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Formulário de Teste */}
            <Card>
              <CardHeader>
                <CardTitle>Análise de Empresa</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="empresa">Nome da Empresa *</Label>
                  <Input
                    id="empresa"
                    value={empresa}
                    onChange={(e) => setEmpresa(e.target.value)}
                    placeholder="Ex: Tech Solutions Ltda"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="cidadeEstado">Cidade/Estado *</Label>
                  <Input
                    id="cidadeEstado"
                    value={cidadeEstado}
                    onChange={(e) => setCidadeEstado(e.target.value)}
                    placeholder="Ex: São Paulo, SP"
                    className="mt-1"
                  />
                </div>

                                 <div className="text-xs text-gray-500 bg-blue-50 p-3 rounded-lg">
                   <p className="font-semibold mb-1">💡 Análise Baseada em Conhecimento</p>
                   <p>A IA irá analisar a empresa usando seu conhecimento atual sobre empresas reais, incluindo informações sobre site, redes sociais e posicionamento de mercado.</p>
                 </div>

                <Button
                  onClick={handleTeste}
                  disabled={isLoading || !empresa.trim() || !cidadeEstado.trim()}
                  className="w-full"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Analisando Nicho...
                    </div>
                                     ) : (
                     <div className="flex items-center gap-2">
                       <Brain className="h-4 w-4" />
                       Analisar Empresa
                     </div>
                   )}
                </Button>

                                 <div className="text-sm text-gray-600">
                   <p><strong>O que você receberá:</strong></p>
                   <ul className="list-disc list-inside mt-2 space-y-1">
                     <li>Visão geral da empresa e posicionamento</li>
                     <li>Análise do site e presença digital</li>
                     <li>Análise de concorrentes diretos</li>
                     <li>Insights invisíveis do marketing</li>
                     <li>Diagnóstico de maturidade e oportunidades</li>
                   </ul>
                 </div>
              </CardContent>
            </Card>

            {/* Resposta da IA */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                                     <CardTitle>Análise Estratégica Completa</CardTitle>
                  {respostaIA && (
                    <Button
                      onClick={copyToClipboard}
                      variant="outline"
                      size="sm"
                      className="h-8"
                    >
                      {copied ? (
                        <Check className="h-4 w-4 text-green-600" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                      {copied ? 'Copiado!' : 'Copiar'}
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                                 {isLoading ? (
                   <div className="flex items-center justify-center h-64">
                     <div className="text-center w-full max-w-md">
                       <div className="relative mb-6">
                         <div className="w-16 h-16 mx-auto mb-4 relative">
                           <div className="absolute inset-0 rounded-full border-4 border-gray-200"></div>
                           <div 
                             className="absolute inset-0 rounded-full border-4 border-purple-600 border-t-transparent animate-spin"
                             style={{
                               background: `conic-gradient(from 0deg, #9333ea ${loadingProgress * 3.6}deg, #e5e7eb ${loadingProgress * 3.6}deg)`
                             }}
                           ></div>
                           <div className="absolute inset-2 rounded-full bg-white flex items-center justify-center">
                             <span className="text-sm font-semibold text-purple-600">
                               {Math.round(loadingProgress)}%
                             </span>
                           </div>
                         </div>
                       </div>
                       
                       <div className="space-y-2">
                         <p className="text-gray-600 font-medium">Analisando empresa...</p>
                         <div className="w-full bg-gray-200 rounded-full h-2">
                           <div 
                             className="bg-purple-600 h-2 rounded-full transition-all duration-300 ease-out"
                             style={{ width: `${loadingProgress}%` }}
                           ></div>
                         </div>
                         <p className="text-sm text-gray-500">
                           {loadingProgress < 30 && "Coletando informações básicas..."}
                           {loadingProgress >= 30 && loadingProgress < 60 && "Analisando presença digital..."}
                           {loadingProgress >= 60 && loadingProgress < 90 && "Gerando insights estratégicos..."}
                           {loadingProgress >= 90 && "Finalizando diagnóstico..."}
                         </p>
                       </div>
                     </div>
                   </div>
                ) : respostaIA ? (
                  <div className="bg-gray-50 p-4 rounded-lg max-h-96 overflow-y-auto">
                    <pre className="whitespace-pre-wrap text-sm text-gray-800 font-mono">
                      {typeof respostaIA === 'string' ? respostaIA : JSON.stringify(respostaIA, null, 2)}
                    </pre>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-64 text-gray-500">
                    <div className="text-center">
                      <Brain className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                                             <p>Clique em &quot;Analisar Empresa&quot; para ver a análise</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="flex items-center justify-between p-6 border-t bg-gray-50">
                     <div className="text-sm text-gray-600">
             <p><strong>Dica:</strong> Esta é uma análise estratégica completa, focada em insights para gestores de tráfego e consultores de marketing.</p>
           </div>
          
          <Button onClick={onClose} variant="outline">
            Fechar
          </Button>
        </div>
      </motion.div>
    </div>
  );
} 