---
name: Refactor
about: Suggest code refactoring improvements
title: '[REFACTOR] '
labels: 'refactor'
assignees: ''

---

## 🔧 Refatoração de Código

### 📝 Descrição

Descreva a refatoração sugerida ou problema de código que precisa ser melhorado.

### 🎯 Tipo de Refatoração

- [ ] Code Duplication
- [ ] Long Functions/Methods
- [ ] Complex Conditionals
- [ ] Magic Numbers/Strings
- [ ] Poor Naming
- [ ] Tight Coupling
- [ ] Code Smells
- [ ] Performance Optimization
- [ ] Architecture Improvement
- [ ] Outro: [especifique]

### 🔍 Problema Atual

Descreva o problema de código que precisa ser refatorado:

- **O que está problemático?**
- **Por que precisa ser refatorado?**
- **Qual é o impacto atual?**

### 💡 Sugestão de Refatoração

Descreva como você gostaria que o código fosse refatorado:

- [ ] Extrair funções/métodos
- [ ] Renomear variáveis/funções
- [ ] Simplificar condicionais
- [ ] Remover duplicação
- [ ] Melhorar estrutura
- [ ] Aplicar padrões de design
- [ ] Otimizar performance
- [ ] Outro: [especifique]

### 📋 Área Específica

Se aplicável, especifique a área que precisa de refatoração:

- [ ] Frontend Components
- [ ] Backend Services
- [ ] Database Queries
- [ ] API Endpoints
- [ ] Business Logic
- [ ] Utility Functions
- [ ] Configuration
- [ ] Outro: [especifique]

### 🔧 Como Identificar

Descreva como identificar o problema:

1. Localize [arquivo/função específica]
2. Observe [comportamento problemático]
3. Analise [complexidade/duplicação]

### 💻 Exemplo de Refatoração

Se você tem sugestões específicas, forneça exemplos:

```javascript
// Código atual (problemático)
function processUserData(user) {
  if (user.age > 18 && user.status === 'active' && user.verified === true) {
    // complex logic here
  }
}

// Código refatorado (sugerido)
function isEligibleUser(user) {
  return user.age > 18 && user.status === 'active' && user.verified === true;
}

function processUserData(user) {
  if (isEligibleUser(user)) {
    // complex logic here
  }
}
```

### 📊 Métricas de Melhoria

Se aplicável, descreva as melhorias esperadas:

- **Complexidade ciclomática**: [ex: reduzir de 15 para 8]
- **Linhas de código**: [ex: reduzir de 200 para 150]
- **Duplicação**: [ex: remover 30% de código duplicado]
- **Performance**: [ex: melhorar em 20%]

### 📋 Informações do Ambiente

- **Arquivo(s) afetado(s)**: [ex: src/components/UserForm.tsx]
- **Função(s) afetada(s)**: [ex: processUserData, validateForm]
- **Dependências**: [ex: React, Express, Prisma]

### 📸 Screenshots (se aplicável)

Adicione screenshots de:
- Código problemático
- Análise de complexidade
- Métricas de qualidade

### 🔗 Links Relacionados

- [Issues relacionadas](#)
- [Documentação de padrões](#)

---

**Obrigado por ajudar a melhorar a qualidade do código! 🔧✨**
