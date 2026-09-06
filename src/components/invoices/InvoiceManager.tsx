'use client'

import { useState, useEffect, useCallback, useTransition } from 'react'
import Link from 'next/link'
import { exportInvoicesToCSV } from '@/lib/export'
import {
	getInvoices,
	deleteInvoice,
	updateInvoiceStatus,
} from '@/app/actions/invoice'
import InvoiceTable, {
	InvoiceWithClient,
} from '@/components/invoices/InvoiceTable'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { InvoiceStatus } from '@/generated/prisma/client'

export default function InvoiceManager() {
	const [invoices, setInvoices] = useState<InvoiceWithClient[]>([])
	const [loading, setLoading] = useState<boolean>(true)
	const [searchQuery, setSearchQuery] = useState<string>('')
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const [isPending, startTransition] = useTransition()

	const fetchInvoices = useCallback(async () => {
		try {
			const res = await getInvoices()
			if (res.success && res.data) {
				setInvoices(res.data as InvoiceWithClient[])
			}
		} catch (error) {
			console.error('Failed to load invoices:', error)
		} finally {
			setLoading(false)
		}
	}, [])

	useEffect(() => {
		let isSubscribed = true

		const loadData = async () => {
			await fetchInvoices()
		}

		if (isSubscribed) {
			loadData()
		}
		return () => {
			isSubscribed = false
		}
	}, [fetchInvoices])

	const handleStatusChange = (id: string, newStatus: InvoiceStatus) => {
		startTransition(async () => {
			const res = await updateInvoiceStatus(id, newStatus)
			if (res.success) {
				fetchInvoices()
			}
		})
	}

	const handleDelete = (id: string) => {
		if (confirm('Are you sure you want to delete this invoice record?')) {
			startTransition(async () => {
				const res = await deleteInvoice(id)
				if (res.success) {
					fetchInvoices()
				}
			})
		}
	}

	const filteredInvoices = invoices.filter(
		(inv) =>
			inv.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
			inv.client.companyName
				.toLowerCase()
				.includes(searchQuery.toLowerCase()) ||
			inv.client.name.toLowerCase().includes(searchQuery.toLowerCase()),
	)

	const handleExport = () => {
		const exportData = filteredInvoices.map((inv) => ({
			invoiceNumber: inv.invoiceNumber,
			clientName: inv.client.name,
			companyName: inv.client.companyName,
			issueDate: inv.issueDate,
			dueDate: inv.dueDate,
			subtotal: inv.totalAmount, // or calculate exact subtotal
			taxRate: 0,
			discount: 0,
			totalAmount: inv.totalAmount,
			status: inv.status,
		}))

		exportInvoicesToCSV(exportData)
	}

	return (
		<>
			<div className="mb-6 flex items-center justify-between gap-4">
				<div className="flex-1 max-w-md">
					<Input
						type="text"
						placeholder="Search by invoice number or client name..."
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
					/>
				</div>

				<Button variant="outline" onClick={handleExport}>
					📊 Export CSV/Excel
				</Button>
				<Link href="/invoices/create">
					<Button variant="primary">+ Create New Invoice</Button>
				</Link>
			</div>

			<InvoiceTable
				invoices={filteredInvoices}
				loading={loading}
				onDelete={handleDelete}
				onStatusChange={handleStatusChange}
			/>
		</>
	)
}
