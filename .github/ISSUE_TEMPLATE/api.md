---
name: API
about: Suggest API improvements or report API issues
title: '[API] '
labels: 'api'
assignees: ''

---

## 🔌 Melhoria de API

### 📝 Descrição

Descreva a melhoria de API ou problema relacionado aos endpoints.

### 🎯 Tipo de Melhoria

- [ ] New Endpoint
- [ ] Endpoint Modification
- [ ] Response Format
- [ ] Error Handling
- [ ] Authentication
- [ ] Rate Limiting
- [ ] Documentation
- [ ] Performance
- [ ] Validation
- [ ] Outro: [especifique]

### 🔍 Problema Atual

Descreva o problema ou melhoria necessária:

- **O que não está funcionando?**
- **Qual é o impacto?**
- **Quando acontece?**

### 💡 Sugestão de Melhoria

Descreva como você gostaria que a API fosse melhorada:

- [ ] Adicionar novo endpoint
- [ ] Modificar endpoint existente
- [ ] Melhorar resposta
- [ ] Adicionar validação
- [ ] Implementar cache
- [ ] Melhorar documentação
- [ ] Otimizar performance
- [ ] Outro: [especifique]

### 📋 Endpoint Específico

Se aplicável, especifique o endpoint:

- [ ] GET /api/clientes
- [ ] POST /api/clientes
- [ ] PUT /api/clientes/:id
- [ ] DELETE /api/clientes/:id
- [ ] POST /api/auth/login
- [ ] POST /api/diagnostico-nicho
- [ ] GET /api/tarefas
- [ ] Outro: [especifique]

### 🔧 Como Reproduzir

Se for um problema específico:

1. Faça requisição para [endpoint específico]
2. Use [método HTTP]
3. Envie [dados específicos]
4. Observe [erro/comportamento]

### 📊 Exemplo de Requisição

```bash
# Requisição atual (problemática)
curl -X POST http://localhost:3001/api/clientes \
  -H "Content-Type: application/json" \
  -d '{"nome": "João"}'

# Resposta atual
{
  "error": "Validation failed"
}
```

### 💻 Exemplo de Implementação

Se você tem sugestões específicas, forneça exemplos:

```typescript
// Endpoint sugerido
app.post('/api/clientes', async (req, res) => {
  try {
    const { nome, email, telefone } = req.body;
    
    // Validação
    if (!nome) {
      return res.status(400).json({
        error: 'Nome é obrigatório'
      });
    }
    
    // Criação
    const cliente = await prisma.cliente.create({
      data: { nome, email, telefone }
    });
    
    res.status(201).json(cliente);
  } catch (error) {
    res.status(500).json({
      error: 'Erro interno do servidor'
    });
  }
});
```

### 📋 Informações do Ambiente

- **Base URL**: [ex: http://localhost:3001]
- **Método HTTP**: [ex: GET, POST, PUT, DELETE]
- **Headers**: [ex: Authorization, Content-Type]
- **Status Code**: [ex: 200, 400, 500]

### 📸 Screenshots (se aplicável)

Adicione screenshots de:
- Resposta da API
- Erros no console
- Documentação da API
- Testes de endpoint

### 🔗 Links Relacionados

- [Issues relacionadas](#)
- [Documentação da API](#)
- [Swagger/OpenAPI](#)

---

**Obrigado por ajudar a melhorar nossa API! 🔌✨**
