# 🚀 Guia de Deploy em Produção - Traffic Manager Hub

## 🎯 **CONFIGURAÇÃO ATUAL**

✅ **Backend**: Node.js/Express configurado  
✅ **Frontend**: Next.js configurado  
✅ **IA**: Integração ChatGPT implementada  
✅ **Autenticação**: JWT configurado  
✅ **Variáveis de Ambiente**: Configuradas  

## 🔧 **CONFIGURAÇÃO PARA PRODUÇÃO**

### **1. Variáveis de Ambiente (Produção)**

Crie um arquivo `.env` na pasta `backend/` com:

```env
# Configurações do Servidor
PORT=4000
NODE_ENV=production

# JWT Configuration (MUDE EM PRODUÇÃO!)
JWT_SECRET=sua_chave_secreta_super_segura_aqui_mude_obrigatoriamente
JWT_EXPIRES_IN=7d

# OpenAI API Key
OPENAI_API_KEY=your_openai_api_key_here

# Database (configurar conforme necessário)
DATABASE_URL=sua_url_do_banco_aqui

# Email (configurar conforme necessário)
GMAIL_USER=seu.email@gmail.com
GMAIL_PASS=sua_senha_de_app
```

### **2. Configuração do Frontend**

No arquivo `next.config.js`:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_API_URL: process.env.NODE_ENV === 'production' 
      ? 'https://seu-dominio.com/api' 
      : 'http://localhost:4000/api'
  }
}

module.exports = nextConfig
```

## 🌐 **OPÇÕES DE DEPLOY**

### **Opção A: Vercel (Recomendado)**

#### **Frontend (Vercel)**
1. Conecte seu repositório no Vercel
2. Configure as variáveis de ambiente:
   - `NEXT_PUBLIC_API_URL`: URL do seu backend

#### **Backend (Vercel Functions ou Railway)**
1. **Vercel Functions**: Deploy automático
2. **Railway**: Mais controle sobre o servidor

### **Opção B: Railway (Completo)**

1. Conecte o repositório no Railway
2. Configure as variáveis de ambiente
3. Deploy automático

### **Opção C: DigitalOcean/AWS**

1. Configure um servidor VPS
2. Instale Node.js e PM2
3. Configure nginx como proxy reverso

## 📦 **SCRIPTS DE BUILD**

### **Backend**
```bash
cd backend
npm install
npm run build
npm start
```

### **Frontend**
```bash
npm install
npm run build
npm start
```

## 🔒 **SEGURANÇA EM PRODUÇÃO**

### **Obrigatório:**
- [ ] Mudar JWT_SECRET para uma chave segura
- [ ] Configurar HTTPS
- [ ] Configurar CORS adequadamente
- [ ] Rate limiting
- [ ] Logs de erro

### **Recomendado:**
- [ ] Monitoramento (Sentry, LogRocket)
- [ ] Backup automático
- [ ] CDN para assets
- [ ] Cache Redis

## 🧪 **TESTE ANTES DO DEPLOY**

### **1. Teste Local**
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
npm run dev

# Terminal 3 - Teste IA
node teste-integracao-ia.js
```

### **2. Teste de Build**
```bash
# Backend
cd backend
npm run build

# Frontend
npm run build
```

## 🚀 **COMANDOS DE DEPLOY**

### **Vercel**
```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy frontend
vercel

# Deploy backend (se usar Vercel Functions)
vercel --prod
```

### **Railway**
```bash
# Instalar Railway CLI
npm i -g @railway/cli

# Login e deploy
railway login
railway up
```

## 📊 **MONITORAMENTO**

### **Logs Importantes**
- Erros de autenticação
- Falhas na API da OpenAI
- Performance do sistema
- Uso de recursos

### **Métricas**
- Número de diagnósticos gerados
- Tempo de resposta da IA
- Taxa de erro
- Uso de tokens da OpenAI

## 💰 **CUSTOS ESTIMADOS**

### **Vercel**
- Frontend: Gratuito (até 100GB)
- Backend: $20/mês (Pro)

### **Railway**
- $5/mês (básico)
- $20/mês (com mais recursos)

### **OpenAI**
- ~$0.01-0.02 por diagnóstico
- 200 diagnósticos = ~$2-4/mês

## 🔧 **TROUBLESHOOTING**

### **Erro: "OPENAI_API_KEY não configurada"**
- Verifique se a variável está no ambiente de produção
- Confirme se a chave é válida

### **Erro: "CORS"**
- Configure CORS no backend para o domínio de produção

### **Erro: "JWT"**
- Verifique se JWT_SECRET está configurado
- Confirme se o token não expirou

## ✅ **CHECKLIST DE DEPLOY**

- [ ] Variáveis de ambiente configuradas
- [ ] JWT_SECRET alterado
- [ ] Build testado localmente
- [ ] IA funcionando
- [ ] HTTPS configurado
- [ ] CORS configurado
- [ ] Logs configurados
- [ ] Monitoramento ativo

## 🎉 **SUCESSO!**

Após o deploy:
1. Teste todas as funcionalidades
2. Verifique se a IA está funcionando
3. Monitore os logs
4. Configure alertas

**Sistema pronto para produção! 🚀** 