import { lazy, Suspense } from 'react';
import { Outlet, Navigate, useRoutes } from 'react-router-dom';

import Box from '@mui/material/Box';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';

import { varAlpha } from 'src/theme/styles';
import { AuthLayout } from 'src/layouts/auth';
import { DashboardLayout } from 'src/layouts/dashboard';
import { ProtectedRoute } from './protected-route';

// Halaman yang menggunakan lazy loading
const HomePage = lazy(() => import('src/pages/home'));
const BlogPage = lazy(() => import('src/pages/packet'));
const PacketPage = lazy(() => import('src/pages/packet'));
const UserPage = lazy(() => import('src/pages/user'));
const SignInPage = lazy(() => import('src/pages/sign-in'));
const AttendancePage = lazy(() => import('src/pages/history'));
const Page404 = lazy(() => import('src/pages/page-not-found'));

// Komponen fallback untuk suspense
const renderFallback = (
  <Box display="flex" alignItems="center" justifyContent="center" flex="1 1 auto">
    <LinearProgress
      sx={{
        width: 1,
        maxWidth: 320,
        bgcolor: (theme) => varAlpha(theme.vars.palette.text.primaryChannel, 0.16),
        [`& .${linearProgressClasses.bar}`]: { bgcolor: 'text.primary' },
      }}
    />
  </Box>
);

// Router utama
export function Router() {
  return useRoutes([
    {
      element: (
        <DashboardLayout>
          <Suspense fallback={renderFallback}>
            <Outlet />
          </Suspense>
        </DashboardLayout>
      ),
      children: [
        {
          element: (
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          ),
          index: true,
        },
        {
          path: 'packet',
          element: (
            <ProtectedRoute>
              <PacketPage />
            </ProtectedRoute>
          ),
        },
        {
          path: 'user',
          element: (
            <ProtectedRoute>
              <UserPage />
            </ProtectedRoute>
          ),
        },
        {
          path: 'history',
          element: (
            <ProtectedRoute>
              <AttendancePage />
            </ProtectedRoute>
          ),
        },
        { path: 'blog', element: <BlogPage /> },
      ],
    },
    {
      path: 'sign-in',
      element: (
        <AuthLayout>
          <SignInPage />
        </AuthLayout>
      ),
    },
    {
      path: '404',
      element: <Page404 />,
    },
    {
      path: '*',
      element: <Navigate to="/404" replace />,
    },
  ]);
}
