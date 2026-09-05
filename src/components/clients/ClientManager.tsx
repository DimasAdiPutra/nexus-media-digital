'use client';

import { useState, useEffect, useCallback, useTransition } from 'react';
import {
  getClients,
  createClient,
  updateClient,
  deleteClient,
  ClientInput,
} from '@/app/actions/client';
import ClientTable, { Client } from '@/components/clients/ClientTable';
import ClientModal from '@/components/clients/ClientModal';
import ClientSearch from '@/components/clients/ClientSearch';
import ClientHeaderActions from '@/components/clients/ClientHeaderActions';

export default function ClientManager() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isPending, startTransition] = useTransition();

  const [formData, setFormData] = useState<ClientInput>({
    name: '',
    email: '',
    companyName: '',
    phone: '',
    address: '',
  });

  const fetchClients = useCallback(async () => {
    try {
      const response = await getClients();
      if (response.success && response.data) {
        setClients(response.data as Client[]);
      }
    } catch (error) {
      console.error('Failed to load clients:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let isSubscribed = true;

		const loadData = async () => {
			await fetchClients()
		}
		
    if (isSubscribed) {
      loadData()
    }

    return () => {
      isSubscribed = false;
    };
  }, [fetchClients]);

  const handleOpenModal = (client?: Client) => {
    if (client) {
      setEditingClient(client);
      setFormData({
        name: client.name,
        email: client.email,
        companyName: client.companyName,
        phone: client.phone || '',
        address: client.address || '',
      });
    } else {
      setEditingClient(null);
      setFormData({
        name: '',
        email: '',
        companyName: '',
        phone: '',
        address: '',
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingClient(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      if (editingClient) {
        const res = await updateClient(editingClient.id, formData);
        if (res.success) {
          fetchClients();
          handleCloseModal();
        }
      } else {
        const res = await createClient(formData);
        if (res.success) {
          fetchClients();
          handleCloseModal();
        }
      }
    });
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this client record?')) {
      startTransition(async () => {
        const res = await deleteClient(id);
        if (res.success) {
          fetchClients();
        }
      });
    }
  };

  const filteredClients = clients.filter(
    (client) =>
      client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      {/* Top Bar Actions & Search */}
      <div className="mb-6 flex items-center justify-between gap-4">
        <ClientSearch value={searchQuery} onChange={setSearchQuery} />
        <div className="flex items-center gap-4">
          <div className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 shadow-sm">
            Total Registered Clients: <span className="font-bold text-indigo-600">{clients.length}</span>
          </div>
          <ClientHeaderActions onOpenModal={() => handleOpenModal()} />
        </div>
      </div>

      {/* Client Table */}
      <ClientTable
        clients={filteredClients}
        loading={loading}
        onEdit={handleOpenModal}
        onDelete={handleDelete}
      />

      {/* Client Form Modal */}
      <ClientModal
        isOpen={isModalOpen}
        editingClient={editingClient}
        formData={formData}
        isPending={isPending}
        onClose={handleCloseModal}
        onChange={setFormData}
        onSubmit={handleSubmit}
      />
    </>
  );
}