'use server'

import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'
import { InvoiceStatus } from '@/generated/prisma/client'

export interface InvoiceItemInput {
	description: string
	quantity: number
	unitPrice: number
}

export interface CreateInvoiceInput {
	clientId: string
	issueDate: Date
	dueDate: Date
	taxRate: number
	discount: number
	items: InvoiceItemInput[]
}

/**
 * Generates a unique invoice number sequence safely.
 * Format: INV/YYYY/MM/XXX
 */
async function generateInvoiceNumber(): Promise<string> {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const prefix = `INV/${year}/${month}/`;

  // Cari tagihan terakhir pada bulan dan tahun yang sama
  const lastInvoice = await prisma.invoice.findFirst({
    where: {
      invoiceNumber: {
        startsWith: prefix,
      },
    },
    orderBy: {
      invoiceNumber: 'desc',
    },
    select: {
      invoiceNumber: true,
    },
  });

  let nextSequence = 1;

  if (lastInvoice) {
    // Ambil 3 digit nomor urut terakhir (misal: "INV/2026/09/003" -> "003" -> 3)
    const parts = lastInvoice.invoiceNumber.split('/');
    const lastSequenceStr = parts[parts.length - 1];
    const lastSequenceNum = parseInt(lastSequenceStr, 10);

    if (!isNaN(lastSequenceNum)) {
      nextSequence = lastSequenceNum + 1;
    }
  }

  const sequence = String(nextSequence).padStart(3, '0');
  return `${prefix}${sequence}`;
}

/**
 * Retrieves all invoices with associated client data.
 */
export async function getInvoices() {
	try {
		const invoices = await prisma.invoice.findMany({
			include: {
				client: {
					select: {
						id: true,
						name: true,
						companyName: true,
						email: true,
					},
				},
				items: true,
			},
			orderBy: {
				createdAt: 'desc',
			},
		})

		return { success: true, data: invoices }
	} catch (error) {
		console.error('Failed to fetch invoices:', error)
		return { success: false, error: 'Failed to fetch invoice list.' }
	}
}

/**
 * Retrieves a single invoice by its unique ID with full details.
 */
export async function getInvoiceById(id: string) {
	try {
		const invoice = await prisma.invoice.findUnique({
			where: { id },
			include: {
				client: true,
				items: true,
			},
		})

		if (!invoice) {
			return { success: false, error: 'Invoice not found.' }
		}

		return { success: true, data: invoice }
	} catch (error) {
		console.error('Failed to fetch invoice details:', error)
		return { success: false, error: 'Failed to fetch invoice details.' }
	}
}

/**
 * Creates a new invoice along with its dynamic items atomically.
 */
export async function createInvoice(data: CreateInvoiceInput) {
	try {
		if (!data.items || data.items.length === 0) {
			return {
				success: false,
				error: 'Invoice must contain at least one item.',
			}
		}

		// Calculate line items amount and total subtotal
		const processedItems = data.items.map((item) => {
			const amount = item.quantity * item.unitPrice
			return {
				description: item.description,
				quantity: item.quantity,
				unitPrice: item.unitPrice,
				amount,
			}
		})

		const subtotal = processedItems.reduce((acc, item) => acc + item.amount, 0)
		const taxAmount = subtotal * (data.taxRate / 100)
		const totalAmount = subtotal + taxAmount - data.discount
		const invoiceNumber = await generateInvoiceNumber()

		const invoice = await prisma.invoice.create({
			data: {
				invoiceNumber,
				clientId: data.clientId,
				issueDate: new Date(data.issueDate),
				dueDate: new Date(data.dueDate),
				subtotal,
				taxRate: data.taxRate,
				discount: data.discount,
				totalAmount,
				status: InvoiceStatus.DRAFT,
				items: {
					create: processedItems,
				},
			},
			include: {
				items: true,
				client: true,
			},
		})

		revalidatePath('/invoices')
		return { success: true, data: invoice }
	} catch (error) {
		console.error('Failed to create invoice:', error)
		return { success: false, error: 'Failed to create invoice.' }
	}
}

/**
 * Updates the payment status of an existing invoice.
 */
export async function updateInvoiceStatus(id: string, status: InvoiceStatus) {
	try {
		const updatedInvoice = await prisma.invoice.update({
			where: { id },
			data: { status },
		})

		revalidatePath('/invoices')
		return { success: true, data: updatedInvoice }
	} catch (error) {
		console.error('Failed to update invoice status:', error)
		return { success: false, error: 'Failed to update invoice status.' }
	}
}

/**
 * Deletes an invoice and its line items (Cascade Delete handled at DB level).
 */
export async function deleteInvoice(id: string) {
	try {
		await prisma.invoice.delete({
			where: { id },
		})

		revalidatePath('/invoices')
		return { success: true }
	} catch (error) {
		console.error('Failed to delete invoice:', error)
		return { success: false, error: 'Failed to delete invoice.' }
	}
}
