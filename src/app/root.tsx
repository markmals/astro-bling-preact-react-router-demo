import type { ComponentChildren } from "preact"
import { Outlet } from "react-router-dom"
import { Scripts } from "~/scripts"

export function RootLayout({ children }: { children: ComponentChildren }) {
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

export function Root() {
    return (
        <RootLayout>
            <Outlet />
        </RootLayout>
    )
}
