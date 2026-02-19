import { useCallback, useMemo, useState } from 'react';
import type {
  EmailGenerationInput,
  EmailLength,
  EmailMode,
  EmailTone,
} from '../types/email';

const INITIAL_STATE: EmailGenerationInput = {
  mode: 'new',
  recipient: '',
  tone: 'Professional',
  length: 'Medium',
  intent: '',
  originalEmail: '',
};

export function useEmailForm() {
  const [form, setForm] = useState<EmailGenerationInput>(INITIAL_STATE);

  const setField = useCallback(
    <K extends keyof EmailGenerationInput>(key: K, value: EmailGenerationInput[K]) => {
      setForm((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  const setMode = useCallback((mode: EmailMode) => setField('mode', mode), [setField]);
  const setRecipient = useCallback((v: string) => setField('recipient', v), [setField]);
  const setTone = useCallback((v: EmailTone) => setField('tone', v), [setField]);
  const setLength = useCallback((v: EmailLength) => setField('length', v), [setField]);
  const setIntent = useCallback((v: string) => setField('intent', v), [setField]);
  const setOriginalEmail = useCallback((v: string) => setField('originalEmail', v), [setField]);

  const isValid = useMemo(() => {
    const hasRecipient = form.recipient.trim().length > 0;
    const hasIntent = form.intent.trim().length > 0;
    const hasOriginalEmail =
      form.mode === 'new' || (form.originalEmail?.trim().length ?? 0) > 0;
    return hasRecipient && hasIntent && hasOriginalEmail;
  }, [form]);

  const reset = useCallback(() => setForm(INITIAL_STATE), []);

  return {
    form,
    setMode,
    setRecipient,
    setTone,
    setLength,
    setIntent,
    setOriginalEmail,
    isValid,
    reset,
  };
}
