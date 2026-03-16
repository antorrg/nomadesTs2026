import type { RouteObject } from 'react-router-dom'
import Home from './Pages/Home'
import Product from './Pages/Product'
import Item from './Pages/Item'
import Videos from './Pages/Videos'
import Work from './Pages/Work'
import Contact from './Pages/Contact'
import About from './Pages/About'
import Login from './Pages/Access'

export const publicRoutes: RouteObject[] = [
  {
    index: true,
    element: <Home />,
  },
  {
    path: 'detalle/:id',
    element: <Product />,
  },
  {
    path: 'detalle/item/:id',
    element: <Item />,
  },
  {
    path: 'videos',
    element: <Videos />,
  },
  {
    path: 'nuestro-trabajo',
    element: <Work />,
  },
  {
    path: 'contacto',
    element: <Contact />,
  },
  {
    path: 'acerca',
    element: <About />,
  },
  {
    path: 'ingresar',
    element: <Login />,
  },
]