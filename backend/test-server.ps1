# Traffic Manager Hub - Backend Test Script
# Versão: 1.0.0
# Testa o servidor backend

param(
    [switch]$Help,
    [string]$Port = "3001",
    [switch]$Detailed
)

# Configurações
$ErrorActionPreference = "Stop"
$ProgressPreference = "SilentlyContinue"

# Função para exibir ajuda
function Show-Help {
    Write-Host @"
==========================================
   Traffic Manager Hub - Backend Test
==========================================

Uso: .\test-server.ps1 [opções]

Opções:
  -Help          Exibir esta ajuda
  -Port <num>    Porta do servidor (padrão: 3001)
  -Detailed      Exibir informações detalhadas

"@ -ForegroundColor Cyan
}

# Função para testar health check
function Test-HealthCheck {
    Write-Host "[VERIFICAR] Testando health check..." -ForegroundColor Yellow
    
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:$Port/health" -Method GET -TimeoutSec 10
        Write-Host "[OK] Servidor está funcionando!" -ForegroundColor Green
        Write-Host "[STATUS] Status: $($response.StatusCode)" -ForegroundColor Cyan
        
        if ($Detailed) {
            Write-Host "[RESPOSTA] Resposta: $($response.Content)" -ForegroundColor Gray
        }
        
        return $true
    }
    catch {
        Write-Host "[ERRO] Servidor não está respondendo" -ForegroundColor Red
        Write-Host "[INFO] Erro: $($_.Exception.Message)" -ForegroundColor Yellow
        return $false
    }
}

# Função para testar endpoint de autenticação
function Test-AuthEndpoint {
    Write-Host "[VERIFICAR] Testando endpoint de autenticação..." -ForegroundColor Yellow
    
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:$Port/api/auth/me" -Method GET -TimeoutSec 10
        Write-Host "[OK] Endpoint de auth acessível!" -ForegroundColor Green
        Write-Host "[STATUS] Status: $($response.StatusCode)" -ForegroundColor Cyan
        return $true
    }
    catch {
        if ($_.Exception.Response.StatusCode -eq 401) {
            Write-Host "[OK] Endpoint protegido funcionando (401 Unauthorized esperado)" -ForegroundColor Yellow
            return $true
        }
        else {
            Write-Host "[ERRO] Erro inesperado: $($_.Exception.Message)" -ForegroundColor Red
            return $false
        }
    }
}

# Função para testar conectividade
function Test-Connectivity {
    Write-Host "[VERIFICAR] Testando conectividade..." -ForegroundColor Yellow
    
    try {
        $tcpClient = New-Object System.Net.Sockets.TcpClient
        $tcpClient.Connect("localhost", $Port)
        $tcpClient.Close()
        Write-Host "[OK] Porta $Port está acessível" -ForegroundColor Green
        return $true
    }
    catch {
        Write-Host "[ERRO] Porta $Port não está acessível" -ForegroundColor Red
        return $false
    }
}

# Função para verificar processos
function Test-Processes {
    Write-Host "[VERIFICAR] Verificando processos..." -ForegroundColor Yellow
    
    try {
        $processes = Get-NetTCPConnection -LocalPort $Port -ErrorAction SilentlyContinue | 
                    Where-Object { $_.State -eq "Listen" }
        
        if ($processes) {
            foreach ($process in $processes) {
                $processInfo = Get-Process -Id $process.OwningProcess -ErrorAction SilentlyContinue
                if ($processInfo) {
                    Write-Host "[OK] Processo encontrado: $($processInfo.ProcessName) (PID: $($processInfo.Id))" -ForegroundColor Green
                }
            }
            return $true
        }
        else {
            Write-Host "[ERRO] Nenhum processo encontrado na porta $Port" -ForegroundColor Red
            return $false
        }
    }
    catch {
        Write-Host "[ERRO] Erro ao verificar processos: $($_.Exception.Message)" -ForegroundColor Red
        return $false
    }
}

# Função principal
function Start-BackendTest {
    Write-Host @"
==========================================
   Traffic Manager Hub - Backend Test
==========================================

"@ -ForegroundColor Cyan
    
    # Verificar argumentos
    if ($Help) {
        Show-Help
        return
    }
    
    $allTestsPassed = $true
    
    # Testar conectividade
    if (-not (Test-Connectivity)) {
        $allTestsPassed = $false
    }
    
    # Testar processos
    if (-not (Test-Processes)) {
        $allTestsPassed = $false
    }
    
    # Testar health check
    if (-not (Test-HealthCheck)) {
        $allTestsPassed = $false
    }
    
    # Testar endpoint de auth
    if (-not (Test-AuthEndpoint)) {
        $allTestsPassed = $false
    }
    
    # Resumo
    Write-Host ""
    Write-Host "==========================================" -ForegroundColor Cyan
    Write-Host "   RESUMO DOS TESTES" -ForegroundColor Cyan
    Write-Host "==========================================" -ForegroundColor Cyan
    
    if ($allTestsPassed) {
        Write-Host "[OK] Todos os testes passaram!" -ForegroundColor Green
        Write-Host "[INICIAR] Backend está funcionando corretamente" -ForegroundColor Green
    }
    else {
        Write-Host "[ERRO] Alguns testes falharam" -ForegroundColor Red
        Write-Host "[INFO] Verifique se o servidor está rodando" -ForegroundColor Yellow
    }
    
    Write-Host ""
    Write-Host "[URLS] URLs:" -ForegroundColor Cyan
    Write-Host "   Backend: http://localhost:$Port" -ForegroundColor Gray
    Write-Host "   Health:  http://localhost:$Port/health" -ForegroundColor Gray
    Write-Host "   Frontend: http://localhost:3000" -ForegroundColor Gray
    Write-Host ""
    Write-Host "[COMANDOS] Comandos úteis:" -ForegroundColor Cyan
    Write-Host "   start-server.bat - Iniciar servidor" -ForegroundColor Gray
    Write-Host "   npm run dev     - Iniciar em modo desenvolvimento" -ForegroundColor Gray
    Write-Host ""
}

# Executar função principal
Start-BackendTest
