const http = require('http');

console.log('🧪 Testando IA - Versão Simplificada');

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

console.log('📡 Enviando requisição...');

const req = http.request(options, (res) => {
  console.log(`📊 Status: ${res.statusCode}`);
  
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    try {
      const result = JSON.parse(data);
      if (result.success) {
        console.log('\n🎉 SUCESSO! IA está funcionando!');
        console.log('='.repeat(50));
        console.log(result.resposta);
        console.log('='.repeat(50));
      } else {
        console.log('\n❌ Erro na IA:', result.error);
      }
    } catch (e) {
      console.log('\n❌ Erro ao processar resposta:', e.message);
      console.log('Resposta bruta:', data);
    }
  });
});

req.on('error', (e) => {
  console.log('\n❌ Erro de conexão:', e.message);
  console.log('💡 Verifique se o backend está rodando');
});

req.write(postData);
req.end();
