import { TimelineEvent, TimelineEventFamily, TimelineEventImportance } from '@/lib/types/timeline'

// Dados de teste para demonstrar todas as funcionalidades da timeline POSITIVA
export const timelineTestEvents: TimelineEvent[] = [
  // 🏆 Meta/Recorde - Alta importância
  {
    id: '1',
    clientId: 'cliente-teste',
    date: '2024-01-15T10:30:00Z',
    family: 'milestone',
    importance: 'high',
    title: 'Meta de Conversões Superada',
    description: 'Cliente atingiu 150% da meta de conversões estabelecida para o mês. Resultado excepcional que demonstra a eficácia da estratégia implementada.',
    author: { id: '1', name: 'Ana Silva' },
    impact: { metric: 'Conversão', value: '5.2%', delta: '+27%' },
    links: [
      { label: 'Ver Relatório', href: '/relatorios/conversoes' },
      { label: 'Dashboard', href: '/dashboard' }
    ],
    attachments: [
      { name: 'Relatório Detalhado.pdf', url: '/files/relatorio-conversoes.pdf' }
    ],
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T10:30:00Z'
  },

  // 🚀 Lançamento/Ação Strat. - Alta importância
  {
    id: '2',
    clientId: 'cliente-teste',
    date: '2024-01-20T14:00:00Z',
    family: 'launch',
    importance: 'high',
    title: 'Lançamento Campanha Black Friday',
    description: 'Campanha estratégica de Black Friday lançada com sucesso, incluindo segmentação avançada e criativos otimizados.',
    author: { id: '2', name: 'Carlos Santos' },
    impact: { metric: 'ROAS', value: '8.5x', delta: '+150%' },
    links: [
      { label: 'Ver Campanha', href: '/campanhas/black-friday' }
    ],
    attachments: [
      { name: 'Briefing Campanha.pdf', url: '/files/briefing-black-friday.pdf' }
    ],
    createdAt: '2024-01-20T14:00:00Z',
    updatedAt: '2024-01-20T14:00:00Z'
  },

  // ⚡ Otimização/Performance - Média importância
  {
    id: '3',
    clientId: 'cliente-teste',
    date: '2024-01-25T16:00:00Z',
    family: 'optimization',
    importance: 'medium',
    title: 'Otimização de Landing Pages',
    description: 'Implementação de melhorias nas landing pages resultou em aumento significativo na taxa de conversão.',
    author: { id: '3', name: 'Mariana Costa' },
    impact: { metric: 'Taxa Conversão', value: '3.8%', delta: '+18%' },
    links: [
      { label: 'Ver Landing Pages', href: '/landing-pages' }
    ],
    attachments: [
      { name: 'Relatório A/B Test.pdf', url: '/files/ab-test-landing.pdf' }
    ],
    createdAt: '2024-01-25T16:00:00Z',
    updatedAt: '2024-01-25T16:00:00Z'
  },

  // 📊 Relatório/Entrega - Baixa importância
  {
    id: '4',
    clientId: 'cliente-teste',
    date: '2024-02-05T09:15:00Z',
    family: 'report',
    importance: 'low',
    title: 'Relatório Mensal Entregue',
    description: 'Relatório mensal de performance entregue ao cliente com métricas detalhadas e insights valiosos.',
    author: { id: '4', name: 'Sistema' },
    impact: { metric: 'Satisfação', value: '95%', delta: '+5%' },
    links: [
      { label: 'Ver Relatório', href: '/relatorios/mensal' }
    ],
    attachments: [
      { name: 'Relatório Mensal Jan 2024.pdf', url: '/files/relatorio-mensal-jan.pdf' }
    ],
    createdAt: '2024-02-05T09:15:00Z',
    updatedAt: '2024-02-05T09:15:00Z'
  },

  // 🤝 Reunião/Contato - Média importância
  {
    id: '5',
    clientId: 'cliente-teste',
    date: '2024-02-15T11:00:00Z',
    family: 'meeting',
    importance: 'medium',
    title: 'Reunião de Alinhamento Estratégico',
    description: 'Reunião produtiva para alinhar estratégias do próximo trimestre e definir novas metas de crescimento.',
    author: { id: '5', name: 'João Oliveira' },
    impact: { metric: 'Alinhamento', value: '100%', delta: 'N/A' },
    links: [
      { label: 'Ver Ata', href: '/atas/reuniao-estrategica' }
    ],
    attachments: [
      { name: 'Ata Reunião.pdf', url: '/files/ata-reuniao-estrategica.pdf' }
    ],
    createdAt: '2024-02-15T11:00:00Z',
    updatedAt: '2024-02-15T11:00:00Z'
  },

  // 🏆 Meta/Recorde - Alta importância
  {
    id: '6',
    clientId: 'cliente-teste',
    date: '2024-02-28T15:30:00Z',
    family: 'milestone',
    importance: 'high',
    title: 'Recorde de Vendas Mensais',
    description: 'Cliente bateu recorde histórico de vendas mensais, superando todas as expectativas e metas estabelecidas.',
    author: { id: '6', name: 'Fernanda Lima' },
    impact: { metric: 'Vendas', value: 'R$ 150k', delta: '+45%' },
    links: [
      { label: 'Ver Dashboard', href: '/dashboard/vendas' }
    ],
    attachments: [
      { name: 'Relatório Vendas.pdf', url: '/files/relatorio-vendas-record.pdf' }
    ],
    createdAt: '2024-02-28T15:30:00Z',
    updatedAt: '2024-02-28T15:30:00Z'
  },

  // ⚡ Otimização/Performance - Média importância
  {
    id: '7',
    clientId: 'cliente-teste',
    date: '2024-03-10T14:00:00Z',
    family: 'optimization',
    importance: 'medium',
    title: 'Otimização de Campanhas Google Ads',
    description: 'Refinamento de campanhas Google Ads resultou em redução significativa do CPC e aumento do CTR.',
    author: { id: '7', name: 'Pedro Santos' },
    impact: { metric: 'CPC', value: 'R$ 2.15', delta: '-12%' },
    links: [
      { label: 'Ver Campanhas', href: '/campanhas/google-ads' }
    ],
    attachments: [
      { name: 'Relatório Otimização.pdf', url: '/files/relatorio-otimizacao-ads.pdf' }
    ],
    createdAt: '2024-03-10T14:00:00Z',
    updatedAt: '2024-03-10T14:00:00Z'
  },

  // 📊 Relatório/Entrega - Baixa importância
  {
    id: '8',
    clientId: 'cliente-teste',
    date: '2024-03-15T08:00:00Z',
    family: 'report',
    importance: 'low',
    title: 'Relatório Semanal Enviado',
    description: 'Relatório semanal de performance enviado ao cliente com métricas atualizadas e insights importantes.',
    author: { id: '8', name: 'Sistema' },
    impact: { metric: 'Engajamento', value: '85%', delta: '+3%' },
    links: [
      { label: 'Ver Relatório', href: '/relatorios/semanal' }
    ],
    attachments: [
      { name: 'Relatório Semanal 12.pdf', url: '/files/relatorio-semanal-12.pdf' }
    ],
    createdAt: '2024-03-15T08:00:00Z',
    updatedAt: '2024-03-15T08:00:00Z'
  }
]

// Função para obter eventos de teste baseados no ID do cliente
export const getTimelineTestEvents = (clientId: string): TimelineEvent[] => {
  return timelineTestEvents.map(evento => ({
    ...evento,
    clientId
  }))
}
