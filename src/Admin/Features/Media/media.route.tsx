import { type RouteObject } from "react-router-dom";

export const mediaRouter: RouteObject[] = [
    {
        path: ':type/creacion',
        lazy: async ()=>{
            const {default: CreateMediaPage} = await import("./pages/CreateMediaPage")
            return { element: <CreateMediaPage/>}
        }
    },
    {
        path: ':id/edicion',
        lazy: async()=>{
            const {default: UpdateMediaPage} = await import("./pages/UpdateMediaPage")
            return {element: <UpdateMediaPage/>}
        }
    }
]