const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🚀 Iniciando configuração do banco de dados...');

  // Criar usuário admin
  const adminPassword = await bcrypt.hash('admin123', 10);
  
  const admin = await prisma.user.upsert({
    where: { email: 'admin@trafficmanager.com' },
    update: {},
    create: {
      email: 'admin@trafficmanager.com',
      nome: 'Administrador',
      senha: adminPassword,
      plano: 'PREMIUM',
      statusPagamento: 'ATIVO',
      limiteClientes: -1,
      limiteDiagnosticos: -1,
      limiteTarefas: -1,
      limiteReunioes: -1,
    },
  });

  console.log('✅ Usuário admin criado:', admin.email);

  // Criar usuário de teste
  const testPassword = await bcrypt.hash('teste123', 10);
  
  const testUser = await prisma.user.upsert({
    where: { email: 'teste@trafficmanager.com' },
    update: {},
    create: {
      email: 'teste@trafficmanager.com',
      nome: 'Usuário Teste',
      senha: testPassword,
      plano: 'FREE',
      statusPagamento: 'ATIVO',
      limiteClientes: 3,
      limiteDiagnosticos: 1,
      limiteTarefas: 10,
      limiteReunioes: 5,
    },
  });

  console.log('✅ Usuário de teste criado:', testUser.email);

  // Criar clientes de exemplo para o usuário de teste
  const clientes = await Promise.all([
    prisma.cliente.upsert({
      where: { id: 'cliente-1' },
      update: {},
      create: {
        id: 'cliente-1',
        nome: 'João Silva',
        email: 'joao.silva@techstart.com.br',
        telefone: '(11) 99999-8888',
        empresa: 'TechStart Solutions',
        endereco: 'Rua das Flores, 123 - São Paulo/SP',
        observacoes: 'Cliente focado em soluções de e-commerce',
        status: 'ATIVO',
        userId: testUser.id,
      },
    }),
    prisma.cliente.upsert({
      where: { id: 'cliente-2' },
      update: {},
      create: {
        id: 'cliente-2',
        nome: 'Maria Santos',
        email: 'maria.santos@consultoriapro.com.br',
        telefone: '(21) 98888-7777',
        empresa: 'Consultoria Pro',
        endereco: 'Av. Paulista, 1000 - São Paulo/SP',
        observacoes: 'Consultoria de gestão empresarial',
        status: 'PROSPECTO',
        userId: testUser.id,
      },
    }),
    prisma.cliente.upsert({
      where: { id: 'cliente-3' },
      update: {},
      create: {
        id: 'cliente-3',
        nome: 'Carlos Oliveira',
        email: 'carlos.oliveira@fitnessacademy.com.br',
        telefone: '(31) 97777-6666',
        empresa: 'Fitness Academy',
        endereco: 'Rua do Comércio, 500 - Belo Horizonte/MG',
        observacoes: 'Academia premium com foco em resultados',
        status: 'ATIVO',
        userId: testUser.id,
      },
    }),
  ]);

  console.log('✅ Clientes de exemplo criados:', clientes.length);

  // Criar tarefas de exemplo
  const tarefas = await Promise.all([
    prisma.tarefa.upsert({
      where: { id: 'tarefa-1' },
      update: {},
      create: {
        id: 'tarefa-1',
        titulo: 'Revisar campanha de marketing',
        descricao: 'Analisar métricas da campanha atual e propor melhorias',
        prioridade: 'ALTA',
        status: 'PENDENTE',
        dataVencimento: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 dias
        userId: testUser.id,
        clienteId: clientes[0].id,
      },
    }),
    prisma.tarefa.upsert({
      where: { id: 'tarefa-2' },
      update: {},
      create: {
        id: 'tarefa-2',
        titulo: 'Preparar relatório mensal',
        descricao: 'Criar relatório de performance do mês',
        prioridade: 'MEDIA',
        status: 'EM_ANDAMENTO',
        dataVencimento: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 dias
        userId: testUser.id,
        clienteId: clientes[1].id,
      },
    }),
    prisma.tarefa.upsert({
      where: { id: 'tarefa-3' },
      update: {},
      create: {
        id: 'tarefa-3',
        titulo: 'Atualizar site do cliente',
        descricao: 'Implementar novas funcionalidades no site',
        prioridade: 'URGENTE',
        status: 'PENDENTE',
        dataVencimento: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // 1 dia
        userId: testUser.id,
        clienteId: clientes[2].id,
      },
    }),
  ]);

  console.log('✅ Tarefas de exemplo criadas:', tarefas.length);

  // Criar reuniões de exemplo
  const reunioes = await Promise.all([
    prisma.reuniao.upsert({
      where: { id: 'reuniao-1' },
      update: {},
      create: {
        id: 'reuniao-1',
        titulo: 'Apresentação de resultados',
        descricao: 'Apresentar resultados da campanha de marketing',
        dataHora: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // Amanhã
        tipo: 'APRESENTACAO',
        status: 'AGENDADA',
        observacoes: 'Preparar slides com métricas e gráficos',
        userId: testUser.id,
        clienteId: clientes[0].id,
      },
    }),
    prisma.reuniao.upsert({
      where: { id: 'reuniao-2' },
      update: {},
      create: {
        id: 'reuniao-2',
        titulo: 'Follow-up estratégico',
        descricao: 'Acompanhamento do projeto de consultoria',
        dataHora: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 dias
        tipo: 'FOLLOW_UP',
        status: 'AGENDADA',
        observacoes: 'Discutir próximos passos e ajustes necessários',
        userId: testUser.id,
        clienteId: clientes[1].id,
      },
    }),
  ]);

  console.log('✅ Reuniões de exemplo criadas:', reunioes.length);

  // Criar diagnósticos de exemplo
  const diagnosticos = await Promise.all([
    prisma.diagnostico.upsert({
      where: { id: 'diagnostico-1' },
      update: {},
      create: {
        id: 'diagnostico-1',
        titulo: 'Análise de mercado - TechStart',
        descricao: 'Diagnóstico completo do mercado de e-commerce',
        resultado: 'Mercado em crescimento, oportunidades identificadas para expansão',
        status: 'CONCLUIDO',
        dataConclusao: new Date(),
        userId: testUser.id,
        clienteId: clientes[0].id,
      },
    }),
    prisma.diagnostico.upsert({
      where: { id: 'diagnostico-2' },
      update: {},
      create: {
        id: 'diagnostico-2',
        titulo: 'Análise de concorrência - Fitness Academy',
        descricao: 'Estudo da concorrência no setor fitness',
        resultado: 'Posicionamento diferenciado identificado, recomendações de marketing',
        status: 'EM_ANDAMENTO',
        userId: testUser.id,
        clienteId: clientes[2].id,
      },
    }),
  ]);

  console.log('✅ Diagnósticos de exemplo criados:', diagnosticos.length);

  // Atualizar contadores do usuário
  await prisma.user.update({
    where: { id: testUser.id },
    data: {
      totalClientes: clientes.length,
      totalTarefas: tarefas.length,
      totalReunioes: reunioes.length,
      totalDiagnosticos: diagnosticos.length,
    },
  });

  console.log('✅ Contadores do usuário atualizados');

  console.log('\n🎉 Configuração do banco de dados concluída!');
  console.log('\n📋 Dados criados:');
  console.log(`- Usuários: 2 (admin + teste)`);
  console.log(`- Clientes: ${clientes.length}`);
  console.log(`- Tarefas: ${tarefas.length}`);
  console.log(`- Reuniões: ${reunioes.length}`);
  console.log(`- Diagnósticos: ${diagnosticos.length}`);
  
  console.log('\n🔑 Credenciais de acesso:');
  console.log('Admin: admin@trafficmanager.com / admin123');
  console.log('Teste: teste@trafficmanager.com / teste123');
}

main()
  .catch((e) => {
    console.error('❌ Erro na configuração:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });


