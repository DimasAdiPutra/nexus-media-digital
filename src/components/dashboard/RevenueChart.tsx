'use client'

import {
	BarChart,
	Bar,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
	Legend,
} from 'recharts'

export interface ChartDataPoint {
	month: string
	paid: number
	pending: number
}

interface RevenueChartProps {
	data: ChartDataPoint[]
}

export default function RevenueChart({ data }: RevenueChartProps) {
	const formatCurrency = (value: number) => {
		if (value >= 1000000) {
			return `${(value / 1000000).toFixed(1)}M`
		}
		if (value >= 1000) {
			return `${(value / 1000).toFixed(0)}K`
		}
		return value.toString()
	}

	return (
		<div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
			<div className="mb-6 flex items-center justify-between">
				<div>
					<h2 className="text-lg font-bold text-slate-900">
						Monthly Cash Flow
					</h2>
					<p className="text-xs text-slate-500">
						Comparison of Paid Revenue vs Pending Receivables
					</p>
				</div>
			</div>

			<div className="h-72 w-full">
				{data.length === 0 ? (
					<div className="flex h-full items-center justify-center text-sm text-slate-400">
						No transaction data available yet.
					</div>
				) : (
					<ResponsiveContainer width="100%" height="100%">
						<BarChart
							data={data}
							margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
							<CartesianGrid
								strokeDasharray="3 3"
								vertical={false}
								stroke="#E2E8F0"
							/>
							<XAxis
								dataKey="month"
								stroke="#64748B"
								fontSize={12}
								tickLine={false}
							/>
							<YAxis
								stroke="#64748B"
								fontSize={12}
								tickLine={false}
								tickFormatter={formatCurrency}
							/>
							<Tooltip
								formatter={(value: unknown) => [
									`Rp ${Number(value || 0).toLocaleString('id-ID')}`,
									'Amount',
								]}
								contentStyle={{
									backgroundColor: '#0F172A',
									borderColor: '#0F172A',
									borderRadius: '8px',
									color: '#FFFFFF',
									fontSize: '12px',
								}}
							/>
							<Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
							<Bar
								dataKey="paid"
								name="Paid Revenue"
								fill="#10B981"
								radius={[4, 4, 0, 0]}
							/>
							<Bar
								dataKey="pending"
								name="Pending Receivables"
								fill="#F59E0B"
								radius={[4, 4, 0, 0]}
							/>
						</BarChart>
					</ResponsiveContainer>
				)}
			</div>
		</div>
	)
}
