'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { X, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PerguntaResposta } from '@/lib/types/debriefing';

interface PerguntasRespostasModalProps {
  isOpen: boolean;
  onClose: () => void;
  perguntasRespostas: PerguntaResposta[];
  clienteNome: string;
}

export function PerguntasRespostasModal({ 
  isOpen, 
  onClose, 
  perguntasRespostas, 
  clienteNome 
}: PerguntasRespostasModalProps) {
  if (!isOpen) return null;

  // Agrupar perguntas por categoria
  const perguntasPorCategoria = perguntasRespostas.reduce((acc, item) => {
    if (!acc[item.categoria]) {
      acc[item.categoria] = [];
    }
    acc[item.categoria].push(item);
    return acc;
  }, {} as Record<string, PerguntaResposta[]>);

  const formatarResposta = (resposta: any): string => {
    if (Array.isArray(resposta)) {
      return resposta.join(', ');
    }
    if (typeof resposta === 'boolean') {
      return resposta ? 'Sim' : 'Não';
    }
    if (typeof resposta === 'number') {
      return resposta.toLocaleString('pt-BR');
    }
    return resposta || 'Não informado';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-3">
            <FileText className="h-6 w-6 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">
              Perguntas e Respostas - {clienteNome}
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
          <div className="mb-6">
            <p className="text-sm text-gray-600">
              Total de perguntas respondidas: <strong>{perguntasRespostas.length}</strong>
            </p>
            <p className="text-sm text-gray-600">
              Perguntas obrigatórias: <strong>{perguntasRespostas.filter(p => p.obrigatoria).length}</strong>
            </p>
          </div>

          <div className="space-y-6">
            {Object.entries(perguntasPorCategoria).map(([categoria, perguntas]) => (
              <Card key={categoria}>
                <CardHeader>
                  <CardTitle className="text-lg">{categoria}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {perguntas.map((item, index) => (
                      <div key={index} className="border-l-4 border-blue-200 pl-4">
                        <div className="flex items-start gap-2 mb-2">
                          {item.obrigatoria ? (
                            <AlertCircle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                          ) : (
                            <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                          )}
                          <div className="flex-1">
                            <p className="font-medium text-gray-900 mb-1">
                              {item.pergunta}
                              {item.obrigatoria && <span className="text-red-500 ml-1">*</span>}
                            </p>
                            <p className="text-gray-700 bg-gray-50 p-3 rounded-md">
                              {formatarResposta(item.resposta)}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between p-6 border-t bg-gray-50">
          <div className="text-sm text-gray-600">
            <span className="text-red-500">●</span> Pergunta obrigatória
            <span className="ml-4 text-green-500">●</span> Pergunta opcional
          </div>
          
          <Button onClick={onClose} variant="outline">
            Fechar
          </Button>
        </div>
      </motion.div>
    </div>
  );
} 