---
name: Breaking Change
about: Report a breaking change or suggest one
title: '[BREAKING] '
labels: 'breaking-change'
assignees: ''

---

## ⚠️ Mudança que Quebra Compatibilidade

### 📝 Descrição

Descreva a mudança que quebra compatibilidade e seu impacto.

### 🎯 Tipo de Mudança

- [ ] API Changes
- [ ] Database Schema
- [ ] Configuration
- [ ] Dependencies
- [ ] Environment Variables
- [ ] File Structure
- [ ] Function Signatures
- [ ] Data Format
- [ ] Outro: [especifique]

### 🔍 O que Mudou

Descreva especificamente o que foi alterado:

- **Antes**: [como era antes]
- **Depois**: [como ficou depois]
- **Motivo**: [por que a mudança foi necessária]

### ⚠️ Impacto

Descreva o impacto da mudança:

- **APIs afetadas**: [listar endpoints]
- **Dados afetados**: [esquemas, formatos]
- **Configurações**: [variáveis de ambiente, arquivos]
- **Dependências**: [versões, pacotes]

### 🔧 Como Migrar

Forneça instruções detalhadas de migração:

1. **Backup**: [o que fazer antes]
2. **Atualização**: [passos de migração]
3. **Teste**: [como verificar se funcionou]
4. **Rollback**: [como reverter se necessário]

### 💻 Exemplo de Migração

```javascript
// Código antigo (não funciona mais)
const user = await getUserById(id);

// Código novo (funciona agora)
const user = await getUserById(id, { include: 'profile' });
```

```sql
-- Migração de banco de dados
ALTER TABLE users ADD COLUMN email_verified BOOLEAN DEFAULT FALSE;
UPDATE users SET email_verified = true WHERE email IS NOT NULL;
```

### 📋 Checklist de Migração

- [ ] Backup do banco de dados
- [ ] Backup de configurações
- [ ] Atualizar dependências
- [ ] Executar migrações
- [ ] Testar funcionalidades
- [ ] Atualizar documentação
- [ ] Notificar usuários

### 📊 Compatibilidade

- **Versão mínima**: [ex: v2.0.0]
- **Node.js**: [ex: >=18.0.0]
- **Database**: [ex: PostgreSQL >=15]
- **Browser**: [ex: Chrome >=90]

### 📸 Screenshots (se aplicável)

Adicione screenshots de:
- Erros de compatibilidade
- Diferenças visuais
- Logs de erro

### 🔗 Links Relacionados

- [Changelog](#)
- [Migration guide](#)
- [Release notes](#)

### 📞 Suporte

Se você precisar de ajuda com a migração:
- [Documentação de migração](#)
- [Issues relacionadas](#)
- [Discussions](#)

---

**⚠️ Esta mudança pode quebrar seu código existente. Leia cuidadosamente as instruções de migração!**
