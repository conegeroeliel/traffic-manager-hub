@echo off
echo ========================================
echo    VERIFICAR USUARIO ADMIN
echo ========================================
echo.

set PGPASSWORD=Larissa23!

echo Verificando usuario admin...
"C:\Program Files\PostgreSQL\17\bin\psql.exe" -U postgres -d traffic_manager_hub -c "SELECT id, email, nome, plano, \"ultimoLogin\" FROM users WHERE email = 'admin@trafficmanager.com';"

echo.
echo ========================================
echo    VERIFICACAO CONCLUIDA!
echo ========================================
pause


