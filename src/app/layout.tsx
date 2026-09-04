import { Metadata } from 'next';
import Sidebar from '@/components/layout/Sidebar';
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
        <div className="flex min-h-screen">
          {/* Global Navigation Sidebar */}
          <Sidebar />

          {/* Main Workspace Area */}
          <main className="flex-1 overflow-x-auto">{children}</main>
        </div>
      </body>
    </html>
  );
}