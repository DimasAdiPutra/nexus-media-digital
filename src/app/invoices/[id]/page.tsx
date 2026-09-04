import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getInvoiceById } from '@/app/actions/invoice'
import { Badge } from '@/components/ui/badge'

interface PublicInvoicePageProps {
	params: Promise<{
		id: string
	}>
}

export async function generateMetadata({
	params,
}: PublicInvoicePageProps): Promise<Metadata> {
	const resolvedParams = await params
	const invoiceRes = await getInvoiceById(resolvedParams.id)

	if (!invoiceRes.success || !invoiceRes.data) {
		return {
			title: 'Invoice Not Found | Nexus Media Digital',
		}
	}

	const invoice = invoiceRes.data
	return {
		title: `Invoice ${invoice.invoiceNumber} - ${invoice.client.companyName} | Nexus Media Digital`,
		description: `Official billing invoice ${invoice.invoiceNumber} for ${invoice.client.companyName}.`,
	}
}

export default async function PublicInvoicePage({
	params,
}: PublicInvoicePageProps) {
	const resolvedParams = await params
	const invoiceRes = await getInvoiceById(resolvedParams.id)

	if (!invoiceRes.success || !invoiceRes.data) {
		notFound()
	}

	const invoice = invoiceRes.data

	return (
		<div className="min-h-screen bg-slate-100 py-8 px-4 sm:px-6 lg:px-8">
			<div className="mx-auto max-w-3xl">
				{/* Main Invoice Card (PDF/Print View Target) */}
				<div className="overflow-hidden rounded-2xl bg-white shadow-xl border border-slate-200">
					{/* Header Banner */}
					<div className="bg-slate-900 p-6 sm:p-8 text-white flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
						<div>
							<div className="flex items-center gap-3">
								<div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 font-bold text-white text-lg">
									N
								</div>
								<div>
									<h1 className="text-xl font-bold tracking-tight">
										Nexus Media Digital
									</h1>
									<p className="text-xs text-slate-400">
										Creative & Digital Marketing Agency
									</p>
								</div>
							</div>
							<p className="mt-3 text-xs text-slate-300">
								Jl. Asia Afrika No. 123, Bandung • finance@nexusmedia.id
							</p>
						</div>

						<div className="sm:text-right border-t sm:border-t-0 pt-4 sm:pt-0 border-slate-800">
							<p className="text-xs font-medium uppercase tracking-wider text-slate-400">
								Invoice Number
							</p>
							<p className="text-xl font-extrabold text-indigo-400">
								{invoice.invoiceNumber}
							</p>
							<div className="mt-2">
								<Badge status={invoice.status} />
							</div>
						</div>
					</div>

					{/* Billing & Date Information */}
					<div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-2 gap-6 border-b border-slate-100 bg-slate-50/50">
						<div>
							<p className="text-xs font-semibold uppercase tracking-wider text-slate-600 mb-2">
								Billed To
							</p>
							<h2 className="text-base font-bold text-slate-900">
								{invoice.client.companyName}
							</h2>
							<p className="text-sm text-slate-600 font-medium">
								{invoice.client.name}
							</p>
							<p className="text-sm text-slate-500">{invoice.client.email}</p>
							{invoice.client.phone && (
								<p className="text-sm text-slate-500">{invoice.client.phone}</p>
							)}
							{invoice.client.address && (
								<p className="text-sm text-slate-500 mt-1 whitespace-pre-line">
									{invoice.client.address}
								</p>
							)}
						</div>

						<div className="space-y-3 sm:text-right">
							<div>
								<p className="text-xs font-semibold uppercase tracking-wider text-slate-600">
									Issue Date
								</p>
								<p className="text-sm font-semibold text-slate-800">
									{new Date(invoice.issueDate).toLocaleDateString('en-GB', {
										day: 'numeric',
										month: 'long',
										year: 'numeric',
									})}
								</p>
							</div>
							<div>
								<p className="text-xs font-semibold uppercase tracking-wider text-slate-600">
									Due Date
								</p>
								<p className="text-sm font-semibold text-rose-600">
									{new Date(invoice.dueDate).toLocaleDateString('en-GB', {
										day: 'numeric',
										month: 'long',
										year: 'numeric',
									})}
								</p>
							</div>
						</div>
					</div>

					{/* Line Items Table */}
					<div className="p-6 sm:p-8">
						<h3 className="text-sm font-semibold uppercase tracking-wider text-slate-600 mb-4">
							Service Details
						</h3>
						<div className="overflow-x-auto">
							<table className="w-full text-left text-sm">
								<thead>
									<tr className="border-b border-slate-200 text-xs font-bold uppercase text-slate-600 bg-slate-50">
										<th className="py-3 px-4">Description</th>
										<th className="py-3 px-4 text-center">Qty</th>
										<th className="py-3 px-4 text-right">Unit Price</th>
										<th className="py-3 px-4 text-right">Amount</th>
									</tr>
								</thead>
								<tbody className="divide-y divide-slate-100">
									{invoice.items.map((item) => (
										<tr key={item.id}>
											<td className="py-4 px-4 font-medium text-slate-800">
												{item.description}
											</td>
											<td className="py-4 px-4 text-center text-slate-600">
												{item.quantity}
											</td>
											<td className="py-4 px-4 text-right text-slate-600">
												Rp {item.unitPrice.toLocaleString('id-ID')}
											</td>
											<td className="py-4 px-4 text-right font-semibold text-slate-900">
												Rp {item.amount.toLocaleString('id-ID')}
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>

						{/* Total Calculation Summary */}
						<div className="mt-8 flex flex-col sm:flex-row sm:justify-end">
							<div className="w-full sm:w-72 space-y-2 border-t sm:border-t-0 pt-4 sm:pt-0">
								<div className="flex justify-between text-sm text-slate-600">
									<span>Subtotal</span>
									<span>Rp {invoice.subtotal.toLocaleString('id-ID')}</span>
								</div>
								{invoice.taxRate > 0 && (
									<div className="flex justify-between text-sm text-slate-600">
										<span>Tax ({invoice.taxRate}%)</span>
										<span>
											Rp{' '}
											{(
												invoice.subtotal *
												(invoice.taxRate / 100)
											).toLocaleString('id-ID')}
										</span>
									</div>
								)}
								{invoice.discount > 0 && (
									<div className="flex justify-between text-sm text-slate-600">
										<span>Discount</span>
										<span className="text-emerald-600">
											- Rp {invoice.discount.toLocaleString('id-ID')}
										</span>
									</div>
								)}
								<div className="border-t border-slate-200 pt-2 flex justify-between text-base font-extrabold text-slate-900">
									<span>Total Due</span>
									<span className="text-indigo-600">
										Rp {invoice.totalAmount.toLocaleString('id-ID')}
									</span>
								</div>
							</div>
						</div>
					</div>

					{/* Payment Instructions Section */}
					<div className="p-6 sm:p-8 bg-slate-50 border-t border-slate-200 grid grid-cols-1 md:grid-cols-2 gap-6">
						<div>
							<h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
								Payment Method (Bank Transfer)
							</h4>
							<div className="rounded-xl border border-slate-200 bg-white p-4 space-y-1">
								<p className="text-xs text-slate-600">
									Bank Central Asia (BCA)
								</p>
								<p className="text-base font-mono font-bold text-slate-900">
									4922918166
								</p>
								<p className="text-xs text-slate-600">a.n. Dimas Adi Putra</p>
							</div>
						</div>

						<div>
							<h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
								Payment via QRIS
							</h4>
							<div className="rounded-xl border border-slate-200 bg-white p-4 flex items-center gap-4">
								<div className="h-16 w-16 bg-slate-200 rounded-lg flex items-center justify-center text-xs text-slate-600 font-bold border">
									QRIS CODE
								</div>
								<div>
									<p className="text-xs font-semibold text-slate-800">
										Scan via GoPay / OVO / ShopeePay / Mobile Banking
									</p>
									<p className="text-xs text-slate-600 mt-0.5">
										Nexus Media Digital Official
									</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
