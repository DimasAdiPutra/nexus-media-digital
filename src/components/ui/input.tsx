import React from 'react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
	label?: string
	error?: string
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
	({ label, error, className = '', ...props }, ref) => {
		return (
			<div className="w-full">
				{label && (
					<label className="block text-xs font-semibold uppercase text-slate-600 mb-1">
						{label}
					</label>
				)}
				<input
					ref={ref}
					className={`w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 ${
						error
							? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500'
							: ''
					} ${className}`}
					{...props}
				/>
				{error && <p className="mt-1 text-xs text-rose-500">{error}</p>}
			</div>
		)
	},
)

Input.displayName = 'Input'
