import React from 'react';
import { InvoiceStatus } from '@/generated/prisma/client';

interface BadgeProps {
  status: InvoiceStatus;
}

export const Badge: React.FC<BadgeProps> = ({ status }) => {
  const styles: Record<InvoiceStatus, string> = {
    PAID: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    PENDING: 'bg-amber-100 text-amber-800 border-amber-200',
    DRAFT: 'bg-slate-100 text-slate-700 border-slate-200',
    SENT: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    OVERDUE: 'bg-rose-100 text-rose-800 border-rose-200',
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${styles[status]}`}
    >
      {status}
    </span>
  );
};