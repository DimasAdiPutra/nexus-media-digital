import { Metadata } from 'next';
import '@/app/globals.css';

export const metadata: Metadata = {
  title: {
    default: 'Nexus Media Digital - Invoicing & Payment Tracker',
    template: '%s | Nexus Media Digital',
  },
  description: 'Client Invoicing and Payment Tracking System for Nexus Media Digital.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-slate-50 text-slate-900 antialiased">
        {children}
      </body>
    </html>
  );
}