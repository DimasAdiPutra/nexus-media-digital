import { Metadata } from 'next'
import InvoiceManager from '@/components/invoices/InvoiceManager'

export const metadata: Metadata = {
	title: 'Invoice Management | Nexus Media Digital',
	description:
		'Manage, track, and generate billing invoices for Nexus Media Digital.',
}

export default function InvoicesPage() {
	return (
		<div className="min-h-screen bg-slate-50 p-8">
			<div className="mx-auto max-w-7xl">
				<div className="mb-8">
					<h1 className="text-2xl font-bold text-slate-900">
						Invoice Management
					</h1>
					<p className="mt-1 text-sm text-slate-500">
						Track transaction records, manage statuses, and generate client
						invoices.
					</p>
				</div>

				<InvoiceManager />
			</div>
		</div>
	)
}
