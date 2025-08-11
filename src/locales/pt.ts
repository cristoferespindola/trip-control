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
    },
    status: {
      active: 'Ativo',
      inactive: 'Inativo',
    },
    messages: {
      created: 'Usuário criado com sucesso!',
      updated: 'Usuário atualizado com sucesso!',
      deleted: 'Usuário excluído com sucesso!',
      confirmDelete: 'Tem certeza que deseja excluir este usuário?',
    },
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
}
