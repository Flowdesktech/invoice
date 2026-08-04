'use client';

import { useCallback, useMemo } from 'react';
import { profileAPI } from '../utils/api';
import { useAuth } from '../contexts/AuthContext';

const DEFAULT_SETTINGS = {
  prefix: 'INV',
  nextNumber: 1,
  taxRate: 0,
  paymentTerms: 'Due on receipt',
  currency: 'USD',
  dueDateDuration: 7,
  autoIncrementNumber: true,
};

const withDefaults = (settings) => ({
  ...DEFAULT_SETTINGS,
  ...(settings || {}),
  autoIncrementNumber: settings?.autoIncrementNumber !== false,
});

/**
 * Invoice settings live either on the active business profile or, for personal
 * accounts, on the user document. Both shapes are resolved here so callers
 * never have to repeat the `currentProfile || userData` dance.
 */
export const useInvoiceSettings = () => {
  const { userData, currentProfile } = useAuth();

  const settings = useMemo(
    () => withDefaults((currentProfile || userData)?.invoiceSettings),
    [currentProfile, userData]
  );

  // Until the user document arrives, `settings` is only the fallback set.
  const ready = Boolean(userData);

  /**
   * The cached nextNumber goes stale as soon as another tab or a recurring job
   * creates an invoice, so fetch it fresh when starting a new invoice.
   */
  const fetchNextNumber = useCallback(async () => {
    try {
      const { data } = await profileAPI.get();
      const activeProfile =
        data?.activeProfileId && data.activeProfileId !== 'personal' && Array.isArray(data.profiles)
          ? data.profiles.find((profile) => profile.id === data.activeProfileId)
          : null;

      const freshest = activeProfile?.invoiceSettings || data?.invoiceSettings;
      return withDefaults(freshest).nextNumber;
    } catch (error) {
      console.error('Error fetching latest invoice number:', error);
      return settings.nextNumber;
    }
  }, [settings.nextNumber]);

  return { settings, ready, fetchNextNumber };
};
