import React from 'react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	variant?: 'primary' | 'secondary' | 'danger' | 'outline'
	size?: 'sm' | 'md' | 'lg'
	isLoading?: boolean
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
	(
		{
			children,
			variant = 'primary',
			size = 'md',
			isLoading = false,
			className = '',
			disabled,
			...props
		},
		ref,
	) => {
		const baseStyles =
			'inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'

		const variants = {
			primary:
				'bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500',
			secondary:
				'bg-slate-100 text-slate-700 hover:bg-slate-200 focus:ring-slate-500',
			danger: 'bg-rose-600 text-white hover:bg-rose-700 focus:ring-rose-500',
			outline:
				'border border-slate-300 text-slate-700 hover:bg-slate-50 focus:ring-indigo-500',
		}

		const sizes = {
			sm: 'px-3 py-1.5 text-xs',
			md: 'px-4 py-2 text-sm',
			lg: 'px-6 py-3 text-base',
		}

		return (
			<button
				ref={ref}
				disabled={disabled || isLoading}
				className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
				{...props}>
				{isLoading ? (
					<span className="flex items-center gap-2">
						<svg
							className="animate-spin h-4 w-4 text-current"
							fill="none"
							viewBox="0 0 24 24">
							<circle
								className="opacity-25"
								cx="12"
								cy="12"
								r="10"
								stroke="currentColor"
								strokeWidth="4"
							/>
							<path
								className="opacity-75"
								fill="currentColor"
								d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
							/>
						</svg>
						Loading...
					</span>
				) : (
					children
				)}
			</button>
		)
	},
)

Button.displayName = 'Button'
