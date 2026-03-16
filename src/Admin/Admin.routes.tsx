import type { RouteObject } from 'react-router-dom'
import TabsPage from './AdminTab/TabsPage'
import { productRoutes } from './Features/Product/product.route'
import { userRouter } from './Features/User/user.route'

export const adminRoutes: RouteObject[] = [
  {
    index: true,
    element: <TabsPage />,
  },
  {
    path:'producto',
    children: productRoutes
  },
  {
    path: 'usuarios',
    children: userRouter
  },
]