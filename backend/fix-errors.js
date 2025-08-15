const fs = require('fs');
const path = require('path');

console.log('🔧 Corrigindo erros de TypeScript...');

// Corrigir auth.ts
const authPath = path.join(__dirname, 'src', 'routes', 'auth.ts');
let authContent = fs.readFileSync(authPath, 'utf8');

// Substituir as duas ocorrências do erro
authContent = authContent.replace(
  /throw errors\.badRequest\('Dados inválidos', error\.errors\);/g,
  "throw errors.badRequest('Dados inválidos');"
);

fs.writeFileSync(authPath, authContent);
console.log('✅ auth.ts corrigido');

// Corrigir auth-middleware.ts
const authMiddlewarePath = path.join(__dirname, 'src', 'middleware', 'auth-middleware.ts');
let authMiddlewareContent = fs.readFileSync(authMiddlewarePath, 'utf8');

authMiddlewareContent = authMiddlewareContent.replace(
  /const options = \{ expiresIn: config\.jwt\.expiresIn \};/,
  "const options = { expiresIn: config.jwt.expiresIn as string };"
);

fs.writeFileSync(authMiddlewarePath, authMiddlewareContent);
console.log('✅ auth-middleware.ts corrigido');

// Corrigir debriefing.ts
const debriefingPath = path.join(__dirname, 'src', 'routes', 'debriefing.ts');
let debriefingContent = fs.readFileSync(debriefingPath, 'utf8');

debriefingContent = debriefingContent.replace(
  /import \{ generateDiagnosis \} from '@\/lib\/gpt\/generate-diagnosis';/,
  "import { generateNicheDiagnosis } from '@/lib/gpt/generate-diagnosis';"
);

debriefingContent = debriefingContent.replace(
  /const diagnostico = await generateDiagnosis\(respostas\);/g,
  "const diagnostico = await generateNicheDiagnosis(respostas);"
);

debriefingContent = debriefingContent.replace(
  /errors\.internalServerError/g,
  "errors.internal()"
);

fs.writeFileSync(debriefingPath, debriefingContent);
console.log('✅ debriefing.ts corrigido');

console.log('\n🎉 Todos os erros corrigidos!');
console.log('💡 Execute: npm run build');
