// Script para testar carregamento de clientes
console.log('🧪 Testando carregamento de clientes...\n');

// Simular localStorage para teste
if (typeof window === 'undefined') {
  global.localStorage = {
    getItem: (key) => {
      if (key === 'token') {
        return 'mock-token-123'; // Simular token
      }
      if (key === 'user') {
        return JSON.stringify({ type: 'PREMIUM' }); // Simular usuário premium
      }
      return null;
    },
    setItem: () => {},
    removeItem: () => {}
  };
}

// Função para simular o serviço de clientes
const mockClientes = [
  {
    id: '1',
    nome: 'João Silva',
    empresa: 'TechStart Solutions',
    email: 'joao.silva@techstart.com.br'
  },
  {
    id: '2',
    nome: 'Maria Santos',
    empresa: 'Consultoria Pro',
    email: 'maria.santos@consultoriapro.com.br'
  },
  {
    id: '3',
    nome: 'Carlos Oliveira',
    empresa: 'Fitness Academy',
    email: 'carlos.oliveira@fitnessacademy.com.br'
  }
];

// Simular função de autenticação
const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  console.log('🔑 Token encontrado:', !!token);
  return !!token;
};

// Simular carregamento de clientes
const loadClientes = async () => {
  try {
    console.log('🔄 Tentando carregar clientes...');
    
    if (!isAuthenticated()) {
      console.log('❌ Usuário não autenticado');
      console.log('📋 Retornando clientes mockados:', mockClientes.length);
      return mockClientes;
    }
    
    // Simular chamada à API
    console.log('✅ Usuário autenticado, simulando chamada à API...');
    console.log('📋 Retornando clientes da API:', mockClientes.length);
    return mockClientes;
    
  } catch (error) {
    console.log('❌ Erro na API, retornando clientes mockados');
    return mockClientes;
  }
};

// Executar teste
(async () => {
  const clientes = await loadClientes();
  console.log('\n📊 Resultado:');
  console.log(`- Total de clientes: ${clientes.length}`);
  clientes.forEach((cliente, index) => {
    console.log(`- ${index + 1}. ${cliente.empresa} (${cliente.nome})`);
  });
  
  console.log('\n🎯 Status do dropdown:');
  if (clientes.length > 0) {
    console.log('✅ Clientes disponíveis para o dropdown');
    console.log('✅ Modal deve mostrar opções de clientes');
  } else {
    console.log('❌ Nenhum cliente disponível');
    console.log('❌ Dropdown ficará vazio');
  }
})();






