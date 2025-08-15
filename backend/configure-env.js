const fs = require('fs');
const path = require('path');

console.log('🔧 Configurando arquivo .env...');

const envContent = `# Database
DATABASE_URL="postgresql://username:password@localhost:5432/traffic_manager_hub"

# Server
PORT=3001
NODE_ENV=development

# JWT
JWT_SECRET=12ae28990a88da20f24f0634e6faf2b4cdf659c70be104ac7355646a458038727cf9ab8a9b6435da09fcee045080a3
JWT_EXPIRES_IN=7d

# OpenAI
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_MODEL=gpt-4-turbo-preview

# CORS
FRONTEND_URL=http://localhost:3000

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Logging
LOG_LEVEL=info
LOG_FILE_PATH=logs/app.log
`;

const envPath = path.join(__dirname, '.env');
fs.writeFileSync(envPath, envContent);

console.log('✅ Arquivo .env configurado com sucesso!');
console.log('🔑 Chave da OpenAI configurada');
console.log('🔐 JWT_SECRET configurado');
console.log('🗄️  DATABASE_URL configurado');

// Verificar se o backend está rodando
console.log('\n🔍 Verificando se o backend está rodando...');
try {
  const http = require('http');
  const options = {
    hostname: 'localhost',
    port: 3001,
    path: '/health',
    method: 'GET',
    timeout: 2000
  };

  const req = http.request(options, (res) => {
    console.log('✅ Backend está rodando na porta 3001');
    console.log('🌐 Status:', res.statusCode);
  });

  req.on('error', (err) => {
    console.log('❌ Backend não está respondendo na porta 3001');
    console.log('💡 Execute: npm run dev');
  });

  req.on('timeout', () => {
    console.log('⏰ Timeout ao conectar com o backend');
    console.log('💡 Execute: npm run dev');
  });

  req.end();
} catch (error) {
  console.log('❌ Erro ao verificar o backend:', error.message);
}
