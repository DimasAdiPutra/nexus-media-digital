'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { createInvoice } from '@/app/actions/invoice'

interface ClientOption {
	id: string
	name: string
	companyName: string
}

interface InvoiceFormProps {
	clients: ClientOption[]
}

interface FormItem {
	description: string
	quantity: number | ''
	unitPrice: number | ''
}

export default function InvoiceForm({ clients }: InvoiceFormProps) {
	const router = useRouter()
	const [isPending, startTransition] = useTransition()

	const [selectedClientId, setSelectedClientId] = useState<string>(
		clients[0]?.id || '',
	)

	// Lazy Initial State untuk tanggal murni tanpa cascading render warning
	const [issueDate, setIssueDate] = useState<string>(() => {
		return new Date().toISOString().split('T')[0]
	})

	const [dueDate, setDueDate] = useState<string>(() => {
		const today = new Date()
		const fourteenDaysLater = new Date(
			today.getTime() + 14 * 24 * 60 * 60 * 1000,
		)
		return fourteenDaysLater.toISOString().split('T')[0]
	})

	const [taxRate, setTaxRate] = useState<number | ''>(11)

	// Discount States
	const [discountType, setDiscountType] = useState<'fixed' | 'percentage'>(
		'fixed',
	)
	const [discountValue, setDiscountValue] = useState<number | ''>('')

	// Item Pertama dibiarkan kosong murni tanpa text default
	const [items, setItems] = useState<FormItem[]>([
		{ description: '', quantity: 1, unitPrice: '' },
	])

	const handleAddItem = () => {
		setItems((prev) => [
			...prev,
			{ description: '', quantity: 1, unitPrice: '' },
		])
	}

	const handleRemoveItem = (index: number) => {
		if (items.length === 1) return
		setItems((prev) => prev.filter((_, i) => i !== index))
	}

	const handleItemChange = (
		index: number,
		field: keyof FormItem,
		value: string,
	) => {
		setItems((prev) => {
			const updated = [...prev]
			if (field === 'description') {
				updated[index].description = value
			} else {
				// Jika input kosong, simpan sebagai '', jika ada angka simpan sebagai number
				updated[index][field] = value === '' ? '' : Number(value)
			}
			return updated
		})
	}

	// Real-time calculations
	const subtotal = items.reduce((acc, item) => {
		const qty = typeof item.quantity === 'number' ? item.quantity : 0
		const price = typeof item.unitPrice === 'number' ? item.unitPrice : 0
		return acc + qty * price
	}, 0)

	const numericTaxRate = typeof taxRate === 'number' ? taxRate : 0
	const taxAmount = subtotal * (numericTaxRate / 100)

	// Calculation of Discount in IDR
	const numericDiscountVal =
		typeof discountValue === 'number' ? discountValue : 0
	const discountInIDR =
		discountType === 'percentage'
			? subtotal * (numericDiscountVal / 100)
			: numericDiscountVal

	const totalAmount = Math.max(0, subtotal + taxAmount - discountInIDR)

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault()

		if (!selectedClientId) {
			alert('Please select a client.')
			return
		}

		// Format item untuk dikirim ke Server Action
		const formattedItems = items.map((item) => ({
			description: item.description,
			quantity: typeof item.quantity === 'number' ? item.quantity : 1,
			unitPrice: typeof item.unitPrice === 'number' ? item.unitPrice : 0,
		}))

		startTransition(async () => {
			const res = await createInvoice({
				clientId: selectedClientId,
				issueDate: new Date(issueDate),
				dueDate: new Date(dueDate),
				taxRate: numericTaxRate,
				discount: discountInIDR, // Selalu tersimpan dalam IDR di Supabase
				items: formattedItems,
			})

			if (res.success) {
				router.push('/invoices')
			} else {
				alert(res.error || 'Failed to create invoice')
			}
		})
	}

	return (
		<form onSubmit={handleSubmit} className="space-y-8">
			{/* Top Details Section */}
			<div className="grid grid-cols-1 gap-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm md:grid-cols-3">
				<div>
					<label className="block text-xs font-semibold uppercase text-slate-600 mb-1">
						Select Client
					</label>
					<select
						value={selectedClientId}
						onChange={(e) => setSelectedClientId(e.target.value)}
						className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
						required>
						{clients.map((client) => (
							<option key={client.id} value={client.id}>
								{client.companyName} ({client.name})
							</option>
						))}
					</select>
				</div>

				<div>
					<Input
						label="Issue Date"
						type="date"
						value={issueDate}
						onChange={(e) => setIssueDate(e.target.value)}
						required
					/>
				</div>

				<div>
					<Input
						label="Due Date"
						type="date"
						value={dueDate}
						onChange={(e) => setDueDate(e.target.value)}
						required
					/>
				</div>
			</div>

			{/* Dynamic Line Items Table */}
			<div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
				<h2 className="mb-4 text-lg font-semibold text-slate-900">
					Line Items
				</h2>

				<div className="space-y-4">
					{items.map((item, index) => {
						const qty = typeof item.quantity === 'number' ? item.quantity : 0
						const price =
							typeof item.unitPrice === 'number' ? item.unitPrice : 0
						const lineAmount = qty * price

						return (
							<div
								key={index}
								className="flex flex-col gap-4 border-b border-slate-100 pb-4 md:flex-row md:items-end">
								<div className="flex-1">
									<Input
										label={index === 0 ? 'Description' : ''}
										placeholder="Item or service description..."
										value={item.description}
										onChange={(e) =>
											handleItemChange(index, 'description', e.target.value)
										}
										required
									/>
								</div>

								<div className="w-full md:w-28">
									<Input
										label={index === 0 ? 'Qty' : ''}
										type="number"
										min="1"
										placeholder="1"
										value={item.quantity}
										onChange={(e) =>
											handleItemChange(index, 'quantity', e.target.value)
										}
										required
									/>
								</div>

								<div className="w-full md:w-44">
									<Input
										label={index === 0 ? 'Unit Price (IDR)' : ''}
										type="number"
										min="0"
										placeholder="0"
										value={item.unitPrice}
										onChange={(e) =>
											handleItemChange(index, 'unitPrice', e.target.value)
										}
										required
									/>
								</div>

								<div className="w-full md:w-44 text-right">
									{index === 0 && (
										<span className="block text-xs font-semibold uppercase text-slate-600 mb-1">
											Amount
										</span>
									)}
									<p className="py-2 text-sm font-semibold text-slate-800">
										Rp {lineAmount.toLocaleString('id-ID')}
									</p>
								</div>

								<div className="pb-1">
									<Button
										type="button"
										variant="danger"
										size="sm"
										disabled={items.length === 1}
										onClick={() => handleRemoveItem(index)}>
										Remove
									</Button>
								</div>
							</div>
						)
					})}
				</div>

				<div className="mt-4">
					<Button type="button" variant="outline" onClick={handleAddItem}>
						+ Add Item
					</Button>
				</div>
			</div>

			{/* Summary & Submit Section */}
			<div className="flex flex-col gap-6 md:flex-row md:justify-between">
				<div className="w-full md:w-1/3 space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
					<Input
						label="Tax Rate (%)"
						type="number"
						placeholder="0"
						value={taxRate}
						onChange={(e) =>
							setTaxRate(e.target.value === '' ? '' : Number(e.target.value))
						}
					/>

					<div>
						<div className="flex items-center justify-between mb-1">
							<label className="block text-xs font-semibold uppercase text-slate-600">
								Discount
							</label>
							<div className="inline-flex rounded-md shadow-xs bg-slate-100 p-0.5">
								<button
									type="button"
									onClick={() => setDiscountType('fixed')}
									className={`px-2 py-0.5 text-xs font-semibold rounded ${
										discountType === 'fixed'
											? 'bg-white text-indigo-600 shadow-xs'
											: 'text-slate-500 hover:text-slate-900'
									}`}>
									IDR (Rp)
								</button>
								<button
									type="button"
									onClick={() => setDiscountType('percentage')}
									className={`px-2 py-0.5 text-xs font-semibold rounded ${
										discountType === 'percentage'
											? 'bg-white text-indigo-600 shadow-xs'
											: 'text-slate-500 hover:text-slate-900'
									}`}>
									%
								</button>
							</div>
						</div>
						<Input
							type="number"
							min="0"
							placeholder={discountType === 'fixed' ? '0 IDR' : '0 %'}
							value={discountValue}
							onChange={(e) =>
								setDiscountValue(
									e.target.value === '' ? '' : Number(e.target.value),
								)
							}
						/>
					</div>
				</div>

				<div className="w-full md:w-1/3 rounded-xl border border-slate-200 bg-white p-6 shadow-sm space-y-3">
					<div className="flex justify-between text-sm text-slate-600">
						<span>Subtotal:</span>
						<span>Rp {subtotal.toLocaleString('id-ID')}</span>
					</div>
					<div className="flex justify-between text-sm text-slate-600">
						<span>Tax ({numericTaxRate}%):</span>
						<span>Rp {taxAmount.toLocaleString('id-ID')}</span>
					</div>
					<div className="flex justify-between text-sm text-slate-600">
						<span>
							Discount{' '}
							{discountType === 'percentage' && numericDiscountVal > 0
								? `(${numericDiscountVal}%)`
								: ''}
							:
						</span>
						<span>- Rp {discountInIDR.toLocaleString('id-ID')}</span>
					</div>
					<hr className="border-slate-200" />
					<div className="flex justify-between text-base font-bold text-slate-900">
						<span>Total Amount:</span>
						<span className="text-indigo-600">
							Rp {totalAmount.toLocaleString('id-ID')}
						</span>
					</div>

					<div className="pt-4">
						<Button
							type="submit"
							variant="primary"
							className="w-full"
							isLoading={isPending}>
							Save & Generate Invoice
						</Button>
					</div>
				</div>
			</div>
		</form>
	)
}
