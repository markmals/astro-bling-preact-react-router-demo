import type { ComponentChildren } from "preact"
import { Outlet, json, useRouteError } from "react-router-dom"
import { Scripts } from "~/scripts"
import { createContact } from "./lib/contacts"

function RootLayout({ children }: { children: ComponentChildren }) {
    return (
        <html lang="en">
            <head>
                <meta charSet="UTF-8" />
                <title>React Router Contacts</title>
                <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
                <link rel="stylesheet" href="/src/app/styles/index.css" />
            </head>
            <body style={{ height: "100%", width: "100%" }}>
                {children}
                <Scripts />
            </body>
        </html>
    )
}

export async function action() {
    let contact = await createContact()
    return json({ contact })
}

export default function App() {
    return (
        <RootLayout>
            <Outlet />
        </RootLayout>
    )
}

export function ErrorBoundary() {
    const error = useRouteError() as any
    console.error(error)

    return (
        <RootLayout>
            <div id="error-page">
                <h1>Oops!</h1>
                <p>Sorry, an unexpected error has occurred.</p>
                <p>
                    <i>{error.statusText || error.message}</i>
                </p>
            </div>
        </RootLayout>
    )
}
