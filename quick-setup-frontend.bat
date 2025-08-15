@echo off
echo.
echo ==========================================
echo   Traffic Manager Hub - Setup Frontend
echo ==========================================
echo.

cd /d "%~dp0"

echo 🔧 Executando setup automatico do frontend...
echo.

echo ✅ 1. Verificando estrutura do projeto...
if not exist "src\app\layout.tsx" (
    echo ❌ Erro: Estrutura do Next.js não encontrada!
    echo    Verifique se está no diretório correto.
    pause
    exit /b 1
)

echo ✅ 2. Verificando package.json...
if not exist "package.json" (
    echo ❌ Erro: package.json não encontrado!
    pause
    exit /b 1
)

echo ✅ 3. Instalando dependencias...
npm install

echo.
echo ✅ 4. Verificando configurações...
if not exist "next.config.js" (
    echo ⚠️  next.config.js não encontrado, criando...
    echo /** @type {import('next').NextConfig} */ > next.config.js
    echo const nextConfig = {} >> next.config.js
    echo module.exports = nextConfig >> next.config.js
)

if not exist "tailwind.config.ts" (
    echo ⚠️  tailwind.config.ts não encontrado, criando...
    echo /** @type {import('tailwindcss').Config} */ > tailwind.config.ts
    echo module.exports = { >> tailwind.config.ts
    echo   content: [ >> tailwind.config.ts
    echo     './src/pages/**/*.{js,ts,jsx,tsx,mdx}', >> tailwind.config.ts
    echo     './src/components/**/*.{js,ts,jsx,tsx,mdx}', >> tailwind.config.ts
    echo     './src/app/**/*.{js,ts,jsx,tsx,mdx}', >> tailwind.config.ts
    echo   ], >> tailwind.config.ts
    echo   theme: { extend: {} }, >> tailwind.config.ts
    echo   plugins: [], >> tailwind.config.ts
    echo } >> tailwind.config.ts
)

echo.
echo 🎉 Setup do frontend concluido com sucesso!
echo.
echo ===== PRÓXIMOS PASSOS =====
echo.
echo 1. Execute o frontend:
echo    quick-restart-frontend.bat
echo.
echo 2. Certifique-se que o backend está rodando:
echo    backend\quick-restart.bat
echo.
echo ===== COMANDOS ÚTEIS =====
echo.
echo quick-restart-frontend.bat  - Iniciar frontend
echo npm run build               - Compilar para produção
echo npm run lint                - Verificar codigo
echo npm run start               - Iniciar em modo produção
echo.

pause
