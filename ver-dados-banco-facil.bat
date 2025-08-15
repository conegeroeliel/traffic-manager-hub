@echo off
echo ========================================
echo    VISUALIZAR DADOS DO BANCO
echo ========================================
echo.

echo 1. Ver usuarios...
echo Larissa23! | "C:\Program Files\PostgreSQL\17\bin\psql.exe" -U postgres -d traffic_manager_hub -c "SELECT id, email, plano, statusPagamento FROM \"User\" LIMIT 5;"

echo.
echo 2. Ver clientes...
echo Larissa23! | "C:\Program Files\PostgreSQL\17\bin\psql.exe" -U postgres -d traffic_manager_hub -c "SELECT id, nome, email, telefone FROM \"Cliente\" LIMIT 5;"

echo.
echo 3. Ver tarefas...
echo Larissa23! | "C:\Program Files\PostgreSQL\17\bin\psql.exe" -U postgres -d traffic_manager_hub -c "SELECT id, titulo, status, prioridade FROM \"Tarefa\" LIMIT 5;"

echo.
echo 4. Ver reunioes...
echo Larissa23! | "C:\Program Files\PostgreSQL\17\bin\psql.exe" -U postgres -d traffic_manager_hub -c "SELECT id, titulo, dataReuniao, status FROM \"Reuniao\" LIMIT 5;"

echo.
echo 5. Ver diagnosticos...
echo Larissa23! | "C:\Program Files\PostgreSQL\17\bin\psql.exe" -U postgres -d traffic_manager_hub -c "SELECT id, titulo, status, dataCriacao FROM \"Diagnostico\" LIMIT 5;"

echo.
echo ========================================
echo    DADOS EXIBIDOS COM SUCESSO!
echo ========================================
pause


