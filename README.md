![image](./public/trip-control-full.png)
# TripControl - Sistema de Controle de Viagens

Sistema completo para gerenciamento de frota, motoristas, clientes e viagens. Desenvolvido com Next.js 14, Prisma, PostgreSQL e Tailwind CSS.

## 🚀 Deploy na Vercel

### Pré-requisitos
- Conta na [Vercel](https://vercel.com)
- Banco de dados PostgreSQL (recomendamos [Neon](https://neon.tech) ou [Supabase](https://supabase.com))

### Passos para Deploy

1. **Fork/Clone o repositório**
   ```bash
   git clone <seu-repositorio>
   cd trip-control
   ```

2. **Configure o banco de dados**
   - Crie um banco PostgreSQL na Vercel, Neon ou Supabase
   - Copie a URL de conexão

3. **Deploy na Vercel**
   - Conecte seu repositório na Vercel
   - Configure as variáveis de ambiente:
     ```
     DATABASE_URL=sua_url_do_banco_postgresql
     ```
   - Deploy automático será iniciado

4. **Configuração do banco**
   - Após o primeiro deploy, acesse o projeto
   - O Prisma irá criar as tabelas automaticamente
   - Opcional: Execute o seed para dados de exemplo

### Variáveis de Ambiente

Crie um arquivo `.env.local` para desenvolvimento local:

```env
DATABASE_URL="postgresql://usuario:senha@localhost:5432/trip_control?schema=public"
```

## 🛠️ Desenvolvimento Local

### Instalação

```bash
# Clone o repositório
git clone <url-do-repositorio>
cd trip-control

# Instale as dependências
npm install

# Configure o banco de dados
npm run setup

# Execute o seed (opcional)
npm run seed

# Inicie o servidor de desenvolvimento
npm run dev
```

### Scripts Disponíveis

- `npm run dev` - Servidor de desenvolvimento
- `npm run build` - Build para produção
- `npm run start` - Servidor de produção
- `npm run lint` - Verificação de código
- `npm run seed` - Popula o banco com dados de exemplo
- `npm run setup` - Configuração inicial do projeto

## 📊 Funcionalidades

### 🚗 Gestão de Veículos
- Cadastro de veículos com placa, modelo, marca, ano
- Controle de capacidade e status
- Histórico de viagens por veículo

### 👨‍💼 Gestão de Motoristas
- Cadastro completo de motoristas
- Controle de CNH e status
- Histórico de viagens por motorista

### 🏢 Gestão de Clientes
- Cadastro de clientes (pessoa física e jurídica)
- Controle de CPF/CNPJ e status
- Histórico de viagens por cliente

### 🗺️ Gestão de Viagens
- Registro completo de viagens
- Integração com API do IBGE para cidades
- Controle de custos (combustível, pedágio, outros)
- Status de viagem (Agendada, Em Andamento, Concluída, Cancelada)
- Relacionamento com veículo, motorista e cliente

## 🏗️ Arquitetura

### Frontend
- **Next.js 14** com App Router
- **TypeScript** para tipagem estática
- **Tailwind CSS** para estilização
- **Headless UI** para componentes acessíveis
- **Heroicons** para ícones

### Backend
- **API Routes** do Next.js
- **Prisma ORM** para banco de dados
- **PostgreSQL** como banco principal

### Banco de Dados
- **Prisma Schema** com relacionamentos
- **Migrations** para controle de versão
- **Seed** para dados iniciais

## 📁 Estrutura do Projeto

```
trip-control/
├── src/
│   ├── app/                 # App Router (Next.js 14)
│   │   ├── api/            # API Routes
│   │   ├── vehicles/       # Página de veículos
│   │   ├── drivers/        # Página de motoristas
│   │   ├── clients/        # Página de clientes
│   │   ├── trips/          # Página de viagens
│   │   ├── layout.tsx      # Layout principal
│   │   └── page.tsx        # Página inicial
│   ├── components/         # Componentes reutilizáveis
│   │   ├── Layout.tsx      # Layout com navegação
│   │   └── modal/          # Componente modal
│   ├── lib/               # Utilitários
│   │   └── prisma.ts      # Cliente Prisma
│   ├── models/            # Modelos de dados
│   │   └── cities.ts      # API de cidades
│   └── types/             # Tipos TypeScript
│       └── index.ts       # Interfaces
├── prisma/                # Configuração Prisma
│   └── schema.prisma      # Schema do banco
├── scripts/               # Scripts utilitários
│   ├── setup.sh          # Setup inicial
│   └── seed.js           # Dados de exemplo
├── public/               # Arquivos estáticos
└── package.json          # Dependências
```

## 🔧 Configuração do Banco

### PostgreSQL Local (macOS)
```bash
# Instalar PostgreSQL
brew install postgresql

# Iniciar serviço
brew services start postgresql

# Criar banco
createdb trip_control

# Configurar .env
echo 'DATABASE_URL="postgresql://cristoferespindola@localhost:5432/trip_control?schema=public"' > .env
```

### Migrations
```bash
# Gerar migration
npx prisma migrate dev --name init

# Aplicar migrations
npx prisma migrate deploy

# Reset do banco (desenvolvimento)
npx prisma migrate reset
```

## 🎨 Interface

### Design System
- **Cores**: Laranja (#f97316) como cor principal
- **Tipografia**: Sistema de fontes do Tailwind
- **Componentes**: Modais, formulários, tabelas responsivas
- **Responsividade**: Mobile-first design

### Componentes Principais
- **Modal**: Sistema de modais deslizantes
- **Layout**: Navegação com indicador de página ativa
- **Formulários**: Validação e UX otimizada
- **Tabelas**: Responsivas com ações inline

## 🚀 Deploy

### Vercel (Recomendado)
- Deploy automático via Git
- Integração com PostgreSQL
- SSL automático
- CDN global

### Outras Plataformas
- **Railway**: Suporte nativo ao PostgreSQL
- **Netlify**: Funciona com adaptações
- **Heroku**: Suporte completo

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📞 Suporte

Para suporte, envie um email para [seu-email@exemplo.com] ou abra uma issue no GitHub.

---

Desenvolvido com ❤️ usando Next.js, Prisma e Tailwind CSS. 