import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Layout from '@/components/Layout'
import { AuthProvider } from '@/contexts/AuthContext'
import { TranslationProvider } from '@/locales'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'TripControl - Sistema de Controle de Viagens',
  description: 'Sistema completo para gestão de veículos, motoristas, clientes e viagens',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt">
      <body className={inter.className}>
        <TranslationProvider>
          <AuthProvider>
            <Layout>
              {children}
            </Layout>
          </AuthProvider>
        </TranslationProvider>
      </body>
    </html>
  )
}
