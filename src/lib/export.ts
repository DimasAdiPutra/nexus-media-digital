export interface InvoiceExportData {
	invoiceNumber: string
	clientName: string
	companyName: string
	issueDate: Date
	dueDate: Date
	subtotal: number
	taxRate: number
	discount: number
	totalAmount: number
	status: string
}

/**
 * Converts array of invoice objects into CSV formatted string and triggers browser download.
 */
export function exportInvoicesToCSV(invoices: InvoiceExportData[]) {
	const headers = [
		'Invoice Number',
		'Client Name',
		'Company Name',
		'Issue Date',
		'Due Date',
		'Subtotal (IDR)',
		'Tax Rate (%)',
		'Discount (IDR)',
		'Total Amount (IDR)',
		'Status',
	]

	const rows = invoices.map((inv) => [
		`"${inv.invoiceNumber}"`,
		`"${inv.clientName.replace(/"/g, '""')}"`,
		`"${inv.companyName.replace(/"/g, '""')}"`,
		`"${new Date(inv.issueDate).toLocaleDateString('en-GB')}"`,
		`"${new Date(inv.dueDate).toLocaleDateString('en-GB')}"`,
		inv.subtotal,
		inv.taxRate,
		inv.discount,
		inv.totalAmount,
		inv.status,
	])

	const csvContent =
		'data:text/csv;charset=utf-8,' +
		[headers.join(','), ...rows.map((e) => e.join(','))].join('\n')

	const encodedUri = encodeURI(csvContent)
	const link = document.createElement('a')
	link.setAttribute('href', encodedUri)
	link.setAttribute(
		'download',
		`Nexus_Invoices_Report_${new Date().toISOString().split('T')[0]}.csv`,
	)
	document.body.appendChild(link)
	link.click()
	document.body.removeChild(link)
}
