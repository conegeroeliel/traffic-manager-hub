@echo off
echo ========================================
echo    TESTE SIMPLES DE LOGIN
echo ========================================
echo.

echo Testando login simples...
powershell -Command "try { $body = '{\"email\":\"admin@trafficmanager.com\",\"senha\":\"admin123\"}'; $response = Invoke-RestMethod -Uri 'http://localhost:3001/api/auth/login' -Method POST -Body $body -ContentType 'application/json'; Write-Host 'Login OK:' $response.success } catch { Write-Host 'Login ERROR:' $_.Exception.Message; Write-Host 'Response:' $_.Exception.Response }"

echo.
echo ========================================
echo    TESTE CONCLUIDO!
echo ========================================
pause


