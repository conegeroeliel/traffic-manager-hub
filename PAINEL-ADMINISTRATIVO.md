# 🛡️ Painel Administrativo - Gestão de Usuários

## 📋 Visão Geral

O painel administrativo permite que você, como dono do app, gerencie todos os usuários, monitore planos, pagamentos e tenha controle total sobre a plataforma.

## 🔐 Acesso ao Painel

### **Credenciais de Administrador**
- **Email**: `admin@trafficmanager.com`
- **Senha**: `admin123`

### **Como Acessar**
1. Faça login com as credenciais de admin
2. No header, você verá o link "Admin" com ícone de escudo
3. Clique em "Admin" para acessar o painel
4. URL: `http://localhost:3000/admin`

## 🎯 Funcionalidades do Painel

### **📊 Dashboard de Estatísticas**
- **Total de Usuários**: Contagem por plano (Free/Trial/Premium)
- **Receita Total**: Valor total arrecadado
- **Receita do Mês**: Valor arrecadado no mês atual
- **Pagamentos**: Status dos pagamentos (pendente/aprovado/cancelado)
- **Uso Total**: Clientes e diagnósticos criados

### **👥 Gestão de Usuários**
- **Lista Completa**: Todos os usuários cadastrados
- **Busca**: Por nome ou email
- **Filtros**: Por plano (Free/Trial/Premium)
- **Detalhes**: Plano, status, data de cadastro, último login
- **Uso**: Quantidade de clientes e diagnósticos criados

### **⚙️ Ações Administrativas**
- **Visualizar**: Detalhes completos do usuário
- **Editar**: Alterar plano, status de pagamento, datas de expiração
- **Deletar**: Remover usuário do sistema
- **Monitorar**: Histórico de pagamentos e uso

## 🛠️ APIs Administrativas

### **Endpoints Disponíveis**

```bash
# Estatísticas gerais
GET /api/admin/stats

# Listar todos os usuários
GET /api/admin/users

# Detalhes de um usuário específico
GET /api/admin/users/:id

# Atualizar usuário
PUT /api/admin/users/:id

# Deletar usuário
DELETE /api/admin/users/:id

# Listar todos os pagamentos
GET /api/admin/payments
```

### **Exemplo de Uso**

```bash
# Obter estatísticas
curl -X GET http://localhost:3001/api/admin/stats \
  -H "Authorization: Bearer SEU_TOKEN_ADMIN"

# Listar usuários
curl -X GET http://localhost:3001/api/admin/users \
  -H "Authorization: Bearer SEU_TOKEN_ADMIN"

# Atualizar plano de um usuário
curl -X PUT http://localhost:3001/api/admin/users/123 \
  -H "Authorization: Bearer SEU_TOKEN_ADMIN" \
  -H "Content-Type: application/json" \
  -d '{"plano": "premium", "statusPagamento": "ativo"}'
```

## 📈 Métricas Disponíveis

### **Estatísticas de Usuários**
```json
{
  "users": {
    "total": 150,
    "free": 45,
    "trial": 30,
    "premium": 75,
    "ativo": 120,
    "pendente": 15,
    "cancelado": 10,
    "expirado": 5
  }
}
```

### **Estatísticas de Receita**
```json
{
  "revenue": {
    "total": 7500.00,
    "thisMonth": 1200.00
  }
}
```

### **Estatísticas de Uso**
```json
{
  "usage": {
    "totalClientes": 450,
    "totalDiagnosticos": 180,
    "totalTarefas": 1200,
    "totalReunioes": 300
  }
}
```

## 🔧 Configuração de Admin

### **Definir Novo Admin**
Para adicionar novos administradores, edite o arquivo `backend/src/routes/admin.ts`:

```typescript
// Middleware para verificar se é admin
const requireAdmin = async (req: AuthenticatedRequest, res: any, next: any) => {
  try {
    if (!req.user) {
      throw errors.unauthorized('Usuário não autenticado');
    }

    // Lista de emails admin
    const adminEmails = [
      'admin@trafficmanager.com',
      'seu-email@exemplo.com',  // Adicione aqui
      'outro-admin@exemplo.com' // Adicione aqui
    ];

    if (!adminEmails.includes(req.user.email)) {
      throw errors.forbidden('Acesso restrito a administradores');
    }

    next();
  } catch (error) {
    next(error);
  }
};
```

### **Permissões de Admin**
- ✅ Acesso total a todos os usuários
- ✅ Modificação de planos e status
- ✅ Visualização de pagamentos
- ✅ Estatísticas completas
- ✅ Deletar usuários
- ✅ Logs de todas as ações

## 📊 Relatórios Disponíveis

### **Relatório de Usuários por Plano**
- Distribuição entre Free/Trial/Premium
- Taxa de conversão
- Usuários ativos vs inativos

### **Relatório Financeiro**
- Receita total
- Receita mensal
- Pagamentos por método (PIX/Cartão/Boleto)
- Status dos pagamentos

### **Relatório de Uso**
- Total de clientes criados
- Total de diagnósticos realizados
- Uso por usuário
- Tendências de uso

## 🚀 Próximos Passos

### **Funcionalidades Futuras**
1. **Exportação de Relatórios**: PDF/Excel
2. **Notificações**: Alertas de usuários inativos
3. **Automação**: Upgrade automático de trial expirado
4. **Analytics**: Gráficos e métricas avançadas
5. **Bulk Actions**: Ações em lote para usuários

### **Integração com Gateway de Pagamento**
```typescript
// Webhook para atualizar status automaticamente
router.post('/webhooks/payment', async (req, res) => {
  const event = req.body;
  
  if (event.type === 'payment_intent.succeeded') {
    // Atualizar status do usuário automaticamente
    await updateUserPaymentStatus(event.data.object);
  }
});
```

## 🔒 Segurança

### **Logs de Auditoria**
Todas as ações administrativas são logadas:
- Quem fez a ação
- Qual ação foi realizada
- Quando foi feita
- Dados modificados

### **Controle de Acesso**
- Apenas emails autorizados podem acessar
- Middleware de verificação em todas as rotas
- Logs de tentativas de acesso não autorizado

## 📞 Suporte

### **Para Problemas de Acesso**
1. Verifique se está logado com email de admin
2. Confirme se o token JWT é válido
3. Verifique os logs em `backend/logs/`

### **Para Dúvidas sobre Funcionalidades**
1. Consulte a documentação da API
2. Teste os endpoints com Postman/Insomnia
3. Verifique os exemplos de uso

---

**Painel administrativo implementado e funcionando! 🎉**

Agora você tem controle total sobre todos os usuários e pode monitorar o crescimento da sua plataforma.


