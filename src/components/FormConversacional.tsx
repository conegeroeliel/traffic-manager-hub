'use client';

import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

interface FormConversacionalProps {
  onSubmit: (respostas: any, perguntasRespostas: any[]) => void;
  isLoading?: boolean;
}

interface Pergunta {
  id: string;
  titulo: string;
  tipo: 'texto' | 'textarea' | 'select' | 'multiselect' | 'numero' | 'checkbox' | 'radio';
  opcoes?: string[];
  obrigatoria?: boolean;
  categoria: string;
  placeholder?: string;
  descricao?: string;
}

const PERGUNTAS: Pergunta[] = [
  // DADOS DA EMPRESA
  {
    id: 'nomeEmpresa',
    titulo: 'Qual é o nome da sua empresa?',
    tipo: 'texto',
    obrigatoria: true,
    categoria: 'Dados da Empresa',
    placeholder: 'Ex: Tech Solutions Ltda'
  },
  {
    id: 'cnpj',
    titulo: 'Qual é o CNPJ da empresa?',
    tipo: 'texto',
    categoria: 'Dados da Empresa',
    placeholder: '00.000.000/0000-00'
  },
  {
    id: 'site',
    titulo: 'Qual é o site da empresa?',
    tipo: 'texto',
    categoria: 'Dados da Empresa',
    placeholder: 'https://www.empresa.com.br'
  },
  {
    id: 'redesSociais',
    titulo: 'Quais redes sociais vocês utilizam?',
    tipo: 'multiselect',
    opcoes: ['Instagram', 'Facebook', 'LinkedIn', 'TikTok', 'YouTube', 'Twitter', 'Nenhuma'],
    categoria: 'Dados da Empresa'
  },
  {
    id: 'anoFundacao',
    titulo: 'Em que ano a empresa foi fundada?',
    tipo: 'numero',
    categoria: 'Dados da Empresa',
    placeholder: '2020'
  },
  {
    id: 'numeroFuncionarios',
    titulo: 'Quantos funcionários a empresa tem?',
    tipo: 'numero',
    categoria: 'Dados da Empresa',
    placeholder: '10'
  },
  {
    id: 'faturamentoAnual',
    titulo: 'Qual é o faturamento anual aproximado?',
    tipo: 'numero',
    categoria: 'Dados da Empresa',
    placeholder: '1000000'
  },

  // CONTEXTO DO NEGÓCIO
  {
    id: 'segmento',
    titulo: 'Em qual segmento sua empresa atua?',
    tipo: 'select',
    opcoes: [
      'Tecnologia', 'Saúde', 'Educação', 'E-commerce', 'Serviços', 
      'Consultoria', 'Manufatura', 'Varejo', 'Alimentação', 'Beleza',
      'Fitness', 'Finanças', 'Imobiliário', 'Automotivo', 'Outro'
    ],
    obrigatoria: true,
    categoria: 'Contexto do Negócio'
  },
  {
    id: 'subSegmento',
    titulo: 'Qual é o sub-segmento específico?',
    tipo: 'texto',
    categoria: 'Contexto do Negócio',
    placeholder: 'Ex: Software de gestão empresarial'
  },
  {
    id: 'localizacao',
    titulo: 'Onde está localizada a empresa?',
    tipo: 'texto',
    obrigatoria: true,
    categoria: 'Contexto do Negócio',
    placeholder: 'São Paulo, SP'
  },
  {
    id: 'regioesAtendidas',
    titulo: 'Quais regiões vocês atendem?',
    tipo: 'multiselect',
    opcoes: ['São Paulo', 'Rio de Janeiro', 'Minas Gerais', 'Paraná', 'Santa Catarina', 'Rio Grande do Sul', 'Brasil todo', 'Internacional'],
    categoria: 'Contexto do Negócio'
  },
  {
    id: 'ticketMedio',
    titulo: 'Qual é o ticket médio dos seus produtos/serviços?',
    tipo: 'numero',
    obrigatoria: true,
    categoria: 'Contexto do Negócio',
    placeholder: '5000'
  },
  {
    id: 'ticketMinimo',
    titulo: 'Qual é o ticket mínimo?',
    tipo: 'numero',
    categoria: 'Contexto do Negócio',
    placeholder: '1000'
  },
  {
    id: 'ticketMaximo',
    titulo: 'Qual é o ticket máximo?',
    tipo: 'numero',
    categoria: 'Contexto do Negócio',
    placeholder: '50000'
  },
  {
    id: 'produtoServico',
    titulo: 'Descreva seu produto ou serviço principal:',
    tipo: 'textarea',
    obrigatoria: true,
    categoria: 'Contexto do Negócio',
    placeholder: 'Descreva detalhadamente o que vocês vendem...'
  },
  {
    id: 'modeloVenda',
    titulo: 'Qual é o modelo de venda principal?',
    tipo: 'select',
    opcoes: ['venda_direta', 'agendamento', 'recorrencia', 'outro'],
    obrigatoria: true,
    categoria: 'Contexto do Negócio'
  },
  {
    id: 'faseNegocio',
    titulo: 'Em qual fase está o negócio?',
    tipo: 'select',
    opcoes: ['comecando', 'crescendo', 'escalando', 'reestruturando'],
    obrigatoria: true,
    categoria: 'Contexto do Negócio'
  },
  {
    id: 'cicloVenda',
    titulo: 'Quantos dias em média leva para fechar uma venda?',
    tipo: 'numero',
    categoria: 'Contexto do Negócio',
    placeholder: '30'
  },

  // PÚBLICO-ALVO
  {
    id: 'clienteIdeal',
    titulo: 'Descreva seu cliente ideal em detalhes:',
    tipo: 'textarea',
    obrigatoria: true,
    categoria: 'Público-Alvo',
    placeholder: 'Ex: Empresários de 30-50 anos, renda média-alta, com problemas de gestão, que buscam eficiência...',
    descricao: 'Inclua idade, renda, problemas que enfrentam, objetivos, comportamento online, etc.'
  },
  {
    id: 'momentoJornada',
    titulo: 'Em qual momento da jornada de compra estão seus leads?',
    tipo: 'select',
    opcoes: ['descoberta', 'consideracao', 'decisao'],
    obrigatoria: true,
    categoria: 'Público-Alvo'
  },
  {
    id: 'objecoes',
    titulo: 'Quais são as principais objeções dos clientes?',
    tipo: 'textarea',
    categoria: 'Público-Alvo',
    placeholder: 'Ex: Preço alto, complexidade do produto...'
  },
  {
    id: 'objecoesPrincipais',
    titulo: 'Selecione as objeções principais:',
    tipo: 'multiselect',
    opcoes: ['Preço alto', 'Falta de confiança', 'Complexidade', 'Tempo de implementação', 'Concorrência', 'Outro'],
    categoria: 'Público-Alvo'
  },
  {
    id: 'conteudoPreVenda',
    titulo: 'Que tipo de conteúdo vocês usam para pré-venda?',
    tipo: 'textarea',
    categoria: 'Público-Alvo',
    placeholder: 'Ex: Demonstração online, case de sucesso...'
  },
  {
    id: 'gatilhosEmocionais',
    titulo: 'Quais gatilhos emocionais funcionam melhor?',
    tipo: 'multiselect',
    opcoes: ['Medo de perder', 'Urgência', 'Prova social', 'Autoridade', 'Escassez', 'Reciprocidade', 'Outro'],
    categoria: 'Público-Alvo'
  },

  // DIFERENCIAIS
  {
    id: 'problemaResolvido',
    titulo: 'Qual problema principal seu produto/serviço resolve?',
    tipo: 'textarea',
    obrigatoria: true,
    categoria: 'Diferenciais',
    placeholder: 'Descreva detalhadamente o problema que vocês resolvem...',
    descricao: 'Seja específico sobre a dor do cliente e como vocês a resolvem'
  },
  {
    id: 'diferencialUnico',
    titulo: 'Qual é o seu diferencial único (USP)?',
    tipo: 'textarea',
    obrigatoria: true,
    categoria: 'Diferenciais',
    placeholder: 'O que torna vocês únicos no mercado? Qual é a vantagem que só vocês oferecem?',
    descricao: 'Pense no que faz vocês serem diferentes da concorrência'
  },
  {
    id: 'posicionamento',
    titulo: 'Como vocês se posicionam no mercado?',
    tipo: 'select',
    opcoes: ['especialista', 'proxima', 'premium', 'acessivel', 'tecnica'],
    categoria: 'Diferenciais'
  },
  {
    id: 'concorrenteAdmira',
    titulo: 'Qual concorrente vocês mais admiram?',
    tipo: 'texto',
    categoria: 'Diferenciais',
    placeholder: 'Nome da empresa'
  },
  {
    id: 'concorrentesPrincipais',
    titulo: 'Quem são os principais concorrentes?',
    tipo: 'multiselect',
    opcoes: ['Não sei', 'Muitos pequenos', 'Poucos grandes', 'Outro'],
    categoria: 'Diferenciais'
  },
  {
    id: 'vantagemCompetitiva',
    titulo: 'Qual é a vantagem competitiva?',
    tipo: 'textarea',
    categoria: 'Diferenciais',
    placeholder: 'O que vocês fazem melhor que a concorrência...'
  },

  // EXPERIÊNCIA
  {
    id: 'jaInvestiu',
    titulo: 'Vocês já investiram em tráfego pago?',
    tipo: 'checkbox',
    categoria: 'Experiência'
  },
  {
    id: 'canaisTestados',
    titulo: 'Quais canais já testaram?',
    tipo: 'multiselect',
    opcoes: ['Google Ads', 'Facebook', 'Instagram', 'LinkedIn', 'TikTok', 'YouTube', 'Nenhum'],
    categoria: 'Experiência'
  },
  {
    id: 'resultadosAnteriores',
    titulo: 'Como foram os resultados anteriores?',
    tipo: 'textarea',
    categoria: 'Experiência',
    placeholder: 'Ex: 50 leads/mês, 15% conversão...'
  },
  {
    id: 'investimentoMensal',
    titulo: 'Qual foi o investimento mensal médio?',
    tipo: 'numero',
    categoria: 'Experiência',
    placeholder: '5000'
  },
  {
    id: 'leadsGerados',
    titulo: 'Quantos leads geraram por mês?',
    tipo: 'numero',
    categoria: 'Experiência',
    placeholder: '50'
  },
  {
    id: 'conversaoAtual',
    titulo: 'Qual é a taxa de conversão atual?',
    tipo: 'numero',
    categoria: 'Experiência',
    placeholder: '15'
  },
  {
    id: 'cplAtual',
    titulo: 'Qual é o CPL (Custo por Lead) atual?',
    tipo: 'numero',
    categoria: 'Experiência',
    placeholder: '100'
  },
  {
    id: 'equipeVendas',
    titulo: 'Como está estruturada a equipe de vendas?',
    tipo: 'textarea',
    categoria: 'Experiência',
    placeholder: 'Ex: 3 vendedores, 1 coordenador...'
  },
  {
    id: 'numeroVendedores',
    titulo: 'Quantos vendedores vocês têm?',
    tipo: 'numero',
    categoria: 'Experiência',
    placeholder: '3'
  },

  // OBJETIVOS
  {
    id: 'objetivoPrincipal',
    titulo: 'Qual é o objetivo principal com tráfego pago?',
    tipo: 'textarea',
    obrigatoria: true,
    categoria: 'Objetivos',
    placeholder: 'Ex: Aumentar vendas em 50% nos próximos 6 meses...'
  },
  {
    id: 'metaVendas',
    titulo: 'Qual é a meta de vendas?',
    tipo: 'numero',
    categoria: 'Objetivos',
    placeholder: '100000'
  },
  {
    id: 'prazoMeta',
    titulo: 'Em quantos meses querem atingir a meta?',
    tipo: 'numero',
    categoria: 'Objetivos',
    placeholder: '6'
  },
  {
    id: 'budgetDisponivel',
    titulo: 'Qual é o budget disponível para investimento?',
    tipo: 'numero',
    categoria: 'Objetivos',
    placeholder: '10000'
  },
  {
    id: 'kpisPrincipais',
    titulo: 'Quais são os KPIs principais?',
    tipo: 'multiselect',
    opcoes: ['Leads gerados', 'Conversão', 'CPL', 'ROI', 'Ticket médio', 'Outro'],
    categoria: 'Objetivos'
  },

  // INFORMAÇÕES ADICIONAIS
  {
    id: 'sazonalidade',
    titulo: 'O negócio tem sazonalidade?',
    tipo: 'textarea',
    categoria: 'Informações Adicionais',
    placeholder: 'Ex: Vendas aumentam no final do ano...'
  },
  {
    id: 'regulamentacoes',
    titulo: 'Existem regulamentações específicas do setor?',
    tipo: 'textarea',
    categoria: 'Informações Adicionais',
    placeholder: 'Ex: Anvisa, CVM, etc...'
  },
  {
    id: 'tendenciasMercado',
    titulo: 'Quais tendências vocês observam no mercado?',
    tipo: 'textarea',
    categoria: 'Informações Adicionais',
    placeholder: 'Descreva as principais tendências...'
  },
  {
    id: 'desafiosAtuais',
    titulo: 'Quais são os principais desafios atuais?',
    tipo: 'multiselect',
    opcoes: ['Concorrência', 'Custos', 'Mão de obra', 'Tecnologia', 'Regulamentação', 'Outro'],
    categoria: 'Informações Adicionais'
  },
  {
    id: 'oportunidades',
    titulo: 'Quais oportunidades vocês identificam?',
    tipo: 'multiselect',
    opcoes: ['Mercado em crescimento', 'Tecnologia', 'Novos canais', 'Parcerias', 'Outro'],
    categoria: 'Informações Adicionais'
  }
];

export default function FormConversacional({ onSubmit, isLoading }: FormConversacionalProps) {
  const [perguntaAtual, setPerguntaAtual] = useState(0);
  const [respostas, setRespostas] = useState<any>({});
  const [perguntasRespostas, setPerguntasRespostas] = useState<any[]>([]);
  const [valorAtual, setValorAtual] = useState('');
  const [loadingProgress, setLoadingProgress] = useState(0);

  const pergunta = PERGUNTAS[perguntaAtual];
  const totalPerguntas = PERGUNTAS.length;
  const progresso = ((perguntaAtual + 1) / totalPerguntas) * 100;

  // Simular progresso de loading de 0 a 100%
  useEffect(() => {
    if (isLoading) {
      setLoadingProgress(0);
      const interval = setInterval(() => {
        setLoadingProgress(prev => {
          if (prev >= 90) {
            clearInterval(interval);
            return 90; // Para em 90% até o processo terminar
          }
          return prev + Math.random() * 15 + 5; // Incremento variável
        });
      }, 200);
      
      return () => clearInterval(interval);
    } else {
      // Quando o loading termina, vai para 100%
      if (loadingProgress > 0) {
        setLoadingProgress(100);
        setTimeout(() => setLoadingProgress(0), 500);
      }
    }
  }, [isLoading, loadingProgress]);

  const handleProximo = () => {
    if (pergunta.obrigatoria && !valorAtual.trim()) {
      alert(`Esta pergunta é obrigatória! Por favor, responda antes de continuar.`);
      return;
    }

    // Salvar resposta atual
    const novasRespostas = { ...respostas };
    let valorResposta: any = valorAtual;
    
    if (pergunta.tipo === 'multiselect') {
      // Para multiselect, assumimos que valorAtual é uma string separada por vírgulas
      valorResposta = valorAtual.split(',').map(item => item.trim()).filter(item => item);
      novasRespostas[pergunta.id] = valorResposta;
    } else if (pergunta.tipo === 'numero') {
      valorResposta = valorAtual ? Number(valorAtual) : undefined;
      novasRespostas[pergunta.id] = valorResposta;
    } else if (pergunta.tipo === 'checkbox') {
      valorResposta = valorAtual === 'true';
      novasRespostas[pergunta.id] = valorResposta;
    } else {
      novasRespostas[pergunta.id] = valorAtual;
    }

    // Salvar pergunta e resposta
    const novaPerguntaResposta = {
      pergunta: pergunta.titulo,
      resposta: valorResposta,
      categoria: pergunta.categoria,
      obrigatoria: pergunta.obrigatoria || false
    };

    const novasPerguntasRespostas = [...perguntasRespostas];
    // Atualizar se já existe, ou adicionar se não existe
    const indexExistente = novasPerguntasRespostas.findIndex(p => p.pergunta === pergunta.titulo);
    if (indexExistente >= 0) {
      novasPerguntasRespostas[indexExistente] = novaPerguntaResposta;
    } else {
      novasPerguntasRespostas.push(novaPerguntaResposta);
    }

    setRespostas(novasRespostas);
    setPerguntasRespostas(novasPerguntasRespostas);

    // Ir para próxima pergunta ou finalizar
    if (perguntaAtual < totalPerguntas - 1) {
      setPerguntaAtual(perguntaAtual + 1);
      setValorAtual('');
    } else {
      onSubmit(novasRespostas, novasPerguntasRespostas);
    }
  };

  const handleAnterior = () => {
    if (perguntaAtual > 0) {
      setPerguntaAtual(perguntaAtual - 1);
      // Carregar valor anterior
      const valorAnterior = respostas[PERGUNTAS[perguntaAtual - 1].id];
      if (PERGUNTAS[perguntaAtual - 1].tipo === 'multiselect' && Array.isArray(valorAnterior)) {
        setValorAtual(valorAnterior.join(', '));
      } else if (PERGUNTAS[perguntaAtual - 1].tipo === 'checkbox') {
        setValorAtual(valorAnterior ? 'true' : 'false');
      } else {
        setValorAtual(valorAnterior || '');
      }
    }
  };

  const renderPergunta = () => {
    switch (pergunta.tipo) {
      case 'texto':
        return (
          <Input
            value={valorAtual}
            onChange={(e) => setValorAtual(e.target.value)}
            placeholder={pergunta.placeholder}
            className="w-full"
          />
        );

      case 'textarea':
        return (
          <Textarea
            value={valorAtual}
            onChange={(e) => setValorAtual(e.target.value)}
            placeholder={pergunta.placeholder}
            className="w-full min-h-[100px]"
          />
        );

      case 'numero':
        return (
          <Input
            type="number"
            value={valorAtual}
            onChange={(e) => setValorAtual(e.target.value)}
            placeholder={pergunta.placeholder}
            className="w-full"
          />
        );

      case 'select':
        return (
          <select
            value={valorAtual}
            onChange={(e) => setValorAtual(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
          >
            <option value="">Selecione uma opção</option>
            {pergunta.opcoes?.map((opcao) => (
              <option key={opcao} value={opcao}>
                {opcao}
              </option>
            ))}
          </select>
        );

      case 'multiselect':
        return (
          <div className="space-y-2">
            {pergunta.opcoes?.map((opcao) => (
              <label key={opcao} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={valorAtual.includes(opcao)}
                  onChange={(e) => {
                    const valores = valorAtual ? valorAtual.split(',').map(v => v.trim()) : [];
                    if (e.target.checked) {
                      valores.push(opcao);
                    } else {
                      const index = valores.indexOf(opcao);
                      if (index > -1) {
                        valores.splice(index, 1);
                      }
                    }
                    setValorAtual(valores.join(', '));
                  }}
                  className="rounded"
                />
                <span>{opcao}</span>
              </label>
            ))}
          </div>
        );

      case 'checkbox':
        return (
          <div className="space-y-2">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={valorAtual === 'true'}
                onChange={(e) => setValorAtual(e.target.checked ? 'true' : 'false')}
                className="rounded"
              />
              <span>Sim</span>
            </label>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-center">
            {pergunta.categoria}
          </CardTitle>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progresso}%` }}
            />
          </div>
          <p className="text-sm text-gray-600 text-center">
            Pergunta {perguntaAtual + 1} de {totalPerguntas}
          </p>
        </CardHeader>
        
        <CardContent className="space-y-6">
                     <div>
             <Label className="text-lg font-medium">
               {pergunta.titulo}
               {pergunta.obrigatoria && <span className="text-red-500 ml-1">*</span>}
             </Label>
             {pergunta.obrigatoria ? (
               <p className="text-sm text-red-600 mt-1 font-medium">⚠️ Esta pergunta é obrigatória</p>
             ) : (
               <p className="text-sm text-gray-500 mt-1">💡 Esta pergunta é opcional - você pode pular se quiser</p>
             )}
             {pergunta.descricao && (
               <p className="text-sm text-gray-600 mt-1">{pergunta.descricao}</p>
             )}
           </div>

          <div className="mt-4">
            {renderPergunta()}
          </div>

          <div className="flex justify-between pt-4">
            <Button
              onClick={handleAnterior}
              disabled={perguntaAtual === 0}
              variant="outline"
            >
              Anterior
            </Button>

            <Button
              onClick={handleProximo}
              disabled={isLoading}
              className="ml-auto"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-2">
                    <div className="w-16 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-white h-2 rounded-full transition-all duration-300"
                        style={{ width: `${loadingProgress}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium">{Math.round(loadingProgress)}%</span>
                  </div>
                  Processando...
                </div>
              ) : (
                perguntaAtual === totalPerguntas - 1 ? 'Finalizar' : 'Próximo'
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 