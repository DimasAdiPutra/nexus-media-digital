import { NextRequest, NextResponse } from 'next/server'
import { renderToBuffer, Document } from '@react-pdf/renderer'
import React from 'react'
import { getInvoiceById } from '@/app/actions/invoice'
import InvoicePDFDocument from '@/components/invoices/InvoicePDFDocument'

export async function GET(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) {
	try {
		const { id } = await params

		if (!id) {
			return new NextResponse('Invoice ID parameter is missing', {
				status: 400,
			})
		}

		const invoiceRes = await getInvoiceById(id)

		if (!invoiceRes.success || !invoiceRes.data) {
			return new NextResponse('Invoice record not found', { status: 404 })
		}

		const invoice = invoiceRes.data

		const pdfElement = React.createElement(InvoicePDFDocument, {
			invoice,
		}) as unknown as React.ReactElement<React.ComponentProps<typeof Document>>

		const pdfBuffer = await renderToBuffer(pdfElement)
		const pdfUint8Array = new Uint8Array(pdfBuffer)

		const safeInvoiceNumber = invoice.invoiceNumber.replace(
			/[\/\\?%*:|"<>]/g,
			'_',
		)

		return new NextResponse(pdfUint8Array, {
			status: 200,
			headers: {
				'Content-Type': 'application/pdf',
				'Content-Disposition': `attachment; filename="Invoice-${safeInvoiceNumber}.pdf"`,
				'Content-Length': pdfUint8Array.byteLength.toString(),
				'Cache-Control': 'no-cache, no-store, must-revalidate',
			},
		})
	} catch (error) {
		console.error('Failed to generate PDF:', error)
		return new NextResponse('Internal Server Error while generating PDF', {
			status: 500,
		})
	}
}
