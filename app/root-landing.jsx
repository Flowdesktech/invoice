'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../src/contexts/AuthContext';
import LandingPage from '../src/views/LandingPage';

/**
 * Client wrapper for the root landing page.
 * Redirects authenticated users to /dashboard; otherwise renders the public
 * landing page. SSR renders the landing page markup so SEO and first paint
 * happen before Firebase Auth resolves on the client.
 */
export default function RootLanding() {
  const router = useRouter();
  const { currentUser, loading } = useAuth();

  useEffect(() => {
    if (!loading && currentUser) {
      router.replace('/dashboard');
    }
  }, [loading, currentUser, router]);

  return <LandingPage />;
}
