# 📅 Linha do Tempo - Documentação

## Visão Geral

A **Linha do Tempo** é uma funcionalidade central no Traffic Manager Hub que registra cronologicamente todos os eventos, interações, marcos e ações executadas na conta de um cliente. Funciona como um histórico visual e consultável de tudo o que foi feito em relação à conta do cliente.

## 🎯 Objetivos

- **Transparência**: Evidenciar a carga de trabalho diária para os clientes
- **Histórico**: Manter registro completo de todas as interações
- **Valor**: Aumentar a percepção de valor do serviço prestado
- **Confiança**: Gerar confiança através da visibilidade das ações

## 🏗️ Arquitetura

### Estrutura de Arquivos

```
src/
├── lib/
│   ├── types/
│   │   └── timeline.ts          # Tipos TypeScript
│   └── services/
│       └── timelineService.ts   # Serviço de API
├── hooks/
│   └── useTimeline.ts          # Hook personalizado
├── components/
│   └── ui/
│       ├── timeline.tsx         # Componente principal
│       ├── timeline-event-card.tsx    # Card de evento
│       ├── timeline-filters.tsx       # Filtros
│       ├── timeline-event-modal.tsx   # Modal de evento
│       └── timeline-widget.tsx        # Widget para outras páginas
└── app/
    └── dashboard/
        └── timeline/
            └── page.tsx         # Página da timeline
```

### Backend

```
backend/src/
├── routes/
│   └── timeline.ts             # Rotas da API
└── index.ts                   # Registro das rotas
```

## 📊 Tipos de Eventos

### Categorias Principais

| Tipo | Ícone | Descrição | Importância |
|------|-------|-----------|-------------|
| `reuniao` | 👥 | Reuniões com cliente | Alto |
| `analise_kpi` | 📊 | Análises de performance | Médio |
| `otimizacao` | ⚡ | Otimizações de campanha | Médio |
| `criativo` | 🎨 | Criação/aprovação de criativos | Médio |
| `marco` | 🏆 | Marcos importantes | Celebrativo |
| `problema` | ⚠️ | Problemas e soluções | Crítico |
| `feedback` | 💬 | Feedbacks do cliente | Médio |
| `sistema` | ⚙️ | Eventos automáticos | Baixo |
| `meta_batida` | 🎯 | Metas alcançadas | Celebrativo |
| `alerta` | 🚨 | Alertas importantes | Crítico |
| `comunicacao` | 📧 | Comunicações | Médio |

### Níveis de Importância

- **Baixo**: Eventos informativos
- **Médio**: Ações normais do dia a dia
- **Alto**: Eventos importantes
- **Crítico**: Problemas urgentes
- **Celebrativo**: Conquistas e marcos

## 🚀 Como Usar

### 1. Página Principal da Timeline

```tsx
// src/app/dashboard/timeline/page.tsx
import { Timeline } from '@/components/ui/timeline'

export default function TimelinePage() {
  return (
    <Timeline 
      clienteId="cliente_id"
      showStats={true}
      showActions={true}
    />
  )
}
```

### 2. Widget em Outras Páginas

```tsx
// Em uma página de detalhes do cliente
import { TimelineWidget } from '@/components/ui/timeline-widget'

export default function ClienteDetalhesPage() {
  return (
    <div>
      {/* Outros componentes */}
      <TimelineWidget 
        clienteId="cliente_id"
        maxEvents={5}
        showAddButton={true}
      />
    </div>
  )
}
```

### 3. Hook Personalizado

```tsx
import { useTimeline } from '@/hooks/useTimeline'

function MeuComponente() {
  const {
    eventos,
    stats,
    loading,
    error,
    addEvent,
    updateEvent,
    deleteEvent
  } = useTimeline('cliente_id')

  // Usar os dados e funções
}
```

### 4. Serviço Direto

```tsx
import { timelineService } from '@/lib/services/timelineService'

// Criar evento
const novoEvento = await timelineService.create({
  clienteId: 'cliente_id',
  tipo: 'reuniao',
  titulo: 'Reunião de Alinhamento',
  descricao: 'Reunião para alinhar objetivos',
  data: new Date(),
  autor: 'João Silva',
  importancia: 'alto'
})

// Buscar eventos
const eventos = await timelineService.getByCliente('cliente_id', {
  tipo: 'reuniao',
  importancia: 'alto'
})
```

## 🔧 API Endpoints

### GET `/api/timeline/cliente/:clienteId`
Busca eventos de um cliente específico.

**Query Parameters:**
- `tipo`: Filtro por tipo de evento
- `importancia`: Filtro por importância
- `dataInicio`: Data de início
- `dataFim`: Data de fim
- `autor`: Filtro por autor

### POST `/api/timeline/evento`
Cria um novo evento.

**Body:**
```json
{
  "clienteId": "string",
  "tipo": "reuniao",
  "titulo": "string",
  "descricao": "string",
  "data": "2024-01-01T10:00:00Z",
  "autor": "string",
  "importancia": "alto",
  "dadosAdicionais": {}
}
```

### PUT `/api/timeline/evento/:id`
Atualiza um evento existente.

### DELETE `/api/timeline/evento/:id`
Remove um evento.

### GET `/api/timeline/stats/:clienteId`
Busca estatísticas da timeline.

## 🎨 Componentes

### Timeline (Principal)
- Exibe lista completa de eventos
- Inclui filtros e estatísticas
- Suporte a ações (criar, editar, deletar)

### TimelineEventCard
- Card individual para cada evento
- Destaque visual por importância
- Ações contextuais

### TimelineFilters
- Filtros avançados
- Interface responsiva
- Filtros ativos visíveis

### TimelineEventModal
- Formulário para criar/editar eventos
- Validação de campos
- Interface intuitiva

### TimelineWidget
- Versão compacta para outras páginas
- Configurável (número de eventos, ações)
- Integração fácil

## 🔄 Integração Automática

### Eventos do Sistema
O sistema pode criar eventos automaticamente:

```tsx
// Exemplo: Meta batida
await timelineService.createSystemEvent(
  clienteId,
  'meta_batida',
  'Meta de ROAS 10x Alcançada!',
  'Parabéns! Batemos a meta de ROAS 10x.',
  'celebrativo',
  { roas: 12.5, meta: 10 }
)
```

### Integração com Outras Funcionalidades
- **Tarefas**: Criar evento ao marcar tarefa como concluída
- **Reuniões**: Criar evento ao agendar reunião
- **KPIs**: Criar evento ao atingir metas
- **Campanhas**: Criar evento ao otimizar campanha

## 📱 Responsividade

Todos os componentes são responsivos e funcionam bem em:
- Desktop (1200px+)
- Tablet (768px - 1199px)
- Mobile (< 768px)

## 🎯 Melhores Práticas

### 1. Nomenclatura
- Use títulos descritivos e claros
- Inclua contexto relevante na descrição
- Seja específico sobre ações tomadas

### 2. Importância
- Use "celebrativo" para conquistas
- Use "crítico" apenas para problemas urgentes
- Use "alto" para reuniões e decisões importantes

### 3. Dados Adicionais
- Inclua métricas relevantes
- Adicione links para documentos
- Referencie campanhas específicas

### 4. Frequência
- Registre eventos importantes
- Não sobrecarregue com eventos triviais
- Mantenha foco no valor para o cliente

## 🚀 Próximos Passos

### Funcionalidades Futuras
- [ ] Exportação para PDF
- [ ] Notificações automáticas
- [ ] Integração com calendário
- [ ] Templates de eventos
- [ ] Relatórios avançados
- [ ] Integração com ferramentas externas

### Melhorias Técnicas
- [ ] Cache inteligente
- [ ] Paginação infinita
- [ ] Busca por texto
- [ ] Tags personalizadas
- [ ] Anexos de arquivos

## 📞 Suporte

Para dúvidas ou problemas com a Timeline:
1. Verifique a documentação
2. Consulte os exemplos de código
3. Abra uma issue no repositório
4. Entre em contato com a equipe de desenvolvimento
