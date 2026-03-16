import type { RouteObject } from 'react-router-dom'
import Product from './pages/Product'
import CreateProductPage from './pages/CreateProductPage'
import UpdateProductPage from './pages/UpdateProductPage'
import Item from './pages/Item'
import CreateItemPage from './pages/CreateItemPage'
import UpdateItemPage from './pages/UpdateItemPage'

export const productRoutes: RouteObject[] = [
    {
        path: 'detalles/:id',
        element: <Product />
    },
    {
        path: 'creacion',
        element: <CreateProductPage />
    },
    {
        path: 'edicion/:id',
        element: <UpdateProductPage />
    },
    {
        path: 'detalles/item/:id',
        element: <Item />
    },
    {
        path: 'creacion/item/:productId',
        element: <CreateItemPage />
    },
    {
        path: 'edicion/item/:id',
        element: <UpdateItemPage />
    }
]