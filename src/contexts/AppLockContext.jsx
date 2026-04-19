'use client';

import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback,
} from 'react';

/**
 * App Lock context -- manages an optional PIN-based app lock that engages
 * after a configurable period of user inactivity.
 *
 * All state is persisted in localStorage on the current device. The PIN is
 * stored as a SHA-256 hash, so the raw digits are never written to disk.
 */

const STORAGE_KEYS = {
  enabled: 'flowdesk_app_lock_enabled',
  pinHash: 'flowdesk_app_lock_pin',
  timeout: 'flowdesk_app_lock_timeout',
  locked: 'flowdesk_app_locked',
};

const DEFAULT_TIMEOUT_MINUTES = 5;

// Events that count as "user activity" for resetting the inactivity timer
const ACTIVITY_EVENTS = ['mousemove', 'mousedown', 'keydown', 'touchstart', 'scroll'];

const AppLockContext = createContext({});

export const useAppLock = () => useContext(AppLockContext);

/**
 * Hash a string using SHA-256 via the Web Crypto API.
 * @param {string} value
 * @returns {Promise<string>} hex-encoded hash
 */
async function hashPin(value) {
  const data = new TextEncoder().encode(value);
  const buffer = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

const readBool = (key) => {
  try {
    return localStorage.getItem(key) === 'true';
  } catch {
    return false;
  }
};

const readString = (key) => {
  try {
    return localStorage.getItem(key) || '';
  } catch {
    return '';
  }
};

const readNumber = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    const parsed = raw ? parseInt(raw, 10) : NaN;
    return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
  } catch {
    return fallback;
  }
};

export const AppLockProvider = ({ children }) => {
  // IMPORTANT: initial state must be identical on the server and on the
  // client's first render to avoid hydration mismatches. localStorage is
  // unavailable during SSR, so we start with safe defaults and then hydrate
  // from storage in a useEffect after mount.
  const [isEnabled, setIsEnabled] = useState(false);
  const [timeoutMinutes, setTimeoutMinutes] = useState(DEFAULT_TIMEOUT_MINUTES);
  const [isLocked, setIsLocked] = useState(false);

  const inactivityTimerRef = useRef(null);

  useEffect(() => {
    const enabled = readBool(STORAGE_KEYS.enabled);
    setIsEnabled(enabled);
    setTimeoutMinutes(readNumber(STORAGE_KEYS.timeout, DEFAULT_TIMEOUT_MINUTES));
    setIsLocked(enabled && readBool(STORAGE_KEYS.locked));
  }, []);

  // ----- Public methods -----

  const lock = useCallback(() => {
    if (!readBool(STORAGE_KEYS.enabled)) return;
    setIsLocked(true);
    try {
      localStorage.setItem(STORAGE_KEYS.locked, 'true');
    } catch {
      /* ignore */
    }
  }, []);

  const unlock = useCallback(async (pin) => {
    const storedHash = readString(STORAGE_KEYS.pinHash);
    if (!storedHash) return false;
    const attemptHash = await hashPin(String(pin));
    if (attemptHash === storedHash) {
      setIsLocked(false);
      try {
        localStorage.setItem(STORAGE_KEYS.locked, 'false');
      } catch {
        /* ignore */
      }
      return true;
    }
    return false;
  }, []);

  const setupPin = useCallback(async (pin) => {
    const hash = await hashPin(String(pin));
    try {
      localStorage.setItem(STORAGE_KEYS.pinHash, hash);
      localStorage.setItem(STORAGE_KEYS.enabled, 'true');
      localStorage.setItem(STORAGE_KEYS.locked, 'false');
    } catch {
      /* ignore */
    }
    setIsEnabled(true);
    setIsLocked(false);
  }, []);

  const removePin = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEYS.pinHash);
      localStorage.removeItem(STORAGE_KEYS.locked);
      localStorage.setItem(STORAGE_KEYS.enabled, 'false');
    } catch {
      /* ignore */
    }
    setIsEnabled(false);
    setIsLocked(false);
  }, []);

  const updateTimeout = useCallback((minutes) => {
    const clean = Math.max(1, parseInt(minutes, 10) || DEFAULT_TIMEOUT_MINUTES);
    try {
      localStorage.setItem(STORAGE_KEYS.timeout, String(clean));
    } catch {
      /* ignore */
    }
    setTimeoutMinutes(clean);
  }, []);

  const hasPin = useCallback(() => Boolean(readString(STORAGE_KEYS.pinHash)), []);

  // ----- Inactivity tracking -----

  useEffect(() => {
    // Do nothing if lock is disabled or the user is currently on the lock screen
    if (!isEnabled || isLocked) {
      if (inactivityTimerRef.current) {
        clearTimeout(inactivityTimerRef.current);
        inactivityTimerRef.current = null;
      }
      return undefined;
    }

    const resetTimer = () => {
      if (inactivityTimerRef.current) {
        clearTimeout(inactivityTimerRef.current);
      }
      inactivityTimerRef.current = setTimeout(() => {
        lock();
      }, timeoutMinutes * 60 * 1000);
    };

    // Start the timer immediately and on each activity event
    resetTimer();
    ACTIVITY_EVENTS.forEach((event) => {
      window.addEventListener(event, resetTimer, { passive: true });
    });

    return () => {
      if (inactivityTimerRef.current) {
        clearTimeout(inactivityTimerRef.current);
        inactivityTimerRef.current = null;
      }
      ACTIVITY_EVENTS.forEach((event) => {
        window.removeEventListener(event, resetTimer);
      });
    };
  }, [isEnabled, isLocked, timeoutMinutes, lock]);

  const value = {
    isEnabled,
    isLocked,
    timeoutMinutes,
    hasPin,
    lock,
    unlock,
    setupPin,
    removePin,
    updateTimeout,
  };

  return <AppLockContext.Provider value={value}>{children}</AppLockContext.Provider>;
};
