'use client'

import { useState, useTransition } from 'react'
import { sendInvoiceEmail } from '@/app/actions/email'
import { Button } from '@/components/ui/button'

interface SendEmailButtonProps {
	invoiceId: string
}

export default function SendEmailButton({ invoiceId }: SendEmailButtonProps) {
	const [isPending, startTransition] = useTransition()
	const [statusMessage, setStatusMessage] = useState<{
		type: 'success' | 'error'
		text: string
	} | null>(null)

	const handleSendEmail = () => {
		setStatusMessage(null)
		startTransition(async () => {
			const res = await sendInvoiceEmail(invoiceId)
			if (res.success) {
				setStatusMessage({
					type: 'success',
					text: 'Email sent successfully!',
				})
			} else {
				setStatusMessage({
					type: 'error',
					text: res.error || 'Failed to send email.',
				})
			}
		})
	}

	return (
		<div className="flex flex-col items-end gap-1">
			<Button
				variant="primary"
				size="sm"
				isLoading={isPending}
				onClick={handleSendEmail}>
				Send via Email
			</Button>
			{statusMessage && (
				<span
					className={`text-xs ${
						statusMessage.type === 'success'
							? 'text-emerald-600'
							: 'text-rose-600'
					}`}>
					{statusMessage.type === 'success'
						? statusMessage.text
						: 'Failed to send email'}
				</span>
			)}
		</div>
	)
}
