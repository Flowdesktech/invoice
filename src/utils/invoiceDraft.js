/**
 * Picking a template is a full route change, so the in-progress invoice is
 * parked in localStorage and restored when the editor mounts again.
 */

const DRAFT_KEY = 'flowdesk:invoice-draft';

// The draft only has to survive a trip to the template picker. Expiring it
// keeps an abandoned round trip from repopulating an unrelated invoice later.
const DRAFT_TTL_MS = 30 * 60 * 1000;

export const saveInvoiceDraft = (draft) => {
  try {
    localStorage.setItem(DRAFT_KEY, JSON.stringify({ ...draft, savedAt: Date.now() }));
  } catch (error) {
    console.error('Could not save invoice draft:', error);
  }
};

export const loadInvoiceDraft = () => {
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    if (!raw) return null;

    const draft = JSON.parse(raw);
    if (!draft?.savedAt || Date.now() - draft.savedAt > DRAFT_TTL_MS) {
      localStorage.removeItem(DRAFT_KEY);
      return null;
    }
    return draft;
  } catch (error) {
    console.error('Could not read invoice draft:', error);
    return null;
  }
};

export const clearInvoiceDraft = () => {
  try {
    localStorage.removeItem(DRAFT_KEY);
  } catch {
    // nothing actionable if storage is unavailable
  }
};
