@echo off
echo ========================================
echo    TESTE DA API DE CLIENTES
echo ========================================
echo.

echo Testando se o backend esta respondendo...
powershell -Command "try { $response = Invoke-RestMethod -Uri 'http://localhost:3001/api/clientes' -Method GET; Write-Host 'API Clientes OK:' $response } catch { Write-Host 'API Clientes ERROR:' $_.Exception.Message }"

echo.
echo ========================================
echo    TESTE CONCLUIDO!
echo ========================================
pause


