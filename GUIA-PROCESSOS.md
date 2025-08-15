# 🔄 Guia de Processos - Traffic Manager Hub

## 🎯 Processo de Desenvolvimento

### **1. Configuração Inicial do Ambiente**

#### **1.1 Instalação de Dependências**
```bash
# 1. Navegar para o diretório do projeto
cd C:\Users\coneg\traffic-manager-hub

# 2. Configurar PATH do Node.js (se necessário)
$env:PATH += ";C:\Program Files\nodejs"

# 3. Verificar instalação
node --version
npm --version

# 4. Instalar dependências
npm install
```

#### **1.2 Execução do Servidor**
```bash
# Método 1: Script automatizado (Recomendado)
# Duplo clique em: EXECUTAR-AGORA.bat

# Método 2: Manual
npm run dev

# Método 3: PowerShell
.\start-server.ps1
```

### **2. Estrutura de Desenvolvimento**

#### **2.1 Organização de Arquivos**
```
📁 src/
├── 📁 app/                    # Páginas (Next.js App Router)
│   ├── 📁 dashboard/          # Área do dashboard
│   │   ├── 📁 calculadora/    # Calculadora de previsibilidade
│   │   └── 📁 clientes/       # Sistema de clientes
│   ├── layout.tsx             # Layout principal
│   └── page.tsx               # Página inicial
├── 📁 components/             # Componentes React
│   ├── 📁 ui/                 # Componentes base (shadcn/ui)
│   └── [ComponentName].tsx    # Componentes específicos
└── 📁 lib/                    # Utilitários e serviços
    ├── 📁 calc/               # Funções de cálculo
    ├── 📁 schemas/            # Esquemas de validação
    ├── 📁 services/           # Serviços de dados
    └── 📁 types/              # Tipos TypeScript
```

#### **2.2 Convenções de Nomenclatura**
- **Arquivos**: PascalCase (ex: `ClienteForm.tsx`)
- **Componentes**: PascalCase (ex: `ClienteForm`)
- **Funções**: camelCase (ex: `calcularRoi`)
- **Constantes**: UPPER_SNAKE_CASE (ex: `MAX_INVESTIMENTO`)
- **Interfaces**: PascalCase com prefixo I (ex: `ICliente`)

### **3. Processo de Criação de Funcionalidades**

#### **3.1 Etapas para Nova Funcionalidade**

**Passo 1: Planejamento**
- [ ] Definir requisitos da funcionalidade
- [ ] Criar mockup/design
- [ ] Definir estrutura de dados
- [ ] Planejar validações

**Passo 2: Implementação**
- [ ] Criar tipos TypeScript
- [ ] Criar esquemas de validação (Zod)
- [ ] Implementar lógica de negócio
- [ ] Criar componentes React
- [ ] Implementar formulários

**Passo 3: Teste**
- [ ] Testar validações
- [ ] Testar responsividade
- [ ] Testar fluxo completo
- [ ] Verificar performance

**Passo 4: Documentação**
- [ ] Atualizar documentação técnica
- [ ] Documentar APIs (se houver)
- [ ] Criar exemplos de uso

#### **3.2 Exemplo: Criando um Novo Formulário**

```typescript
// 1. Definir tipos
interface NovaFuncionalidade {
  campo1: string
  campo2: number
  campo3?: boolean
}

// 2. Criar esquema de validação
const novaFuncionalidadeSchema = z.object({
  campo1: z.string().min(2, 'Campo obrigatório'),
  campo2: z.number().min(0, 'Deve ser positivo'),
  campo3: z.boolean().optional()
})

// 3. Criar componente
export function NovaFuncionalidadeForm() {
  const form = useForm<NovaFuncionalidade>({
    resolver: zodResolver(novaFuncionalidadeSchema)
  })
  
  // Implementação...
}
```

### **4. Processo de Validação**

#### **4.1 Validação de Formulários**
```typescript
// Esquema de validação com Zod
const clienteSchema = z.object({
  nome: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  telefone: z.string().min(10, 'Telefone deve ter pelo menos 10 dígitos'),
  // ... outros campos
})

// Uso com React Hook Form
const form = useForm<ClienteForm>({
  resolver: zodResolver(clienteSchema)
})
```

#### **4.2 Tipos de Validação Implementados**
- **Campos obrigatórios**: Validação de preenchimento
- **Formato de email**: Validação de estrutura
- **Números positivos**: Validação de valores
- **Percentuais**: Validação de range (0-100%)
- **URLs**: Validação de formato
- **Telefones**: Validação de formato brasileiro

### **5. Processo de Estilização**

#### **5.1 Uso do Tailwind CSS**
```tsx
// Classes utilitárias do Tailwind
<div className="
  flex items-center justify-between
  p-4 bg-white rounded-lg shadow-sm
  hover:shadow-md transition-shadow
">
  <h2 className="text-xl font-semibold text-gray-900">
    Título
  </h2>
  <button className="
    px-4 py-2 bg-blue-600 text-white
    rounded-md hover:bg-blue-700
    transition-colors
  ">
    Ação
  </button>
</div>
```

#### **5.2 Componentes shadcn/ui**
```tsx
// Uso de componentes base
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function MeuComponente() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Título</CardTitle>
      </CardHeader>
      <CardContent>
        <Button>Clique aqui</Button>
      </CardContent>
    </Card>
  )
}
```

### **6. Processo de Dados**

#### **6.1 Estrutura de Serviços**
```typescript
// Serviço para gerenciar dados
export const clienteService = {
  // Buscar todos
  getAll: (): Cliente[] => { /* implementação */ },
  
  // Buscar por ID
  getById: (id: string): Cliente | undefined => { /* implementação */ },
  
  // Criar novo
  create: (data: ClienteFormData): Cliente => { /* implementação */ },
  
  // Atualizar
  update: (id: string, data: Partial<ClienteFormData>): Cliente | null => { /* implementação */ },
  
  // Deletar
  delete: (id: string): boolean => { /* implementação */ }
}
```

#### **6.2 Dados Mockados**
- **Clientes**: 3 exemplos com dados realistas
- **Campanhas**: 3 exemplos com métricas variadas
- **Diferentes status**: Ativo, inativo, prospecto
- **Diferentes setores**: Tecnologia, consultoria, startup

### **7. Processo de Teste**

#### **7.1 Checklist de Teste**
- [ ] **Funcionalidade**: Todas as ações funcionam corretamente
- [ ] **Validação**: Mensagens de erro aparecem adequadamente
- [ ] **Responsividade**: Funciona em mobile, tablet e desktop
- [ ] **Performance**: Carregamento rápido e sem travamentos
- [ ] **Acessibilidade**: Navegação por teclado funciona
- [ ] **Cross-browser**: Testado em Chrome, Firefox, Edge

#### **7.2 Cenários de Teste**
```typescript
// Exemplo de cenários para calculadora
const cenariosTeste = [
  {
    nome: 'Cenário básico',
    input: { investimento: 1000, custoPorLead: 10, taxaConversao: 2, ticketMedio: 100 },
    esperado: { leadsGerados: 100, vendasPrevistas: 2, roi: 100 }
  },
  {
    nome: 'Cenário com valores altos',
    input: { investimento: 10000, custoPorLead: 50, taxaConversao: 5, ticketMedio: 500 },
    esperado: { leadsGerados: 200, vendasPrevistas: 10, roi: 400 }
  }
]
```

### **8. Processo de Deploy**

#### **8.1 Build de Produção**
```bash
# 1. Build do projeto
npm run build

# 2. Verificar se não há erros
npm run lint

# 3. Testar build localmente
npm run start
```

#### **8.2 Checklist de Deploy**
- [ ] **Build**: Projeto compila sem erros
- [ ] **Lint**: Não há problemas de linting
- [ ] **Testes**: Todos os testes passam
- [ ] **Performance**: Métricas dentro do esperado
- [ ] **SEO**: Meta tags configuradas
- [ ] **Analytics**: Tracking configurado (se aplicável)

### **9. Processo de Manutenção**

#### **9.1 Atualizações de Dependências**
```bash
# Verificar dependências desatualizadas
npm outdated

# Atualizar dependências
npm update

# Atualizar dependências major
npm install [package]@latest
```

#### **9.2 Backup e Versionamento**
- **Git**: Commits frequentes com mensagens descritivas
- **Branches**: Feature branches para novas funcionalidades
- **Tags**: Versionamento semântico (v1.0.0, v1.1.0, etc.)
- **Backup**: Dados importantes documentados

### **10. Processo de Documentação**

#### **10.1 Documentação de Código**
```typescript
/**
 * Calcula o ROI (Return on Investment) de uma campanha
 * @param investimento - Valor investido na campanha
 * @param faturamento - Faturamento gerado pela campanha
 * @returns ROI em porcentagem
 */
export function calcularRoi(investimento: number, faturamento: number): number {
  return ((faturamento - investimento) / investimento) * 100
}
```

#### **10.2 Documentação de Componentes**
```tsx
/**
 * Formulário para cadastro de clientes
 * 
 * @param onSubmit - Função chamada quando o formulário é enviado
 * @param isLoading - Estado de loading do formulário
 * @param initialData - Dados iniciais para edição
 * @param isEditing - Se está em modo de edição
 */
interface ClienteFormProps {
  onSubmit: (data: ClienteFormData) => void
  isLoading?: boolean
  initialData?: Partial<ClienteFormData>
  isEditing?: boolean
}
```

---

## 📋 Checklist de Qualidade

### **Antes de Finalizar uma Funcionalidade:**
- [ ] Código segue as convenções de nomenclatura
- [ ] Componentes são reutilizáveis
- [ ] Validações estão implementadas
- [ ] Responsividade testada
- [ ] Performance otimizada
- [ ] Documentação atualizada
- [ ] Testes realizados

### **Antes de Fazer Deploy:**
- [ ] Build sem erros
- [ ] Lint sem problemas
- [ ] Testes passando
- [ ] Performance adequada
- [ ] SEO configurado
- [ ] Backup realizado

---

**Última atualização**: Dezembro 2024  
**Versão**: 1.0.0  
**Responsável**: Equipe de Desenvolvimento 