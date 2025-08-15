# 📚 Documentação Técnica - Traffic Manager Hub

## 🎯 Visão Geral do Projeto

**Traffic Manager Hub** é uma aplicação web moderna para gestores de tráfego, desenvolvida com Next.js 14, TypeScript e Tailwind CSS. O sistema oferece ferramentas para cálculo de previsibilidade de campanhas e gestão completa de clientes.

### 🏗️ Arquitetura do Sistema

```
Traffic Manager Hub/
├── 📁 src/
│   ├── 📁 app/                    # App Router (Next.js 14)
│   │   ├── 📁 dashboard/
│   │   │   ├── 📁 calculadora/    # Calculadora de Previsibilidade
│   │   │   └── 📁 clientes/       # Sistema de Gestão de Clientes
│   │   ├── globals.css            # Estilos globais
│   │   ├── layout.tsx             # Layout principal
│   │   └── page.tsx               # Página inicial
│   ├── 📁 components/             # Componentes React
│   │   ├── 📁 ui/                 # Componentes shadcn/ui
│   │   ├── ClienteForm.tsx        # Formulário de clientes
│   │   ├── FormCompleto.tsx       # Formulário calculadora completa
│   │   ├── FormSimplificado.tsx   # Formulário calculadora simples
│   │   ├── Header.tsx             # Cabeçalho da aplicação
│   │   ├── RoiChart.tsx           # Gráfico de ROI
│   │   ├── ResultTableCompleta.tsx # Tabela resultados completa
│   │   └── ResultTableSimplificada.tsx # Tabela resultados simples
│   └── 📁 lib/                    # Utilitários e serviços
│       ├── 📁 calc/
│       │   └── previsibilidade.ts # Funções de cálculo
│       ├── 📁 schemas/
│       │   └── cliente.ts         # Esquemas de validação
│       ├── 📁 services/
│       │   └── clienteService.ts  # Serviços de dados
│       ├── 📁 types/
│       │   └── cliente.ts         # Tipos TypeScript
│       ├── schemas.ts             # Esquemas gerais
│       └── utils.ts               # Utilitários
├── 📄 package.json                # Dependências do projeto
├── 📄 tailwind.config.ts          # Configuração Tailwind
├── 📄 tsconfig.json               # Configuração TypeScript
├── 📄 next.config.js              # Configuração Next.js
└── 📄 README.md                   # Documentação principal
```

## 🛠️ Stack Tecnológica

### **Frontend:**
- **Next.js 14** - Framework React com App Router
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Framework CSS utilitário
- **shadcn/ui** - Componentes baseados em Radix UI

### **Formulários e Validação:**
- **React Hook Form** - Gerenciamento de formulários
- **Zod** - Validação de esquemas

### **Gráficos e Animações:**
- **Recharts** - Biblioteca de gráficos
- **Framer Motion** - Animações

### **Desenvolvimento:**
- **ESLint** - Linting de código
- **PostCSS** - Processamento CSS
- **Autoprefixer** - Prefixos CSS automáticos

## 📊 Estrutura de Dados

### **Cliente (Cliente)**
```typescript
interface Cliente {
  id: string
  nome: string
  email: string
  telefone: string
  empresa: string
  setor: string
  dataCadastro: Date
  status: 'ativo' | 'inativo' | 'prospecto'
  observacoes?: string
  endereco?: {
    rua: string
    cidade: string
    estado: string
    cep: string
  }
  redesSociais?: {
    instagram?: string
    facebook?: string
    linkedin?: string
    website?: string
  }
}
```

### **Campanha (Campanha)**
```typescript
interface Campanha {
  id: string
  clienteId: string
  nome: string
  plataforma: 'facebook' | 'instagram' | 'google' | 'tiktok' | 'outros'
  dataInicio: Date
  dataFim?: Date
  investimento: number
  custoPorLead: number
  taxaConversao: number
  ticketMedio: number
  leadsGerados: number
  vendasRealizadas: number
  faturamento: number
  roi: number
  status: 'ativa' | 'pausada' | 'finalizada' | 'cancelada'
  observacoes?: string
}
```

## 🔧 Funcionalidades Implementadas

### **1. Calculadora de Previsibilidade**

#### **Versão Simplificada:**
- **Inputs**: Investimento, Custo por Lead, Taxa de Conversão, Ticket Médio
- **Cálculos**: Leads Gerados, Vendas Previstas, Faturamento Previsto, ROI
- **Validação**: Todos os campos obrigatórios e positivos

#### **Versão Completa:**
- **Inputs adicionais**: Margem de Lucro, Repetição de Compras
- **3 Cenários**: Pessimista, Realista, Otimista
- **Métricas avançadas**: CAC, LTV, Lucro Líquido
- **Gráfico de ROI**: Comparação visual dos cenários

### **2. Sistema de Gestão de Clientes**

#### **Cadastro de Clientes:**
- **3 Abas organizadas**: Dados Básicos, Endereço, Redes Sociais
- **Validação completa** com mensagens de erro
- **Status visual** com cores diferentes
- **Campos obrigatórios** e opcionais

#### **Listagem de Clientes:**
- **Cards responsivos** com informações principais
- **Busca avançada** por nome, empresa ou email
- **Filtros por status** (Ativo, Inativo, Prospecto)
- **Ações**: Visualizar, Editar, Excluir
- **Estatísticas** em tempo real

#### **Dados Mockados:**
- **3 clientes de exemplo** já cadastrados
- **3 campanhas de exemplo** com dados realistas
- **Diferentes status** e setores para teste

## 🎨 Design System

### **Cores:**
- **Primária**: Azul (#3b82f6) - Ações principais
- **Secundária**: Verde (#10b981) - Sucessos
- **Acentuada**: Laranja (#f59e0b) - Avisos
- **Neutra**: Cinza (#6b7280) - Textos secundários
- **Status**: Verde (ativo), Vermelho (inativo), Amarelo (prospecto)

### **Tipografia:**
- **Fonte**: Inter (Google Fonts)
- **Hierarquia**: Títulos, subtítulos, corpo, legendas
- **Responsiva**: Escala automática por dispositivo

### **Componentes:**
- **Cards**: Bordas arredondadas, sombras suaves
- **Botões**: Estados hover, loading, disabled
- **Formulários**: Validação visual, mensagens de erro
- **Tabelas**: Responsivas, ordenação, filtros

## 📱 Responsividade

### **Breakpoints:**
- **Mobile**: < 768px - Layout em coluna única
- **Tablet**: 768px - 1024px - Layout adaptado
- **Desktop**: > 1024px - Layout completo

### **Adaptações:**
- **Navegação**: Menu hambúrguer no mobile
- **Cards**: Grid responsivo (1-3 colunas)
- **Formulários**: Campos empilhados no mobile
- **Tabelas**: Scroll horizontal quando necessário

## 🔒 Validação e Segurança

### **Validação de Formulários:**
- **Zod schemas** para validação de tipos
- **React Hook Form** para gerenciamento de estado
- **Mensagens de erro** em português
- **Validação em tempo real**

### **Tipos de Validação:**
- **Campos obrigatórios**: Nome, email, telefone, empresa
- **Formato de email**: Validação de estrutura
- **Números positivos**: Investimentos, custos, taxas
- **Percentuais**: Entre 0 e 100%
- **URLs**: Formato válido para redes sociais

## 🚀 Performance

### **Otimizações:**
- **Next.js 14** com App Router para melhor performance
- **Componentes lazy-loaded** quando necessário
- **Imagens otimizadas** com next/image
- **CSS purged** com Tailwind

### **Métricas:**
- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1
- **First Input Delay**: < 100ms

## 🧪 Testes e Qualidade

### **Estrutura de Testes:**
- **Componentes**: Testes unitários
- **Formulários**: Testes de validação
- **Cálculos**: Testes de lógica de negócio
- **Integração**: Testes de fluxo completo

### **Qualidade de Código:**
- **ESLint** para linting
- **TypeScript** para type safety
- **Prettier** para formatação
- **Husky** para pre-commit hooks

## 📈 Roadmap de Desenvolvimento

### **Fase 1 - MVP (Concluída) ✅**
- [x] Calculadora de Previsibilidade
- [x] Sistema de Gestão de Clientes
- [x] Interface responsiva
- [x] Validação de formulários

### **Fase 2 - Funcionalidades Avançadas**
- [ ] Edição de clientes
- [ ] Dashboard individual por cliente
- [ ] Histórico de campanhas
- [ ] Relatórios em PDF

### **Fase 3 - Integração**
- [ ] Banco de dados PostgreSQL
- [ ] Autenticação de usuários
- [ ] API REST completa
- [ ] Backup automático

### **Fase 4 - Automação**
- [ ] Sistema de alertas
- [ ] Notificações por email
- [ ] Integração com APIs de marketing
- [ ] Dashboard executivo

## 🔧 Configuração de Desenvolvimento

### **Requisitos:**
- **Node.js**: v18+ (recomendado v20+)
- **npm**: v9+ ou yarn v1.22+
- **Git**: Para controle de versão

### **Variáveis de Ambiente:**
```env
# .env.local
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=Traffic Manager Hub
```

### **Scripts Disponíveis:**
```json
{
  "dev": "next dev",
  "build": "next build", 
  "start": "next start",
  "lint": "next lint"
}
```

## 📚 Recursos e Referências

### **Documentação Oficial:**
- [Next.js 14](https://nextjs.org/docs)
- [TypeScript](https://www.typescriptlang.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [shadcn/ui](https://ui.shadcn.com)

### **Bibliotecas Utilizadas:**
- [React Hook Form](https://react-hook-form.com)
- [Zod](https://zod.dev)
- [Recharts](https://recharts.org)
- [Framer Motion](https://www.framer.com/motion)

---

**Última atualização**: Dezembro 2024  
**Versão**: 1.0.0  
**Desenvolvedor**: Traffic Manager Hub Team 