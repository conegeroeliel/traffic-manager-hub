#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Configurando Traffic Manager Hub Backend...\n');

// Create logs directory
const logsDir = path.join(__dirname, '..', 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
  console.log('✅ Diretório de logs criado');
}

// Check if .env exists, if not create from example
const envPath = path.join(__dirname, '..', '.env');
const envExamplePath = path.join(__dirname, '..', 'env.example');

if (!fs.existsSync(envPath)) {
  if (fs.existsSync(envExamplePath)) {
    fs.copyFileSync(envExamplePath, envPath);
    console.log('✅ Arquivo .env criado a partir do exemplo');
    console.log('⚠️  Lembre-se de configurar as variáveis de ambiente no arquivo .env');
  } else {
    console.log('❌ Arquivo env.example não encontrado');
  }
}

// Check Node.js version
const nodeVersion = process.version;
const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0]);

if (majorVersion < 18) {
  console.log('❌ Node.js versão 18 ou superior é necessária');
  console.log(`   Versão atual: ${nodeVersion}`);
  process.exit(1);
}

console.log(`✅ Node.js ${nodeVersion} - compatível`);

// Install dependencies if node_modules doesn't exist
const nodeModulesPath = path.join(__dirname, '..', 'node_modules');
if (!fs.existsSync(nodeModulesPath)) {
  console.log('📦 Instalando dependências...');
  try {
    execSync('npm install', { 
      cwd: path.join(__dirname, '..'),
      stdio: 'inherit' 
    });
    console.log('✅ Dependências instaladas');
  } catch (error) {
    console.log('❌ Erro ao instalar dependências');
    console.log(error.message);
    process.exit(1);
  }
}

// Check environment variables
console.log('\n🔍 Verificando configuração...');

const requiredEnvVars = [
  'DATABASE_URL',
  'JWT_SECRET',
  'OPENAI_API_KEY'
];

let envValid = true;

if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  
  requiredEnvVars.forEach(envVar => {
    if (!envContent.includes(`${envVar}=`) || envContent.includes(`${envVar}=your-`)) {
      console.log(`⚠️  ${envVar} não configurado`);
      envValid = false;
    } else {
      console.log(`✅ ${envVar} configurado`);
    }
  });
}

if (!envValid) {
  console.log('\n📋 Variáveis de ambiente que precisam ser configuradas:');
  console.log('   - DATABASE_URL: URL de conexão com PostgreSQL');
  console.log('   - JWT_SECRET: Chave secreta para JWT (mínimo 32 caracteres)');
  console.log('   - OPENAI_API_KEY: Chave da API da OpenAI');
  console.log('\n   Configure essas variáveis no arquivo .env antes de executar a aplicação.');
}

// Generate JWT secret if needed
if (fs.existsSync(envPath)) {
  let envContent = fs.readFileSync(envPath, 'utf8');
  
  if (envContent.includes('JWT_SECRET=your-super-secret-jwt-key-here')) {
    const crypto = require('crypto');
    const jwtSecret = crypto.randomBytes(64).toString('hex');
    
    envContent = envContent.replace(
      'JWT_SECRET=your-super-secret-jwt-key-here',
      `JWT_SECRET=${jwtSecret}`
    );
    
    fs.writeFileSync(envPath, envContent);
    console.log('✅ JWT_SECRET gerado automaticamente');
  }
}

console.log('\n🎉 Configuração concluída!');
console.log('\n📋 Próximos passos:');
console.log('   1. Configure as variáveis de ambiente no arquivo .env');
console.log('   2. Execute: npm run dev');
console.log('   3. Acesse: http://localhost:3001/health');

console.log('\n📚 Comandos disponíveis:');
console.log('   npm run dev      - Executar em desenvolvimento');
console.log('   npm run build    - Compilar para produção');
console.log('   npm start        - Executar versão compilada');
console.log('   npm run test     - Executar testes');
console.log('   npm run lint     - Verificar código');

console.log('\n🔗 Documentação completa disponível no README.md');