'use server'

import { prisma } from '@/lib/prisma'

export interface DashboardMetrics {
	totalIncome: number
	pendingReceivables: number
	overdueAmount: number
	overdueCount: number
	totalClients: number
}

export interface MonthlyChartData {
	month: string
	paid: number
	pending: number
}

export interface RecentInvoice {
	id: string
	invoiceNumber: string
	totalAmount: number
	status: 'DRAFT' | 'SENT' | 'PENDING' | 'PAID' | 'OVERDUE'
	createdAt: Date
	client: {
		companyName: string
		name: string
	}
}

/**
 * Fetches aggregated financial summary metrics for the dashboard.
 */
export async function getDashboardMetrics(): Promise<{
	success: boolean
	data?: DashboardMetrics
	error?: string
}> {
	try {
		const paidInvoices = await prisma.invoice.aggregate({
			where: { status: 'PAID' },
			_sum: { totalAmount: true },
		})

		const pendingInvoices = await prisma.invoice.aggregate({
			where: { status: { in: ['PENDING', 'SENT'] } },
			_sum: { totalAmount: true },
		})

		const overdueInvoices = await prisma.invoice.aggregate({
			where: { status: 'OVERDUE' },
			_sum: { totalAmount: true },
			_count: { id: true },
		})

		const totalClientsCount = await prisma.client.count()

		return {
			success: true,
			data: {
				totalIncome: paidInvoices._sum.totalAmount || 0,
				pendingReceivables: pendingInvoices._sum.totalAmount || 0,
				overdueAmount: overdueInvoices._sum.totalAmount || 0,
				overdueCount: overdueInvoices._count.id || 0,
				totalClients: totalClientsCount,
			},
		}
	} catch (error) {
		console.error('Failed to fetch dashboard metrics:', error)
		return { success: false, error: 'Failed to calculate financial metrics' }
	}
}

/**
 * Fetches recent 5 invoices for quick overview table.
 */
export async function getRecentInvoices(): Promise<{
	success: boolean
	data?: RecentInvoice[]
	error?: string
}> {
	try {
		const invoices = await prisma.invoice.findMany({
			take: 5,
			orderBy: { createdAt: 'desc' },
			select: {
				id: true,
				invoiceNumber: true,
				totalAmount: true,
				status: true,
				createdAt: true,
				client: {
					select: {
						companyName: true,
						name: true,
					},
				},
			},
		})

		return { success: true, data: invoices as RecentInvoice[] }
	} catch (error) {
		console.error('Failed to fetch recent invoices:', error)
		return { success: false, error: 'Failed to fetch recent transactions' }
	}
}

/**
 * Fetches real monthly cash flow data (Paid vs Pending) from the database.
 */
export async function getMonthlyChartData() {
	try {
		const invoices = await prisma.invoice.findMany({
			select: {
				totalAmount: true,
				status: true,
				createdAt: true,
			},
		})

		const months = [
			'Jan',
			'Feb',
			'Mar',
			'Apr',
			'May',
			'Jun',
			'Jul',
			'Aug',
			'Sep',
			'Oct',
			'Nov',
			'Dec',
		]
		const currentYear = new Date().getFullYear()

		// Inisialisasi struktur 12 bulan
		const monthlyMap: Record<string, { paid: number; pending: number }> = {}
		months.forEach((m) => {
			monthlyMap[m] = { paid: 0, pending: 0 }
		})

		// Agregasi nominal transaksi berdasarkan status dan bulan
		invoices.forEach((inv) => {
			const invDate = new Date(inv.createdAt)
			if (invDate.getFullYear() === currentYear) {
				const monthName = months[invDate.getMonth()]
				if (inv.status === 'PAID') {
					monthlyMap[monthName].paid += inv.totalAmount
				} else if (inv.status === 'PENDING' || inv.status === 'SENT') {
					monthlyMap[monthName].pending += inv.totalAmount
				}
			}
		})

		const chartData = months.map((month) => ({
			month,
			paid: monthlyMap[month].paid,
			pending: monthlyMap[month].pending,
		}))

		return { success: true, data: chartData }
	} catch (error) {
		console.error('Failed to fetch monthly chart data:', error)
		return { success: false, error: 'Failed to calculate monthly cash flow' }
	}
}
