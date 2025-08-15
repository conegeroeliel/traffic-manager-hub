# Traffic Manager Hub - PowerShell Frontend Script
# Versão: 1.0.0
# Compatível com PowerShell 5.1+ e PowerShell Core 7+

param(
    [switch]$Help,
    [switch]$Test,
    [switch]$Clean,
    [switch]$Build,
    [string]$Port = "3000"
)

# Configurações
$ErrorActionPreference = "Stop"
$ProgressPreference = "SilentlyContinue"

# Função para exibir ajuda
function Show-Help {
    Write-Host @"
==========================================
   Traffic Manager Hub - Frontend
==========================================

Uso: .\start-frontend.ps1 [opções]

Opções:
  -Help          Exibir esta ajuda
  -Test          Executar testes antes de iniciar
  -Clean         Limpar cache e node_modules
  -Build         Compilar para produção
  -Port <num>    Porta do frontend (padrão: 3000)

Exemplos:
  .\start-frontend.ps1
  .\start-frontend.ps1 -Test
  .\start-frontend.ps1 -Clean -Port 3001
  .\start-frontend.ps1 -Build

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
    
    # Verificar estrutura Next.js
    if (-not (Test-Path "src/app/layout.tsx")) {
        Write-Host "[ERRO] Estrutura Next.js não encontrada!" -ForegroundColor Red
        Write-Host "[INFO] Verifique se está no diretório correto" -ForegroundColor Yellow
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
    
    # Limpar cache se solicitado
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

# Função para testar frontend
function Test-Frontend {
    Write-Host "[TEST] Testando frontend..." -ForegroundColor Yellow
    
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:$Port" -Method GET -TimeoutSec 10
        Write-Host "[OK] Frontend está funcionando! Status: $($response.StatusCode)" -ForegroundColor Green
        return $true
    }
    catch {
        Write-Host "[ERRO] Frontend não está respondendo" -ForegroundColor Red
        Write-Host "[INFO] Verifique se o frontend está rodando na porta $Port" -ForegroundColor Yellow
        return $false
    }
}

# Função para compilar para produção
function Build-Production {
    Write-Host "[COMPILAR] Compilando para produção..." -ForegroundColor Yellow
    
    try {
        npm run build
        Write-Host "[OK] Compilação concluída com sucesso!" -ForegroundColor Green
    }
    catch {
        Write-Host "[ERRO] Erro na compilação: $($_.Exception.Message)" -ForegroundColor Red
        exit 1
    }
}

# Função para exibir informações do frontend
function Show-FrontendInfo {
    Write-Host @"
==========================================
   Traffic Manager Hub - Frontend
==========================================

[OK] Frontend iniciado com sucesso!
[URL] http://localhost:$Port
[BACKEND] http://localhost:3001

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
function Start-TrafficManagerFrontend {
    Write-Host @"
==========================================
   Traffic Manager Hub - Frontend
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
    
    # Compilar para produção se solicitado
    if ($Build) {
        Build-Production
        return
    }
    
    # Testar frontend se solicitado
    if ($Test) {
        if (Test-Frontend) {
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
    Show-FrontendInfo
    
    # Iniciar frontend
    Write-Host "[INICIAR] Iniciando frontend na porta $Port..." -ForegroundColor Green
    Write-Host ""
    
    try {
        npm run dev
    }
    catch {
        Write-Host "[ERRO] Erro ao iniciar frontend: $($_.Exception.Message)" -ForegroundColor Red
        exit 1
    }
}

# Executar função principal
Start-TrafficManagerFrontend
