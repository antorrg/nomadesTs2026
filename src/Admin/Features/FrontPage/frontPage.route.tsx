import { type RouteObject } from "react-router-dom";
import CreateFrontPagePage from "./pages/CreateFrontPagePage";
import UpdateFrontPagePage from "./pages/UpdateFrontPagePage";

export const frontPageRouter: RouteObject[] = [
    {
        path: 'creacion',
        element: <CreateFrontPagePage />
    },
    {
        path: ':id/edicion',
        element: <UpdateFrontPagePage />
    }
]