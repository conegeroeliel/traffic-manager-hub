# 🚀 Traffic Manager Hub

> Plataforma Inteligente para Gestores de Tráfego - Hub central para gestores e donos de agência

[![CI/CD Pipeline](https://github.com/SEU_USUARIO/traffic-manager-hub/workflows/CI%2FCD%20Pipeline/badge.svg)](https://github.com/SEU_USUARIO/traffic-manager-hub/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-000000?style=flat&logo=next.js&logoColor=white)](https://nextjs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=flat&logo=postgresql&logoColor=white)](https://www.postgresql.org/)

## 📋 Sobre o Projeto

O **Traffic Manager Hub** é uma plataforma web moderna e inteligente desenvolvida para substituir planilhas e ferramentas dispersas utilizadas por gestores de tráfego e donos de agência. O sistema oferece uma solução centralizada e integrada para gerenciamento completo de clientes, diagnósticos inteligentes de nicho, calculadoras de previsibilidade e controle de tarefas.

### 🎯 Principais Funcionalidades

- **👥 Gestão de Clientes**: Cadastramento e controle completo de clientes
- **🤖 Diagnóstico Inteligente**: Análise automatizada de nicho via IA (GPT)
- **📊 Calculadora de Previsibilidade**: Cenários e métricas avançadas
- **✅ Controle de Tarefas**: Gerenciamento de tarefas e reuniões
- **📅 Painel de Overview**: Calendário integrado e avisos
- **💎 Controle de Planos**: Sistema de trial/premium com restrições

## 🛠️ Stack Tecnológica

### Frontend
- **TypeScript** - Linguagem principal
- **Next.js 14** - Framework React com App Router
- **Tailwind CSS** - Framework de estilização
- **Shadcn UI** - Componentes de interface
- **Zustand** - Gerenciamento de estado
- **TanStack Query** - Gerenciamento de dados
- **Zod** - Validação de schemas

### Backend
- **Node.js** - Runtime JavaScript
- **TypeScript** - Linguagem principal
- **PostgreSQL** - Banco de dados principal
- **Prisma** - ORM para banco de dados
- **NextAuth.js** - Autenticação
- **OpenAI/GPT** - Integração com IA

### DevOps & Ferramentas
- **GitHub Actions** - CI/CD Pipeline
- **Dependabot** - Atualizações automáticas
- **ESLint** - Linting de código
- **Husky** - Git hooks

## 🚀 Como Executar

### Pré-requisitos
- Node.js 18+
- PostgreSQL 15+
- Git

### Instalação Rápida

1. **Clone o repositório**
```bash
git clone https://github.com/SEU_USUARIO/traffic-manager-hub.git
cd traffic-manager-hub
```

2. **Configure o ambiente**
```bash
# Frontend
npm install
cp .env.example .env.local

# Backend
cd backend
npm install
cp .env.example .env
```

3. **Configure o banco de dados**
```bash
cd backend
npx prisma migrate dev
npx prisma generate
```

4. **Execute o projeto**
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
npm run dev
```

### Scripts Automatizados

Para facilitar a configuração, utilize os scripts disponíveis:

```bash
# Configuração completa (Windows)
setup-github.bat

# Configuração completa (PowerShell)
.\setup-github.ps1

# Iniciar full-stack
start-full-stack.bat
```

## 📁 Estrutura do Projeto

```
traffic-manager-hub/
├── src/                    # Frontend Next.js
│   ├── app/               # App Router
│   ├── components/        # Componentes React
│   ├── lib/              # Utilitários e configurações
│   └── types/            # Tipos TypeScript
├── backend/              # Backend Node.js
│   ├── src/              # Código fonte
│   ├── prisma/           # Schema e migrações
│   └── routes/           # Rotas da API
├── .github/              # Configurações GitHub
│   ├── workflows/        # GitHub Actions
│   └── dependabot.yml    # Atualizações automáticas
└── docs/                 # Documentação
```

## 🔄 Workflow de Desenvolvimento

### 1. Configurar Git
```bash
git config --global user.name "Seu Nome"
git config --global user.email "seu.email@exemplo.com"
```

### 2. Criar Feature Branch
```bash
git checkout develop
git pull origin develop
git checkout -b feature/nova-funcionalidade
```

### 3. Desenvolver e Commitar
```bash
# Fazer alterações
git add .
git commit -m "✨ Adiciona nova funcionalidade"
git push -u origin feature/nova-funcionalidade
```

### 4. Criar Pull Request
```bash
gh pr create --title "✨ Nova funcionalidade" --body "Descrição das mudanças" --base develop
```

## 🧪 Testes

### Executar Testes
```bash
# Frontend
npm test

# Backend
cd backend
npm test

# Testes com cobertura
npm test -- --coverage
```

### Linting
```bash
npm run lint
npx tsc --noEmit
```

## 📚 Documentação

- [📖 Guia de Configuração GitHub](GUIA-CONFIGURACAO-GITHUB.md)
- [🔧 Documentação Técnica](DOCUMENTACAO-TECNICA.md)
- [🚀 Guia de Deploy](GUIA-DEPLOY-PRODUCAO.md)
- [📋 Guia de Processos](GUIA-PROCESSOS.md)

## 🤝 Como Contribuir

1. **Fork** o projeto
2. **Clone** seu fork
3. **Crie** uma branch para sua feature
4. **Desenvolva** seguindo os padrões do projeto
5. **Teste** suas alterações
6. **Commit** com mensagens semânticas
7. **Push** para sua branch
8. **Abra** um Pull Request

### Padrões de Commit
```
feat: nova funcionalidade
fix: correção de bug
docs: documentação
style: formatação
refactor: refatoração
test: testes
chore: manutenção
```

## 📄 Licença

Este projeto está licenciado sob a Licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.

## 🆘 Suporte

- **Issues**: [GitHub Issues](https://github.com/SEU_USUARIO/traffic-manager-hub/issues)
- **Discussions**: [GitHub Discussions](https://github.com/SEU_USUARIO/traffic-manager-hub/discussions)
- **Documentação**: [Wiki do Projeto](https://github.com/SEU_USUARIO/traffic-manager-hub/wiki)

## 🙏 Agradecimentos

- [Next.js](https://nextjs.org/) - Framework React
- [Tailwind CSS](https://tailwindcss.com/) - Framework CSS
- [Shadcn UI](https://ui.shadcn.com/) - Componentes
- [Prisma](https://www.prisma.io/) - ORM
- [OpenAI](https://openai.com/) - IA Integration

---

**Desenvolvido com ❤️ para a comunidade de gestores de tráfego**

