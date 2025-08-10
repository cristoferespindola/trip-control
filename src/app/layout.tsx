import type { Metadata } from 'next'
import './globals.css'
import Layout from '@/components/Layout'
import { AuthProvider } from '@/contexts/AuthContext'

export const metadata: Metadata = {
  title: 'TripControl - Sistema de Controle de Viagens',
  description: 'Sistema completo para gerenciamento de frota, motoristas, clientes e viagens',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body>
        <AuthProvider>
          <Layout>
            {children}
          </Layout>
        </AuthProvider>
      </body>
    </html>
  )
}
