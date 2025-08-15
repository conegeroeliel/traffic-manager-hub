@echo off
echo.
echo ==========================================
echo   Traffic Manager Hub - Full Stack
echo ==========================================
echo.

cd /d "%~dp0"

echo 🚀 Iniciando aplicação completa...
echo.

echo ✅ 1. Parando processos existentes...
for /f "tokens=5" %%a in ('netstat -aon ^| find ":3000" ^| find "LISTENING"') do taskkill /f /pid %%a >nul 2>&1
for /f "tokens=5" %%a in ('netstat -aon ^| find ":3001" ^| find "LISTENING"') do taskkill /f /pid %%a >nul 2>&1

echo ✅ 2. Aguardando 3 segundos...
timeout /t 3 /nobreak >nul

echo ✅ 3. Iniciando backend em nova janela...
start "Backend - Traffic Manager Hub" cmd /k "cd /d %~dp0backend && quick-restart.bat"

echo ✅ 4. Aguardando backend inicializar...
timeout /t 5 /nobreak >nul

echo ✅ 5. Iniciando frontend...
echo.
echo 📋 Informações:
echo    Frontend: http://localhost:3000
echo    Backend:  http://localhost:3001
echo.
echo 🔧 Comandos úteis:
echo    Ctrl+C - Parar servidor
echo    R      - Recarregar página
echo.
echo 🌍 Acesse: http://localhost:3000
echo.

npm run dev
