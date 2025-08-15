import OpenAI from 'openai';
import { config } from '@/config';
import { logger } from '@/utils/logger';
import { errors } from '@/middleware/error-handler';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: config.openai.apiKey,
});

export interface DiagnosisFormData {
  nomeEmpresa: string;
  cidadeEstado: string;
}

const DIAGNOSIS_PROMPT = `
Você é um especialista em marketing digital e análise estratégica de empresas, com vasta experiência em gestão de tráfego e consultoria de marketing.

SUA MISSÃO:
Analisar a empresa solicitada usando seu conhecimento atual sobre empresas reais.

FORMATO DA ANÁLISE:

## 1. 📍 VISÃO GERAL DA EMPRESA
• O que a empresa faz (produtos, serviços, público-alvo)
• Como ela se posiciona hoje no mercado
• Qual é a proposta de valor percebida

## 2. 🌐 ANÁLISE DO SITE OFICIAL
• Estrutura e clareza da proposta
• Tipos de CTAs
• Copy e tom de voz utilizados
• Design e UX
• SEO básico (velocidade, meta tags, estrutura H1/H2 se possível)

## 3. 📲 PRESENÇA DIGITAL E REDES SOCIAIS
• Redes sociais utilizadas
• Tipo de conteúdo publicado
• Frequência e engajamento
• Linguagem e branding aplicado

## 4. 🆚 CONCORRENTES DIRETOS
• Quais são os principais concorrentes na mesma região e nicho
• Breve comparação do posicionamento
• Alguma vantagem ou desvantagem competitiva percebida

## 5. 💡 INSIGHTS INVISÍVEIS DO MARKETING
(Os mais importantes)

• Qual é o posicionamento implícito que a marca transmite?
• Que tipo de cliente ela está realmente atraindo (mesmo sem dizer)?
• Quais são as forças e fraquezas do marketing atual?
• O que ela está comunicando sem perceber?
• Como ela está educando o mercado ou construindo autoridade?

## 📊 DIAGNÓSTICO FINAL
• Nível de maturidade de marketing da empresa (baixo, médio, alto)
• Justificativa do nível de maturidade
• Duas possíveis oportunidades estratégicas não exploradas ainda

DIRETRIZES:
⚠️ Foque em uma visão estratégica e técnica, como se fosse uma análise para um gestor de tráfego ou consultor de marketing.
Use apenas informações que você tem sobre a empresa específica.
Seja transparente sobre suas limitações de conhecimento.
Seja específico e acionável em suas observações.

DADOS DA EMPRESA PARA ANÁLISE:
`;

export async function generateNicheDiagnosis(formData: DiagnosisFormData): Promise<string> {
  try {
    // Prepare the prompt with company data
    const businessData = `
**Nome da empresa:** ${formData.nomeEmpresa}
**Cidade/Sede:** ${formData.cidadeEstado}
    `;

    const fullPrompt = DIAGNOSIS_PROMPT + businessData;

    logger.info('Generating diagnosis with OpenAI', {
      model: config.openai.model,
      promptLength: fullPrompt.length
    });

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: config.openai.model,
      messages: [
        {
          role: 'system',
          content: 'Você é um especialista em marketing digital e análise de mercado com mais de 15 anos de experiência. Use seu conhecimento atual sobre empresas para fornecer análises precisas e relevantes.'
        },
        {
          role: 'user',
          content: fullPrompt
        }
      ],
      max_tokens: 4000,
      temperature: 0.3, // Balanceado para consistência
      top_p: 0.8, // Balanceado para foco
      frequency_penalty: 0.0, // Removido para evitar inconsistências
      presence_penalty: 0.0, // Removido para evitar inconsistências
    });

    const diagnosis = completion.choices[0]?.message?.content;

    if (!diagnosis) {
      throw new Error('Resposta vazia da OpenAI');
    }

    logger.info('Diagnosis generated successfully', {
      responseLength: diagnosis.length,
      tokensUsed: completion.usage?.total_tokens || 0
    });

    return diagnosis;

  } catch (error) {
    logger.error('Error generating diagnosis', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });

    if (error instanceof OpenAI.APIError) {
      if (error.status === 401) {
        throw errors.internal('Erro de autenticação com OpenAI. Verifique a API key.');
      }
      if (error.status === 429) {
        throw errors.tooManyRequests('Limite de requisições excedido. Tente novamente em alguns minutos.');
      }
      if (error.status === 500) {
        throw errors.internal('Erro interno da OpenAI. Tente novamente.');
      }
    }

    throw errors.internal('Erro ao gerar diagnóstico com IA. Tente novamente.');
  }
}

// Helper function to validate OpenAI connection
export async function testOpenAIConnection(): Promise<boolean> {
  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: 'Hello' }],
      max_tokens: 5,
    });

    return !!completion.choices[0]?.message?.content;
  } catch (error) {
    logger.error('OpenAI connection test failed', {
      error: error instanceof Error ? error.message : 'Unknown error'
    });
    return false;
  }
}