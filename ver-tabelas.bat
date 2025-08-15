@echo off
echo ========================================
echo    LISTAR TABELAS DO BANCO
echo ========================================
echo.

set PGPASSWORD=Larissa23!

echo Listando todas as tabelas...
"C:\Program Files\PostgreSQL\17\bin\psql.exe" -U postgres -d traffic_manager_hub -c "\dt"

echo.
echo ========================================
echo    TABELAS LISTADAS!
echo ========================================
pause


