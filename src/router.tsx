import { createBrowserRouter } from 'react-router-dom'
import { AppLayout } from './components/Layout/AppLayout'
import { publicRoutes } from './PublicAccess/public.routes'
import { adminRoutes } from './Admin/Admin.routes'
import Admin from './Admin/Pages/Admin'
import ProtectedRoute from './Admin/ProtectedRoute'
export const router = createBrowserRouter([
    {
        path: '/',
        element: <AppLayout />,
        children: publicRoutes
    },
    {
        path: '/admin',
        element: (
            <ProtectedRoute allowedRoles={['ADMIN', 'MODERATOR']}>
                <Admin />
            </ProtectedRoute>
        ),
        children: adminRoutes
    }
])