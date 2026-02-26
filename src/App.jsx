import React from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

// Import shared route definitions
import { publicRoutes, authenticatedRoutes, LandingPage } from './routes';

// Import components
import PrivateRoute from './components/PrivateRoute';
import Layout from './components/Layout';
import RootLayout from './components/RootLayout';
import LoadingScreen from './components/LoadingScreen';

// Import shared theme
import { theme } from './theme';

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
      // Spread in public routes
      ...publicRoutes,
      // Authenticated routes wrapped in PrivateRoute + Layout
      {
        path: '/',
        element: <PrivateRoute />,
        children: [
          {
            element: <Layout />,
            children: authenticatedRoutes,
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
