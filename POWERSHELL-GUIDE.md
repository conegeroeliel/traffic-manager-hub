# 🚀 Traffic Manager Hub - Guia PowerShell

Este guia explica como usar os scripts PowerShell para gerenciar o projeto Traffic Manager Hub de forma eficiente e moderna.

## 📋 Índice

- [Configuração Inicial](#configuração-inicial)
- [Scripts Disponíveis](#scripts-disponíveis)
- [Uso dos Scripts](#uso-dos-scripts)
- [Solução de Problemas](#solução-de-problemas)
- [Migração de .bat para .ps1](#migração-de-bat-para-ps1)

## ⚙️ Configuração Inicial

### 1. Verificar Versão do PowerShell

```powershell
$PSVersionTable.PSVersion
```

**Requisitos mínimos:**
- PowerShell 5.1+ (Windows)
- PowerShell Core 7+ (Cross-platform)

### 2. Configurar Política de Execução

Execute o script de configuração:

```powershell
.\setup-powershell.ps1
```

**Opções disponíveis:**
- `.\setup-powershell.ps1 -CheckOnly` - Apenas verificar configurações
- `.\setup-powershell.ps1 -Force` - Forçar alterações sem confirmação

### 3. Verificar Dependências

O script de configuração verifica automaticamente:
- ✅ Versão do PowerShell
- ✅ Política de execução
- ✅ Funcionalidades necessárias
- ✅ Permissões de escrita
- ✅ Scripts do projeto

## 📜 Scripts Disponíveis

### 🎯 Scripts Principais

| Script | Descrição | Uso |
|--------|-----------|-----|
| `start-server.ps1` | Inicia o servidor backend | `.\start-server.ps1` |
| `start-frontend.ps1` | Inicia o frontend Next.js | `.\start-frontend.ps1` |
| `start-full-stack.ps1` | Inicia backend + frontend | `.\start-full-stack.ps1` |
| `setup-powershell.ps1` | Configura o PowerShell | `.\setup-powershell.ps1` |

### 🧪 Scripts de Teste

| Script | Descrição | Localização |
|--------|-----------|-------------|
| `test-server.ps1` | Testa o servidor backend | `backend/test-server.ps1` |

## 🚀 Uso dos Scripts

### Iniciar Servidor Backend

```powershell
# Iniciar normalmente
.\start-server.ps1

# Com opções
.\start-server.ps1 -Port 3002
.\start-server.ps1 -Clean
.\start-server.ps1 -Test
.\start-server.ps1 -Help
```

**Opções disponíveis:**
- `-Port <num>` - Porta do servidor (padrão: 3001)
- `-Clean` - Limpar cache e node_modules
- `-Test` - Executar testes antes de iniciar
- `-Help` - Exibir ajuda

### Iniciar Frontend

```powershell
# Iniciar normalmente
.\start-frontend.ps1

# Com opções
.\start-frontend.ps1 -Port 3001
.\start-frontend.ps1 -Clean
.\start-frontend.ps1 -Build
.\start-frontend.ps1 -Test
.\start-frontend.ps1 -Help
```

**Opções disponíveis:**
- `-Port <num>` - Porta do frontend (padrão: 3000)
- `-Clean` - Limpar cache e node_modules
- `-Build` - Compilar para produção
- `-Test` - Executar testes antes de iniciar
- `-Help` - Exibir ajuda

### Iniciar Full Stack

```powershell
# Iniciar backend + frontend
.\start-full-stack.ps1

# Apenas backend
.\start-full-stack.ps1 -BackendOnly

# Apenas frontend
.\start-full-stack.ps1 -FrontendOnly

# Com opções
.\start-full-stack.ps1 -Clean
.\start-full-stack.ps1 -Test
.\start-full-stack.ps1 -BackendPort 3002 -FrontendPort 3001
.\start-full-stack.ps1 -Help
```

**Opções disponíveis:**
- `-BackendOnly` - Iniciar apenas o backend
- `-FrontendOnly` - Iniciar apenas o frontend
- `-BackendPort <num>` - Porta do backend (padrão: 3001)
- `-FrontendPort <num>` - Porta do frontend (padrão: 3000)
- `-Clean` - Limpar cache e node_modules
- `-Test` - Executar testes antes de iniciar
- `-Help` - Exibir ajuda

### Testar Servidor

```powershell
# Testar backend
cd backend
.\test-server.ps1

# Com opções
.\test-server.ps1 -Port 3002
.\test-server.ps1 -Detailed
.\test-server.ps1 -Help
```

## 🔧 Solução de Problemas

### Erro: "Execution Policy"

```powershell
# Verificar política atual
Get-ExecutionPolicy

# Configurar política (como administrador)
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope LocalMachine

# Ou para usuário atual (sem privilégios de admin)
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Erro: "Script não encontrado"

```powershell
# Verificar se está no diretório correto
Get-Location

# Navegar para o diretório do projeto
cd "C:\caminho\para\traffic-manager-hub"

# Verificar se os scripts existem
Get-ChildItem *.ps1
```

### Erro: "Porta já em uso"

```powershell
# Verificar processos na porta
Get-NetTCPConnection -LocalPort 3001 | Where-Object { $_.State -eq "Listen" }

# Parar processo específico
Stop-Process -Id <PID> -Force

# Ou usar a opção -Clean nos scripts
.\start-server.ps1 -Clean
```

### Erro: "Node.js não encontrado"

```powershell
# Verificar se Node.js está instalado
node --version
npm --version

# Se não estiver instalado, baixe em: https://nodejs.org/
```

### Erro: "Permissões insuficientes"

```powershell
# Executar PowerShell como administrador
# Ou usar a opção -Force no setup
.\setup-powershell.ps1 -Force
```

## 🔄 Migração de .bat para .ps1

### Vantagens dos Scripts PowerShell

| Aspecto | .bat | .ps1 |
|---------|------|------|
| **Funcionalidades** | Limitadas | Avançadas |
| **Tratamento de Erros** | Básico | Robusto |
| **Parâmetros** | Simples | Flexível |
| **Cores e Formatação** | Limitada | Rica |
| **Compatibilidade** | Windows | Cross-platform |
| **Manutenção** | Difícil | Fácil |

### Comandos Equivalentes

| .bat | .ps1 |
|------|------|
| `start-server.bat` | `.\start-server.ps1` |
| `quick-restart-frontend.bat` | `.\start-frontend.ps1 -Clean` |
| `start-full-stack.bat` | `.\start-full-stack.ps1` |
| `test-server.bat` | `.\backend\test-server.ps1` |

### Migração Automática

Para migrar gradualmente:

1. **Mantenha os scripts .bat** para compatibilidade
2. **Use os scripts .ps1** para novas funcionalidades
3. **Atualize a documentação** para referenciar .ps1
4. **Remova scripts .bat** quando não forem mais necessários

## 📚 Exemplos Práticos

### Desenvolvimento Diário

```powershell
# 1. Configurar ambiente (primeira vez)
.\setup-powershell.ps1

# 2. Iniciar desenvolvimento
.\start-full-stack.ps1

# 3. Testar backend
cd backend
.\test-server.ps1

# 4. Limpar cache quando necessário
.\start-full-stack.ps1 -Clean
```

### Debugging

```powershell
# Testar apenas backend
.\start-full-stack.ps1 -BackendOnly

# Testar com porta diferente
.\start-server.ps1 -Port 3002

# Verificar se está funcionando
.\backend\test-server.ps1 -Port 3002 -Detailed
```

### Produção

```powershell
# Compilar frontend
.\start-frontend.ps1 -Build

# Testar tudo
.\start-full-stack.ps1 -Test
```

## 🎯 Boas Práticas

### 1. Sempre use parâmetros nomeados

```powershell
# ✅ Bom
.\start-server.ps1 -Port 3002 -Clean

# ❌ Evite
.\start-server.ps1 3002
```

### 2. Verifique a ajuda primeiro

```powershell
.\start-server.ps1 -Help
```

### 3. Use o setup inicial

```powershell
.\setup-powershell.ps1 -CheckOnly
```

### 4. Teste antes de usar

```powershell
.\start-full-stack.ps1 -Test
```

## 🔗 Links Úteis

- [PowerShell Documentation](https://docs.microsoft.com/en-us/powershell/)
- [PowerShell Core](https://github.com/PowerShell/PowerShell)
- [Node.js](https://nodejs.org/)
- [Next.js](https://nextjs.org/)

---

**💡 Dica:** Os scripts PowerShell oferecem muito mais funcionalidades que os scripts .bat. Use-os para uma experiência de desenvolvimento mais moderna e eficiente!
