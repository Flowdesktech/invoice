'use client';

import { useEffect, useState } from 'react';
import { invoiceAPI } from '../utils/api';
import { useInvoiceSettings } from './useInvoiceSettings';
import { normalizeLineItems } from '../utils/invoiceLineItems';
import { loadInvoiceDraft, clearInvoiceDraft } from '../utils/invoiceDraft';
import { blankFormValues, duplicateFormValues, invoiceToFormValues } from '../utils/invoiceFormValues';

export const EDITOR_MODE = {
  CREATE: 'create',
  EDIT: 'edit',
  DUPLICATE: 'duplicate',
};

const draftToFormValues = (draft, settings) => ({
  ...invoiceToFormValues(draft.values || {}, settings),
  invoiceNumber: draft.values?.invoiceNumber ?? '',
});

/**
 * Resolves the initial state of the invoice editor for all three entry points:
 * a blank invoice, editing an existing one, and duplicating one
 * (`/invoices/create?duplicate=<invoiceId>`).
 *
 * Everything is resolved before the form is populated, so there is no partially
 * filled form and no dependency on the order in which requests finish.
 */
export const useInvoiceEditorSource = ({ invoiceId, duplicateFromId, templateIdFromQuery }) => {
  const { settings, ready, fetchNextNumber } = useInvoiceSettings();

  const mode = invoiceId
    ? EDITOR_MODE.EDIT
    : duplicateFromId
      ? EDITOR_MODE.DUPLICATE
      : EDITOR_MODE.CREATE;

  const [state, setState] = useState({ loading: true, values: null, lineItems: null, error: null });

  useEffect(() => {
    if (!ready) return undefined;

    let cancelled = false;

    const resolve = async () => {
      setState((previous) => ({ ...previous, loading: true, error: null }));

      try {
        let values;
        let lineItems;

        if (mode === EDITOR_MODE.EDIT) {
          const { data } = await invoiceAPI.getById(invoiceId);
          values = invoiceToFormValues(data, settings);
          lineItems = normalizeLineItems(data.lineItems);
        } else if (mode === EDITOR_MODE.DUPLICATE) {
          const { data } = await invoiceAPI.getById(duplicateFromId);
          values = duplicateFormValues(data, settings);
          lineItems = normalizeLineItems(data.lineItems);
        } else {
          values = blankFormValues(settings, await fetchNextNumber());
          lineItems = normalizeLineItems(null);
        }

        // A draft only exists when coming back from the template picker, and it
        // is newer than whatever the server returned.
        const draft = loadInvoiceDraft();
        if (draft?.mode === mode && draft?.sourceId === (invoiceId || duplicateFromId || null)) {
          values = { ...values, ...draftToFormValues(draft, settings) };
          lineItems = normalizeLineItems(draft.lineItems);
          clearInvoiceDraft();
        }

        if (templateIdFromQuery) {
          values.templateId = templateIdFromQuery;
        }

        if (!cancelled) setState({ loading: false, values, lineItems, error: null });
      } catch (error) {
        console.error('Error preparing invoice editor:', error);
        if (!cancelled) setState({ loading: false, values: null, lineItems: null, error });
      }
    };

    resolve();
    return () => {
      cancelled = true;
    };
    // `settings` is recreated on every auth context render; `ready` gates the
    // one initialisation pass this effect is meant to perform per route.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, mode, invoiceId, duplicateFromId, templateIdFromQuery]);

  return { mode, ...state };
};
