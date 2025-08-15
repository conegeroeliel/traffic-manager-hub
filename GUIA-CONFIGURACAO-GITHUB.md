# 🚀 Guia de Configuração Git e GitHub - Traffic Manager Hub

## 📋 Pré-requisitos

### 1. Instalar Git
- **Windows**: Baixar e instalar [Git for Windows](https://git-scm.com/download/win)
- **macOS**: `brew install git` (se tiver Homebrew) ou baixar do site oficial
- **Linux**: `sudo apt-get install git` (Ubuntu/Debian) ou `sudo yum install git` (CentOS/RHEL)

### 2. Criar conta no GitHub
- Acessar [github.com](https://github.com) e criar uma conta
- Configurar autenticação SSH ou usar GitHub CLI

## 🔧 Configuração Inicial

### 1. Configurar Git localmente
```bash
# Configurar nome e email
git config --global user.name "Seu Nome"
git config --global user.email "seu.email@exemplo.com"

# Configurar editor padrão (opcional)
git config --global core.editor "code --wait"  # VS Code
```

### 2. Configurar autenticação GitHub

#### Opção A: GitHub CLI (Recomendado)
```bash
# Instalar GitHub CLI
# Windows: winget install GitHub.cli
# macOS: brew install gh
# Linux: sudo apt install gh

# Fazer login
gh auth login
```

#### Opção B: SSH Keys
```bash
# Gerar chave SSH
ssh-keygen -t ed25519 -C "seu.email@exemplo.com"

# Adicionar chave ao ssh-agent
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_ed25519

# Copiar chave pública
cat ~/.ssh/id_ed25519.pub
# Adicionar no GitHub: Settings > SSH and GPG keys
```

#### Opção C: Personal Access Token
- GitHub > Settings > Developer settings > Personal access tokens
- Gerar token com permissões: `repo`, `workflow`
- Usar token como senha ao fazer push

## 🏗️ Configuração do Repositório

### 1. Inicializar repositório local
```bash
# Inicializar Git
git init

# Adicionar arquivos
git add .

# Primeiro commit
git commit -m "🎉 Initial commit: Traffic Manager Hub"

# Configurar branch principal
git branch -M main
```

### 2. Criar repositório no GitHub
```bash
# Usando GitHub CLI
gh repo create traffic-manager-hub --public --description "Plataforma Inteligente para Gestores de Tráfego - Hub central para gestores e donos de agência"

# Ou criar manualmente no GitHub.com e depois:
git remote add origin https://github.com/SEU_USUARIO/traffic-manager-hub.git
```

### 3. Fazer push inicial
```bash
git push -u origin main
```

## 📁 Estrutura de Branches

### Branches principais
- `main` - Código em produção
- `develop` - Desenvolvimento integrado
- `feature/*` - Novas funcionalidades
- `hotfix/*` - Correções urgentes
- `release/*` - Preparação de releases

### Configurar branches
```bash
# Criar branch develop
git checkout -b develop
git push -u origin develop

# Configurar proteção de branches no GitHub
# Settings > Branches > Add rule
```

## 🔄 Workflow de Desenvolvimento

### 1. Criar feature branch
```bash
git checkout develop
git pull origin develop
git checkout -b feature/nova-funcionalidade
```

### 2. Desenvolver e commitar
```bash
# Fazer alterações
git add .
git commit -m "✨ Adiciona nova funcionalidade"

# Push da feature
git push -u origin feature/nova-funcionalidade
```

### 3. Criar Pull Request
```bash
# Usando GitHub CLI
gh pr create --title "✨ Nova funcionalidade" --body "Descrição das mudanças" --base develop

# Ou criar manualmente no GitHub.com
```

### 4. Merge e limpeza
```bash
# Após aprovação do PR
git checkout develop
git pull origin develop
git branch -d feature/nova-funcionalidade
```

## 🏷️ Versionamento

### Semântico (SemVer)
- `MAJOR.MINOR.PATCH`
- Exemplo: `1.0.0`, `1.2.3`

### Criar release
```bash
# Tag da versão
git tag -a v1.0.0 -m "Release 1.0.0"
git push origin v1.0.0

# Usando GitHub CLI
gh release create v1.0.0 --title "Release 1.0.0" --notes "Notas da release"
```

## 🔧 Configurações Avançadas

### 1. Git Hooks (opcional)
```bash
# Instalar husky para hooks
npm install --save-dev husky
npx husky install
npx husky add .husky/pre-commit "npm run lint"
npx husky add .husky/pre-push "npm run test"
```

### 2. Conventional Commits
```bash
# Padrão de commits
feat: nova funcionalidade
fix: correção de bug
docs: documentação
style: formatação
refactor: refatoração
test: testes
chore: manutenção
```

### 3. Configurar aliases úteis
```bash
git config --global alias.st status
git config --global alias.co checkout
git config --global alias.br branch
git config --global alias.ci commit
git config --global alias.unstage 'reset HEAD --'
git config --global alias.last 'log -1 HEAD'
```

## 🚨 Troubleshooting

### Problemas comuns

#### 1. Git não encontrado
```bash
# Verificar instalação
git --version

# Adicionar ao PATH (Windows)
# Adicionar C:\Program Files\Git\bin ao PATH do sistema
```

#### 2. Problemas de autenticação
```bash
# Verificar configuração
git config --list

# Reconfigurar credenciais
git config --global --unset user.name
git config --global --unset user.email
git config --global user.name "Seu Nome"
git config --global user.email "seu.email@exemplo.com"
```

#### 3. Conflitos de merge
```bash
# Ver status
git status

# Resolver conflitos manualmente
# Depois:
git add .
git commit -m "🔧 Resolve conflitos de merge"
```

## 📚 Recursos Adicionais

- [Git Documentation](https://git-scm.com/doc)
- [GitHub Guides](https://guides.github.com/)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [Semantic Versioning](https://semver.org/)

## 🎯 Próximos Passos

1. ✅ Instalar Git
2. ✅ Configurar autenticação GitHub
3. ✅ Inicializar repositório
4. ✅ Criar repositório no GitHub
5. ✅ Configurar branches e proteções
6. ✅ Configurar CI/CD (GitHub Actions)
7. ✅ Configurar dependabot para atualizações automáticas
8. ✅ Configurar code review workflow

---

**Nota**: Este guia assume que você está usando Windows com PowerShell. Ajuste os comandos conforme seu sistema operacional.

