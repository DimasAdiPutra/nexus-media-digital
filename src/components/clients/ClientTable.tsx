'use client';

import { Button } from '@/components/ui/button';

export interface Client {
  id: string;
  name: string;
  email: string;
  companyName: string;
  phone: string | null;
  address: string | null;
  createdAt: Date;
}

interface ClientTableProps {
  clients: Client[];
  loading: boolean;
  onEdit: (client: Client) => void;
  onDelete: (id: string) => void;
}

export default function ClientTable({
  clients,
  loading,
  onEdit,
  onDelete,
}: ClientTableProps) {
  if (loading) {
    return (
      <div className="p-8 text-center text-sm text-slate-500">
        Loading client directory...
      </div>
    );
  }

  if (clients.length === 0) {
    return (
      <div className="p-8 text-center text-sm text-slate-500">
        No clients found. Click &quot;Add New Client&quot; to create a record.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <table className="w-full text-left text-sm text-slate-600">
        <thead className="bg-slate-50 text-xs uppercase text-slate-500 border-b border-slate-200">
          <tr>
            <th className="px-6 py-4">Company Name</th>
            <th className="px-6 py-4">Contact Person</th>
            <th className="px-6 py-4">Email Address</th>
            <th className="px-6 py-4">Phone Number</th>
            <th className="px-6 py-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200">
          {clients.map((client) => (
            <tr key={client.id} className="hover:bg-slate-50/80 transition-colors">
              <td className="px-6 py-4 font-semibold text-slate-900">
                {client.companyName}
              </td>
              <td className="px-6 py-4">{client.name}</td>
              <td className="px-6 py-4 text-slate-500">{client.email}</td>
              <td className="px-6 py-4 text-slate-500">{client.phone || '-'}</td>
              <td className="px-6 py-4 text-right space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEdit(client)}
                >
                  Edit
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => onDelete(client.id)}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}