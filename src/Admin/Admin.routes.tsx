import type { RouteObject } from 'react-router-dom'
import TabsPage from './AdminTab/TabsPage'
import { productRoutes } from './Features/Product/product.route'
import { userRouter } from './Features/User/user.route'
import { workRouter } from './Features/Work/work.route'
import { mediaRouter } from './Features/Media/media.route'
import { frontPageRouter } from './Features/FrontPage/frontPage.route'

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
  {
    path: 'trabajo',
    children: workRouter
  },
  {
    path: 'videos',
    children: mediaRouter
  },
  {
    path: 'front-page',
    children: frontPageRouter
  }
]