@echo off
echo 🔄 Reiniciando frontend rapidamente...
echo.

cd /d "%~dp0"

echo ✅ Parando processos na porta 3000...
for /f "tokens=5" %%a in ('netstat -aon ^| find ":3000" ^| find "LISTENING"') do taskkill /f /pid %%a >nul 2>&1

echo ✅ Aguardando 2 segundos...
timeout /t 2 /nobreak >nul

echo 🚀 Iniciando frontend...
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
