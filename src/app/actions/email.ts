'use server'

import { prisma } from '@/lib/prisma'
import { resend } from '@/lib/resend'
import { renderInvoiceEmailHtml } from '@/lib/email-renderer'

export async function sendInvoiceEmail(invoiceId: string) {
	try {
		const invoice = await prisma.invoice.findUnique({
			where: { id: invoiceId },
			include: { client: true },
		})

		if (!invoice) {
			return { success: false, error: 'Invoice record not found' }
		}

		const baseUrl = process.env.BASE_URL || 'http://localhost:3000'
		const invoiceUrl = `${baseUrl}/invoices/${invoice.id}`

		const isDevelopment = process.env.NODE_ENV === 'development'
		const recipientEmail = isDevelopment
			? 'dimasadiputra528@gmail.com'
			: invoice.client.email

		// Render HTML secara asinkron menggunakan @react-email/render
		const emailHtml = await renderInvoiceEmailHtml({
			clientName: invoice.client.name,
			companyName: invoice.client.companyName,
			invoiceNumber: invoice.invoiceNumber,
			totalAmount: invoice.totalAmount,
			dueDate: invoice.dueDate,
			invoiceUrl,
		})

		const { data, error } = await resend.emails.send({
			from: 'Nexus Media Digital <onboarding@resend.dev>',
			to: [recipientEmail],
			subject: `Faktur Tagihan ${invoice.invoiceNumber} - Nexus Media Digital`,
			html: emailHtml,
		})

		if (error) {
			console.error('Resend API Error:', error)
			return { success: false, error: error.message }
		}

		// Perbarui status invoice dari DRAFT ke SENT
		if (invoice.status === 'DRAFT') {
			await prisma.invoice.update({
				where: { id: invoiceId },
				data: { status: 'SENT' },
			})
		}

		return { success: true, data }
	} catch (error) {
		console.error('Failed to send invoice email:', error)
		return { success: false, error: 'Failed to send transactional email' }
	}
}
