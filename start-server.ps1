# Traffic Manager Hub - PowerShell Server Script
# Versão: 1.0.0
# Compatível com PowerShell 5.1+ e PowerShell Core 7+

param(
    [switch]$Help,
    [switch]$Test,
    [switch]$Clean,
    [string]$Port = "3001"
)

# Configurações
$ErrorActionPreference = "Stop"
$ProgressPreference = "SilentlyContinue"

# Função para exibir ajuda
function Show-Help {
    Write-Host @"
==========================================
   Traffic Manager Hub - PowerShell
==========================================

Uso: .\start-server.ps1 [opções]

Opções:
  -Help          Exibir esta ajuda
  -Test          Executar testes antes de iniciar
  -Clean         Limpar cache e node_modules
  -Port <num>    Porta do servidor (padrão: 3001)

Exemplos:
  .\start-server.ps1
  .\start-server.ps1 -Test
  .\start-server.ps1 -Clean -Port 3002

"@ -ForegroundColor Cyan
}

# Função para verificar dependências
function Test-Dependencies {
    Write-Host "[VERIFICAR] Verificando dependências..." -ForegroundColor Yellow
    
    # Verificar Node.js
    try {
        $nodeVersion = node --version
        Write-Host "[OK] Node.js: $nodeVersion" -ForegroundColor Green
    }
    catch {
        Write-Host "[ERRO] Node.js não encontrado!" -ForegroundColor Red
        Write-Host "[INFO] Instale Node.js: https://nodejs.org/" -ForegroundColor Yellow
        exit 1
    }
    
    # Verificar npm
    try {
        $npmVersion = npm --version
        Write-Host "[OK] npm: $npmVersion" -ForegroundColor Green
    }
    catch {
        Write-Host "[ERRO] npm não encontrado!" -ForegroundColor Red
        exit 1
    }
    
    # Verificar se estamos no diretório correto
    if (-not (Test-Path "package.json")) {
        Write-Host "[ERRO] package.json não encontrado!" -ForegroundColor Red
        Write-Host "[INFO] Execute este script na raiz do projeto" -ForegroundColor Yellow
        exit 1
    }
}

# Função para limpar cache
function Clear-Cache {
    Write-Host "[LIMPAR] Limpando cache..." -ForegroundColor Yellow
    
    # Parar processos na porta
    try {
        $processes = Get-NetTCPConnection -LocalPort $Port -ErrorAction SilentlyContinue | 
                    Where-Object { $_.State -eq "Listen" }
        
        foreach ($process in $processes) {
            $processInfo = Get-Process -Id $process.OwningProcess -ErrorAction SilentlyContinue
            if ($processInfo) {
                Write-Host "[PARAR] Parando processo: $($processInfo.ProcessName) (PID: $($processInfo.Id))" -ForegroundColor Yellow
                Stop-Process -Id $processInfo.Id -Force -ErrorAction SilentlyContinue
            }
        }
    }
    catch {
        Write-Host "[AVISO] Não foi possível parar processos existentes" -ForegroundColor Yellow
    }
    
    # Limpar node_modules se solicitado
    if ($Clean) {
        if (Test-Path "node_modules") {
            Write-Host "[REMOVER] Removendo node_modules..." -ForegroundColor Yellow
            Remove-Item -Path "node_modules" -Recurse -Force -ErrorAction SilentlyContinue
        }
        
        if (Test-Path ".next") {
            Write-Host "[REMOVER] Removendo cache .next..." -ForegroundColor Yellow
            Remove-Item -Path ".next" -Recurse -Force -ErrorAction SilentlyContinue
        }
        
        Write-Host "[INSTALAR] Reinstalando dependências..." -ForegroundColor Yellow
        npm install
    }
    
    Start-Sleep -Seconds 2
}

# Função para testar servidor
function Test-Server {
    Write-Host "[TEST] Testando servidor..." -ForegroundColor Yellow
    
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:$Port/health" -Method GET -TimeoutSec 10
        Write-Host "[OK] Servidor está funcionando! Status: $($response.StatusCode)" -ForegroundColor Green
        return $true
    }
    catch {
        Write-Host "[ERRO] Servidor não está respondendo" -ForegroundColor Red
        Write-Host "[INFO] Verifique se o servidor está rodando na porta $Port" -ForegroundColor Yellow
        return $false
    }
}

# Função para exibir informações do servidor
function Show-ServerInfo {
    Write-Host @"
==========================================
   Traffic Manager Hub - Servidor
==========================================

[OK] Servidor iniciado com sucesso!
[URL] http://localhost:$Port
[HEALTH] http://localhost:$Port/health
[FRONTEND] http://localhost:3000

[CREDENCIAIS] Credenciais de teste:
   Email: admin@teste.com
   Senha: 123456

[COMANDOS] Comandos úteis:
   Ctrl+C - Parar servidor
   R      - Recarregar página

"@ -ForegroundColor Green
}

# Função principal
function Start-TrafficManagerServer {
    Write-Host @"
==========================================
   Traffic Manager Hub - PowerShell
==========================================

"@ -ForegroundColor Cyan
    
    # Verificar argumentos
    if ($Help) {
        Show-Help
        return
    }
    
    # Verificar dependências
    Test-Dependencies
    
    # Limpar cache se solicitado
    if ($Clean) {
        Clear-Cache
    }
    
    # Testar servidor se solicitado
    if ($Test) {
        if (Test-Server) {
            Write-Host "[OK] Teste concluído com sucesso!" -ForegroundColor Green
            return
        }
        else {
            Write-Host "[ERRO] Teste falhou!" -ForegroundColor Red
            exit 1
        }
    }
    
    # Verificar se node_modules existe
    if (-not (Test-Path "node_modules")) {
        Write-Host "[INSTALAR] Instalando dependências..." -ForegroundColor Yellow
        npm install
    }
    
    # Exibir informações
    Show-ServerInfo
    
    # Iniciar servidor
    Write-Host "[INICIAR] Iniciando servidor na porta $Port..." -ForegroundColor Green
    Write-Host ""
    
    try {
        npm run dev
    }
    catch {
        Write-Host "[ERRO] Erro ao iniciar servidor: $($_.Exception.Message)" -ForegroundColor Red
        exit 1
    }
}

# Executar função principal
Start-TrafficManagerServer
