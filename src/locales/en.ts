export const en = {
  // Navigation
  nav: {
    dashboard: 'Dashboard',
    vehicles: 'Vehicles',
    drivers: 'Drivers',
    clients: 'Clients',
    trips: 'Trips',
    users: 'Users',
    reports: 'Reports',
    logout: 'Logout',
  },

  // Dashboard
  dashboard: {
    title: 'Control Panel',
    subtitle: 'Trip Management System',
    stats: {
      totalVehicles: 'Total Vehicles',
      totalDrivers: 'Total Drivers',
      totalClients: 'Total Clients',
      totalTrips: 'Total Trips',
      activeTrips: 'Active Trips',
      completedTrips: 'Completed Trips',
    },
    modules: {
      vehicles: 'Vehicle Management',
      drivers: 'Driver Management',
      clients: 'Client Management',
      trips: 'Trip Management',
      users: 'User Management',
    },
    quickActions: 'Quick Actions',
  },

  // Forms
  forms: {
    add: 'Add',
    edit: 'Edit',
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    confirm: 'Confirm',
    close: 'Close',
    search: 'Search',
    filter: 'Filter',
    clear: 'Clear',
    update: 'Update',
    create: 'Create',
    register: 'Register',
    select: 'Select',
  },

  // Vehicles
  vehicles: {
    title: 'Vehicles',
    addVehicle: 'Add Vehicle',
    editVehicle: 'Edit Vehicle',
    deleteVehicle: 'Delete Vehicle',
    fields: {
      plate: 'License Plate',
      model: 'Model',
      brand: 'Brand',
      year: 'Year',
      color: 'Color',
      capacity: 'Capacity',
      status: 'Status',
    },
    status: {
      active: 'Active',
      maintenance: 'Maintenance',
      inactive: 'Inactive',
    },
    messages: {
      created: 'Vehicle created successfully!',
      updated: 'Vehicle updated successfully!',
      deleted: 'Vehicle deleted successfully!',
      confirmDelete: 'Are you sure you want to delete this vehicle?',
    },
  },

  // Drivers
  drivers: {
    title: 'Drivers',
    addDriver: 'Add Driver',
    editDriver: 'Edit Driver',
    deleteDriver: 'Delete Driver',
    fields: {
      name: 'Name',
      cnh: 'License',
      phone: 'Phone',
      email: 'Email',
      address: 'Address',
      status: 'Status',
    },
    status: {
      active: 'Active',
      inactive: 'Inactive',
      vacation: 'Vacation',
    },
    messages: {
      created: 'Driver created successfully!',
      updated: 'Driver updated successfully!',
      deleted: 'Driver deleted successfully!',
      confirmDelete: 'Are you sure you want to delete this driver?',
    },
  },

  // Clients
  clients: {
    title: 'Clients',
    addClient: 'Add Client',
    editClient: 'Edit Client',
    deleteClient: 'Delete Client',
    fields: {
      name: 'Name',
      cnpj: 'CNPJ',
      phone: 'Phone',
      email: 'Email',
      address: 'Address',
      status: 'Status',
    },
    status: {
      active: 'Active',
      inactive: 'Inactive',
      blocked: 'Blocked',
    },
    messages: {
      created: 'Client created successfully!',
      updated: 'Client updated successfully!',
      deleted: 'Client deleted successfully!',
      confirmDelete: 'Are you sure you want to delete this client?',
    },
  },

  // Trips
  trips: {
    title: 'Trips',
    addTrip: 'Add Trip',
    editTrip: 'Edit Trip',
    deleteTrip: 'Delete Trip',
    fields: {
      origin: 'Origin',
      destination: 'Destination',
      departureDate: 'Departure Date',
      returnDate: 'Return Date',
      vehicle: 'Vehicle',
      driver: 'Driver',
      client: 'Client',
      status: 'Status',
      description: 'Description',
      initialKilometer: 'Initial Kilometer',
      finalKilometer: 'Final Kilometer',
      tripValue: 'Trip Value',
      notes: 'Notes',
    },
    status: {
      scheduled: 'Scheduled',
      inProgress: 'In Progress',
      completed: 'Completed',
      cancelled: 'Cancelled',
    },
    messages: {
      created: 'Trip created successfully!',
      updated: 'Trip updated successfully!',
      deleted: 'Trip deleted successfully!',
      confirmDelete: 'Are you sure you want to delete this trip?',
      noTripsFound: 'No trips found',
      noTripsMatchFilters: 'No trips match the applied filters',
    },
    actions: {
      viewTrip: 'View trip',
      manageExpenses: 'Manage expenses',
      editTrip: 'Edit trip',
      deleteTrip: 'Delete trip',
    },
  },

  // Users
  users: {
    title: 'Users',
    addUser: 'Add User',
    editUser: 'Edit User',
    deleteUser: 'Delete User',
    fields: {
      name: 'Name',
      username: 'Username',
      email: 'Email',
      role: 'Role',
      status: 'Status',
    },
    roles: {
      admin: 'Administrator',
      user: 'User',
      manager: 'Manager',
    },
    status: {
      active: 'Active',
      inactive: 'Inactive',
      suspended: 'Suspended',
    },
    messages: {
      created: 'User created successfully!',
      updated: 'User updated successfully!',
      deleted: 'User deleted successfully!',
      confirmDelete: 'Are you sure you want to delete this user?',
    },
  },

  // Login
  login: {
    title: 'TripControl',
    subtitle: 'Trip Management System',
    username: 'Username',
    password: 'Password',
    login: 'Login',
    error: 'Invalid username or password',
    loading: 'Logging in...',
  },

  // Footer
  footer: {
    developedBy: 'Developed by CE',
  },

  // General messages
  messages: {
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',
    warning: 'Warning',
    info: 'Information',
    noData: 'No data found',
    confirmAction: 'Are you sure you want to perform this action?',
    actionCancelled: 'Action cancelled',
  },

  // Validations
  validation: {
    required: 'This field is required',
    email: 'Invalid email',
    minLength: 'Minimum {min} characters',
    maxLength: 'Maximum {max} characters',
    invalidFormat: 'Invalid format',
  },

  // Filters
  filters: {
    title: 'Filters',
    startDate: 'Start Date',
    endDate: 'End Date',
    filter: 'Filter',
    selectStartDate: 'Select start date',
    selectEndDate: 'Select end date',
  },

  // Cities
  cities: {
    placeholder: 'Type the city name',
    loading: 'Loading...',
    noCitiesFound: 'No cities found',
    errorSearching: 'Error searching cities:',
  },

  // Tables
  table: {
    name: 'Name',
    cpfCnpj: 'CPF/CNPJ',
    phone: 'Phone',
    email: 'Email',
    status: 'Status',
    actions: 'Actions',
    address: 'Address',
    completeAddress: 'Complete address',
  },
}
