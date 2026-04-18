import {type RouteObject } from "react-router-dom";


export const userRouter: RouteObject[] = [
    {
        path: 'detalles/:id',
        lazy: async()=>{
            const {default: AdminUserDetail} = await import("./Pages/AdminUserDetail")
            return {element: <AdminUserDetail/>}
        }
    },
    {
        path: 'creacion',
        lazy: async()=>{
            const {default: AdminUserCreate} = await import("./Pages/AdminUserCreate")
            return {element: <AdminUserCreate/>}
        }
        
    },
    {
        path: 'edicion/:id',
        lazy: async()=>{
            const {default: AdminUserUpdate} = await import("./Pages/AdminUserUpdate")
            return {element: <AdminUserUpdate/>}
        }
        
    }
]