import React from 'react'
import Sidebar from '@/components/layout/Sidebar'

export default function AdminLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<div className="flex min-h-screen bg-slate-50">
			{/* Sidebar hanya di-render untuk halaman admin */}
			<Sidebar />

			{/* Area Konten Utama Admin */}
			<main className="flex-1 overflow-x-auto p-8">
				<div className="mx-auto max-w-7xl">{children}</div>
			</main>
		</div>
	)
}
