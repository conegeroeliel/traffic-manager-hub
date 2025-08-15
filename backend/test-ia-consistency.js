const axios = require('axios');

// Função para testar a IA com diferentes empresas
async function testIAWithCompanies() {
  const companies = [
    { name: 'Apple', city: 'Cupertino, CA' },
    { name: 'Microsoft', city: 'Redmond, WA' },
    { name: 'Google', city: 'Mountain View, CA' },
    { name: 'Nubank', city: 'São Paulo, SP' },
    { name: 'Magazine Luiza', city: 'São Paulo, SP' },
    { name: 'Restaurante Hulhah', city: 'Campinas, SP' }, // Empresa local testada
    { name: 'Empresa Fictícia XYZ', city: 'São Paulo, SP' } // Para testar resposta quando não existe
  ];

  console.log('🧪 Testando consistência da IA...\n');

  for (const company of companies) {
    try {
      console.log(`📋 Testando: ${company.name} (${company.city})`);
      
      const response = await axios.post('http://localhost:3001/api/debriefing/teste-ia', {
        dados: {
          nomeEmpresa: company.name,
          cidadeEstado: company.city
        }
      }, {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 30000 // 30 segundos
      });

      const result = response.data;
      
      if (result.success && result.resposta) {
        // Verificar se a resposta contém informações reais ou se diz que não encontrou
        const hasNoInfo = result.resposta.includes('não tenho informações') || 
                          result.resposta.includes('não encontrei') ||
                          result.resposta.includes('não tenho dados') ||
                          result.resposta.includes('não tenho conhecimento') ||
                          result.resposta.includes('lamento, mas não tenho') ||
                          result.resposta.includes('não posso fornecer uma análise detalhada');
        
        if (hasNoInfo) {
          console.log(`❌ ${company.name}: IA disse que não encontrou informações`);
        } else {
          console.log(`✅ ${company.name}: IA forneceu análise`);
        }
        
        // Mostrar primeiras 100 caracteres da resposta
        const preview = result.resposta.substring(0, 100).replace(/\n/g, ' ');
        console.log(`   Preview: ${preview}...`);
      } else {
        console.log(`❌ ${company.name}: Erro na resposta`);
      }
      
    } catch (error) {
      console.log(`❌ ${company.name}: Erro - ${error.message}`);
    }
    
    console.log(''); // Linha em branco entre testes
    await new Promise(resolve => setTimeout(resolve, 2000)); // Pausa de 2 segundos
  }
  
  console.log('🏁 Teste de consistência concluído!');
}

// Executar o teste
testIAWithCompanies().catch(console.error);
