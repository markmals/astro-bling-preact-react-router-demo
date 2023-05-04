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
import { server$ } from "@tanstack/bling"

export const routes: RouteObject[] = [
    {
        element: <Root />,
        errorElement: <RootErrorBoundary />,
        children: [
            {
                path: "/",
                element: <ContactsLayout />,
                loader: server$(layoutLoader),
                action: server$(async args => await layoutAction()),
                children: [
                    { index: true, element: <Index /> },
                    {
                        path: "contact/:contactId",
                        element: <ViewContact />,
                        loader: server$(contactLoader),
                        action: server$(contactAction),
                    },
                    {
                        path: "contact/:contactId/edit",
                        element: <EditContact />,
                        loader: server$(contactLoader),
                        action: server$(editAction),
                    },
                    {
                        path: "contact/:contactId/destroy",
                        action: server$(destroyAction),
                        errorElement: <DestroyErrorBoundary />,
                    },
                ],
            },
        ],
    },
]
