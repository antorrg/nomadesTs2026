import {type RouteObject } from "react-router-dom";
import AdminUserDetail from "./Pages/AdminUserDetail";
import AdminUserCreate from "./Pages/AdminUserCreate";
import AdminUserUpdate from "./Pages/AdminUserUpdate";


export const userRouter: RouteObject[] = [
    {
        path: 'detalles/:id',
        element: <AdminUserDetail/>
    },
    {
        path: 'creacion',
        element: <AdminUserCreate/>
    },
    {
        path: 'edicion/:id',
        element: <AdminUserUpdate/>
    }
]