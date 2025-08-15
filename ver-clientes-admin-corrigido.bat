@echo off
echo ========================================
echo    CLIENTES DO USUARIO ADMIN
echo ========================================
echo.

set PGPASSWORD=Larissa23!

echo Verificando clientes do usuario admin...
"C:\Program Files\PostgreSQL\17\bin\psql.exe" -U postgres -d traffic_manager_hub -c "SELECT c.id, c.nome, c.email, c.\"userId\", u.email as user_email FROM clientes c JOIN users u ON c.\"userId\" = u.id;"

echo.
echo ========================================
echo    VERIFICACAO CONCLUIDA!
echo ========================================
pause


