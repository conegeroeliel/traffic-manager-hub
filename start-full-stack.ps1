# Traffic Manager Hub - PowerShell Full Stack Script
# Versão: 1.0.0
# Compatível com PowerShell 5.1+ e PowerShell Core 7+

param(
    [switch]$Help,
    [switch]$Test,
    [switch]$Clean,
    [switch]$BackendOnly,
    [switch]$FrontendOnly,
    [string]$BackendPort = "3001",
    [string]$FrontendPort = "3000"
)

# Configurações
$ErrorActionPreference = "Stop"
$ProgressPreference = "SilentlyContinue"

# Função para exibir ajuda
function Show-Help {
    Write-Host @"
==========================================
   Traffic Manager Hub - Full Stack
==========================================

Uso: .\start-full-stack.ps1 [opções]

Opções:
  -Help          Exibir esta ajuda
  -Test          Executar testes antes de iniciar
  -Clean         Limpar cache e node_modules
  -BackendOnly   Iniciar apenas o backend
  -FrontendOnly  Iniciar apenas o frontend
  -BackendPort   Porta do backend (padrão: 3001)
  -FrontendPort  Porta do frontend (padrão: 3000)

Exemplos:
  .\start-full-stack.ps1
  .\start-full-stack.ps1 -Test
  .\start-full-stack.ps1 -Clean
  .\start-full-stack.ps1 -BackendOnly
  .\start-full-stack.ps1 -FrontendOnly

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

# Função para parar processos existentes
function Stop-ExistingProcesses {
    Write-Host "[PARAR] Parando processos existentes..." -ForegroundColor Yellow
    
    $ports = @($BackendPort, $FrontendPort)
    
    foreach ($port in $ports) {
        try {
            $processes = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue | 
                        Where-Object { $_.State -eq "Listen" }
            
            foreach ($process in $processes) {
                $processInfo = Get-Process -Id $process.OwningProcess -ErrorAction SilentlyContinue
                if ($processInfo) {
                    Write-Host "[PARAR] Parando processo na porta $port`: $($processInfo.ProcessName) (PID: $($processInfo.Id))" -ForegroundColor Yellow
                    Stop-Process -Id $processInfo.Id -Force -ErrorAction SilentlyContinue
                }
            }
        }
        catch {
            Write-Host "[AVISO] Não foi possível parar processos na porta $port" -ForegroundColor Yellow
        }
    }
    
    Start-Sleep -Seconds 3
}

# Função para limpar cache
function Clear-Cache {
    Write-Host "[LIMPAR] Limpando cache..." -ForegroundColor Yellow
    
    # Parar processos existentes
    Stop-ExistingProcesses
    
    # Limpar cache se solicitado
    if ($Clean) {
        # Limpar frontend
        if (Test-Path "node_modules") {
            Write-Host "[REMOVER] Removendo node_modules do frontend..." -ForegroundColor Yellow
            Remove-Item -Path "node_modules" -Recurse -Force -ErrorAction SilentlyContinue
        }
        
        if (Test-Path ".next") {
            Write-Host "[REMOVER] Removendo cache .next..." -ForegroundColor Yellow
            Remove-Item -Path ".next" -Recurse -Force -ErrorAction SilentlyContinue
        }
        
        # Limpar backend
        if (Test-Path "backend/node_modules") {
            Write-Host "[REMOVER] Removendo node_modules do backend..." -ForegroundColor Yellow
            Remove-Item -Path "backend/node_modules" -Recurse -Force -ErrorAction SilentlyContinue
        }
        
        Write-Host "[INSTALAR] Reinstalando dependências..." -ForegroundColor Yellow
        npm install
        
        if (Test-Path "backend") {
            Set-Location "backend"
            npm install
            Set-Location ".."
        }
    }
}

# Função para testar serviços
function Test-Services {
    Write-Host "[TEST] Testando serviços..." -ForegroundColor Yellow
    
    $allTestsPassed = $true
    
    # Testar backend
    if (-not $FrontendOnly) {
        try {
            $response = Invoke-WebRequest -Uri "http://localhost:$BackendPort/health" -Method GET -TimeoutSec 10
            Write-Host "[OK] Backend está funcionando! Status: $($response.StatusCode)" -ForegroundColor Green
        }
        catch {
            Write-Host "[ERRO] Backend não está respondendo" -ForegroundColor Red
            $allTestsPassed = $false
        }
    }
    
    # Testar frontend
    if (-not $BackendOnly) {
        try {
            $response = Invoke-WebRequest -Uri "http://localhost:$FrontendPort" -Method GET -TimeoutSec 10
            Write-Host "[OK] Frontend está funcionando! Status: $($response.StatusCode)" -ForegroundColor Green
        }
        catch {
            Write-Host "[ERRO] Frontend não está respondendo" -ForegroundColor Red
            $allTestsPassed = $false
        }
    }
    
    return $allTestsPassed
}

# Função para iniciar backend
function Start-Backend {
    Write-Host "[INICIAR] Iniciando backend na porta $BackendPort..." -ForegroundColor Green
    
    if (Test-Path "backend") {
        Set-Location "backend"
        
        # Verificar se node_modules existe
        if (-not (Test-Path "node_modules")) {
            Write-Host "[INSTALAR] Instalando dependências do backend..." -ForegroundColor Yellow
            npm install
        }
        
        # Iniciar backend em nova janela
        Start-Process powershell -ArgumentList "-NoExit", "-Command", "Write-Host '[INICIAR] Backend iniciado na porta $BackendPort' -ForegroundColor Green; npm run dev" -WindowStyle Normal
        
        Set-Location ".."
    }
    else {
        Write-Host "[ERRO] Diretório backend não encontrado!" -ForegroundColor Red
        exit 1
    }
}

# Função para iniciar frontend
function Start-Frontend {
    Write-Host "[INICIAR] Iniciando frontend na porta $FrontendPort..." -ForegroundColor Green
    
    # Verificar se node_modules existe
    if (-not (Test-Path "node_modules")) {
        Write-Host "[INSTALAR] Instalando dependências do frontend..." -ForegroundColor Yellow
        npm install
    }
    
    # Iniciar frontend
    npm run dev
}

# Função para exibir informações
function Show-Info {
    Write-Host @"
==========================================
   Traffic Manager Hub - Full Stack
==========================================

[OK] Aplicação iniciada com sucesso!

[URLS] URLs:
   Frontend: http://localhost:$FrontendPort
   Backend:  http://localhost:$BackendPort
   Health:   http://localhost:$BackendPort/health

[CREDENCIAIS] Credenciais de teste:
   Email: admin@teste.com
   Senha: 123456

[PAGINAS] Páginas disponíveis:
   /              - Página inicial
   /login         - Login
   /register      - Registro
   /dashboard     - Dashboard principal
   /dashboard/clientes - Gestão de clientes
   /dashboard/calculadora - Calculadora

[COMANDOS] Comandos úteis:
   Ctrl+C - Parar servidor
   R      - Recarregar página
   Ctrl+R - Hard refresh

"@ -ForegroundColor Green
}

# Função principal
function Start-TrafficManagerFullStack {
    Write-Host @"
==========================================
   Traffic Manager Hub - Full Stack
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
    else {
        # Parar processos existentes
        Stop-ExistingProcesses
    }
    
    # Testar serviços se solicitado
    if ($Test) {
        if (Test-Services) {
            Write-Host "[OK] Teste concluído com sucesso!" -ForegroundColor Green
            return
        }
        else {
            Write-Host "[ERRO] Teste falhou!" -ForegroundColor Red
            exit 1
        }
    }
    
    # Determinar o que iniciar
    $startBackend = -not $FrontendOnly
    $startFrontend = -not $BackendOnly
    
    # Iniciar backend se necessário
    if ($startBackend) {
        Start-Backend
        Write-Host "[AGUARDAR] Aguardando backend inicializar..." -ForegroundColor Yellow
        Start-Sleep -Seconds 5
    }
    
    # Exibir informações
    Show-Info
    
    # Iniciar frontend se necessário
    if ($startFrontend) {
        Start-Frontend
    }
    else {
        Write-Host "[OK] Backend iniciado! Frontend não foi iniciado (use -FrontendOnly para iniciar apenas o frontend)" -ForegroundColor Green
        Write-Host "[URL] Backend disponível em: http://localhost:$BackendPort" -ForegroundColor Cyan
    }
}

# Executar função principal
Start-TrafficManagerFullStack
