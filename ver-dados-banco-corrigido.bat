@echo off
echo ========================================
echo    VISUALIZAR DADOS DO BANCO
echo ========================================
echo.

set PGPASSWORD=Larissa23!

echo 1. Ver usuarios...
"C:\Program Files\PostgreSQL\17\bin\psql.exe" -U postgres -d traffic_manager_hub -c "SELECT id, email, plano, statusPagamento FROM users LIMIT 5;"

echo.
echo 2. Ver clientes...
"C:\Program Files\PostgreSQL\17\bin\psql.exe" -U postgres -d traffic_manager_hub -c "SELECT id, nome, email, telefone FROM clientes LIMIT 5;"

echo.
echo 3. Ver tarefas...
"C:\Program Files\PostgreSQL\17\bin\psql.exe" -U postgres -d traffic_manager_hub -c "SELECT id, titulo, status, prioridade FROM tarefas LIMIT 5;"

echo.
echo 4. Ver reunioes...
"C:\Program Files\PostgreSQL\17\bin\psql.exe" -U postgres -d traffic_manager_hub -c "SELECT id, titulo, dataReuniao, status FROM reunioes LIMIT 5;"

echo.
echo 5. Ver diagnosticos...
"C:\Program Files\PostgreSQL\17\bin\psql.exe" -U postgres -d traffic_manager_hub -c "SELECT id, titulo, status, dataCriacao FROM diagnosticos LIMIT 5;"

echo.
echo ========================================
echo    DADOS EXIBIDOS COM SUCESSO!
echo ========================================
pause


