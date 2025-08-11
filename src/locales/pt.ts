export const pt = {
  // Navegação
  nav: {
    dashboard: 'Dashboard',
    vehicles: 'Veículos',
    drivers: 'Motoristas',
    clients: 'Clientes',
    trips: 'Viagens',
    users: 'Usuários',
    reports: 'Relatórios',
    logout: 'Sair',
    settings: 'Configurações',
  },

  // Dashboard
  dashboard: {
    title: 'Painel de Controle',
    subtitle: 'Sistema de Controle de Viagens',
    stats: {
      totalVehicles: 'Total de Veículos',
      totalDrivers: 'Total de Motoristas',
      totalClients: 'Total de Clientes',
      totalTrips: 'Total de Viagens',
      activeTrips: 'Viagens Ativas',
      completedTrips: 'Viagens Concluídas',
    },
    modules: {
      vehicles: 'Gestão de Veículos',
      drivers: 'Gestão de Motoristas',
      clients: 'Gestão de Clientes',
      trips: 'Gestão de Viagens',
      users: 'Gestão de Usuários',
    },
    quickActions: 'Ações Rápidas',
  },

  // Formulários
  forms: {
    add: 'Adicionar',
    edit: 'Editar',
    save: 'Salvar',
    cancel: 'Cancelar',
    delete: 'Excluir',
    confirm: 'Confirmar',
    close: 'Fechar',
    search: 'Buscar',
    filter: 'Filtrar',
    clear: 'Limpar',
    update: 'Atualizar',
    create: 'Criar',
    register: 'Cadastrar',
    select: 'Selecione',
  },

  // Veículos
  vehicles: {
    title: 'Veículos',
    addVehicle: 'Adicionar Veículo',
    editVehicle: 'Editar Veículo',
    deleteVehicle: 'Excluir Veículo',
    fields: {
      plate: 'Placa',
      model: 'Modelo',
      brand: 'Marca',
      year: 'Ano',
      color: 'Cor',
      capacity: 'Capacidade',
      status: 'Status',
    },
    status: {
      active: 'Ativo',
      maintenance: 'Manutenção',
      inactive: 'Inativo',
    },
    messages: {
      created: 'Veículo criado com sucesso!',
      updated: 'Veículo atualizado com sucesso!',
      deleted: 'Veículo excluído com sucesso!',
      confirmDelete: 'Tem certeza que deseja excluir este veículo?',
    },
  },

  // Motoristas
  drivers: {
    title: 'Motoristas',
    addDriver: 'Adicionar Motorista',
    editDriver: 'Editar Motorista',
    deleteDriver: 'Excluir Motorista',
    fields: {
      name: 'Nome',
      cnh: 'CNH',
      phone: 'Telefone',
      email: 'E-mail',
      address: 'Endereço',
      status: 'Status',
    },
    status: {
      active: 'Ativo',
      inactive: 'Inativo',
      vacation: 'Férias',
    },
    messages: {
      created: 'Motorista criado com sucesso!',
      updated: 'Motorista atualizado com sucesso!',
      deleted: 'Motorista excluído com sucesso!',
      confirmDelete: 'Tem certeza que deseja excluir este motorista?',
    },
  },

  // Clientes
  clients: {
    title: 'Clientes',
    addClient: 'Adicionar Cliente',
    editClient: 'Editar Cliente',
    deleteClient: 'Excluir Cliente',
    fields: {
      name: 'Nome',
      cnpj: 'CNPJ',
      phone: 'Telefone',
      email: 'E-mail',
      address: 'Endereço',
      status: 'Status',
    },
    status: {
      active: 'Ativo',
      inactive: 'Inativo',
      blocked: 'Bloqueado',
    },
    messages: {
      created: 'Cliente criado com sucesso!',
      updated: 'Cliente atualizado com sucesso!',
      deleted: 'Cliente excluído com sucesso!',
      confirmDelete: 'Tem certeza que deseja excluir este cliente?',
    },
  },

  // Viagens
  trips: {
    title: 'Viagens',
    addTrip: 'Adicionar Viagem',
    editTrip: 'Editar Viagem',
    deleteTrip: 'Excluir Viagem',
    fields: {
      origin: 'Origem',
      destination: 'Destino',
      departureDate: 'Data de Partida',
      returnDate: 'Data de Retorno',
      vehicle: 'Veículo',
      driver: 'Motorista',
      client: 'Cliente',
      status: 'Status',
      description: 'Descrição',
      initialKilometer: 'Kilometragem Inicial',
      finalKilometer: 'Kilometragem Final',
      tripValue: 'Valor da Viagem',
      notes: 'Observações',
    },
    status: {
      scheduled: 'Agendada',
      inProgress: 'Em Andamento',
      completed: 'Concluída',
      cancelled: 'Cancelada',
    },
    messages: {
      created: 'Viagem criada com sucesso!',
      updated: 'Viagem atualizada com sucesso!',
      deleted: 'Viagem excluída com sucesso!',
      confirmDelete: 'Tem certeza que deseja excluir esta viagem?',
      noTripsFound: 'Nenhuma viagem encontrada',
      noTripsMatchFilters: 'Nenhuma viagem corresponde aos filtros aplicados',
    },
    actions: {
      viewTrip: 'Visualizar viagem',
      manageExpenses: 'Gerenciar despesas',
      editTrip: 'Editar viagem',
      deleteTrip: 'Excluir viagem',
    },
  },

  // Usuários
  users: {
    title: 'Usuários',
    addUser: 'Adicionar Usuário',
    editUser: 'Editar Usuário',
    deleteUser: 'Excluir Usuário',
    fields: {
      name: 'Nome',
      username: 'Usuário',
      email: 'E-mail',
      role: 'Perfil',
      status: 'Status',
    },
    roles: {
      admin: 'Administrador',
      user: 'Usuário',
      manager: 'Gerente',
    },
    status: {
      active: 'Ativo',
      inactive: 'Inativo',
      suspended: 'Suspenso',
    },
    messages: {
      created: 'Usuário criado com sucesso!',
      updated: 'Usuário atualizado com sucesso!',
      deleted: 'Usuário excluído com sucesso!',
      confirmDelete: 'Tem certeza que deseja excluir este usuário?',
    },
  },

  // Relatórios
  reports: {
    title: 'Relatórios',
    subtitle:
      'Acesse relatórios detalhados sobre viagens, despesas e análise financeira',
    accessReport: 'Acessar relatório',
    byVehicle: {
      title: 'Viagens por Veículo',
      description: 'Relatório de viagens agrupadas por veículo',
    },
    byDriver: {
      title: 'Viagens por Motorista',
      description: 'Relatório de viagens agrupadas por motorista',
    },
    byClient: {
      title: 'Viagens por Cliente',
      description: 'Relatório de viagens agrupadas por cliente',
    },
    expenses: {
      title: 'Relatório de Despesas',
      description: 'Análise detalhada de despesas',
    },
    financial: {
      title: 'Relatório Financeiro',
      description: 'Análise financeira completa',
    },
    detailedTrips: 'Viagens Detalhadas',
    totalTrips: 'Total de Viagens',
    totalExpenses: 'Total de Despesas',
    expensesLabel: 'Despesas',
    totalValue: 'Valor Total',
    finalValue: 'Valor Final',
    loadingReport: 'Carregando relatório...',
    loadingFinancial: 'Carregando relatório financeiro...',
    loadingExpenses: 'Carregando despesas...',
    noDataForPeriod: 'Nenhum dado encontrado para o período selecionado',
  },

  // Configurações
  settings: {
    title: 'Configurações da Empresa',
    subtitle: 'Personalize o nome, cores e informações da sua empresa',
    companyName: 'Nome da Empresa',
    companySlogan: 'Slogan',
    primaryColor: 'Cor Primária',
    secondaryColor: 'Cor Secundária',
    logo: 'Logo da Empresa',
    favicon: 'Favicon',
    contactEmail: 'Email de Contato',
    contactPhone: 'Telefone de Contato',
    website: 'Website',
    address: 'Endereço',
    cnpj: 'CNPJ',
    saveSettings: 'Salvar Configurações',
    saving: 'Salvando...',
    updatedSuccess: 'Configurações atualizadas com sucesso!',
    updateError: 'Erro ao atualizar configurações',
    placeholders: {
      companyName: 'Nome da sua empresa',
      slogan: 'Slogan da empresa',
      contactEmail: 'contato@empresa.com',
      contactPhone: '(11) 99999-9999',
      website: 'https://empresa.com',
      cnpj: '00.000.000/0000-00',
      address: 'Endereço completo da empresa',
    },
  },

  // Upload de Imagens
  upload: {
    uploading: 'Enviando...',
    upload: 'Upload',
    acceptedFormats: 'Formatos aceitos: JPG, PNG, GIF, WebP, SVG',
    maxSize: 'Tamanho máximo: 5MB',
    willReplace: '⚠️ A imagem atual será substituída',
    unsupportedType:
      'Tipo de arquivo não suportado. Use: JPG, PNG, GIF, WebP ou SVG',
    fileTooLarge: 'Arquivo muito grande. Máximo 5MB',
    uploadError: 'Erro no upload',
    serverError: 'Erro interno no servidor',
  },

  // Login
  login: {
    title: 'TripControl',
    subtitle: 'Sistema de Controle de Viagens',
    username: 'Usuário',
    password: 'Senha',
    login: 'Entrar',
    error: 'Usuário ou senha incorretos',
    loading: 'Entrando...',
  },

  // Footer
  footer: {
    developedBy: 'Desenvolvido por CE',
  },

  // Mensagens gerais
  messages: {
    loading: 'Carregando...',
    error: 'Erro',
    success: 'Sucesso',
    warning: 'Aviso',
    info: 'Informação',
    noData: 'Nenhum dado encontrado',
    confirmAction: 'Tem certeza que deseja realizar esta ação?',
    actionCancelled: 'Ação cancelada',
  },

  // Validações
  validation: {
    required: 'Este campo é obrigatório',
    email: 'E-mail inválido',
    minLength: 'Mínimo de {min} caracteres',
    maxLength: 'Máximo de {max} caracteres',
    invalidFormat: 'Formato inválido',
  },

  // Filtros
  filters: {
    title: 'Filtros',
    startDate: 'Data Inicial',
    endDate: 'Data Final',
    filter: 'Filtrar',
    selectStartDate: 'Selecione a data inicial',
    selectEndDate: 'Selecione a data final',
  },

  // Cidades
  cities: {
    placeholder: 'Digite o nome da cidade',
    loading: 'Carregando...',
    noCitiesFound: 'Nenhuma cidade encontrada',
    errorSearching: 'Erro ao buscar cidades:',
  },

  // Tabelas
  table: {
    name: 'Nome',
    cpfCnpj: 'CPF/CNPJ',
    phone: 'Telefone',
    email: 'E-mail',
    status: 'Status',
    actions: 'Ações',
    address: 'Endereço',
    completeAddress: 'Endereço completo',
  },
}
