@echo off
chcp 65001 >nul
echo.
echo ========================================
echo 🚀 Configuração Git e GitHub
echo ========================================
echo.

:: Verificar se Git já está instalado
echo 📋 Verificando se Git está instalado...
git --version >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Git já está instalado!
    git --version
) else (
    echo ❌ Git não encontrado. Instalando...
    echo.
    echo 🔧 Instalando Git via winget...
    winget install --id Git.Git -e --source winget
    if %errorlevel% equ 0 (
        echo ✅ Git instalado com sucesso!
        echo 🔄 Reiniciando terminal para aplicar mudanças...
        echo.
        echo ⚠️  Por favor, feche este terminal e abra um novo para continuar.
        pause
        exit
    ) else (
        echo ❌ Erro ao instalar Git via winget.
        echo.
        echo 📥 Instale manualmente em: https://git-scm.com/download/win
        pause
        exit /b 1
    )
)

echo.
echo ========================================
echo 🔧 Configuração do Git
echo ========================================
echo.

:: Configurar Git
echo 📝 Configurando Git...
echo.
set /p GIT_NAME="Digite seu nome completo: "
set /p GIT_EMAIL="Digite seu email: "

git config --global user.name "%GIT_NAME%"
git config --global user.email "%GIT_EMAIL%"
git config --global init.defaultBranch main
git config --global core.autocrlf true

echo ✅ Git configurado com sucesso!
echo.

:: Verificar se repositório já está inicializado
if exist ".git" (
    echo ✅ Repositório Git já inicializado!
) else (
    echo 🔧 Inicializando repositório Git...
    git init
    echo ✅ Repositório inicializado!
)

echo.
echo ========================================
echo 📦 Preparando primeiro commit
echo ========================================
echo.

:: Adicionar arquivos
echo 📁 Adicionando arquivos ao Git...
git add .

:: Verificar se há mudanças para commitar
git diff --cached --quiet
if %errorlevel% equ 0 (
    echo ℹ️  Nenhuma mudança para commitar.
) else (
    echo 💾 Fazendo primeiro commit...
    git commit -m "🎉 Initial commit: Traffic Manager Hub"
    echo ✅ Primeiro commit realizado!
)

echo.
echo ========================================
echo 🌐 Configuração GitHub
echo ========================================
echo.

:: Verificar GitHub CLI
echo 📋 Verificando GitHub CLI...
gh --version >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ GitHub CLI já está instalado!
) else (
    echo 🔧 Instalando GitHub CLI...
    winget install --id GitHub.cli -e --source winget
    if %errorlevel% equ 0 (
        echo ✅ GitHub CLI instalado!
        echo 🔄 Reiniciando terminal...
        pause
        exit
    ) else (
        echo ❌ Erro ao instalar GitHub CLI.
        echo 📥 Instale manualmente: https://cli.github.com/
    )
)

echo.
echo ========================================
echo 🎯 Próximos Passos
echo ========================================
echo.
echo 1️⃣  Faça login no GitHub CLI:
echo     gh auth login
echo.
echo 2️⃣  Crie o repositório no GitHub:
echo     gh repo create traffic-manager-hub --public --description "Plataforma Inteligente para Gestores de Tráfego"
echo.
echo 3️⃣  Faça o push inicial:
echo     git push -u origin main
echo.
echo 4️⃣  Configure branches protegidas no GitHub.com
echo.
echo 📚 Consulte o arquivo GUIA-CONFIGURACAO-GITHUB.md para mais detalhes.
echo.

pause

