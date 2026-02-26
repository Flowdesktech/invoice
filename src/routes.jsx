import React from 'react';

// Static imports for public pages (required for SSR)
import LandingPage from './pages/LandingPage';
import Features from './pages/Features';
import Contact from './pages/Contact';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import Documentation from './pages/Documentation';
import About from './pages/About';
import Blog from './pages/Blog';
import Login from './pages/Login';
import Register from './pages/Register';
import PublicInvoiceGenerator from './pages/PublicInvoiceGenerator';
import SocialImageGenerator from './components/SocialImageGenerator';

// Lazy imports for authenticated pages (CSR-only)
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const Profile = React.lazy(() => import('./pages/Profile'));
const Customers = React.lazy(() => import('./pages/Customers'));
const Invoices = React.lazy(() => import('./pages/Invoices'));
const CreateInvoice = React.lazy(() => import('./pages/CreateInvoice'));
const ViewInvoice = React.lazy(() => import('./pages/ViewInvoice'));
const RecurringInvoices = React.lazy(() => import('./pages/RecurringInvoices'));
const InvoiceTemplates = React.lazy(() => import('./pages/InvoiceTemplates'));

// List of public SSR route paths (used by the SSR function to know which routes to handle)
export const SSR_ROUTES = [
  '/',
  '/features',
  '/contact',
  '/privacy',
  '/terms',
  '/docs',
  '/about',
  '/blog',
  '/login',
  '/register',
  '/try-now',
  '/generate-social-images',
];

/**
 * Public route definitions -- used by both client and server.
 * These are statically imported so they can be rendered on the server.
 */
export const publicRoutes = [
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/register',
    element: <Register />,
  },
  {
    path: '/generate-social-images',
    element: <SocialImageGenerator />,
  },
  {
    path: '/features',
    element: <Features />,
  },
  {
    path: '/contact',
    element: <Contact />,
  },
  {
    path: '/privacy',
    element: <PrivacyPolicy />,
  },
  {
    path: '/terms',
    element: <TermsOfService />,
  },
  {
    path: '/docs',
    element: <Documentation />,
  },
  {
    path: '/about',
    element: <About />,
  },
  {
    path: '/blog',
    element: <Blog />,
  },
  {
    path: '/try-now',
    element: <PublicInvoiceGenerator />,
  },
];

/**
 * Authenticated route definitions -- CSR only.
 * These use React.lazy and are never rendered on the server.
 */
export const authenticatedRoutes = [
  {
    path: 'dashboard',
    element: <Dashboard />,
  },
  {
    path: 'profile',
    element: <Profile />,
  },
  {
    path: '/invoice-templates',
    element: <InvoiceTemplates />,
  },
  {
    path: 'customers',
    element: <Customers />,
  },
  {
    path: 'invoices',
    element: <Invoices />,
  },
  {
    path: 'invoices/create',
    element: <CreateInvoice />,
  },
  {
    path: 'invoices/:id',
    element: <ViewInvoice />,
  },
  {
    path: 'invoices/:id/edit',
    element: <CreateInvoice />,
  },
  {
    path: 'recurring-invoices',
    element: <RecurringInvoices />,
  },
  {
    path: 'recurring-invoices/:id/invoices',
    element: <RecurringInvoices />,
  },
];

// Re-export LandingPage for use in the RootRoute component
export { LandingPage };
