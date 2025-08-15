# Traffic Manager Hub 🚀

> Plataforma inteligente para gestores de tráfego que substitui planilhas e ferramentas dispersas.

## ✨ Funcionalidades

- 👥 **Gestão de Clientes** - Cadastro e organização completa
- 🧠 **Diagnóstico Inteligente** - Análise de nicho com IA (GPT-4)
- 📊 **Calculadora de ROI** - Projeções e cenários de investimento
- ✅ **Gestão de Tarefas** - Controle de atividades por cliente
- 📅 **Agenda de Reuniões** - Calendário integrado
- 🎯 **Dashboard** - Overview completo com métricas
- 🏆 **Planos** - Sistema trial/premium com restrições

## 🛠️ Tecnologias

### Frontend
- **Next.js 14** (App Router)
- **TypeScript** para tipagem
- **Tailwind CSS** + **Shadcn UI** para interface
- **Zustand** para estado global
- **TanStack Query** para dados
- **Zod** para validações

### Backend
- **Node.js** + **Express.js**
- **TypeScript** para tipagem
- **PostgreSQL** + **Prisma ORM**
- **OpenAI GPT-4** para IA
- **JWT** para autenticação
- **Winston** para logging

## 🚀 Início Rápido

### 🎯 Método Recomendado (PowerShell)

```powershell
# 1. Configurar PowerShell (primeira vez)
.\setup-powershell.ps1

# 2. Iniciar aplicação completa
.\start-full-stack.ps1

# 3. Ou iniciar separadamente:
.\start-server.ps1      # Backend (porta 3001)
.\start-frontend.ps1    # Frontend (porta 3000)
```

### 🔄 Método Alternativo (Scripts .bat)

```bash
# Backend
cd backend
quick-setup.bat     # Setup inicial completo
start-server.bat    # Iniciar servidor (porta 3001)
test-server.bat     # Testar se está funcionando

# Frontend
quick-restart-frontend.bat  # Iniciar frontend (porta 3000)
```

### 📚 Documentação PowerShell

Para instruções detalhadas sobre os scripts PowerShell, consulte:
- [Guia PowerShell Completo](POWERSHELL-GUIDE.md)

## 📁 Estrutura do Projeto

```
traffic-manager-hub/
├── backend/                 # API Backend
│   ├── src/
│   │   ├── config/         # Configurações
│   │   ├── features/       # Módulos por funcionalidade
│   │   ├── lib/           # Bibliotecas (GPT, Prisma, etc)
│   │   ├── middleware/    # Auth, Error handling
│   │   ├── routes/        # Rotas da API
│   │   └── types/         # Tipos TypeScript
│   ├── scripts/           # Scripts de automação
│   ├── test-server.ps1    # Script PowerShell para testes
│   └── *.bat              # Scripts Windows (legado)
├── frontend/               # Interface do usuário
│   └── package.json
├── src/                   # Código Next.js atual
│   ├── app/              # Pages (App Router)
│   ├── components/       # Componentes UI
│   └── lib/              # Utilitários
├── *.ps1                 # Scripts PowerShell (recomendado)
├── *.bat                 # Scripts Windows (legado)
└── docs/                 # Documentação
```

## 🔧 Configuração

### Variáveis de Ambiente (Backend)
```env
# Database
DATABASE_URL="postgresql://user:pass@localhost:5432/traffic_manager_hub"

# JWT
JWT_SECRET="sua-chave-secreta-aqui"

# OpenAI
OPENAI_API_KEY="sua-chave-openai-aqui"

# Servidor
PORT=3001
FRONTEND_URL=http://localhost:3000
```

## 📖 APIs Disponíveis

- `GET /health` - Status do servidor
- `POST /api/auth/login` - Login
- `POST /api/auth/register` - Registro
- `GET /api/clientes` - Listar clientes
- `POST /api/diagnostico-nicho` - Gerar diagnóstico
- `POST /api/calculadora` - Calcular ROI
- `GET /api/tarefas` - Listar tarefas
- `GET /api/reunioes` - Listar reuniões

## 🎯 Próximos Passos

1. ✅ Backend completo e funcional
2. 🔄 Integração frontend ↔ backend
3. 🗄️ Configuração do banco PostgreSQL
4. 🧪 Testes automatizados
5. 🚀 Deploy em produção

## 📚 Documentação

- [Backend README](./backend/README.md) - Documentação completa da API
- [Guia de Processos](./GUIA-PROCESSOS.md) - Fluxos de trabalho
- [Documentação Técnica](./DOCUMENTACAO-TECNICA.md) - Arquitetura detalhada

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📄 Licença

MIT License - veja [LICENSE](./LICENSE) para detalhes.

---

**Desenvolvido com ❤️ para gestores de tráfego**