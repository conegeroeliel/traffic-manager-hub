@echo off
echo.
echo ==========================================
echo   Traffic Manager Hub - Gerenciador de Versões
echo ==========================================
echo.

if "%1"=="backup" goto backup
if "%1"=="list" goto list
if "%1"=="restore" goto restore
if "%1"=="current" goto current

:menu
echo 📋 Opções disponíveis:
echo.
echo 1. backup [versao]    - Criar backup da versão atual
echo 2. list              - Listar versões disponíveis  
echo 3. restore [versao]  - Restaurar uma versão
echo 4. current           - Mostrar versão atual
echo.
echo Exemplos:
echo   version-manager.bat backup 1.0.0
echo   version-manager.bat list
echo   version-manager.bat restore 1.0.0
echo   version-manager.bat current
echo.
goto end

:backup
set VERSION=%2
if "%VERSION%"=="" set VERSION=1.0.0
echo 📦 Criando backup da versão %VERSION%...
call create-version-backup.bat %VERSION%
goto end

:list
echo 📁 Versões disponíveis:
echo.
if exist "versions" (
    dir "versions" /B /AD
    echo.
    echo 💡 Para mais detalhes de uma versão, veja o arquivo VERSAO_INFO.txt na pasta
) else (
    echo ❌ Nenhuma versão encontrada
    echo 💡 Use: version-manager.bat backup 1.0.0
)
echo.
goto end

:restore
set VERSION=%2
if "%VERSION%"=="" (
    echo ❌ Erro: Especifique a versão a restaurar
    echo 💡 Exemplo: version-manager.bat restore 1.0.0
    goto end
)
if exist "versions\v%VERSION%\restore-version.bat" (
    echo 🔄 Restaurando versão %VERSION%...
    cd "versions\v%VERSION%"
    call restore-version.bat
    cd ..\..
) else (
    echo ❌ Versão %VERSION% não encontrada
    echo 📁 Versões disponíveis:
    dir "versions" /B /AD 2>nul || echo Nenhuma versão disponível
)
goto end

:current
echo 📊 Versão atual do projeto:
echo.
if exist "VERSION.md" (
    findstr /C:"Versão:" VERSION.md
    findstr /C:"Data:" VERSION.md  
    findstr /C:"Status:" VERSION.md
) else (
    if exist "package.json" (
        findstr /C:"version" package.json
    ) else (
        echo ❌ Arquivo de versão não encontrado
    )
)
echo.
goto end

:end
echo.
pause