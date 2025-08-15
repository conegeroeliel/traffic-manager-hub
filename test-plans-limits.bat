@echo off
echo ========================================
echo    TESTE PLANS/LIMITS
echo ========================================
echo.

echo Testando API de plans/limits...
powershell -Command "try { $body = '{\"email\":\"admin@trafficmanager.com\",\"senha\":\"admin123\"}'; $loginResponse = Invoke-RestMethod -Uri 'http://localhost:3001/api/auth/login' -Method POST -Body $body -ContentType 'application/json'; Write-Host 'Login OK:' $loginResponse.success; $headers = @{Authorization='Bearer ' + $loginResponse.data.token}; $limitsResponse = Invoke-RestMethod -Uri 'http://localhost:3001/api/plans/limits' -Method GET -Headers $headers; Write-Host 'Limits OK:' $limitsResponse.success; Write-Host 'Plano:' $limitsResponse.data.plano; Write-Host 'Uso clientes:' $limitsResponse.data.uso.clientes } catch { Write-Host 'ERROR:' $_.Exception.Message }"

echo.
echo ========================================
echo    TESTE CONCLUIDO!
echo ========================================
pause


