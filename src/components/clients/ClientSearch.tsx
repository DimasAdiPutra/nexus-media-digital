'use client';

import { Input } from '@/components/ui/input';

interface ClientSearchProps {
  value: string;
  onChange: (value: string) => void;
}

export default function ClientSearch({ value, onChange }: ClientSearchProps) {
  return (
    <div className="flex-1 max-w-md">
      <Input
        type="text"
        placeholder="Search by client name, company, or email..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}