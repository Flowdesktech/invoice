'use client';

/**
 * react-router-dom compatibility shim for Next.js App Router.
 *
 * The existing codebase imports hooks and components from 'react-router-dom'
 * in ~25 files. Rather than rewrite every import, a webpack alias in
 * next.config.mjs redirects 'react-router-dom' to this module. The surface
 * area covered here matches the APIs actually used in the app (see grep):
 * Link, Navigate, Outlet, useNavigate, useLocation, useParams, useSearchParams.
 */

import React from 'react';
import NextLink from 'next/link';
import {
  useRouter,
  usePathname,
  useSearchParams as useNextSearchParams,
  useParams as useNextParams,
} from 'next/navigation';

// ---------- navigation state ----------
// next/navigation has no equivalent of react-router's location state, so it is
// persisted per destination pathname in sessionStorage and read back by
// useLocation() after the navigation completes. Prefer query params for data
// that should survive a reload or be shareable; this exists so that
// navigate(to, { state }) does not silently lose data.

const STATE_KEY_PREFIX = 'flowdesk:nav-state:';

const stateKeyFor = (pathname) => `${STATE_KEY_PREFIX}${pathname}`;

const pathnameOf = (to) => {
  try {
    return new URL(to, 'http://localhost').pathname;
  } catch {
    return to;
  }
};

function writeNavigationState(to, state) {
  if (typeof window === 'undefined') return;
  try {
    const key = stateKeyFor(pathnameOf(to));
    if (state === undefined || state === null) {
      window.sessionStorage.removeItem(key);
    } else {
      window.sessionStorage.setItem(key, JSON.stringify(state));
    }
  } catch {
    // sessionStorage can throw in private mode / when full - state is optional
  }
}

function readNavigationState(pathname) {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.sessionStorage.getItem(stateKeyFor(pathname));
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

// ---------- Link ----------

export const Link = React.forwardRef(function Link(
  { to, href, replace, state: _state, relative: _relative, reloadDocument, ...rest },
  ref
) {
  const target = href ?? to ?? '#';
  if (reloadDocument) {
    return <a ref={ref} href={target} {...rest} />;
  }
  return <NextLink ref={ref} href={target} replace={replace} {...rest} />;
});

export const NavLink = Link;

// ---------- Navigate ----------

export function Navigate({ to, replace = false }) {
  const router = useRouter();
  React.useEffect(() => {
    if (!to) return;
    if (replace) router.replace(to);
    else router.push(to);
  }, [to, replace, router]);
  return null;
}

// ---------- Outlet ----------
// The App Router passes children through `children` prop on layouts, so any
// consumers of <Outlet /> have been refactored to accept children. This
// remains a safety-net no-op for files not yet refactored.
export function Outlet() {
  return null;
}

// ---------- useNavigate ----------

export function useNavigate() {
  const router = useRouter();
  return React.useCallback(
    (to, options = {}) => {
      if (typeof to === 'number') {
        if (to < 0) {
          if (typeof window !== 'undefined') window.history.go(to);
          return;
        }
        return;
      }
      if (!to) return;
      writeNavigationState(to, options.state);
      if (options.replace) router.replace(to);
      else router.push(to);
    },
    [router]
  );
}

// ---------- useLocation ----------

export function useLocation() {
  const pathname = usePathname() || '/';
  const search = useNextSearchParams();
  const searchString = search?.toString() || '';
  const hash = typeof window !== 'undefined' ? window.location.hash : '';

  // Read after mount so server and first client render agree.
  const [state, setState] = React.useState(null);
  React.useEffect(() => {
    setState(readNavigationState(pathname));
  }, [pathname]);

  return {
    pathname,
    search: searchString ? `?${searchString}` : '',
    hash,
    state,
    key: pathname,
  };
}

// ---------- useParams ----------

export function useParams() {
  return useNextParams() || {};
}

// ---------- useSearchParams ----------

export function useSearchParams() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useNextSearchParams();

  const setSearchParams = React.useCallback(
    (nextInit, options = {}) => {
      const next =
        typeof nextInit === 'function' ? nextInit(new URLSearchParams(params?.toString() || '')) : nextInit;
      const usp =
        next instanceof URLSearchParams
          ? next
          : new URLSearchParams(next || {});
      const qs = usp.toString();
      const url = qs ? `${pathname}?${qs}` : pathname;
      if (options.replace) router.replace(url);
      else router.push(url);
    },
    [router, pathname, params]
  );

  return [params || new URLSearchParams(), setSearchParams];
}

// ---------- Stubs for APIs only used inside the deleted App.jsx ----------
// These exist so a stray import doesn't crash, but are not expected to render.

export const BrowserRouter = ({ children }) => <>{children}</>;
export const Routes = ({ children }) => <>{children}</>;
export const Route = () => null;
export const RouterProvider = ({ children }) => <>{children}</>;
export const createBrowserRouter = () => null;

const api = {
  Link,
  NavLink,
  Navigate,
  Outlet,
  BrowserRouter,
  Routes,
  Route,
  RouterProvider,
  createBrowserRouter,
  useNavigate,
  useLocation,
  useParams,
  useSearchParams,
};

export default api;
