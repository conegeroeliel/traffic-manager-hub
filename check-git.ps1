# 🔍 Verificação do Git - Traffic Manager Hub

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "🔍 Verificação do Git" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Verificar se Git está instalado
Write-Host "📋 Verificando se Git está instalado..." -ForegroundColor Yellow
try {
    $gitVersion = git --version 2>$null
    if ($gitVersion) {
        Write-Host "✅ Git está instalado!" -ForegroundColor Green
        Write-Host $gitVersion -ForegroundColor Gray
        Write-Host ""
        Write-Host "🎯 Próximos passos:" -ForegroundColor Yellow
        Write-Host "1. Execute: .\setup-github.ps1" -ForegroundColor Gray
        Write-Host "2. Ou execute: setup-github.bat" -ForegroundColor Gray
        Write-Host ""
        Write-Host "📚 Consulte: GUIA-CONFIGURACAO-GITHUB.md" -ForegroundColor Cyan
    }
} catch {
    Write-Host "❌ Git não encontrado!" -ForegroundColor Red
    Write-Host ""
    Write-Host "🔧 Opções de instalação:" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "1️⃣  Instalação automática (recomendado):" -ForegroundColor Yellow
    Write-Host "   Execute: .\setup-github.ps1" -ForegroundColor Gray
    Write-Host ""
    Write-Host "2️⃣  Instalação manual:" -ForegroundColor Yellow
    Write-Host "   - Baixe em: https://git-scm.com/download/win" -ForegroundColor Gray
    Write-Host "   - Execute o instalador" -ForegroundColor Gray
    Write-Host "   - Reinicie o terminal" -ForegroundColor Gray
    Write-Host ""
    Write-Host "3️⃣  Via winget:" -ForegroundColor Yellow
    Write-Host "   winget install --id Git.Git -e --source winget" -ForegroundColor Gray
    Write-Host ""
    Write-Host "⚠️  Após instalar, feche este terminal e abra um novo." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "📚 Recursos Disponíveis" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "📖 GUIA-CONFIGURACAO-GITHUB.md - Guia completo" -ForegroundColor Gray
Write-Host "🚀 setup-github.bat - Configuração automática (Windows)" -ForegroundColor Gray
Write-Host "⚡ setup-github.ps1 - Configuração automática (PowerShell)" -ForegroundColor Gray
Write-Host "📋 README-GITHUB.md - README para GitHub" -ForegroundColor Gray
Write-Host ""
Write-Host "🎯 Para começar, execute: .\setup-github.ps1" -ForegroundColor Yellow
Write-Host ""

Read-Host "Pressione Enter para sair"

