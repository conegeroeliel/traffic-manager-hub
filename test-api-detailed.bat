@echo off
echo ========================================
echo    TESTE DETALHADO DA API
echo ========================================
echo.

echo Testando login...
powershell -Command "try { $loginBody = @{email='admin@trafficmanager.com';password='admin123'} | ConvertTo-Json; $loginResponse = Invoke-RestMethod -Uri 'http://localhost:3001/api/auth/login' -Method POST -Body $loginBody -ContentType 'application/json'; Write-Host 'Login OK:' $loginResponse.success; Write-Host 'Token:' $loginResponse.token } catch { Write-Host 'Login ERROR:' $_.Exception.Message }"

echo.
echo Testando API de clientes...
powershell -Command "try { $loginBody = @{email='admin@trafficmanager.com';password='admin123'} | ConvertTo-Json; $loginResponse = Invoke-RestMethod -Uri 'http://localhost:3001/api/auth/login' -Method POST -Body $loginBody -ContentType 'application/json'; $headers = @{Authorization='Bearer ' + $loginResponse.token}; $clientesResponse = Invoke-RestMethod -Uri 'http://localhost:3001/api/clientes' -Method GET -Headers $headers; Write-Host 'Clientes OK:' $clientesResponse.success; Write-Host 'Quantidade:' $clientesResponse.data.Count; Write-Host 'Dados:' $clientesResponse.data } catch { Write-Host 'Clientes ERROR:' $_.Exception.Message }"

echo.
echo ========================================
echo    TESTE CONCLUIDO!
echo ========================================
pause


