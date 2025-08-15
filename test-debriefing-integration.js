// Script para testar integração entre clientes e debriefing
console.log('🔧 Testando integração entre clientes e debriefing...\n');

const testIntegration = async () => {
  try {
    // 1. Fazer login
    console.log('🔄 Fazendo login...');
    const loginResponse = await fetch('http://localhost:3001/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: 'admin@trafficmanager.com',
        senha: 'admin123'
      })
    });
    
    if (!loginResponse.ok) {
      throw new Error('Login falhou');
    }
    
    const loginData = await loginResponse.json();
    const token = loginData.data.token;
    console.log('✅ Login realizado com sucesso!');
    
    // 2. Testar API de clientes
    console.log('\n🔄 Testando API de clientes...');
    const clientesResponse = await fetch('http://localhost:3001/api/clientes', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (clientesResponse.ok) {
      const clientesData = await clientesResponse.json();
      console.log(`✅ API de clientes funcionando!`);
      console.log(`📋 Total de clientes: ${clientesData.data.clientes.length}`);
      
      if (clientesData.data.clientes.length > 0) {
        console.log('📋 Clientes disponíveis:');
        clientesData.data.clientes.forEach((cliente, index) => {
          console.log(`- ${index + 1}. ${cliente.empresa} (${cliente.nome}) - Status: ${cliente.status}`);
        });
      } else {
        console.log('❌ Nenhum cliente encontrado');
      }
    } else {
      console.log('❌ Erro na API de clientes:', clientesResponse.status);
    }
    
    // 3. Testar API de debriefing
    console.log('\n🔄 Testando API de debriefing...');
    const debriefingResponse = await fetch('http://localhost:3001/api/debriefing', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (debriefingResponse.ok) {
      const debriefingData = await debriefingResponse.json();
      console.log(`✅ API de debriefing funcionando!`);
      console.log(`📋 Total de debriefings: ${debriefingData.data?.debriefings?.length || 0}`);
    } else {
      console.log('❌ Erro na API de debriefing:', debriefingResponse.status);
    }
    
    // 4. Verificar se o frontend consegue acessar os dados
    console.log('\n🔄 Verificando acesso do frontend...');
    console.log('💡 Para testar o frontend:');
    console.log('1. Acesse: http://localhost:3000');
    console.log('2. Faça login: admin@trafficmanager.com / admin123');
    console.log('3. Vá para "Debriefing" → "Novo Debriefing Inteligente"');
    console.log('4. Verifique se os clientes aparecem no dropdown');
    
    // 5. Verificar localStorage
    console.log('\n🔄 Verificando localStorage...');
    console.log('💡 Abra o DevTools (F12) e verifique:');
    console.log('- localStorage.getItem("token") - deve ter um token');
    console.log('- localStorage.getItem("user") - deve ter dados do usuário');
    
  } catch (error) {
    console.log('❌ Erro:', error.message);
    console.log('💡 Verifique se o backend está rodando na porta 3001');
  }
};

// Executar teste
testIntegration();






