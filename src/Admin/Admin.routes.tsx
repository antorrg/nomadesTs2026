import type { RouteObject } from 'react-router-dom'
import { productRoutes } from './Features/Product/product.route'
import { userRouter } from './Features/User/user.route'
import { workRouter } from './Features/Work/work.route'
import { mediaRouter } from './Features/Media/media.route'
import { frontPageRouter } from './Features/FrontPage/frontPage.route'

export const adminRoutes: RouteObject[] = [
  {
    index: true,
    lazy: async ()=>{
      const {default: TabsPage} = await import('./AdminTab/TabsPage')
      return {element: <TabsPage />}
    }
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