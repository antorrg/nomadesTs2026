import { createBrowserRouter } from 'react-router-dom'
import { AppLayout } from './components/Layout/AppLayout'
import { publicRoutes } from './PublicAccess/public.routes'
import { adminRoutes } from './Admin/Admin.routes'
import Error from './components/Error'
import ProtectedRoute from './Admin/ProtectedRoute'
import RouteErrorBoundary from './ErrorBoundary/RouteErrorBoundary'
export const router = createBrowserRouter([
    {
        path: '/',
        element: <AppLayout/>,
        children: publicRoutes,
        errorElement: <RouteErrorBoundary/>
    },
    {
        path: '/admin',
        lazy: async () => {
            const { default: Admin } = await import('./Admin/Pages/Admin');
            return {
                Component: () => (
                    <ProtectedRoute allowedRoles={['USER', 'ADMIN', 'EMPLOYEE']}>
                        <Admin />
                    </ProtectedRoute>
                ),
            };
        },
        children: adminRoutes,
         errorElement: <RouteErrorBoundary/>
    },
    {
        path: '*',
        element: <Error  />,
        errorElement: <RouteErrorBoundary/>
    }
])