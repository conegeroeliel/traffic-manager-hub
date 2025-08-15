const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Iniciando processo completo...');

// Função para executar comandos
function runCommand(command, args, cwd) {
  return new Promise((resolve, reject) => {
    console.log(`📋 Executando: ${command} ${args.join(' ')}`);
    
    const child = spawn(command, args, {
      cwd: cwd || process.cwd(),
      stdio: 'pipe',
      shell: true
    });

    let output = '';
    let errorOutput = '';

    child.stdout.on('data', (data) => {
      output += data.toString();
      console.log(data.toString());
    });

    child.stderr.on('data', (data) => {
      errorOutput += data.toString();
      console.log('❌', data.toString());
    });

    child.on('close', (code) => {
      if (code === 0) {
        resolve(output);
      } else {
        reject(new Error(`Comando falhou com código ${code}: ${errorOutput}`));
      }
    });
  });
}

// Função para aguardar
function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Função para testar a IA
function testIA() {
  return new Promise((resolve, reject) => {
    console.log('\n🧪 Testando IA...');
    
    const http = require('http');
    const testData = {
      respostas: {
        nomeEmpresa: 'mix fiscal',
        segmento: 'tecnologia',
        site: 'https://www.mixfiscal.com.br',
        faturamentoAnual: 1000000,
        numeroFuncionarios: 10,
        clienteIdeal: 'Empresas de médio porte',
        diferencialUnico: 'Solução inovadora',
        produtoPrincipal: 'Software de gestão',
        precoMedio: 500,
        objetivoPrincipal: 'Aumentar vendas',
        metaVendas: 500000,
        principaisConcorrentes: 'Concorrente A, B',
        orcamentoMarketing: 5000
      }
    };

    const postData = JSON.stringify(testData);
    const options = {
      hostname: 'localhost',
      port: 3001,
      path: '/api/debriefing/teste-ia',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          if (result.success) {
            console.log('\n🎉 SUCESSO! IA está funcionando!');
            console.log('='.repeat(50));
            console.log(result.resposta);
            console.log('='.repeat(50));
            resolve(result);
          } else {
            reject(new Error(`Erro na IA: ${result.error}`));
          }
        } catch (e) {
          reject(new Error(`Erro ao processar resposta: ${e.message}`));
        }
      });
    });

    req.on('error', (e) => {
      reject(new Error(`Erro de conexão: ${e.message}`));
    });

    req.write(postData);
    req.end();
  });
}

// Processo principal
async function main() {
  try {
    // 1. Compilar
    console.log('\n📦 Compilando TypeScript...');
    await runCommand('npm', ['run', 'build']);
    
    // 2. Aguardar um pouco
    console.log('\n⏳ Aguardando 2 segundos...');
    await wait(2000);
    
    // 3. Iniciar servidor em background
    console.log('\n🚀 Iniciando servidor...');
    const server = spawn('npm', ['start'], {
      stdio: 'pipe',
      shell: true
    });
    
    // 4. Aguardar servidor iniciar
    console.log('\n⏳ Aguardando servidor iniciar...');
    await wait(5000);
    
    // 5. Testar IA
    await testIA();
    
    // 6. Parar servidor
    console.log('\n🛑 Parando servidor...');
    server.kill();
    
    console.log('\n✅ Processo concluído com sucesso!');
    
  } catch (error) {
    console.error('\n❌ Erro:', error.message);
    process.exit(1);
  }
}

main();
