@echo off
echo.
echo ==========================================
echo   Traffic Manager Hub - Teste Frontend
echo ==========================================
echo.

cd /d "%~dp0"

echo 🔍 Testando frontend...
echo.

echo ✅ 1. Verificando se o servidor está rodando na porta 3000...
netstat -an | find ":3000" | find "LISTENING" >nul
if %errorlevel% equ 0 (
    echo ✅ Frontend está rodando na porta 3000
) else (
    echo ❌ Frontend não está rodando na porta 3000
    echo    Execute: quick-restart-frontend.bat
    pause
    exit /b 1
)

echo.
echo ✅ 2. Testando conexão com o servidor...
curl -s -o nul -w "HTTP Status: %%{http_code}\n" http://localhost:3000
if %errorlevel% equ 0 (
    echo ✅ Frontend responde corretamente
) else (
    echo ❌ Erro ao conectar com o frontend
)

echo.
echo ✅ 3. Verificando estrutura de arquivos...
if exist "src\app\layout.tsx" (
    echo ✅ Layout principal encontrado
) else (
    echo ❌ Layout principal não encontrado
)

if exist "src\app\page.tsx" (
    echo ✅ Página principal encontrada
) else (
    echo ❌ Página principal não encontrada
)

if exist "src\app\globals.css" (
    echo ✅ Estilos globais encontrados
) else (
    echo ❌ Estilos globais não encontrados
)

echo.
echo ✅ 4. Verificando dependencias...
if exist "node_modules" (
    echo ✅ node_modules encontrado
) else (
    echo ❌ node_modules não encontrado
    echo    Execute: npm install
)

echo.
echo 🌍 URLs de teste:
echo    Frontend: http://localhost:3000
echo    Login:    http://localhost:3000/login
echo    Dashboard: http://localhost:3000/dashboard
echo.
echo 🔧 Comandos úteis:
echo    quick-restart-frontend.bat - Reiniciar frontend
echo    npm run build             - Compilar para produção
echo    npm run lint              - Verificar código
echo.

pause
