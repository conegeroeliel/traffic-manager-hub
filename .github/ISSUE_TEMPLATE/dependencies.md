---
name: Dependencies
about: Suggest dependency updates or report dependency issues
title: '[DEPS] '
labels: 'dependencies'
assignees: ''

---

## 📦 Atualização de Dependências

### 📝 Descrição

Descreva a atualização de dependências ou problema relacionado.

### 🎯 Tipo de Dependência

- [ ] Frontend Dependencies
- [ ] Backend Dependencies
- [ ] Development Dependencies
- [ ] Peer Dependencies
- [ ] Optional Dependencies
- [ ] Outro: [especifique]

### 🔍 Problema Atual

Descreva o problema ou melhoria necessária:

- **O que precisa ser atualizado?**
- **Qual é o motivo?**
- **Qual é o impacto?**

### 💡 Sugestão de Atualização

Descreva como você gostaria que as dependências fossem atualizadas:

- [ ] Atualizar versão específica
- [ ] Atualizar todas as dependências
- [ ] Remover dependência desnecessária
- [ ] Adicionar nova dependência
- [ ] Corrigir vulnerabilidades
- [ ] Melhorar performance
- [ ] Outro: [especifique]

### 📋 Dependências Específicas

Se aplicável, liste as dependências:

**Frontend:**
- [ ] React
- [ ] Next.js
- [ ] TypeScript
- [ ] Tailwind CSS
- [ ] Outro: [especifique]

**Backend:**
- [ ] Express
- [ ] Prisma
- [ ] PostgreSQL
- [ ] JWT
- [ ] Outro: [especifique]

### 🔧 Como Reproduzir

Se for um problema específico:

1. Instale dependências: `npm install`
2. Execute [comando específico]
3. Observe [erro/comportamento]

### 📊 Versões Atuais vs Sugeridas

```json
{
  "dependencies": {
    "react": "18.2.0",        // Atual: 18.2.0 → Sugerida: 18.3.0
    "next": "14.0.4",         // Atual: 14.0.4 → Sugerida: 14.1.0
    "typescript": "5.3.3"     // Atual: 5.3.3 → Sugerida: 5.4.0
  }
}
```

### 💻 Exemplo de Atualização

```bash
# Atualizar dependência específica
npm update react

# Atualizar todas as dependências
npm update

# Instalar versão específica
npm install react@18.3.0

# Verificar vulnerabilidades
npm audit
npm audit fix
```

### 📋 Informações do Ambiente

- **Package Manager**: [ex: npm, yarn, pnpm]
- **Node.js**: [ex: 18.17.0]
- **OS**: [ex: Windows 10, macOS, Ubuntu]

### 📸 Screenshots (se aplicável)

Adicione screenshots de:
- Erros de instalação
- Vulnerabilidades reportadas
- Logs de atualização
- Package.json

### 🔗 Links Relacionados

- [Issues relacionadas](#)
- [Changelog das dependências](#)
- [Documentação de migração](#)

### ⚠️ Considerações

- [ ] Testar após atualização
- [ ] Verificar compatibilidade
- [ ] Atualizar documentação
- [ ] Notificar breaking changes

---

**Obrigado por ajudar a manter nossas dependências atualizadas! 📦✨**
