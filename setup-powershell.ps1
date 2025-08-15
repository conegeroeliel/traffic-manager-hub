# Traffic Manager Hub - PowerShell Setup Script
# Versão: 1.0.0
# Configura o PowerShell para uso com o projeto

param(
    [switch]$Help,
    [switch]$CheckOnly,
    [switch]$Force
)

# Configurações
$ErrorActionPreference = "Stop"
$ProgressPreference = "SilentlyContinue"

# Função para exibir ajuda
function Show-Help {
    Write-Host @"
==========================================
   Traffic Manager Hub - PowerShell Setup
==========================================

Uso: .\setup-powershell.ps1 [opções]

Opções:
  -Help          Exibir esta ajuda
  -CheckOnly     Apenas verificar configurações (não alterar)
  -Force         Forçar alterações sem confirmação

Este script configura o PowerShell para uso com o projeto:
- Verifica versão do PowerShell
- Configura política de execução
- Testa funcionalidades necessárias
- Verifica permissões

"@ -ForegroundColor Cyan
}

# Função para verificar versão do PowerShell
function Test-PowerShellVersion {
    Write-Host "[VERIFICAR] Verificando versão do PowerShell..." -ForegroundColor Yellow
    
    $psVersion = $PSVersionTable.PSVersion
    $psEditionName = $PSVersionTable.PSEdition
    
    Write-Host "[OK] PowerShell $psVersion ($psEditionName)" -ForegroundColor Green
    
    # Verificar se é versão mínima
    if ($psVersion.Major -lt 5) {
        Write-Host "[ERRO] Versão do PowerShell muito antiga!" -ForegroundColor Red
        Write-Host "[INFO] Recomendado: PowerShell 5.1+ ou PowerShell Core 7+" -ForegroundColor Yellow
        return $false
    }
    
    return $true
}

# Função para verificar política de execução
function Test-ExecutionPolicy {
    Write-Host "[VERIFICAR] Verificando política de execução..." -ForegroundColor Yellow
    
    $currentPolicy = Get-ExecutionPolicy
    Write-Host "[INFO] Política atual: $currentPolicy" -ForegroundColor Cyan
    
    # Verificar se permite execução de scripts
    $allowedPolicies = @("Unrestricted", "RemoteSigned", "AllSigned")
    
    if ($currentPolicy -in $allowedPolicies) {
        Write-Host "[OK] Política de execução adequada" -ForegroundColor Green
        return $true
    }
    else {
        Write-Host "[ERRO] Política de execução restritiva: $currentPolicy" -ForegroundColor Red
        Write-Host "[INFO] Necessário: RemoteSigned ou Unrestricted" -ForegroundColor Yellow
        return $false
    }
}

# Função para configurar política de execução
function Set-ExecutionPolicy {
    param([switch]$Force)
    
    Write-Host "[CONFIGURAR] Configurando política de execução..." -ForegroundColor Yellow
    
    try {
        if ($Force) {
            Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser -Force
        }
        else {
            $response = Read-Host "Deseja alterar a política para RemoteSigned? (S/N)"
            if ($response -eq "S" -or $response -eq "s") {
                Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
            }
            else {
                Write-Host "[AVISO] Política não alterada" -ForegroundColor Yellow
                return $false
            }
        }
        
        Write-Host "[OK] Política configurada com sucesso!" -ForegroundColor Green
        return $true
    }
    catch {
        Write-Host "[ERRO] Erro ao configurar política: $($_.Exception.Message)" -ForegroundColor Red
        return $false
    }
}

# Função para testar funcionalidades
function Test-Functionality {
    Write-Host "[TEST] Testando funcionalidades..." -ForegroundColor Yellow
    
    $tests = @{
        "Invoke-WebRequest" = { try { Invoke-WebRequest -Uri "https://httpbin.org/get" -Method GET -TimeoutSec 5 | Out-Null; $true } catch { $false } }
        "Get-NetTCPConnection" = { try { Get-NetTCPConnection -ErrorAction SilentlyContinue | Out-Null; $true } catch { $false } }
        "Get-Process" = { try { Get-Process | Out-Null; $true } catch { $false } }
        "Start-Process" = { try { Start-Process -FilePath "cmd" -ArgumentList "/c", "echo test" -WindowStyle Hidden -PassThru | Stop-Process -Force; $true } catch { $false } }
    }
    
    $allTestsPassed = $true
    
    foreach ($test in $tests.GetEnumerator()) {
        $result = & $test.Value
        if ($result) {
            Write-Host "[OK] $($test.Key)" -ForegroundColor Green
        }
        else {
            Write-Host "[ERRO] $($test.Key)" -ForegroundColor Red
            $allTestsPassed = $false
        }
    }
    
    return $allTestsPassed
}

# Função para verificar permissões
function Test-Permissions {
    Write-Host "[VERIFICAR] Verificando permissões..." -ForegroundColor Yellow
    
    # Verificar se é administrador
    $isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole] "Administrator")
    
    if ($isAdmin) {
        Write-Host "[OK] Executando como administrador" -ForegroundColor Green
    }
    else {
        Write-Host "[AVISO] Não executando como administrador" -ForegroundColor Yellow
        Write-Host "[INFO] Algumas configurações podem requerer privilégios de administrador" -ForegroundColor Yellow
    }
    
    # Verificar permissões de escrita no diretório atual
    try {
        $testFile = "test-permissions.tmp"
        New-Item -ItemType File -Name $testFile -Force | Out-Null
        Remove-Item $testFile -Force
        Write-Host "[OK] Permissões de escrita OK" -ForegroundColor Green
    }
    catch {
        Write-Host "[ERRO] Sem permissões de escrita no diretório atual" -ForegroundColor Red
        return $false
    }
    
    return $true
}

# Função para testar scripts do projeto
function Test-ProjectScripts {
    Write-Host "[TEST] Testando scripts do projeto..." -ForegroundColor Yellow
    
    $scripts = @("start-server.ps1", "start-frontend.ps1", "start-full-stack.ps1")
    $allScriptsExist = $true
    
    foreach ($script in $scripts) {
        if (Test-Path $script) {
            Write-Host "[OK] $script" -ForegroundColor Green
        }
        else {
            Write-Host "[ERRO] $script (não encontrado)" -ForegroundColor Red
            $allScriptsExist = $false
        }
    }
    
    return $allScriptsExist
}

# Função principal
function Start-PowerShellSetup {
    Write-Host @"
==========================================
   Traffic Manager Hub - PowerShell Setup
==========================================

"@ -ForegroundColor Cyan
    
    # Verificar argumentos
    if ($Help) {
        Show-Help
        return
    }
    
    $setupNeeded = $false
    $setupSuccessful = $true
    
    # Verificar versão do PowerShell
    if (-not (Test-PowerShellVersion)) {
        $setupNeeded = $true
        $setupSuccessful = $false
    }
    
    # Verificar política de execução
    if (-not (Test-ExecutionPolicy)) {
        $setupNeeded = $true
        if (-not $CheckOnly) {
            if (-not (Set-ExecutionPolicy -Force:$Force)) {
                $setupSuccessful = $false
            }
        }
    }
    
    # Verificar funcionalidades
    if (-not (Test-Functionality)) {
        Write-Host "[ERRO] Algumas funcionalidades necessárias não estão disponíveis" -ForegroundColor Red
        $setupSuccessful = $false
    }
    
    # Verificar permissões
    if (-not (Test-Permissions)) {
        Write-Host "[ERRO] Problemas com permissões" -ForegroundColor Red
        $setupSuccessful = $false
    }
    
    # Verificar scripts do projeto
    if (-not (Test-ProjectScripts)) {
        Write-Host "[ERRO] Alguns scripts do projeto não foram encontrados" -ForegroundColor Red
        $setupSuccessful = $false
    }
    
    # Resumo
    Write-Host ""
    Write-Host "==========================================" -ForegroundColor Cyan
    Write-Host "   RESUMO DA CONFIGURAÇÃO" -ForegroundColor Cyan
    Write-Host "==========================================" -ForegroundColor Cyan
    
    if ($setupSuccessful) {
        Write-Host "[OK] PowerShell configurado corretamente!" -ForegroundColor Green
        Write-Host ""
        Write-Host "[INICIAR] Agora você pode usar os scripts:" -ForegroundColor Green
        Write-Host "   .\start-server.ps1" -ForegroundColor Cyan
        Write-Host "   .\start-frontend.ps1" -ForegroundColor Cyan
        Write-Host "   .\start-full-stack.ps1" -ForegroundColor Cyan
    }
    else {
        Write-Host "[ERRO] Configuração incompleta" -ForegroundColor Red
        if ($CheckOnly) {
            Write-Host "[INFO] Execute sem -CheckOnly para corrigir automaticamente" -ForegroundColor Yellow
        }
        else {
            Write-Host "[INFO] Verifique os erros acima e tente novamente" -ForegroundColor Yellow
        }
    }
    
    Write-Host ""
}

# Executar função principal
Start-PowerShellSetup
