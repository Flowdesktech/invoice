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
  return {
    pathname,
    search: searchString ? `?${searchString}` : '',
    hash,
    state: null,
    key: 'default',
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
