import type { Metadata } from "next";
import "./globals.css";
import Layout from "@/components/Layout";

export const metadata: Metadata = {
  title: "Sistema de Controle de Viagens",
  description: "Gerencie veículos, motoristas, clientes e viagens de forma eficiente",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="antialiased">
        <Layout>{children}</Layout>
      </body>
    </html>
  );
}
