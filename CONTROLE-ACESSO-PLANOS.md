# 🎯 Sistema de Controle de Acesso e Planos

## 📋 Visão Geral

O sistema implementa um controle robusto de acesso baseado em planos (Free/Trial/Premium) com limites de uso e funcionalidades restritas.

## 🏗️ Arquitetura

### Backend
- **Tipos**: `backend/src/types/user.ts` - Define interfaces de usuário e planos
- **Limites**: `backend/src/lib/plan-limits.ts` - Gerencia limites e validações
- **Middleware**: `backend/src/middleware/plan-middleware.ts` - Controle de acesso
- **Rotas**: `backend/src/routes/plans.ts` - API de planos e pagamentos

### Frontend
- **Serviço**: `src/lib/services/planService.ts` - Integração com API
- **Componentes**: 
  - `src/components/ui/plan-status-card.tsx` - Status do plano
  - `src/components/ui/upgrade-modal.tsx` - Modal de upgrade

## 📊 Planos Disponíveis

### 🆓 Plano Free
- **Clientes**: 3
- **Diagnósticos**: 1
- **Tarefas**: 10
- **Reuniões**: 5
- **Funcionalidades**: Básicas sem IA

### ⚡ Plano Trial (14 dias)
- **Clientes**: 10
- **Diagnósticos**: 5
- **Tarefas**: 50
- **Reuniões**: 20
- **Funcionalidades**: IA básica + relatórios

### 👑 Plano Premium (R$ 97/mês)
- **Clientes**: Ilimitado
- **Diagnósticos**: Ilimitado
- **Tarefas**: Ilimitado
- **Reuniões**: Ilimitado
- **Funcionalidades**: IA avançada (GPT-4) + exportação PDF

## 🔐 Middlewares de Controle

### Verificação de Limites
```typescript
// Verificar se pode criar cliente
router.post('/', canCreateCliente, async (req, res) => {
  // Lógica de criação
});

// Verificar se pode criar diagnóstico
router.post('/', canCreateDiagnostico, async (req, res) => {
  // Lógica de criação
});

// Verificar se pode criar tarefa
router.post('/', canCreateTarefa, async (req, res) => {
  // Lógica de criação
});

// Verificar se pode criar reunião
router.post('/', canCreateReuniao, async (req, res) => {
  // Lógica de criação
});
```

### Verificação de Premium
```typescript
// Acesso restrito ao premium
router.get('/advanced-features', requirePremium, async (req, res) => {
  // Funcionalidades premium
});
```

### Verificação de Trial
```typescript
// Verificar se trial não expirou
router.use(checkTrialStatus);
```

## 🛠️ Implementação

### 1. Adicionar Middleware às Rotas

```typescript
// Em qualquer rota que crie recursos
import { canCreateCliente } from '@/middleware/plan-middleware';

router.post('/', canCreateCliente, async (req, res) => {
  // Sua lógica aqui
});
```

### 2. Verificar Limites no Frontend

```typescript
import { planService } from '@/lib/services/planService';

// Verificar limites antes de criar
const planInfo = await planService.getLimits();
const canCreate = planInfo.uso.clientes < planInfo.limites.clientes;

if (!canCreate) {
  // Mostrar modal de upgrade
  setShowUpgradeModal(true);
}
```

### 3. Mostrar Status do Plano

```typescript
import { PlanStatusCard } from '@/components/ui/plan-status-card';

<PlanStatusCard onUpgradeClick={() => setShowUpgradeModal(true)} />
```

## 🔄 Fluxo de Upgrade

1. **Usuário clica em "Upgrade"**
2. **Modal abre com planos disponíveis**
3. **Usuário seleciona plano e método de pagamento**
4. **Sistema processa pagamento (mock)**
5. **Plano é atualizado no backend**
6. **Interface é atualizada**

## 📈 Monitoramento

### Logs Automáticos
- Tentativas de criação além do limite
- Acessos a funcionalidades premium
- Expiração de trial/premium
- Upgrades realizados

### Métricas Disponíveis
- Uso atual vs limite
- Porcentagem de uso por recurso
- Status de pagamento
- Data de expiração

## 🚀 Próximos Passos

### Integração com Gateway de Pagamento
```typescript
// Em backend/src/routes/plans.ts
// Substituir mock por integração real

// Exemplo com Stripe
const paymentIntent = await stripe.paymentIntents.create({
  amount: valor * 100, // em centavos
  currency: 'brl',
  payment_method_types: ['card', 'pix'],
});
```

### Banco de Dados
```sql
-- Tabela de usuários
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email VARCHAR UNIQUE NOT NULL,
  nome VARCHAR NOT NULL,
  plano VARCHAR NOT NULL DEFAULT 'free',
  status_pagamento VARCHAR NOT NULL DEFAULT 'ativo',
  data_expiracao_trial TIMESTAMP,
  data_expiracao_premium TIMESTAMP,
  limite_clientes INTEGER NOT NULL DEFAULT 3,
  limite_diagnosticos INTEGER NOT NULL DEFAULT 1,
  limite_tarefas INTEGER NOT NULL DEFAULT 10,
  limite_reunioes INTEGER NOT NULL DEFAULT 5,
  total_clientes INTEGER NOT NULL DEFAULT 0,
  total_diagnosticos INTEGER NOT NULL DEFAULT 0,
  total_tarefas INTEGER NOT NULL DEFAULT 0,
  total_reunioes INTEGER NOT NULL DEFAULT 0
);

-- Tabela de pagamentos
CREATE TABLE payments (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  plano VARCHAR NOT NULL,
  valor DECIMAL(10,2) NOT NULL,
  status VARCHAR NOT NULL,
  metodo_pagamento VARCHAR NOT NULL,
  data_pagamento TIMESTAMP,
  data_expiracao TIMESTAMP NOT NULL,
  gateway_pagamento VARCHAR,
  codigo_transacao VARCHAR
);
```

### Webhooks de Pagamento
```typescript
// Webhook para atualizar status
router.post('/webhooks/payment', async (req, res) => {
  const event = req.body;
  
  if (event.type === 'payment_intent.succeeded') {
    // Atualizar plano do usuário
    await updateUserPlan(event.data.object);
  }
});
```

## 🔧 Configuração

### Variáveis de Ambiente
```env
# Gateway de Pagamento
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# JWT
JWT_SECRET=your-secret-key

# Limites dos Planos
FREE_CLIENTES_LIMIT=3
FREE_DIAGNOSTICOS_LIMIT=1
TRIAL_CLIENTES_LIMIT=10
TRIAL_DIAGNOSTICOS_LIMIT=5
```

### Personalização de Limites
```typescript
// Em backend/src/lib/plan-limits.ts
export const PLAN_LIMITS: PlanLimits = {
  free: {
    clientes: parseInt(process.env.FREE_CLIENTES_LIMIT || '3'),
    diagnosticos: parseInt(process.env.FREE_DIAGNOSTICOS_LIMIT || '1'),
    // ... outros limites
  },
  // ... outros planos
};
```

## 🧪 Testes

### Testar Limites
```bash
# Criar usuário free
curl -X POST /api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"nome":"Teste","email":"teste@teste.com","senha":"123456"}'

# Tentar criar mais de 3 clientes
curl -X POST /api/clientes \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"nome":"Cliente 4","email":"cliente4@teste.com","telefone":"11999999999","setor":"Teste"}'
# Deve retornar erro 403 - Limite atingido
```

### Testar Upgrade
```bash
# Fazer upgrade para premium
curl -X POST /api/plans/upgrade \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"plano":"premium","metodoPagamento":"pix","valor":97}'
```

## 📞 Suporte

Para dúvidas sobre implementação ou personalização:

1. **Verificar logs** em `backend/logs/`
2. **Testar endpoints** com Postman/Insomnia
3. **Consultar documentação** da API em `/api/plans/available`
4. **Verificar status** do plano em `/api/plans/limits`

---

**Sistema implementado e funcionando! 🎉**

O controle de acesso está ativo e protegendo todas as funcionalidades conforme os planos dos usuários.


