'use client';

import { ReactNode } from 'react';
import ConsentModal from './ConsentModal';
import { useConsent } from '@/hooks/useConsent';

interface ConsentProviderProps {
  children: ReactNode;
}

export default function ConsentProvider({ children }: ConsentProviderProps) {
  const { isModalOpen, handleConsent, handleReject } = useConsent();

  return (
    <>
      {children}
      <ConsentModal
        isOpen={isModalOpen}
        onConsent={handleConsent}
        onReject={handleReject}
      />
    </>
  );
}
