import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { QueryProvider } from "@/components/providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "NEXUS-Ω · Ecosistema Agéntico Multi-Stack",
  description:
    "Centro de control personal para planificar, auditar e indexar un ecosistema de agentes multi-stack: catálogo de skills, repositorios, fases y automatización trazable.",
  keywords: [
    "agentes autónomos",
    "MCP",
    "Model Context Protocol",
    "Supabase",
    "pgvector",
    "arquitectura de software",
    "ecosistema agéntico",
    "plan maestro",
  ],
  icons: {
    icon: "/logo.svg",
  },
  openGraph: {
    title: "NEXUS-Ω · Ecosistema Agéntico Multi-Stack",
    description: "Centro de control personal para skills, repositorios, fases y auditoría agéntica",
    siteName: "NEXUS-Ω",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-zinc-950 text-zinc-100`}
      >
        <QueryProvider>{children}</QueryProvider>
        <Toaster />
      </body>
    </html>
  );
}
