import { createBrowserRouter } from 'react-router-dom'
import { AppLayout } from './components/Layout/AppLayout'
import { publicRoutes } from './PublicAccess/public.routes'
import { adminRoutes } from './Admin/Admin.routes'
import Error from './components/Error'
import ProtectedRoute from './Admin/ProtectedRoute'
export const router = createBrowserRouter([
    {
        path: '/',
        element: <AppLayout/>,
        children: publicRoutes
    },
    {
        path: '/admin',
        lazy: async () => {
            const { default: Admin } = await import('./Admin/Pages/Admin');
            return {
                Component: () => (
                    <ProtectedRoute allowedRoles={['USER', 'ADMIN', 'MODERATOR']}>
                        <Admin />
                    </ProtectedRoute>
                ),
            };
        },
        children: adminRoutes
    },
    {
        path: '*',
        element: <Error  />
    }
])