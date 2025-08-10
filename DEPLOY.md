**[🇺🇸 See English Version](./DEPLOY_EN.md)**

# 🚀 Guia de Deploy na Vercel

Este guia te ajudará a fazer o deploy do TripControl na Vercel de forma rápida e eficiente.

## 📋 Pré-requisitos

- [ ] Conta na [Vercel](https://vercel.com)
- [ ] Conta no [GitHub](https://github.com)
- [ ] Banco de dados PostgreSQL (recomendamos [Neon](https://neon.tech))

## 🔧 Passo a Passo

### 1. Preparar o Repositório

```bash
# Clone o repositório
git clone <seu-repositorio>
cd trip-control

# Certifique-se de que está tudo commitado
git add .
git commit -m "Preparando para deploy"
git push origin main
```

### 2. Configurar Banco de Dados

#### Opção A: Neon (Recomendado)
1. Acesse [neon.tech](https://neon.tech)
2. Crie uma conta gratuita
3. Crie um novo projeto
4. Copie a URL de conexão (formato: `postgresql://user:password@host/database`)

#### Opção B: Supabase
1. Acesse [supabase.com](https://supabase.com)
2. Crie uma conta gratuita
3. Crie um novo projeto
4. Vá em Settings > Database
5. Copie a connection string

#### Opção C: Vercel Postgres
1. Na Vercel, vá em Storage
2. Crie um novo banco PostgreSQL
3. Copie a URL de conexão

### 3. Deploy na Vercel

#### Método 1: Importar do GitHub
1. Acesse [vercel.com](https://vercel.com)
2. Clique em "New Project"
3. Importe seu repositório do GitHub
4. Configure as variáveis de ambiente:
   ```
   DATABASE_URL=sua_url_do_banco_postgresql
   JWT_SECRET=trip-control-super-secret-jwt-key-2024
   ```
5. Clique em "Deploy"

#### Método 2: Vercel CLI
```bash
# Instalar Vercel CLI
npm i -g vercel

# Login na Vercel
vercel login

# Deploy
vercel

# Configurar variáveis de ambiente
vercel env add DATABASE_URL
vercel env add JWT_SECRET
```

### 4. Configurar Variáveis de Ambiente

Na Vercel, vá em:
1. **Settings** > **Environment Variables**
2. Adicione:
   ```
   Name: DATABASE_URL
   Value: sua_url_do_banco_postgresql
   Environment: Production, Preview, Development
   ```
   ```
   Name: JWT_SECRET
   Value: trip-control-super-secret-jwt-key-2024
   Environment: Production, Preview, Development
   ```

### 5. Setup Automático do Banco

O projeto está configurado para criar automaticamente:
- ✅ **Usuário admin** (admin/admin)
- ✅ **Dados de exemplo** (veículos, motoristas, clientes)

**Após o deploy:**
1. Acesse seu projeto na Vercel
2. O setup automático será executado
3. Use as credenciais: `admin` / `admin`

### 6. Setup Manual (Se necessário)

Se o setup automático não funcionar, você pode executar manualmente:

```bash
# Via API (recomendado)
curl -X POST https://seu-projeto.vercel.app/api/setup

# Ou via Vercel CLI
vercel env pull .env.local
npm run setup-db
```

## 🔍 Verificação do Deploy

### Checklist
- [ ] Build sem erros
- [ ] Banco de dados conectado
- [ ] Usuário admin criado
- [ ] Dados de exemplo carregados
- [ ] Login funcionando
- [ ] SSL ativo
- [ ] Domínio personalizado (opcional)

### Testes
1. Acesse a URL do projeto
2. **Login com admin/admin**
3. Teste o cadastro de veículos
4. Teste o cadastro de motoristas
5. Teste o cadastro de clientes
6. Teste o cadastro de viagens
7. Verifique a busca de cidades

## 🛠️ Troubleshooting

### Erro: "Database connection failed"
- Verifique se a `DATABASE_URL` está correta
- Confirme se o banco está acessível
- Teste a conexão localmente

### Erro: "Prisma client not generated"
- Verifique se o `postinstall` script está no package.json
- Force um rebuild na Vercel

### Erro: "Build failed"
- Verifique os logs na Vercel
- Confirme se todas as dependências estão no package.json
- Teste o build localmente: `npm run build`

### Erro: "API routes not working"
- Verifique se as rotas estão em `src/app/api/`
- Confirme se o Next.js está configurado corretamente

### Erro: "Usuário admin não criado"
- Execute o setup manual: `POST /api/setup`
- Verifique os logs da Vercel
- Confirme se as variáveis de ambiente estão corretas

## 📊 Monitoramento

### Vercel Analytics
- Ative o Vercel Analytics para monitorar performance
- Configure alertas para erros

### Logs
- Monitore os logs na Vercel
- Configure alertas para falhas de build

## 🔄 Deploy Automático

### GitHub Integration
1. Conecte seu repositório na Vercel
2. Configure branch de produção (geralmente `main`)
3. Cada push fará deploy automático

### Preview Deployments
- Pull requests geram previews automaticamente
- Teste mudanças antes de fazer merge

## 🚀 Otimizações

### Performance
- [ ] Imagens otimizadas
- [ ] Lazy loading implementado
- [ ] Bundle size otimizado

### SEO
- [ ] Meta tags configuradas
- [ ] Sitemap gerado
- [ ] Robots.txt configurado

### Segurança
- [ ] Variáveis de ambiente protegidas
- [ ] CORS configurado
- [ ] Rate limiting implementado

## 📞 Suporte

### Vercel Support
- [Documentação Vercel](https://vercel.com/docs)
- [Vercel Community](https://github.com/vercel/vercel/discussions)

### Banco de Dados
- **Neon**: [Documentação](https://neon.tech/docs)
- **Supabase**: [Documentação](https://supabase.com/docs)

### Prisma
- [Documentação Prisma](https://www.prisma.io/docs)
- [Prisma Discord](https://discord.gg/prisma)

---

🎉 **Parabéns!** Seu TripControl está no ar!

**URL do projeto**: https://seu-projeto.vercel.app

**Credenciais de acesso**:
- **Usuário**: `admin`
- **Senha**: `admin`

