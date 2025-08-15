# 🚀 Configuração Git e GitHub - Traffic Manager Hub
# Script PowerShell para automatizar a configuração

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "🚀 Configuração Git e GitHub" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Verificar se Git já está instalado
Write-Host "📋 Verificando se Git está instalado..." -ForegroundColor Yellow
try {
    $gitVersion = git --version 2>$null
    if ($gitVersion) {
        Write-Host "✅ Git já está instalado!" -ForegroundColor Green
        Write-Host $gitVersion -ForegroundColor Gray
    }
} catch {
    Write-Host "❌ Git não encontrado. Instalando..." -ForegroundColor Red
    Write-Host ""
    Write-Host "🔧 Instalando Git via winget..." -ForegroundColor Yellow
    
    try {
        winget install --id Git.Git -e --source winget
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ Git instalado com sucesso!" -ForegroundColor Green
            Write-Host "🔄 Reiniciando terminal para aplicar mudanças..." -ForegroundColor Yellow
            Write-Host ""
            Write-Host "⚠️  Por favor, feche este terminal e abra um novo para continuar." -ForegroundColor Yellow
            Read-Host "Pressione Enter para sair"
            exit
        } else {
            throw "Erro na instalação"
        }
    } catch {
        Write-Host "❌ Erro ao instalar Git via winget." -ForegroundColor Red
        Write-Host ""
        Write-Host "📥 Instale manualmente em: https://git-scm.com/download/win" -ForegroundColor Yellow
        Read-Host "Pressione Enter para sair"
        exit 1
    }
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "🔧 Configuração do Git" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Configurar Git
Write-Host "📝 Configurando Git..." -ForegroundColor Yellow
Write-Host ""

$gitName = Read-Host "Digite seu nome completo"
$gitEmail = Read-Host "Digite seu email"

git config --global user.name $gitName
git config --global user.email $gitEmail
git config --global init.defaultBranch main
git config --global core.autocrlf true

Write-Host "✅ Git configurado com sucesso!" -ForegroundColor Green
Write-Host ""

# Verificar se repositório já está inicializado
if (Test-Path ".git") {
    Write-Host "✅ Repositório Git já inicializado!" -ForegroundColor Green
} else {
    Write-Host "🔧 Inicializando repositório Git..." -ForegroundColor Yellow
    git init
    Write-Host "✅ Repositório inicializado!" -ForegroundColor Green
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "📦 Preparando primeiro commit" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Adicionar arquivos
Write-Host "📁 Adicionando arquivos ao Git..." -ForegroundColor Yellow
git add .

# Verificar se há mudanças para commitar
$hasChanges = git diff --cached --quiet
if ($LASTEXITCODE -eq 0) {
    Write-Host "ℹ️  Nenhuma mudança para commitar." -ForegroundColor Gray
} else {
    Write-Host "💾 Fazendo primeiro commit..." -ForegroundColor Yellow
    git commit -m "🎉 Initial commit: Traffic Manager Hub"
    Write-Host "✅ Primeiro commit realizado!" -ForegroundColor Green
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "🌐 Configuração GitHub" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Verificar GitHub CLI
Write-Host "📋 Verificando GitHub CLI..." -ForegroundColor Yellow
try {
    $ghVersion = gh --version 2>$null
    if ($ghVersion) {
        Write-Host "✅ GitHub CLI já está instalado!" -ForegroundColor Green
    }
} catch {
    Write-Host "🔧 Instalando GitHub CLI..." -ForegroundColor Yellow
    try {
        winget install --id GitHub.cli -e --source winget
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ GitHub CLI instalado!" -ForegroundColor Green
            Write-Host "🔄 Reiniciando terminal..." -ForegroundColor Yellow
            Read-Host "Pressione Enter para sair"
            exit
        } else {
            throw "Erro na instalação"
        }
    } catch {
        Write-Host "❌ Erro ao instalar GitHub CLI." -ForegroundColor Red
        Write-Host "📥 Instale manualmente: https://cli.github.com/" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "🎯 Próximos Passos" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "1️⃣  Faça login no GitHub CLI:" -ForegroundColor Yellow
Write-Host "    gh auth login" -ForegroundColor Gray
Write-Host ""
Write-Host "2️⃣  Crie o repositório no GitHub:" -ForegroundColor Yellow
Write-Host "    gh repo create traffic-manager-hub --public --description `"Plataforma Inteligente para Gestores de Tráfego`"" -ForegroundColor Gray
Write-Host ""
Write-Host "3️⃣  Faça o push inicial:" -ForegroundColor Yellow
Write-Host "    git push -u origin main" -ForegroundColor Gray
Write-Host ""
Write-Host "4️⃣  Configure branches protegidas no GitHub.com" -ForegroundColor Yellow
Write-Host ""
Write-Host "📚 Consulte o arquivo GUIA-CONFIGURACAO-GITHUB.md para mais detalhes." -ForegroundColor Cyan
Write-Host ""

Read-Host "Pressione Enter para sair"

