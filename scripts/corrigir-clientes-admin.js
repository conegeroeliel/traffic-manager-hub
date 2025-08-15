const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function corrigirClientesAdmin() {
  try {
    console.log('🔧 Corrigindo associação dos clientes...');

    // Buscar o usuário admin
    const adminUser = await prisma.user.findFirst({
      where: {
        email: 'admin@trafficmanager.com'
      }
    });

    if (!adminUser) {
      console.error('❌ Usuário admin não encontrado!');
      return;
    }

    console.log(`✅ Usuário admin encontrado: ${adminUser.email} (ID: ${adminUser.id})`);

    // Atualizar todos os clientes para pertencer ao admin
    const clientesAtualizados = await prisma.cliente.updateMany({
      where: {},
      data: {
        userId: adminUser.id
      }
    });

    console.log(`✅ ${clientesAtualizados.count} clientes associados ao admin`);

    // Atualizar contadores do usuário admin
    const totalClientes = await prisma.cliente.count({
      where: {
        userId: adminUser.id
      }
    });

    await prisma.user.update({
      where: {
        id: adminUser.id
      },
      data: {
        totalClientes: totalClientes
      }
    });

    console.log(`✅ Contador de clientes do admin atualizado: ${totalClientes}`);

    console.log('🎉 Correção concluída com sucesso!');

  } catch (error) {
    console.error('❌ Erro ao corrigir clientes:', error);
  } finally {
    await prisma.$disconnect();
  }
}

corrigirClientesAdmin();


