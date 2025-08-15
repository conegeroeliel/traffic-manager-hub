@echo off
echo ========================================
echo    TESTE DA API DE CLIENTES
echo ========================================
echo.

echo Testando se o backend esta respondendo...
powershell -Command "try { $response = Invoke-RestMethod -Uri 'http://localhost:3001/api/health' -Method GET; Write-Host 'Backend OK:' $response } catch { Write-Host 'Backend ERROR:' $_.Exception.Message }"

echo.
echo ========================================
echo    TESTE CONCLUIDO!
echo ========================================
pause


