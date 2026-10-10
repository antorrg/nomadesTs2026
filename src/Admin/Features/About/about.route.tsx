import { type RouteObject } from "react-router-dom";

export const aboutRouter: RouteObject[] = [
    {
        path: 'creacion',
        lazy: async () => {
            const { default: CreateAboutPage } = await import("./pages/CreateAboutPage");
            return { element: <CreateAboutPage /> };
        }
    },
    {
        path: ':id/edicion',
        lazy: async () => {
            const { default: UpdateAboutPage } = await import("./pages/UpdateAboutPage");
            return { element: <UpdateAboutPage /> };
        }
    }
];
