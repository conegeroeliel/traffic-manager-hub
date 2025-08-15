# 🤝 Guia de Contribuição

Obrigado por considerar contribuir com o **Traffic Manager Hub**! 

## 🚀 Como Contribuir

### 1. Configuração Inicial

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/traffic-manager-hub.git
cd traffic-manager-hub

# Instale as dependências
npm install
cd backend && npm install
cd ..

# Configure as variáveis de ambiente
cp backend/env.example backend/.env
# Edite backend/.env com suas configurações
```

### 2. Fluxo de Trabalho

1. **Crie uma branch** para sua feature/fix:
   ```bash
   git checkout -b feature/nova-funcionalidade
   # ou
   git checkout -b fix/correcao-bug
   ```

2. **Faça suas mudanças** seguindo os padrões do projeto

3. **Teste suas mudanças**:
   ```bash
   # Backend
   cd backend && npm test
   
   # Frontend
   npm run lint
   npm run build
   ```

4. **Commit suas mudanças**:
   ```bash
   git add .
   git commit -m "feat: adiciona nova funcionalidade"
   ```

5. **Push para o repositório**:
   ```bash
   git push origin feature/nova-funcionalidade
   ```

6. **Abra um Pull Request** no GitHub

## 📋 Padrões de Commit

Seguimos o [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` - Nova funcionalidade
- `fix:` - Correção de bug
- `docs:` - Documentação
- `style:` - Formatação de código
- `refactor:` - Refatoração
- `test:` - Testes
- `chore:` - Tarefas de manutenção

## 🎯 Padrões de Código

### TypeScript/JavaScript
- Use TypeScript para tipagem
- Siga o ESLint configurado
- Use nomes descritivos para variáveis e funções
- Comente código complexo

### React/Next.js
- Use componentes funcionais com hooks
- Prefira Server Components quando possível
- Use TypeScript para props
- Siga as convenções do Next.js 14

### Backend/Express
- Use async/await
- Trate erros adequadamente
- Use middleware para validação
- Documente APIs com JSDoc

## 🧪 Testes

### Backend
```bash
cd backend
npm test              # Executa todos os testes
npm run test:watch    # Executa em modo watch
```

### Frontend
```bash
npm test              # Executa testes (se configurados)
npm run lint          # Executa linting
```

## 📚 Documentação

- Mantenha o README.md atualizado
- Documente APIs novas
- Adicione comentários em código complexo
- Atualize a documentação técnica quando necessário

## 🐛 Reportando Bugs

1. Use o template de bug report
2. Inclua passos para reproduzir
3. Adicione screenshots se aplicável
4. Especifique ambiente (OS, browser, versões)

## 💡 Sugerindo Features

1. Use o template de feature request
2. Descreva o problema que resolve
3. Proponha uma solução
4. Adicione critérios de aceitação

## 🔒 Segurança

- Não commite arquivos `.env`
- Não inclua chaves de API
- Reporte vulnerabilidades em privado
- Use variáveis de ambiente

## 📞 Suporte

- Abra uma issue para dúvidas
- Use discussions para debates
- Entre em contato via email se necessário

## 🏆 Reconhecimento

Contribuidores serão listados no README.md e receberão créditos apropriados.

---

**Obrigado por contribuir! 🎉**
