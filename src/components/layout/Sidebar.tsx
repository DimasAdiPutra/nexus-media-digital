'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Sidebar() {
	const pathname = usePathname()

	const navItems = [
		{
			name: 'Dashboard',
			href: '/',
		},
		{
			name: 'Clients',
			href: '/clients',
		},
		{
			name: 'Invoices',
			href: '/invoices',
		},
	]

	return (
		<aside className="w-64 border-r border-slate-200 bg-white p-6 min-h-screen flex flex-col justify-between shrink-0">
			<div>
				{/* Brand Logo & Title */}
				<div className="mb-8 flex items-center gap-3">
					<div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 font-bold text-white text-lg">
						N
					</div>
					<div>
						<h2 className="text-base font-bold text-slate-900">Nexus Media</h2>
						<p className="text-xs text-slate-500">Digital Agency</p>
					</div>
				</div>

				{/* Navigation Links */}
				<nav className="space-y-1">
					{navItems.map((item) => {
						const isActive =
							pathname === item.href || pathname.startsWith(`${item.href}/`)

						return (
							<Link
								key={item.href}
								href={item.href}
								className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
									isActive
										? 'bg-indigo-50 font-semibold text-indigo-600'
										: 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
								}`}>
								{item.name}
							</Link>
						)
					})}
				</nav>
			</div>

			<div className="border-t border-slate-100 pt-4 text-xs text-slate-400">
				&copy; 2026 Nexus Media Digital
			</div>
		</aside>
	)
}
