// Script para testar login e autenticação
console.log('🔧 Testando login...\n');

const testLogin = async () => {
  try {
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
    
    if (loginResponse.ok) {
      const loginData = await loginResponse.json();
      console.log('✅ Login realizado com sucesso!');
      console.log('🔑 Token:', loginData.data.token.substring(0, 20) + '...');
      
      // Testar API de clientes com o token
      console.log('\n🔄 Testando API de clientes...');
      
      const clientesResponse = await fetch('http://localhost:3001/api/clientes', {
        headers: {
          'Authorization': `Bearer ${loginData.data.token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (clientesResponse.ok) {
        const clientesData = await clientesResponse.json();
        console.log('✅ API de clientes funcionando!');
        console.log(`📋 Total de clientes: ${clientesData.data.clientes.length}`);
        
        clientesData.data.clientes.forEach((cliente, index) => {
          console.log(`- ${index + 1}. ${cliente.empresa} (${cliente.nome})`);
        });
        
        console.log('\n🎯 Status: TUDO FUNCIONANDO!');
        console.log('💡 Agora você pode fazer login no frontend com:');
        console.log('   Email: admin@trafficmanager.com');
        console.log('   Senha: admin123');
        
      } else {
        console.log('❌ Erro na API de clientes:', clientesResponse.status);
        const errorText = await clientesResponse.text();
        console.log('📄 Detalhes:', errorText);
      }
      
    } else {
      console.log('❌ Erro no login:', loginResponse.status);
      const errorText = await loginResponse.text();
      console.log('📄 Detalhes:', errorText);
    }
    
  } catch (error) {
    console.log('❌ Erro de conexão:', error.message);
    console.log('💡 Verifique se o backend está rodando na porta 3001');
  }
};

// Executar teste
testLogin();






