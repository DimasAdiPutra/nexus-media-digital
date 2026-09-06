import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendInvoiceEmail } from '@/app/actions/email'

export async function GET(request: Request) {
	// Verify Cron Secret header to prevent unauthorized public calls
	const authHeader = request.headers.get('authorization')
	if (
		process.env.CRON_SECRET &&
		authHeader !== `Bearer ${process.env.CRON_SECRET}`
	) {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
	}

	try {
		const today = new Date()

		// 1. Fetch invoices that are past due date and not paid
		const overdueInvoices = await prisma.invoice.findMany({
			where: {
				status: { in: ['PENDING', 'SENT'] },
				dueDate: { lt: today },
			},
		})

		// 2. Automatically update status to OVERDUE and send email reminders
		const processedIds: string[] = []
		for (const invoice of overdueInvoices) {
			await prisma.invoice.update({
				where: { id: invoice.id },
				data: { status: 'OVERDUE' },
			})

			await sendInvoiceEmail(invoice.id)
			processedIds.push(invoice.id)
		}

		return NextResponse.json({
			success: true,
			processedCount: processedIds.length,
			processedInvoices: processedIds,
		})
	} catch (error) {
		console.error('Cron job reminder error:', error)
		return NextResponse.json(
			{ success: false, error: 'Failed to process email reminders.' },
			{ status: 500 },
		)
	}
}
