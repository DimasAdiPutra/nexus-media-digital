import { Metadata } from 'next';
import ClientManager from '@/components/clients/ClientManager';

export const metadata: Metadata = {
  title: 'Client Directory',
  description: 'Manage client accounts, contact information, and billing details for Nexus Media Digital.',
};

export default function ClientsPage() {
  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="mx-auto max-w-7xl">
        {/* Server-rendered Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">Client Directory</h1>
          <p className="mt-1 text-sm text-slate-500">
            Manage client details, contact information, and billing records for Nexus Media Digital.
          </p>
        </div>

        {/* Granular Client Management UI */}
        <ClientManager />
      </div>
    </div>
  );
}