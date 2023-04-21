import type { RouteObject } from "react-router-dom"
import Root, { action as layoutAction, ErrorBoundary as RootErrorBoundary } from "./root"
import ContactsLayout, { loader as layoutLoader } from "./routes/_contacts"
import Index from "./routes/_contacts._index"
import ViewContact, {
    action as contactAction,
    loader as contactLoader,
} from "./routes/_contacts.contact.$contactId"
import {
    action as destroyAction,
    ErrorBoundary as DestroyErrorBoundary,
} from "./routes/_contacts.contact.$contactId_.destroy"
import EditContact, { action as editAction } from "./routes/_contacts.contact.$contactId_.edit"

export const routes: RouteObject[] = [
    {
        element: <Root />,
        errorElement: <RootErrorBoundary />,
        children: [
            {
                path: "/",
                element: <ContactsLayout />,
                loader: layoutLoader,
                action: layoutAction,
                children: [
                    { index: true, element: <Index /> },
                    {
                        path: "contact/:contactId",
                        element: <ViewContact />,
                        loader: contactLoader,
                        action: contactAction,
                    },
                    {
                        path: "contact/:contactId/edit",
                        element: <EditContact />,
                        loader: contactLoader,
                        action: editAction,
                    },
                    {
                        path: "contact/:contactId/destroy",
                        action: destroyAction,
                        errorElement: <DestroyErrorBoundary />,
                    },
                ],
            },
        ],
    },
]
