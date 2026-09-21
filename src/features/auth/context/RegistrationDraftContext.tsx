import { createContext, useContext, useState, type ReactNode } from 'react';
import type { RegisterFormValues } from '@/features/auth/types/auth.types';

type RegistrationDraftContextValue = {
  draft: RegisterFormValues | null;
  saveDraft: (draft: RegisterFormValues) => void;
  clearDraft: () => void;
};

const RegistrationDraftContext = createContext<RegistrationDraftContextValue | null>(null);

// Las contraseñas permanecen solo en memoria mientras se completa este flujo.
export function RegistrationDraftProvider({ children }: { children: ReactNode }) {
  const [draft, setDraft] = useState<RegisterFormValues | null>(null);
  return (
    <RegistrationDraftContext.Provider value={{ draft, saveDraft: setDraft, clearDraft: () => setDraft(null) }}>
      {children}
    </RegistrationDraftContext.Provider>
  );
}

export function useRegistrationDraft() {
  const context = useContext(RegistrationDraftContext);
  if (!context) throw new Error('Se requiere RegistrationDraftProvider.');
  return context;
}
