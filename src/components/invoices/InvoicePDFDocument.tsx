import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer'

interface InvoiceItemData {
	id: string
	description: string
	quantity: number
	unitPrice: number
	amount: number
}

interface InvoicePDFProps {
	invoice: {
		invoiceNumber: string
		issueDate: Date
		dueDate: Date
		subtotal: number
		taxRate: number
		discount: number
		totalAmount: number
		status: string
		client: {
			name: string
			companyName: string
			email: string
			phone?: string | null
			address?: string | null
		}
		items: InvoiceItemData[]
	}
}

const styles = StyleSheet.create({
	page: {
		padding: 36,
		fontSize: 10,
		fontFamily: 'Helvetica',
		color: '#0f172a',
		backgroundColor: '#ffffff',
	},
	header: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginBottom: 24,
		borderBottomWidth: 1,
		borderBottomColor: '#e2e8f0',
		paddingBottom: 16,
	},
	brandTitle: {
		fontSize: 18,
		fontFamily: 'Helvetica-Bold',
		color: '#4f46e5',
	},
	brandSubtitle: {
		fontSize: 9,
		color: '#64748b',
		marginTop: 2,
	},
	invoiceTitle: {
		fontSize: 16,
		fontFamily: 'Helvetica-Bold',
		color: '#0f172a',
		textAlign: 'right',
	},
	invoiceNumber: {
		fontSize: 12,
		fontFamily: 'Helvetica-Bold',
		color: '#4f46e5',
		textAlign: 'right',
		marginTop: 2,
	},
	sectionBilling: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginBottom: 24,
	},
	billingColumn: {
		width: '48%',
	},
	sectionLabel: {
		fontSize: 8,
		fontFamily: 'Helvetica-Bold',
		color: '#64748b',
		textTransform: 'uppercase',
		marginBottom: 4,
	},
	companyName: {
		fontSize: 12,
		fontFamily: 'Helvetica-Bold',
		color: '#0f172a',
	},
	textRegular: {
		fontSize: 9,
		color: '#334155',
		marginTop: 2,
	},
	table: {
		width: '100%',
		marginBottom: 24,
	},
	tableHeader: {
		flexDirection: 'row',
		backgroundColor: '#f8fafc',
		borderBottomWidth: 1,
		borderBottomColor: '#cbd5e1',
		padding: 6,
	},
	tableRow: {
		flexDirection: 'row',
		borderBottomWidth: 1,
		borderBottomColor: '#f1f5f9',
		padding: 6,
	},
	colDesc: { width: '45%' },
	colQty: { width: '15%', textAlign: 'center' },
	colPrice: { width: '20%', textAlign: 'right' },
	colAmount: { width: '20%', textAlign: 'right' },
	tableHeaderText: {
		fontSize: 8,
		fontFamily: 'Helvetica-Bold',
		color: '#475569',
		textTransform: 'uppercase',
	},
	summarySection: {
		flexDirection: 'row',
		justifyContent: 'flex-end',
		marginBottom: 24,
	},
	summaryBox: {
		width: '40%',
	},
	summaryRow: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		paddingVertical: 3,
	},
	summaryTotal: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		borderTopWidth: 1,
		borderTopColor: '#0f172a',
		paddingTop: 6,
		marginTop: 4,
	},
	totalText: {
		fontSize: 11,
		fontFamily: 'Helvetica-Bold',
		color: '#4f46e5',
	},
	paymentBox: {
		padding: 12,
		backgroundColor: '#f8fafc',
		borderRadius: 6,
		borderWidth: 1,
		borderColor: '#e2e8f0',
	},
})

export default function InvoicePDFDocument({ invoice }: InvoicePDFProps) {
	const formattedIssueDate = new Date(invoice.issueDate).toLocaleDateString(
		'en-GB',
	)
	const formattedDueDate = new Date(invoice.dueDate).toLocaleDateString('en-GB')

	return (
		<Document>
			<Page size="A4" style={styles.page}>
				{/* Header */}
				<View style={styles.header}>
					<View>
						<Text style={styles.brandTitle}>Nexus Media Digital</Text>
						<Text style={styles.brandSubtitle}>
							Creative & Digital Marketing Agency
						</Text>
						<Text style={styles.textRegular}>
							Jl. Asia Afrika No. 123, Bandung
						</Text>
						<Text style={styles.textRegular}>finance@nexusmedia.id</Text>
					</View>
					<View>
						<Text style={styles.invoiceTitle}>INVOICE</Text>
						<Text style={styles.invoiceNumber}>{invoice.invoiceNumber}</Text>
						<Text style={styles.textRegular}>Status: {invoice.status}</Text>
					</View>
				</View>

				{/* Billing Information */}
				<View style={styles.sectionBilling}>
					<View style={styles.billingColumn}>
						<Text style={styles.sectionLabel}>Billed To</Text>
						<Text style={styles.companyName}>{invoice.client.companyName}</Text>
						<Text style={styles.textRegular}>Attn: {invoice.client.name}</Text>
						<Text style={styles.textRegular}>{invoice.client.email}</Text>
						{invoice.client.phone && (
							<Text style={styles.textRegular}>{invoice.client.phone}</Text>
						)}
						{invoice.client.address && (
							<Text style={styles.textRegular}>{invoice.client.address}</Text>
						)}
					</View>

					<View style={styles.billingColumn}>
						<Text style={styles.sectionLabel}>Invoice Details</Text>
						<Text style={styles.textRegular}>
							Issue Date: {formattedIssueDate}
						</Text>
						<Text style={styles.textRegular}>Due Date: {formattedDueDate}</Text>
					</View>
				</View>

				{/* Line Items Table */}
				<View style={styles.table}>
					<View style={styles.tableHeader}>
						<Text style={[styles.colDesc, styles.tableHeaderText]}>
							Description
						</Text>
						<Text style={[styles.colQty, styles.tableHeaderText]}>Qty</Text>
						<Text style={[styles.colPrice, styles.tableHeaderText]}>
							Price (IDR)
						</Text>
						<Text style={[styles.colAmount, styles.tableHeaderText]}>
							Amount (IDR)
						</Text>
					</View>

					{invoice.items.map((item) => (
						<View key={item.id} style={styles.tableRow}>
							<Text style={[styles.colDesc, styles.textRegular]}>
								{item.description}
							</Text>
							<Text style={[styles.colQty, styles.textRegular]}>
								{item.quantity}
							</Text>
							<Text style={[styles.colPrice, styles.textRegular]}>
								{item.unitPrice.toLocaleString('id-ID')}
							</Text>
							<Text style={[styles.colAmount, styles.textRegular]}>
								{item.amount.toLocaleString('id-ID')}
							</Text>
						</View>
					))}
				</View>

				{/* Financial Summary */}
				<View style={styles.summarySection}>
					<View style={styles.summaryBox}>
						<View style={styles.summaryRow}>
							<Text style={styles.textRegular}>Subtotal:</Text>
							<Text style={styles.textRegular}>
								Rp {invoice.subtotal.toLocaleString('id-ID')}
							</Text>
						</View>

						{invoice.taxRate > 0 && (
							<View style={styles.summaryRow}>
								<Text style={styles.textRegular}>
									Tax ({invoice.taxRate}%):
								</Text>
								<Text style={styles.textRegular}>
									Rp{' '}
									{(invoice.subtotal * (invoice.taxRate / 100)).toLocaleString(
										'id-ID',
									)}
								</Text>
							</View>
						)}

						{invoice.discount > 0 && (
							<View style={styles.summaryRow}>
								<Text style={styles.textRegular}>Discount:</Text>
								<Text style={styles.textRegular}>
									- Rp {invoice.discount.toLocaleString('id-ID')}
								</Text>
							</View>
						)}

						<View style={styles.summaryTotal}>
							<Text style={styles.totalText}>Total Due:</Text>
							<Text style={styles.totalText}>
								Rp {invoice.totalAmount.toLocaleString('id-ID')}
							</Text>
						</View>
					</View>
				</View>

				{/* Payment Instructions */}
				<View style={styles.paymentBox}>
					<Text style={styles.sectionLabel}>Payment Instructions</Text>
					<Text style={styles.textRegular}>Bank Central Asia (BCA)</Text>
					<Text style={[styles.textRegular, { fontFamily: 'Helvetica-Bold' }]}>
						Account No: 4922918166
					</Text>
					<Text style={styles.textRegular}>Account Name: Dimas Adi Putra</Text>
				</View>
			</Page>
		</Document>
	)
}
