// Script para criar clientes automaticamente
console.log('🔧 Criando clientes automaticamente...\n');

const criarClientes = async () => {
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
    
    // 2. Verificar clientes existentes
    console.log('\n🔄 Verificando clientes existentes...');
    const clientesResponse = await fetch('http://localhost:3001/api/clientes', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (clientesResponse.ok) {
      const clientesData = await clientesResponse.json();
      console.log(`📋 Clientes encontrados: ${clientesData.data.clientes.length}`);
      
      if (clientesData.data.clientes.length > 0) {
        console.log('✅ Clientes já existem no backend!');
        clientesData.data.clientes.forEach((cliente, index) => {
          console.log(`- ${index + 1}. ${cliente.empresa} (${cliente.nome})`);
        });
        console.log('\n💡 Os clientes devem aparecer no frontend após fazer login.');
        return;
      }
    }
    
    // 3. Criar clientes se não existirem
    console.log('\n🔄 Criando clientes...');
    
                   const clientesParaCriar = [
        {
          nome: 'João Silva',
          email: 'joao.silva@techstart.com.br',
          telefone: '(11) 99999-8888',
          empresa: 'TechStart Solutions',
          setor: 'Tecnologia',
          status: 'ativo',
          observacoes: 'Cliente focado em soluções de e-commerce'
        },
        {
          nome: 'Maria Santos',
          email: 'maria.santos@consultoriapro.com.br',
          telefone: '(21) 98888-7777',
          empresa: 'Consultoria Pro',
          setor: 'Consultoria',
          status: 'prospecto',
          observacoes: 'Consultoria de gestão empresarial'
        },
        {
          nome: 'Carlos Oliveira',
          email: 'carlos.oliveira@fitnessacademy.com.br',
          telefone: '(31) 97777-6666',
          empresa: 'Fitness Academy',
          setor: 'Saúde e Fitness',
          status: 'ativo',
          observacoes: 'Academia premium com foco em resultados'
        }
      ];
    
    for (const cliente of clientesParaCriar) {
      const createResponse = await fetch('http://localhost:3001/api/clientes', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(cliente)
      });
      
      if (createResponse.ok) {
        const createdCliente = await createResponse.json();
        console.log(`✅ Cliente criado: ${createdCliente.data.cliente.empresa}`);
      } else {
        console.log(`❌ Erro ao criar cliente ${cliente.empresa}`);
      }
    }
    
    console.log('\n🎯 Clientes criados com sucesso!');
    console.log('💡 Agora faça login no frontend e teste o modal.');
    
  } catch (error) {
    console.log('❌ Erro:', error.message);
    console.log('💡 Verifique se o backend está rodando na porta 3001');
  }
};

// Executar
criarClientes();
