import { type RouteObject } from "react-router-dom";
import CreateWorkPage from "./pages/CreateWorkPage";
import UpdateWorkPage from "./pages/UpdateWorkPage";

export const workRouter: RouteObject[] = [
    {
        path: 'creacion',
        element: <CreateWorkPage />
    },
    {
        path: ':id/edicion',
        element: <UpdateWorkPage />
    }
]