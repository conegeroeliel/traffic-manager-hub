@echo off
echo.
echo =========================================
echo   Traffic Manager Hub - Backend Server
echo =========================================
echo.
echo 🚀 Iniciando servidor backend...
echo.

cd /d "%~dp0"

echo ✅ Verificando dependencias...
if not exist "node_modules" (
    echo 📦 Instalando dependencias...
    npm install
)

echo.
echo ✅ Iniciando servidor em modo desenvolvimento...
echo 🌍 Servidor: http://localhost:3001
echo 🔍 Health Check: http://localhost:3001/health
echo 📱 Frontend: http://localhost:3000
echo.
echo ⚠️  Para parar o servidor, pressione Ctrl+C
echo.

npm run dev

echo.
echo ❌ Servidor foi interrompido
pause