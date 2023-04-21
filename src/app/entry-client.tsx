import { addSerializer } from "@tanstack/bling/client"
import { hydrate } from "preact"
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import { routes } from "./routes"

addSerializer({
    apply: req => req instanceof Request,
    serialize: value => "$request",
})

let router = createBrowserRouter(routes)

function Client() {
    return <RouterProvider router={router} />
}

hydrate(<Client />, document)
