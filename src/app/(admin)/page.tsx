import { Metadata } from 'next'
import Link from 'next/link'
import {
	getDashboardMetrics,
	getMonthlyChartData,
	getRecentInvoices,
} from '@/app/actions/dashboard'
import RevenueChart from '@/components/dashboard/RevenueChart'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

export const metadata: Metadata = {
	title: 'Dashboard Overview | Nexus Media Digital',
	description:
		'Financial dashboard metrics and overview for Nexus Media Digital.',
}

export default async function DashboardPage() {
	const metricsRes = await getDashboardMetrics()
	const recentInvoicesRes = await getRecentInvoices()
	const chartRes = await getMonthlyChartData()

	const metrics = metricsRes.data || {
		totalIncome: 0,
		pendingReceivables: 0,
		overdueAmount: 0,
		overdueCount: 0,
		totalClients: 0,
	}

	const recentInvoices = recentInvoicesRes.data || []

	const monthlyChartData = chartRes.data || []

	return (
		<div className="min-h-screen bg-slate-50 p-8">
			<div className="mx-auto max-w-7xl">
				{/* Header Section */}
				<div className="mb-8 flex items-center justify-between">
					<div>
						<h1 className="text-2xl font-bold text-slate-900">
							Dashboard Overview
						</h1>
						<p className="mt-1 text-sm text-slate-500">
							Real-time financial performance and activity overview for Nexus
							Media Digital.
						</p>
					</div>
					<Link href="/invoices/create">
						<Button variant="primary">+ Create New Invoice</Button>
					</Link>
				</div>

				{/* Top Metric Cards */}
				<div className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
					{/* Card 1: Total Revenue */}
					<div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
						<p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
							Total Revenue (Paid)
						</p>
						<p className="mt-2 text-2xl font-extrabold text-emerald-600">
							Rp {metrics.totalIncome.toLocaleString('id-ID')}
						</p>
						<p className="mt-1 text-xs text-slate-400">Cleared payments</p>
					</div>

					{/* Card 2: Overdue Invoices */}
					<div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
						<p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
							Overdue Amount
						</p>
						<p className="mt-2 text-2xl font-extrabold text-rose-600">
							Rp {metrics.overdueAmount.toLocaleString('id-ID')}
						</p>
						<p className="mt-1 text-xs text-rose-500">
							{metrics.overdueCount} overdue invoice(s)
						</p>
					</div>

					{/* Card 3: Pending Receivables */}
					<div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
						<p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
							Pending Receivables
						</p>
						<p className="mt-2 text-2xl font-extrabold text-amber-600">
							Rp {metrics.pendingReceivables.toLocaleString('id-ID')}
						</p>
						<p className="mt-1 text-xs text-slate-400">Awaiting payment</p>
					</div>

					{/* Card 4: Total Clients */}
					<div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
						<p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
							Active Clients
						</p>
						<p className="mt-2 text-2xl font-extrabold text-indigo-600">
							{metrics.totalClients}
						</p>
						<p className="mt-1 text-xs text-slate-400">
							Registered client profiles
						</p>
					</div>
				</div>

				{/* Charts & Recent Activity Section */}
				<div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
					{/* Revenue Chart (2 Columns) */}
					<div className="lg:col-span-2">
						<RevenueChart data={monthlyChartData} />
					</div>

					{/* Recent Transactions Table (1 Column) */}
					<div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
						<div className="mb-4 flex items-center justify-between border-b border-slate-100 pb-3">
							<h2 className="text-base font-bold text-slate-900">
								Recent Transactions
							</h2>
							<Link
								href="/invoices"
								className="text-xs font-semibold text-indigo-600 hover:text-indigo-800">
								View All
							</Link>
						</div>

						{recentInvoices.length === 0 ? (
							<p className="py-8 text-center text-xs text-slate-400">
								No transactions recorded yet.
							</p>
						) : (
							<div className="space-y-4">
								{recentInvoices.map((inv) => (
									<div
										key={inv.id}
										className="flex items-center justify-between rounded-lg border border-slate-100 p-3 hover:bg-slate-50 transition-colors">
										<div>
											<p className="text-xs font-bold text-slate-900">
												{inv.invoiceNumber}
											</p>
											<p className="text-xs text-slate-500">
												{inv.client.companyName}
											</p>
										</div>
										<div className="text-right">
											<p className="text-xs font-bold text-slate-900">
												Rp {inv.totalAmount.toLocaleString('id-ID')}
											</p>
											<div className="mt-1">
												<Badge status={inv.status} />
											</div>
										</div>
									</div>
								))}
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	)
}
