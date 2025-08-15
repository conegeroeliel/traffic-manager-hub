@echo off
echo ========================================
echo    TESTE DA ROTA HEALTH
echo ========================================
echo.

echo Testando rota health do backend...
powershell -Command "try { $response = Invoke-RestMethod -Uri 'http://localhost:3001/health' -Method GET; Write-Host 'Health OK:' $response } catch { Write-Host 'Health ERROR:' $_.Exception.Message }"

echo.
echo ========================================
echo    TESTE CONCLUIDO!
echo ========================================
pause


