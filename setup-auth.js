// Script para configurar autenticação e testar API
console.log('🔧 Configurando autenticação...\n');

// Simular localStorage para Node.js
if (typeof window === 'undefined') {
  global.localStorage = {
    getItem: (key) => {
      if (key === 'token') {
        return 'mock-jwt-token-123'; // Token mockado
      }
      if (key === 'user') {
        return JSON.stringify({ 
          id: 'user_1',
          type: 'PREMIUM',
          email: 'admin@trafficmanager.com'
        });
      }
      return null;
    },
    setItem: (key, value) => {
      console.log(`💾 Salvando ${key}:`, value);
    },
    removeItem: () => {}
  };
}

// Função para testar a API
const testAPI = async () => {
  try {
    console.log('🔄 Testando conexão com backend...');
    
    const response = await fetch('http://localhost:3001/api/clientes', {
      headers: {
        'Authorization': 'Bearer mock-jwt-token-123',
        'Content-Type': 'application/json'
      }
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ API funcionando!');
      console.log('📊 Resposta:', JSON.stringify(data, null, 2));
      
      if (data.data?.clientes) {
        console.log(`📋 Total de clientes: ${data.data.clientes.length}`);
        data.data.clientes.forEach((cliente, index) => {
          console.log(`- ${index + 1}. ${cliente.empresa} (${cliente.nome})`);
        });
      }
    } else {
      console.log('❌ Erro na API:', response.status, response.statusText);
      const errorText = await response.text();
      console.log('📄 Detalhes:', errorText);
    }
    
  } catch (error) {
    console.log('❌ Erro de conexão:', error.message);
    console.log('💡 Verifique se o backend está rodando na porta 3001');
  }
};

// Executar teste
testAPI();






