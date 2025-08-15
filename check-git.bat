@echo off
chcp 65001 >nul
echo.
echo ========================================
echo 🔍 Verificação do Git
echo ========================================
echo.

:: Verificar se Git está instalado
echo 📋 Verificando se Git está instalado...
git --version >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Git está instalado!
    git --version
    echo.
    echo 🎯 Próximos passos:
    echo 1. Execute: setup-github.bat
    echo 2. Ou execute: .\setup-github.ps1
    echo.
    echo 📚 Consulte: GUIA-CONFIGURACAO-GITHUB.md
) else (
    echo ❌ Git não encontrado!
    echo.
    echo 🔧 Opções de instalação:
    echo.
    echo 1️⃣  Instalação automática (recomendado):
    echo    Execute: setup-github.bat
    echo.
    echo 2️⃣  Instalação manual:
    echo    - Baixe em: https://git-scm.com/download/win
    echo    - Execute o instalador
    echo    - Reinicie o terminal
    echo.
    echo 3️⃣  Via winget:
    echo    winget install --id Git.Git -e --source winget
    echo.
    echo ⚠️  Após instalar, feche este terminal e abra um novo.
)

echo.
echo ========================================
echo 📚 Recursos Disponíveis
echo ========================================
echo.
echo 📖 GUIA-CONFIGURACAO-GITHUB.md - Guia completo
echo 🚀 setup-github.bat - Configuração automática (Windows)
echo ⚡ setup-github.ps1 - Configuração automática (PowerShell)
echo 📋 README-GITHUB.md - README para GitHub
echo.
echo 🎯 Para começar, execute: setup-github.bat
echo.

pause

