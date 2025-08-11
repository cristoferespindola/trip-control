![image](./public/trip-control-full.png)

**[🇺🇸 See English Version](./README_EN.md)**

# TripControl - Sistema de Controle de Viagens

Sistema completo para gestão de veículos, motoristas, clientes e viagens com suporte a múltiplos idiomas e personalização white label.

## 🚀 Funcionalidades

- **Gestão de Veículos**: Cadastro, edição e controle de status
- **Gestão de Motoristas**: Dados pessoais, CNH e status
- **Gestão de Clientes**: Cadastro de clientes com CPF/CNPJ
- **Gestão de Viagens**: Agendamento, acompanhamento e relatórios
- **Gestão de Despesas**: Controle de gastos por viagem
- **Relatórios**: Relatórios financeiros e por período
- **Sistema de Usuários**: Controle de acesso e permissões
- **Internacionalização**: Suporte a português e inglês
- **White Label**: Personalização completa da marca

## 🎨 Sistema White Label

O TripControl oferece personalização completa da marca através do sistema white label:

### Configurações Disponíveis

- **Nome da Empresa**: Personalização do nome exibido no sistema
- **Slogan**: Subtítulo personalizado
- **Cores**: Cores primária e secundária da marca
- **Logos**: Upload de logo principal e favicon
- **Informações de Contato**: Email, telefone, website
- **Dados da Empresa**: Endereço e CNPJ

### Sistema de Upload de Imagens

O sistema inclui um gerenciador de uploads inteligente:

#### Características

- **Substituição Automática**: Ao fazer upload de uma nova imagem, a antiga é automaticamente deletada
- **Validação**: Suporta JPG, PNG, GIF, WebP e SVG (máximo 5MB)
- **Preview**: Visualização em tempo real antes do upload
- **Organização**: Arquivos organizados por pasta (logos, favicons)
- **Limpeza Automática**: Script para remover arquivos antigos não utilizados

#### Como Usar

1. Acesse a página de configurações (apenas administradores)
2. Clique na área de upload desejada
3. Selecione a imagem (a antiga será substituída automaticamente)
4. Configure as cores e informações
5. Salve as configurações

#### Manutenção

Para limpar uploads antigos:

```bash
npm run cleanup-uploads
```

Este comando remove arquivos não utilizados com mais de 30 dias.

### Como Configurar

1. Acesse a página de **Configurações** (apenas administradores)
2. Preencha as informações da sua empresa
3. Defina as cores da sua marca
4. Adicione URLs dos logos (opcional)
5. Salve as configurações

### Aplicação Automática

As configurações são aplicadas automaticamente em:

- Logo e nome no cabeçalho
- Cores dos botões e elementos interativos
- Informações de contato no rodapé
- Loading spinner personalizado

## 🌐 Internacionalização

O sistema suporta múltiplos idiomas:

- **Português (pt)**: Idioma padrão
- **Inglês (en)**: Tradução completa

### Como Adicionar Novos Idiomas

1. Crie um novo arquivo em `src/locales/` (ex: `es.ts`)
2. Adicione as traduções seguindo a estrutura existente
3. Atualize o tipo `Language` em `src/locales/index.tsx`
4. Adicione o novo idioma ao objeto `translations`

## 🛠️ Tecnologias

- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL com Prisma ORM
- **Authentication**: Sistema próprio de autenticação
- **Icons**: Heroicons
- **Deploy**: Vercel

## 📦 Instalação

1. Clone o repositório:

```bash
git clone <repository-url>
cd trip-control
```

2. Instale as dependências:

```bash
npm install
```

3. Configure as variáveis de ambiente:

```bash
cp .env.example .env
```

4. Configure o banco de dados:

```bash
npx prisma db push
```

5. Execute os scripts de setup:

```bash
node scripts/setup-db.js
node scripts/setup-company-settings.js
```

6. Inicie o servidor de desenvolvimento:

```bash
npm run dev
```

## 🔧 Configuração do Banco de Dados

### Migrations

Para aplicar as migrations:

```bash
npx prisma migrate dev
```

Para resetar o banco:

```bash
npx prisma migrate reset
```

### Seed Data

Para popular o banco com dados iniciais:

```bash
node scripts/seed.js
```

## 📁 Estrutura do Projeto

```
src/
├── actions/           # Server Actions
├── app/              # App Router (Next.js 14)
│   ├── api/          # API Routes
│   ├── components/   # Componentes específicos das páginas
│   └── ...
├── components/       # Componentes reutilizáveis
├── contexts/         # Contextos React
├── lib/             # Utilitários e configurações
├── locales/         # Arquivos de tradução
├── types/           # Tipos TypeScript
└── utils/           # Funções utilitárias
```

## 🚀 Deploy

### Vercel

1. Conecte seu repositório ao Vercel
2. Configure as variáveis de ambiente
3. Deploy automático a cada push

### Outros Provedores

O projeto pode ser deployado em qualquer provedor que suporte Next.js.

## 📝 Licença

Este projeto está sob a licença MIT.

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📞 Suporte

Para suporte, entre em contato através do email configurado no sistema ou abra uma issue no repositório.
