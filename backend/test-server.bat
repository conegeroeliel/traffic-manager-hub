@echo off
echo.
echo ========================================
echo   Testando Servidor Backend
echo ========================================
echo.

cd /d "%~dp0"

echo 🔍 Testando health check...
echo.

powershell -Command "try { $response = Invoke-WebRequest -Uri 'http://localhost:3001/health' -Method GET -TimeoutSec 5; Write-Host '✅ Servidor está funcionando!' -ForegroundColor Green; Write-Host 'Status:' $response.StatusCode; Write-Host 'Resposta:' $response.Content } catch { Write-Host '❌ Servidor não está respondendo' -ForegroundColor Red; Write-Host 'Erro:' $_.Exception.Message }"

echo.
echo 🧪 Testando endpoint de autenticação...
echo.

powershell -Command "try { $response = Invoke-WebRequest -Uri 'http://localhost:3001/api/auth/me' -Method GET -TimeoutSec 5; Write-Host '✅ Endpoint de auth acessível!' -ForegroundColor Green } catch { if ($_.Exception.Response.StatusCode -eq 401) { Write-Host '✅ Endpoint protegido funcionando (401 Unauthorized esperado)' -ForegroundColor Yellow } else { Write-Host '❌ Erro inesperado:' $_.Exception.Message -ForegroundColor Red } }"

echo.
echo ===== RESUMO =====
echo 🚀 Para iniciar o servidor: start-server.bat
echo 📚 Documentação: README.md
echo 🌍 URL Base: http://localhost:3001
echo.

pause