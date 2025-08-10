![image](./public/trip-control-full.png)

**[🇧🇷 Ver Versão em Português](./README.md)**

# TripControl - Trip Management System

Complete system for fleet, drivers, clients, and trip management. Built with Next.js 14, Prisma, PostgreSQL, and Tailwind CSS.

## 🚀 Deploy to Vercel

### Prerequisites

- [Vercel](https://vercel.com) account
- PostgreSQL database (we recommend [Neon](https://neon.tech) or [Supabase](https://supabase.com))

### Deployment Steps

1. **Fork/Clone the repository**

   ```bash
   git clone <your-repository>
   cd trip-control
   ```

2. **Configure the database**
   - Create a PostgreSQL database on Vercel, Neon, or Supabase
   - Copy the connection URL

3. **Deploy to Vercel**
   - Connect your repository to Vercel
   - Configure environment variables:
     ```
     DATABASE_URL=your_postgresql_database_url
     ```
   - Automatic deployment will start

4. **Database setup**
   - After the first deployment, access the project
   - Prisma will create tables automatically
   - Optional: Run seed for sample data

### Environment Variables

Create a `.env.local` file for local development:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/trip_control?schema=public"
```

## 🛠️ Local Development

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd trip-control

# Install dependencies
npm install

# Configure the database
npm run setup

# Run seed (optional)
npm run seed

# Start development server
npm run dev
```

### Available Scripts

- `npm run dev` - Development server
- `npm run build` - Production build
- `npm run start` - Production server
- `npm run lint` - Code verification
- `npm run seed` - Populate database with sample data
- `npm run setup` - Initial project setup

## 📊 Features

### 🚗 Vehicle Management

- Vehicle registration with license plate, model, brand, year
- Capacity and status control
- Trip history per vehicle

### 👨‍💼 Driver Management

- Complete driver registration
- License and status control
- Trip history per driver

### 🏢 Client Management

- Client registration (individual and corporate)
- CPF/CNPJ control and status
- Trip history per client

### 🗺️ Trip Management

- Complete trip registration
- IBGE API integration for cities
- Cost control (fuel, toll, others)
- Trip status (Scheduled, In Progress, Completed, Cancelled)
- Relationship with vehicle, driver, and client

## 🏗️ Architecture

### Frontend

- **Next.js 14** with App Router
- **TypeScript** for static typing
- **Tailwind CSS** for styling
- **Headless UI** for accessible components
- **Heroicons** for icons

### Backend

- **Next.js API Routes**
- **Prisma ORM** for database
- **PostgreSQL** as main database

### Database

- **Prisma Schema** with relationships
- **Migrations** for version control
- **Seed** for initial data

## 📁 Project Structure

```
trip-control/
├── src/
│   ├── app/                 # App Router (Next.js 14)
│   │   ├── api/            # API Routes
│   │   ├── vehicles/       # Vehicles page
│   │   ├── drivers/        # Drivers page
│   │   ├── clients/        # Clients page
│   │   ├── trips/          # Trips page
│   │   ├── layout.tsx      # Main layout
│   │   └── page.tsx        # Home page
│   ├── components/         # Reusable components
│   │   ├── Layout.tsx      # Navigation layout
│   │   └── modal/          # Modal component
│   ├── lib/               # Utilities
│   │   └── prisma.ts      # Prisma client
│   ├── models/            # Data models
│   │   └── cities.ts      # Cities API
│   └── types/             # TypeScript types
│       └── index.ts       # Interfaces
├── prisma/                # Prisma configuration
│   └── schema.prisma      # Database schema
├── scripts/               # Utility scripts
│   ├── setup.sh          # Initial setup
│   └── seed.js           # Sample data
├── public/               # Static files
└── package.json          # Dependencies
```

## 🔧 Database Configuration

### Local PostgreSQL (macOS)

```bash
# Install PostgreSQL
brew install postgresql

# Start service
brew services start postgresql

# Create database
createdb trip_control

# Configure .env
echo 'DATABASE_URL="postgresql://cristoferespindola@localhost:5432/trip_control?schema=public"' > .env
```

### Migrations

```bash
# Generate migration
npx prisma migrate dev --name init

# Apply migrations
npx prisma migrate deploy

# Reset database (development)
npx prisma migrate reset
```

## 🎨 Interface

### Design System

- **Colors**: Orange (#f97316) as primary color
- **Typography**: Tailwind font system
- **Components**: Modals, forms, responsive tables
- **Responsiveness**: Mobile-first design

### Main Components

- **Modal**: Sliding modal system
- **Layout**: Navigation with active page indicator
- **Forms**: Optimized validation and UX
- **Tables**: Responsive with inline actions

## 🚀 Deployment

### Vercel (Recommended)

- Automatic deployment via Git
- PostgreSQL integration
- Automatic SSL
- Global CDN

### Other Platforms

- **Railway**: Native PostgreSQL support
- **Netlify**: Works with adaptations
- **Heroku**: Complete support

## 📝 License

This project is under the MIT license. See the [LICENSE](LICENSE) file for more details.

## 🤝 Contributing

1. Fork the project
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📞 Support

For support, send an email to [your-email@example.com] or open an issue on GitHub.

---

Developed with ❤️ using Next.js, Prisma, and Tailwind CSS.
