---
name: UI/UX
about: Suggest UI/UX improvements or report design issues
title: '[UI/UX] '
labels: 'ui/ux'
assignees: ''

---

## 🎨 Melhoria de UI/UX

### 📝 Descrição

Descreva a melhoria de interface ou problema de experiência do usuário.

### 🎯 Tipo de Melhoria

- [ ] Visual Design
- [ ] User Experience
- [ ] Accessibility
- [ ] Responsive Design
- [ ] Navigation
- [ ] Forms
- [ ] Feedback
- [ ] Loading States
- [ ] Error Handling
- [ ] Outro: [especifique]

### 🔍 Problema Atual

Descreva o problema de UI/UX que você está enfrentando:

- **O que não está funcionando bem?**
- **Qual é o impacto na experiência do usuário?**
- **Quando acontece?**

### 💡 Sugestão de Melhoria

Descreva como você gostaria que a interface fosse melhorada:

- [ ] Melhorar layout
- [ ] Adicionar animações
- [ ] Melhorar feedback visual
- [ ] Otimizar para mobile
- [ ] Melhorar acessibilidade
- [ ] Simplificar navegação
- [ ] Adicionar tooltips
- [ ] Outro: [especifique]

### 📋 Área Específica

Se aplicável, especifique a área que precisa de melhoria:

- [ ] Dashboard
- [ ] Formulários
- [ ] Listas/Tabelas
- [ ] Modais/Dialogs
- [ ] Navegação
- [ ] Feedback/Notificações
- [ ] Loading/Error States
- [ ] Outro: [especifique]

### 🔧 Como Reproduzir

1. Acesse [URL específica]
2. Execute [ação específica]
3. Observe [problema de UI/UX]
4. Compare com [comportamento esperado]

### 📊 Impacto na UX

Descreva o impacto na experiência do usuário:

- **Usabilidade**: [ex: difícil de usar, confuso]
- **Eficiência**: [ex: demora muito, muitos cliques]
- **Satisfação**: [ex: frustrante, não intuitivo]
- **Acessibilidade**: [ex: não funciona com leitores de tela]

### 💻 Exemplo de Implementação

Se você tem sugestões específicas, forneça exemplos:

```jsx
// Exemplo de componente melhorado
function ImprovedButton({ children, loading, ...props }) {
  return (
    <button 
      className="btn btn-primary"
      disabled={loading}
      {...props}
    >
      {loading ? <Spinner /> : children}
    </button>
  );
}
```

### 📋 Informações do Ambiente

- **OS**: [e.g. Windows 10, macOS, Ubuntu]
- **Browser**: [e.g. Chrome, Safari, Firefox]
- **Device**: [e.g. Desktop, Mobile, Tablet]
- **Screen Size**: [ex: 1920x1080, 375x667]

### 📸 Screenshots

**Obrigatório**: Adicione screenshots de:
- Problema atual
- Comportamento esperado (se possível)
- Comparação com outros sites (se aplicável)

### 🎨 Design System

Se aplicável, mencione:
- [ ] Cores do design system
- [ ] Componentes existentes
- [ ] Padrões de design
- [ ] Brand guidelines

### 🔗 Links Relacionados

- [Issues relacionadas](#)
- [Design system](#)
- [Protótipos](#)

---

**Obrigado por ajudar a melhorar nossa interface! 🎨✨**
