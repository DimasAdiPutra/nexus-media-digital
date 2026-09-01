'use client';

import { Button } from '@/components/ui/button';

interface ClientHeaderActionsProps {
  onOpenModal: () => void;
}

export default function ClientHeaderActions({
  onOpenModal,
}: ClientHeaderActionsProps) {
  return (
    <Button variant="primary" onClick={onOpenModal}>
      + Add New Client
    </Button>
  );
}