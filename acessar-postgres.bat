@echo off
echo ========================================
echo    ACESSO RAPIDO AO POSTGRESQL
echo ========================================
echo.
echo Conectando ao PostgreSQL...
echo.

"C:\Program Files\PostgreSQL\17\bin\psql.exe" -U postgres -d traffic_manager_hub

echo.
echo Conexao encerrada.
pause


