@echo off
echo ========================================
echo    TESTE CLIENTES COM TOKEN
echo ========================================
echo.

echo Testando login e depois clientes...
powershell -Command "try { $body = '{\"email\":\"admin@trafficmanager.com\",\"senha\":\"admin123\"}'; $loginResponse = Invoke-RestMethod -Uri 'http://localhost:3001/api/auth/login' -Method POST -Body $body -ContentType 'application/json'; Write-Host 'Login OK:' $loginResponse.success; Write-Host 'Token:' $loginResponse.data.token; $headers = @{Authorization='Bearer ' + $loginResponse.data.token}; $clientesResponse = Invoke-RestMethod -Uri 'http://localhost:3001/api/clientes' -Method GET -Headers $headers; Write-Host 'Clientes OK:' $clientesResponse.success; Write-Host 'Quantidade:' $clientesResponse.data.Count; Write-Host 'Primeiro cliente:' $clientesResponse.data[0].nome } catch { Write-Host 'ERROR:' $_.Exception.Message }"

echo.
echo ========================================
echo    TESTE CONCLUIDO!
echo ========================================
pause


