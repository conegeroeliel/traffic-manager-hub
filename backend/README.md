# Traffic Manager Hub - Backend

Backend da plataforma inteligente para gestores de tráfego, desenvolvido com Node.js, TypeScript e Express.

## 🚀 Tecnologias

- **Node.js** com TypeScript
- **Express.js** para APIs REST
- **Zod** para validações
- **Winston** para logging
- **OpenAI** para integrações com IA
- **JWT** para autenticação
- **bcryptjs** para hash de senhas

## 📁 Estrutura do Projeto

```
backend/
├── src/
│   ├── config/           # Configurações da aplicação
│   ├── features/         # Módulos específicos por funcionalidade
│   │   ├── diagnostico-nicho/
│   │   ├── calculadora/
│   │   ├── clientes/
│   │   ├── tarefas/
│   │   └── reunioes/
│   ├── lib/              # Bibliotecas e utilitários
│   │   ├── gpt/          # Integração com OpenAI
│   │   ├── prisma/       # Configuração do banco
│   │   ├── prompts/      # Templates de prompts
│   │   └── validations/  # Schemas de validação
│   ├── middleware/       # Middlewares customizados
│   ├── routes/           # Rotas da API
│   ├── services/         # Lógica de negócio
│   ├── types/            # Definições de tipos TypeScript
│   ├── utils/            # Utilitários gerais
│   └── index.ts          # Entrada da aplicação
├── package.json
├── tsconfig.json
└── env.example
```

## ⚙️ Configuração

### 1. Instalar dependências

```bash
npm install
```

### 2. Configurar variáveis de ambiente

Copie o arquivo `env.example` para `.env` e configure as variáveis:

```bash
cp env.example .env
```

Principais variáveis:

- `DATABASE_URL`: URL de conexão com PostgreSQL
- `JWT_SECRET`: Chave secreta para JWT (mínimo 32 caracteres)
- `OPENAI_API_KEY`: Chave da API da OpenAI
- `FRONTEND_URL`: URL do frontend para CORS

### 3. Executar aplicação

```bash
# Desenvolvimento
npm run dev

# Produção
npm run build
npm start
```

## 🔗 Rotas da API

### Autenticação
- `POST /api/auth/register` - Registrar usuário
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Perfil do usuário

### Clientes
- `GET /api/clientes` - Listar clientes
- `GET /api/clientes/:id` - Buscar cliente
- `POST /api/clientes` - Criar cliente
- `PUT /api/clientes/:id` - Atualizar cliente
- `DELETE /api/clientes/:id` - Remover cliente

### Diagnóstico de Nicho
- `GET /api/diagnostico-nicho` - Listar diagnósticos
- `GET /api/diagnostico-nicho/:id` - Buscar diagnóstico
- `POST /api/diagnostico-nicho` - Criar diagnóstico
- `POST /api/diagnostico-nicho/:id/regenerate` - Regenerar diagnóstico
- `DELETE /api/diagnostico-nicho/:id` - Remover diagnóstico

### Calculadora de ROI
- `GET /api/calculadora` - Listar cálculos
- `GET /api/calculadora/:id` - Buscar cálculo
- `POST /api/calculadora` - Realizar cálculo
- `DELETE /api/calculadora/:id` - Remover cálculo

### Tarefas
- `GET /api/tarefas` - Listar tarefas
- `GET /api/tarefas/:id` - Buscar tarefa
- `POST /api/tarefas` - Criar tarefa
- `PUT /api/tarefas/:id` - Atualizar tarefa
- `PATCH /api/tarefas/:id/status` - Atualizar status
- `DELETE /api/tarefas/:id` - Remover tarefa

### Reuniões
- `GET /api/reunioes` - Listar reuniões
- `GET /api/reunioes/:id` - Buscar reunião
- `GET /api/reunioes/calendario/:ano/:mes` - Calendário mensal
- `POST /api/reunioes` - Criar reunião
- `PUT /api/reunioes/:id` - Atualizar reunião
- `PATCH /api/reunioes/:id/status` - Atualizar status
- `DELETE /api/reunioes/:id` - Remover reunião

## 🛡️ Segurança

- **Helmet**: Headers de segurança
- **CORS**: Controle de acesso
- **Rate Limiting**: Proteção contra ataques
- **JWT**: Autenticação stateless
- **Bcrypt**: Hash seguro de senhas
- **Validações**: Zod para entrada de dados

## 📊 Logging

Sistema de logging com Winston:

- **Console**: Ambiente de desenvolvimento
- **Arquivo**: Produção (`logs/app.log`, `logs/error.log`)
- **Níveis**: error, warn, info, debug
- **Rotação**: Arquivos limitados em tamanho e quantidade

## 🔧 Scripts Disponíveis

```bash
npm run dev          # Executar em desenvolvimento com hot reload
npm run build        # Compilar TypeScript para JavaScript
npm start            # Executar versão compilada
npm run test         # Executar testes
npm run test:watch   # Executar testes em modo watch
npm run lint         # Verificar código com ESLint
npm run lint:fix     # Corrigir problemas de lint automaticamente
```

## 🌐 Health Check

A aplicação fornece um endpoint de health check:

```
GET /health
```

Resposta:
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "environment": "development"
}
```

## 🚨 Tratamento de Erros

Sistema robusto de tratamento de erros:

- **Validação**: Erros de validação Zod (400)
- **Autenticação**: Erros de JWT (401)
- **Autorização**: Acesso negado (403)
- **Não encontrado**: Recursos inexistentes (404)
- **Conflito**: Dados duplicados (409)
- **Rate Limit**: Muitas requisições (429)
- **Servidor**: Erros internos (500)

Todos os erros são logados com contexto completo para debugging.

## 📈 Performance

- **Compression**: Compressão gzip
- **Rate Limiting**: Proteção contra sobrecarga
- **Logging eficiente**: Winston com rotação de arquivos
- **Validação rápida**: Zod com early return
- **Error handling**: Express async errors

## 🔮 Próximos Passos

- [ ] Integração com Prisma ORM
- [ ] Banco de dados PostgreSQL
- [ ] Sistema de cache com Redis
- [ ] Upload de arquivos
- [ ] Notificações em tempo real
- [ ] Testes automatizados
- [ ] Docker containerization
- [ ] CI/CD pipeline