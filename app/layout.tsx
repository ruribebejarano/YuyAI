import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "YuyAI — Orquestador Educativo Multinivel para Primaria Rural",
  description:
    "Plataforma pedagógica multinivel con carga de currículo en PDF, grafo de temas por nivel y sesiones interactivas con voz.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="min-h-screen bg-crema-100 text-tierra-900 antialiased selection:bg-terracotta-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
