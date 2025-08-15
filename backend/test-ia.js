const http = require('http');

console.log('🧪 Testando a IA...');

const data = JSON.stringify({
  respostas: {
    nomeEmpresa: 'mix fiscal',
    segmento: 'tecnologia',
    site: 'https://www.mixfiscal.com.br',
    faturamentoAnual: 1000000,
    numeroFuncionarios: 10,
    clienteIdeal: 'Empresas de médio porte, 25-45 anos, interessadas em tecnologia',
    diferencialUnico: 'Solução inovadora com suporte 24/7',
    produtoPrincipal: 'Software de gestão empresarial',
    precoMedio: 500,
    objetivoPrincipal: 'Aumentar vendas em 50%',
    metaVendas: 500000,
    principaisConcorrentes: 'Concorrente A, Concorrente B',
    orcamentoMarketing: 5000
  }
});

const options = {
  hostname: 'localhost',
  port: 3001,
  path: '/api/debriefing/teste-ia',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(data)
  }
};

const req = http.request(options, (res) => {
  console.log(`📡 Status: ${res.statusCode}`);
  console.log(`📋 Headers: ${JSON.stringify(res.headers)}`);

  let responseData = '';

  res.on('data', (chunk) => {
    responseData += chunk;
  });

  res.on('end', () => {
    try {
      const parsed = JSON.parse(responseData);
      console.log('\n✅ Resposta da IA:');
      console.log('='.repeat(50));
      console.log(parsed.resposta || parsed.error || 'Resposta não disponível');
      console.log('='.repeat(50));
      
      if (parsed.success) {
        console.log('\n🎉 IA configurada e funcionando!');
      } else {
        console.log('\n❌ Erro na IA:', parsed.error);
      }
    } catch (error) {
      console.log('\n❌ Erro ao processar resposta:', error.message);
      console.log('Resposta bruta:', responseData);
    }
  });
});

req.on('error', (error) => {
  console.log('\n❌ Erro na requisição:', error.message);
  console.log('💡 Verifique se o backend está rodando na porta 3001');
});

req.write(data);
req.end();
