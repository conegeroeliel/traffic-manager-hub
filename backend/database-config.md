# 🗄️ Configuração do Banco de Dados

## 📋 Pré-requisitos

1. **PostgreSQL** instalado e rodando
2. **Node.js** e **npm** instalados
3. **Prisma CLI** disponível

## 🚀 Configuração Rápida

### 1. Instalar PostgreSQL

**Windows:**
- Baixar e instalar PostgreSQL: https://www.postgresql.org/download/windows/
- Durante a instalação, definir senha como: `password`
- Porta padrão: `5432`

**macOS:**
```bash
brew install postgresql
brew services start postgresql
```

**Linux (Ubuntu):**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

### 2. Criar Banco de Dados

```sql
-- Conectar ao PostgreSQL
psql -U postgres

-- Criar banco de dados
CREATE DATABASE traffic_manager_hub;

-- Verificar se foi criado
\l

-- Sair
\q
```

### 3. Configurar Variáveis de Ambiente

Criar arquivo `.env` na pasta `backend/`:

```env
# Database
DATABASE_URL="postgresql://postgres:password@localhost:5432/traffic_manager_hub"

# JWT
JWT_SECRET="your-super-secret-jwt-key-change-in-production"

# Server
PORT=3001
NODE_ENV=development

# OpenAI
OPENAI_API_KEY="your-openai-api-key"

# Frontend URL
FRONTEND_URL="http://localhost:3002"
```

### 4. Executar Migrações

```bash
# Na pasta backend/
npx prisma migrate dev --name init
```

### 5. Gerar Cliente Prisma

```bash
npx prisma generate
```

### 6. Executar Script de Setup

```bash
node scripts/setup-database.js
```

## 🔑 Credenciais de Acesso

Após executar o script de setup, você terá acesso com:

### 👑 Administrador
- **Email:** admin@trafficmanager.com
- **Senha:** admin123
- **Plano:** Premium (ilimitado)

### 👤 Usuário Teste
- **Email:** teste@trafficmanager.com
- **Senha:** teste123
- **Plano:** Free (limitado)

## 📊 Dados Criados

O script de setup cria automaticamente:

- ✅ **2 Usuários** (admin + teste)
- ✅ **3 Clientes** de exemplo
- ✅ **3 Tarefas** de exemplo
- ✅ **2 Reuniões** de exemplo
- ✅ **2 Diagnósticos** de exemplo

## 🛠️ Comandos Úteis

### Visualizar Dados no Prisma Studio
```bash
npx prisma studio
```

### Resetar Banco de Dados
```bash
npx prisma migrate reset
node scripts/setup-database.js
```

### Verificar Status das Migrações
```bash
npx prisma migrate status
```

## 🔧 Solução de Problemas

### Erro de Conexão
- Verificar se PostgreSQL está rodando
- Verificar credenciais no DATABASE_URL
- Verificar se o banco `traffic_manager_hub` existe

### Erro de Migração
```bash
# Resetar migrações
npx prisma migrate reset --force
npx prisma migrate dev --name init
```

### Erro de Autenticação
- Verificar se a senha do PostgreSQL está correta
- Verificar se o usuário `postgres` tem permissões

## 📝 Estrutura do Banco

### Tabelas Principais
- **users** - Usuários do sistema
- **clientes** - Clientes cadastrados
- **tarefas** - Tarefas e atividades
- **reunioes** - Reuniões agendadas
- **diagnosticos** - Diagnósticos de nicho
- **payments** - Histórico de pagamentos

### Relacionamentos
- Cada usuário pode ter múltiplos clientes
- Clientes podem ter múltiplas tarefas, reuniões e diagnósticos
- Sistema de planos com limites por usuário

## 🎯 Próximos Passos

1. ✅ Configurar PostgreSQL
2. ✅ Executar migrações
3. ✅ Rodar script de setup
4. ✅ Testar login com credenciais
5. ✅ Criar clientes, tarefas e reuniões
6. ✅ Testar funcionalidades do sistema


