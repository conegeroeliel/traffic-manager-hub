@echo off
echo 🔄 Reiniciando servidor rapidamente...
echo.

cd /d "%~dp0"

echo ✅ Parando processos na porta 3001...
for /f "tokens=5" %%a in ('netstat -aon ^| find ":3001" ^| find "LISTENING"') do taskkill /f /pid %%a >nul 2>&1

echo ✅ Aguardando 2 segundos...
timeout /t 2 /nobreak >nul

echo 🚀 Iniciando servidor...
echo.
echo 📋 Credenciais de teste:
echo    Email: admin@teste.com
echo    Senha: 123456
echo.
echo 🌍 URLs:
echo    Backend: http://localhost:3001
echo    Frontend: http://localhost:3000
echo    Health: http://localhost:3001/health
echo.

npm run dev