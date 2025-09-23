import React from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

// Import pages using lazy loading for better performance
const Login = React.lazy(() => import('./pages/Login'));
const Register = React.lazy(() => import('./pages/Register'));
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const Profile = React.lazy(() => import('./pages/Profile'));
const Customers = React.lazy(() => import('./pages/Customers'));
const Invoices = React.lazy(() => import('./pages/Invoices'));
const CreateInvoice = React.lazy(() => import('./pages/CreateInvoice'));
const ViewInvoice = React.lazy(() => import('./pages/ViewInvoice'));
const RecurringInvoices = React.lazy(() => import('./pages/RecurringInvoices'));
const LandingPage = React.lazy(() => import('./pages/LandingPage'));
const Features = React.lazy(() => import('./pages/Features'));
const Contact = React.lazy(() => import('./pages/Contact'));
const PrivacyPolicy = React.lazy(() => import('./pages/PrivacyPolicy'));
const TermsOfService = React.lazy(() => import('./pages/TermsOfService'));
const Documentation = React.lazy(() => import('./pages/Documentation'));
const About = React.lazy(() => import('./pages/About'));
const Blog = React.lazy(() => import('./pages/Blog'));
const InvoiceTemplates = React.lazy(() => import('./pages/InvoiceTemplates'));

// Import components
import PrivateRoute from './components/PrivateRoute';
import Layout from './components/Layout';
import SocialImageGenerator from './components/SocialImageGenerator';
import ScrollToTop from './components/ScrollToTop';
import RootLayout from './components/RootLayout';
import LoadingScreen from './components/LoadingScreen';

// Create MUI theme with professional admin dashboard colors
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1e293b', // Slate 800 - Professional dark blue-gray
      light: '#334155',
      dark: '#0f172a',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#3b82f6', // Blue 500 - Accent color
      light: '#60a5fa',
      dark: '#2563eb',
      contrastText: '#ffffff',
    },
    background: {
      default: '#f8fafc', // Slate 50 - Light gray background
      paper: '#ffffff',
    },
    text: {
      primary: '#1e293b',
      secondary: '#64748b',
    },
    success: {
      main: '#10b981', // Emerald 500
      light: '#34d399',
      dark: '#059669',
    },
    warning: {
      main: '#f59e0b', // Amber 500
      light: '#fbbf24',
      dark: '#d97706',
    },
    error: {
      main: '#ef4444', // Red 500
      light: '#f87171',
      dark: '#dc2626',
    },
    info: {
      main: '#3b82f6', // Blue 500
      light: '#60a5fa',
      dark: '#2563eb',
    },
    divider: '#e2e8f0', // Slate 200
  },
  typography: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    h1: {
      fontWeight: 600,
      fontSize: '2.5rem',
      color: '#1e293b',
    },
    h2: {
      fontWeight: 600,
      fontSize: '2rem',
      color: '#1e293b',
    },
    h3: {
      fontWeight: 600,
      fontSize: '1.75rem',
      color: '#1e293b',
    },
    h4: {
      fontWeight: 600,
      fontSize: '1.5rem',
      color: '#1e293b',
    },
    h5: {
      fontWeight: 600,
      fontSize: '1.25rem',
      color: '#1e293b',
    },
    h6: {
      fontWeight: 600,
      fontSize: '1rem',
      color: '#1e293b',
    },
    body1: {
      fontSize: '0.875rem',
      color: '#475569',
    },
    body2: {
      fontSize: '0.875rem',
      color: '#64748b',
    },
  },
  shape: {
    borderRadius: 8,
  },
  shadows: [
    'none',
    '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  ],
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
          borderRadius: 12,
        },
      },
    },
  },
});

// Component to handle root route
const RootRoute = () => {
  const { currentUser } = useAuth();
  return currentUser ? <Navigate to="/dashboard" replace /> : <LandingPage />;
};

// Create router with React Router v7 syntax
const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />, // Wrap all routes with RootLayout for ScrollToTop
    children: [
      {
        path: '/',
        element: <RootRoute />,
      },
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
        path: '/',
        element: <PrivateRoute />,
        children: [
          {
            element: <Layout />,
            children: [
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
            ],
          },
        ],
      },
    ],
  },
]);

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <AuthProvider>
          <Toaster position="top-right" />
          <React.Suspense fallback={<LoadingScreen />}>
            <RouterProvider router={router} />
          </React.Suspense>
        </AuthProvider>
      </LocalizationProvider>
    </ThemeProvider>
  );
}

export default App;
