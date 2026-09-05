'use client'

import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { InvoiceStatus } from '@/generated/prisma/client'

export interface InvoiceWithClient {
	id: string
	invoiceNumber: string
	issueDate: Date
	dueDate: Date
	totalAmount: number
	status: InvoiceStatus
	client: {
		id: string
		name: string
		companyName: string
		email: string
	}
}

interface InvoiceTableProps {
	invoices: InvoiceWithClient[]
	loading: boolean
	onDelete: (id: string) => void
	onStatusChange: (id: string, status: InvoiceStatus) => void
}

export default function InvoiceTable({
	invoices,
	loading,
	onDelete,
	onStatusChange,
}: InvoiceTableProps) {
	if (loading) {
		return (
			<div className="p-8 text-center text-sm text-slate-500">
				Loading invoice records...
			</div>
		)
	}

	if (invoices.length === 0) {
		return (
			<div className="p-8 text-center text-sm text-slate-500">
				No invoices found. Click &quot;+ Create New Invoice&quot; to generate
				one.
			</div>
		)
	}

	return (
		<div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
			<table className="w-full text-left text-sm text-slate-600">
				<thead className="bg-slate-50 text-xs uppercase text-slate-500 border-b border-slate-200">
					<tr>
						<th className="px-6 py-4">Invoice No</th>
						<th className="px-6 py-4">Client</th>
						<th className="px-6 py-4">Issue Date</th>
						<th className="px-6 py-4">Due Date</th>
						<th className="px-6 py-4">Total Amount</th>
						<th className="px-6 py-4">Status</th>
						<th className="px-6 py-4 text-right">Actions</th>
					</tr>
				</thead>
				<tbody className="divide-y divide-slate-200">
					{invoices.map((invoice) => (
						<tr
							key={invoice.id}
							className="hover:bg-slate-50/80 transition-colors">
							<td className="px-6 py-4 font-semibold text-indigo-600 hover:text-indigo-800">
								{/* Tautan Navigasi Otomatis ke /invoices/[id] */}
								<Link href={`/invoices/${invoice.id}`}>
									{invoice.invoiceNumber}
								</Link>
							</td>
							<td className="px-6 py-4">
								<div className="font-medium text-slate-800">
									{invoice.client.companyName}
								</div>
								<div className="text-xs text-slate-400">
									{invoice.client.name}
								</div>
							</td>
							<td className="px-6 py-4 text-slate-500">
								{new Date(invoice.issueDate).toLocaleDateString('en-GB')}
							</td>
							<td className="px-6 py-4 text-slate-500">
								{new Date(invoice.dueDate).toLocaleDateString('en-GB')}
							</td>
							<td className="px-6 py-4 font-semibold text-slate-900">
								Rp {invoice.totalAmount.toLocaleString('id-ID')}
							</td>
							<td className="px-6 py-4">
								<Badge status={invoice.status} />
							</td>
							<td className="px-6 py-4 text-right space-x-2">
								<Link
									href={`/invoices/${invoice.id}`}
									target="_blank"
									rel="noopener noreferrer">
									<Button variant="outline" size="sm">
										View
									</Button>
								</Link>

								<select
									value={invoice.status}
									onChange={(e) =>
										onStatusChange(invoice.id, e.target.value as InvoiceStatus)
									}
									className="rounded border border-slate-200 bg-white px-2 py-1 text-xs text-slate-700 focus:outline-none">
									<option value="DRAFT">DRAFT</option>
									<option value="SENT">SENT</option>
									<option value="PENDING">PENDING</option>
									<option value="PAID">PAID</option>
									<option value="OVERDUE">OVERDUE</option>
								</select>

								<Button
									variant="danger"
									size="sm"
									onClick={() => onDelete(invoice.id)}>
									Delete
								</Button>
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	)
}
