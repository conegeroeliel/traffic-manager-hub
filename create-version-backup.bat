@echo off
echo.
echo ==========================================
echo   Traffic Manager Hub - Backup Versão
echo ==========================================
echo.

set VERSION=%1
if "%VERSION%"=="" set VERSION=1.0.0

set BACKUP_DIR=versions\v%VERSION%
set DATE_TIME=%date:~-4,4%%date:~-10,2%%date:~-7,2%_%time:~0,2%%time:~3,2%%time:~6,2%
set DATE_TIME=%DATE_TIME: =0%

echo 📦 Criando backup da versão %VERSION%...
echo 📁 Diretório: %BACKUP_DIR%
echo 📅 Data/Hora: %DATE_TIME%
echo.

REM Criar diretório de versões
if not exist "versions" mkdir "versions"
if not exist "%BACKUP_DIR%" mkdir "%BACKUP_DIR%"

echo ✅ Copiando arquivos principais...
copy "package.json" "%BACKUP_DIR%\" >nul
copy "README.md" "%BACKUP_DIR%\" >nul
copy "CHANGELOG.md" "%BACKUP_DIR%\" >nul
copy "VERSION.md" "%BACKUP_DIR%\" >nul
copy "tsconfig.json" "%BACKUP_DIR%\" >nul
copy "tailwind.config.ts" "%BACKUP_DIR%\" >nul
copy "next.config.js" "%BACKUP_DIR%\" >nul

echo ✅ Copiando src...
if not exist "%BACKUP_DIR%\src" mkdir "%BACKUP_DIR%\src"
xcopy "src" "%BACKUP_DIR%\src" /E /I /Q >nul

echo ✅ Copiando backend...
if not exist "%BACKUP_DIR%\backend" mkdir "%BACKUP_DIR%\backend"
xcopy "backend" "%BACKUP_DIR%\backend" /E /I /Q /EXCLUDE:backup-exclude.txt >nul

echo ✅ Criando arquivo de versão...
echo # Backup Versão %VERSION% > "%BACKUP_DIR%\VERSAO_INFO.txt"
echo Data/Hora: %DATE_TIME% >> "%BACKUP_DIR%\VERSAO_INFO.txt"
echo Status: Backup automático >> "%BACKUP_DIR%\VERSAO_INFO.txt"
echo. >> "%BACKUP_DIR%\VERSAO_INFO.txt"
echo ## Conteúdo: >> "%BACKUP_DIR%\VERSAO_INFO.txt"
echo - Frontend completo (src/) >> "%BACKUP_DIR%\VERSAO_INFO.txt"
echo - Backend completo (backend/) >> "%BACKUP_DIR%\VERSAO_INFO.txt"
echo - Configurações (package.json, configs) >> "%BACKUP_DIR%\VERSAO_INFO.txt"
echo - Documentação (README, CHANGELOG) >> "%BACKUP_DIR%\VERSAO_INFO.txt"

echo ✅ Criando script de restore...
echo @echo off > "%BACKUP_DIR%\restore-version.bat"
echo echo Restaurando versão %VERSION%... >> "%BACKUP_DIR%\restore-version.bat"
echo xcopy "src" "..\..\src" /E /I /Y ^>nul >> "%BACKUP_DIR%\restore-version.bat"
echo xcopy "backend" "..\..\backend" /E /I /Y ^>nul >> "%BACKUP_DIR%\restore-version.bat"
echo copy "package.json" "..\..\package.json" /Y ^>nul >> "%BACKUP_DIR%\restore-version.bat"
echo copy "README.md" "..\..\README.md" /Y ^>nul >> "%BACKUP_DIR%\restore-version.bat"
echo echo Versão %VERSION% restaurada com sucesso! >> "%BACKUP_DIR%\restore-version.bat"
echo pause >> "%BACKUP_DIR%\restore-version.bat"

echo.
echo 🎉 Backup da versão %VERSION% criado com sucesso!
echo.
echo 📁 Localização: %BACKUP_DIR%
echo 📋 Arquivos incluídos:
echo    - Frontend (src/)
echo    - Backend (backend/)  
echo    - Configurações
echo    - Documentação
echo    - Script de restore
echo.
echo 🔄 Para restaurar: execute restore-version.bat dentro da pasta da versão
echo.
pause