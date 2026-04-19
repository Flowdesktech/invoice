'use client';

import React from 'react';
import PrivateRoute from '../../src/components/PrivateRoute';
import { AppLockProvider } from '../../src/contexts/AppLockContext';
import { LayoutShell } from '../../src/components/Layout';

/**
 * Shared layout for all authenticated dashboard pages.
 * - PrivateRoute redirects unauthenticated users to /login
 * - AppLockProvider gates the UI with an optional PIN after inactivity
 *   (the LockOverlay is rendered from inside LayoutShell)
 */
export default function DashboardGroupLayout({ children }) {
  return (
    <PrivateRoute>
      <AppLockProvider>
        <LayoutShell>{children}</LayoutShell>
      </AppLockProvider>
    </PrivateRoute>
  );
}
