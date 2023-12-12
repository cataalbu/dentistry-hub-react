import { lazy, Suspense } from 'react';
import { Outlet, Navigate, useRoutes } from 'react-router-dom';

import DashboardLayout from 'src/layouts/dashboard';

export const IndexPage = lazy(() => import('src/pages/App'));
export const BlogPage = lazy(() => import('src/pages/Blog'));
export const UserPage = lazy(() => import('src/pages/User'));
export const LoginPage = lazy(() => import('src/pages/Login'));
export const ProductsPage = lazy(() => import('src/pages/Products'));
export const Page404 = lazy(() => import('src/pages/PageNotFound'));

// ----------------------------------------------------------------------

export default function Router() {
  const routes = useRoutes([
    {
      element: (
        <DashboardLayout>
          <Suspense>
            <Outlet />
          </Suspense>
        </DashboardLayout>
      ),
      children: [
        { element: <IndexPage />, index: true },
        { path: 'patients', element: <UserPage /> },
        { path: 'tmpjd-tests', element: <ProductsPage /> },
      ],
    },
    {
      path: 'login',
      element: <LoginPage />,
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

  return routes;
}
