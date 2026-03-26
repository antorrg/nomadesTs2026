import { type RouteObject } from "react-router-dom";
import CreateMediaPage from "./pages/CreateMediaPage";
import UpdateMediaPage from "./pages/UpdateMediaPage";

export const mediaRouter: RouteObject[] = [
    {
        path: ':type/creacion',
        element: <CreateMediaPage />
    },
    {
        path: ':id/edicion',
        element: <UpdateMediaPage />
    }
]