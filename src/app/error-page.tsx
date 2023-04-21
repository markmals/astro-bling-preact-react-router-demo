import { useRouteError } from "react-router-dom"
import { RootLayout } from "./root"

export function ErrorPage() {
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
