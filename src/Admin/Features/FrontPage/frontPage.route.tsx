import { type RouteObject } from "react-router-dom";


export const frontPageRouter: RouteObject[] = [
    {
        path: 'creacion',
        lazy: async()=>{
            const {default: CreateFrontPagePage} = await import("./pages/CreateFrontPagePage")
            return { element: <CreateFrontPagePage />}
        }
    },
    {
        path: ':id/edicion',
        lazy: async()=>{
            const {default: UpdateFrontPagePage} = await import("./pages/UpdateFrontPagePage")
            return { element: <UpdateFrontPagePage />}
        }
        
    }
]