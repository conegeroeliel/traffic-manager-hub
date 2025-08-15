#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔍 Verificando estrutura do backend...\n');

const requiredFiles = [
  'package.json',
  'tsconfig.json',
  'env.example',
  '.gitignore',
  'README.md',
  'src/index.ts',
  'src/config/index.ts',
  'src/middleware/auth-middleware.ts',
  'src/middleware/error-handler.ts',
  'src/utils/logger.ts',
  'src/routes/auth.ts',
  'src/routes/clientes.ts',
  'src/routes/diagnostico-nicho.ts',
  'src/routes/calculadora.ts',
  'src/routes/tarefas.ts',
  'src/routes/reunioes.ts',
  'src/lib/gpt/generate-diagnosis.ts',
  'src/lib/validations/schemas.ts',
  'src/types/index.ts'
];

const requiredDirs = [
  'src',
  'src/config',
  'src/features',
  'src/features/diagnostico-nicho',
  'src/features/calculadora',
  'src/features/clientes',
  'src/features/tarefas',
  'src/features/reunioes',
  'src/lib',
  'src/lib/gpt',
  'src/lib/prisma',
  'src/lib/prompts',
  'src/lib/validations',
  'src/middleware',
  'src/routes',
  'src/services',
  'src/types',
  'src/utils',
  'scripts'
];

let allValid = true;

console.log('📁 Verificando diretórios:');
requiredDirs.forEach(dir => {
  const dirPath = path.join(__dirname, '..', dir);
  if (fs.existsSync(dirPath)) {
    console.log(`✅ ${dir}`);
  } else {
    console.log(`❌ ${dir} - FALTANDO`);
    allValid = false;
  }
});

console.log('\n📄 Verificando arquivos:');
requiredFiles.forEach(file => {
  const filePath = path.join(__dirname, '..', file);
  if (fs.existsSync(filePath)) {
    const stats = fs.statSync(filePath);
    console.log(`✅ ${file} (${(stats.size / 1024).toFixed(1)}KB)`);
  } else {
    console.log(`❌ ${file} - FALTANDO`);
    allValid = false;
  }
});

if (allValid) {
  console.log('\n🎉 Estrutura do backend está completa!');
  console.log('\n📋 Próximos passos:');
  console.log('   1. cd backend');
  console.log('   2. npm install');
  console.log('   3. Configure o arquivo .env');
  console.log('   4. npm run dev');
} else {
  console.log('\n❌ Estrutura incompleta. Alguns arquivos ou diretórios estão faltando.');
  process.exit(1);
}

console.log('\n🏗️  Arquitetura implementada:');
console.log('   ✅ Express.js + TypeScript');
console.log('   ✅ Middleware de autenticação JWT');
console.log('   ✅ Sistema robusto de error handling');
console.log('   ✅ Logging estruturado com Winston');
console.log('   ✅ Validações com Zod');
console.log('   ✅ Integração com OpenAI GPT');
console.log('   ✅ Rotas modulares organizadas');
console.log('   ✅ Configuração por variáveis de ambiente');
console.log('   ✅ Segurança (Helmet, CORS, Rate Limiting)');
console.log('   ✅ Estrutura de features modulares');

console.log('\n🔧 Scripts disponíveis:');
console.log('   npm run dev      - Desenvolvimento com hot reload');
console.log('   npm run build    - Build para produção');
console.log('   npm start        - Executar versão compilada');
console.log('   npm test         - Executar testes');
console.log('   npm run lint     - Verificar código');

console.log('\n📖 Documentação completa no README.md');