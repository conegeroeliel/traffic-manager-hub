---
name: Database
about: Suggest database improvements or report database issues
title: '[DB] '
labels: 'database'
assignees: ''

---

## 🗄️ Melhoria de Banco de Dados

### 📝 Descrição

Descreva a melhoria de banco de dados ou problema relacionado ao banco.

### 🎯 Tipo de Melhoria

- [ ] Schema Changes
- [ ] Query Optimization
- [ ] Indexing
- [ ] Migration
- [ ] Performance
- [ ] Data Integrity
- [ ] Backup/Recovery
- [ ] Security
- [ ] Scaling
- [ ] Outro: [especifique]

### 🔍 Problema Atual

Descreva o problema ou melhoria necessária:

- **O que está problemático?**
- **Qual é o impacto?**
- **Quando acontece?**

### 💡 Sugestão de Melhoria

Descreva como você gostaria que o banco fosse melhorado:

- [ ] Adicionar índices
- [ ] Otimizar queries
- [ ] Modificar schema
- [ ] Implementar constraints
- [ ] Melhorar performance
- [ ] Adicionar validações
- [ ] Implementar backup
- [ ] Outro: [especifique]

### 📋 Área Específica

Se aplicável, especifique a área que precisa de melhoria:

- [ ] Tabelas
- [ ] Relacionamentos
- [ ] Queries
- [ ] Migrations
- [ ] Seeds
- [ ] Constraints
- [ ] Triggers
- [ ] Outro: [especifique]

### 🔧 Como Reproduzir

Se for um problema específico:

1. Execute [query específica]
2. Observe [comportamento problemático]
3. Resultado: [impacto no sistema]

### 📊 Métricas Atuais

Se possível, forneça métricas específicas:

- **Tempo de query**: [ex: 2.5 segundos]
- **Tamanho do banco**: [ex: 1.2GB]
- **Número de registros**: [ex: 50,000]
- **Performance**: [ex: 80% CPU]

### 💻 Exemplo de Implementação

Se você tem sugestões específicas, forneça exemplos:

```sql
-- Query atual (problemática)
SELECT * FROM users WHERE email LIKE '%@gmail.com';

-- Query otimizada (sugerida)
SELECT id, name, email FROM users WHERE email LIKE '%@gmail.com';
```

```typescript
// Migration sugerida
export async function up(db: PrismaClient) {
  await db.$executeRaw`
    CREATE INDEX idx_users_email ON users(email);
  `;
}
```

### 📋 Informações do Ambiente

- **Database**: [ex: PostgreSQL 15]
- **ORM**: [ex: Prisma 5.22.0]
- **Host**: [ex: localhost, AWS RDS]
- **Version**: [ex: v1.2.3]

### 📸 Screenshots (se aplicável)

Adicione screenshots de:
- Query execution plans
- Performance metrics
- Error messages
- Database schema

### 🔗 Links Relacionados

- [Issues relacionadas](#)
- [Documentação do banco](#)
- [Migrations](#)

---

**Obrigado por ajudar a melhorar nosso banco de dados! 🗄️✨**
