'use client'

import { ClientInput } from '@/app/actions/client'
import { Client } from './ClientTable'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface ClientModalProps {
	isOpen: boolean
	editingClient: Client | null
	formData: ClientInput
	isPending: boolean
	onClose: () => void
	onChange: (data: ClientInput) => void
	onSubmit: (e: React.FormEvent) => void
}

export default function ClientModal({
	isOpen,
	editingClient,
	formData,
	isPending,
	onClose,
	onChange,
	onSubmit,
}: ClientModalProps) {
	if (!isOpen) return null

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm">
			<div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
				<h2 className="text-xl font-bold text-slate-900 mb-4">
					{editingClient ? 'Edit Client Details' : 'Add New Client'}
				</h2>

				<form onSubmit={onSubmit} className="space-y-4">
					<Input
						label="Company Name"
						required
						value={formData.companyName}
						onChange={(e) =>
							onChange({ ...formData, companyName: e.target.value })
						}
						placeholder="e.g. Acme Corporation"
					/>

					<Input
						label="Contact Person"
						required
						value={formData.name}
						onChange={(e) => onChange({ ...formData, name: e.target.value })}
						placeholder="e.g. John Doe"
					/>

					<Input
						label="Email Address"
						type="email"
						required
						value={formData.email}
						onChange={(e) => onChange({ ...formData, email: e.target.value })}
						placeholder="john@acme.com"
					/>

					<Input
						label="Phone Number"
						value={formData.phone}
						onChange={(e) => onChange({ ...formData, phone: e.target.value })}
						placeholder="+62 812 3456 7890"
					/>

					<div>
						<label className="block text-xs font-semibold uppercase text-slate-600 mb-1">
							Billing Address
						</label>
						<textarea
							rows={3}
							value={formData.address}
							onChange={(e) =>
								onChange({ ...formData, address: e.target.value })
							}
							placeholder="Full office address details..."
							className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
						/>
					</div>

					<div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
						<Button type="button" variant="outline" onClick={onClose}>
							Cancel
						</Button>
						<Button type="submit" variant="primary" isLoading={isPending}>
							{editingClient ? 'Update Record' : 'Save Record'}
						</Button>
					</div>
				</form>
			</div>
		</div>
	)
}
