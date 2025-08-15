@echo off
echo.
echo ==========================================
echo   Traffic Manager Hub - Setup Completo
echo ==========================================
echo.

cd /d "%~dp0"

echo 🔧 Executando setup automatico...
echo.

echo ✅ 1. Verificando estrutura...
node scripts/test-structure.js

echo.
echo ✅ 2. Instalando dependencias...
npm install

echo.
echo ✅ 3. Configurando ambiente...
node scripts/setup.js

echo.
echo 🎉 Setup concluido com sucesso!
echo.
echo ===== PRÓXIMOS PASSOS =====
echo.
echo 1. Configure suas chaves no arquivo .env:
echo    - OPENAI_API_KEY (sua chave da OpenAI)
echo    - DATABASE_URL (sua URL do PostgreSQL)
echo.
echo 2. Execute o servidor:
echo    start-server.bat
echo.
echo 3. Teste o servidor:
echo    test-server.bat
echo.
echo ===== COMANDOS ÚTEIS =====
echo.
echo start-server.bat  - Iniciar servidor
echo test-server.bat   - Testar servidor
echo npm run build     - Compilar TypeScript
echo npm run lint      - Verificar codigo
echo.

pause