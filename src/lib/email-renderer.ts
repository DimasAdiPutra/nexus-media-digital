import React from 'react'
import { render } from '@react-email/render'
import { InvoiceEmailTemplate } from '@/components/emails/InvoiceEmailTemplate'

interface RenderEmailProps {
	clientName: string
	companyName: string
	invoiceNumber: string
	totalAmount: number
	dueDate: Date
	invoiceUrl: string
}

/**
 * Converts InvoiceEmailTemplate React Component into pure static HTML string.
 * Uses @react-email/render which is 100% compatible with Next.js App Router Server Actions.
 */
export async function renderInvoiceEmailHtml(
	props: RenderEmailProps,
): Promise<string> {
	const emailElement = React.createElement(InvoiceEmailTemplate, props)
	return await render(emailElement)
}
