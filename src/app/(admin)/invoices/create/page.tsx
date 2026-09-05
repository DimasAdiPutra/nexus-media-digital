import { Metadata } from 'next'
import { getClients } from '@/app/actions/client'
import InvoiceForm from '@/components/invoices/InvoiceForm'

export const metadata: Metadata = {
	title: 'Create New Invoice | Nexus Media Digital',
	description:
		'Generate dynamic invoices and line items for registered clients.',
}

export default async function CreateInvoicePage() {
	const clientsRes = await getClients()
	const clients = clientsRes.success && clientsRes.data ? clientsRes.data : []

	return (
		<div className="min-h-screen bg-slate-50 p-8">
			<div className="mx-auto max-w-5xl">
				<div className="mb-8">
					<h1 className="text-2xl font-bold text-slate-900">
						Create New Invoice
					</h1>
					<p className="mt-1 text-sm text-slate-500">
						Fill in the billing details and line items for Nexus Media Digital
						clients.
					</p>
				</div>

				<InvoiceForm clients={clients} />
			</div>
		</div>
	)
}
