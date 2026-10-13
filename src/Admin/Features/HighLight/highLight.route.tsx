import { type RouteObject } from "react-router-dom";
import CreateHighLightPage from "./pages/CreateHighLightPage";
import UpdateHighLightPage from "./pages/UpdateHighLightPage";

export const highLightRouter: RouteObject[] = [
    {
        path: 'creacion',
        element: <CreateHighLightPage />
    },
    {
        path: ':id/edicion',
        element: <UpdateHighLightPage />
    }
]
