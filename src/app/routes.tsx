import type { RouteObject } from "react-router-dom"
import { ErrorPage } from "./error-page"
import { Root } from "./root"
import Index, { action as indexAction, loader as indexLoader } from "./routes/_index"
import Placeholder from "./routes/_index._placeholder"
import Contact, {
    action as contactAction,
    loader as contactLoader,
} from "./routes/_index.contact.$contactId"
import { ErrorBoundary, action as destroyAction } from "./routes/_index.contact.$contactId.destroy"
import EditContact, { action as editAction } from "./routes/_index.contact.$contactId.edit"

export const routes: RouteObject[] = [
    {
        element: <Root />,
        errorElement: <ErrorPage />,
        children: [
            {
                path: "/",
                element: <Index />,
                loader: indexLoader,
                action: indexAction,
                children: [
                    { index: true, element: <Placeholder /> },
                    {
                        path: "contacts/:contactId",
                        element: <Contact />,
                        loader: contactLoader,
                        action: contactAction,
                    },
                    {
                        path: "contacts/:contactId/edit",
                        element: <EditContact />,
                        loader: contactLoader,
                        action: editAction,
                    },
                    {
                        path: "contacts/:contactId/destroy",
                        action: destroyAction,
                        errorElement: <ErrorBoundary />,
                    },
                ],
            },
        ],
    },
]
