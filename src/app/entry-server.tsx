import { createStaticHandler } from "@remix-run/router"
import { addDeserializer, handleFetch$, hasHandler } from "@tanstack/bling/server"
import type { APIContext } from "astro"
import renderToString from "preact-render-to-string"
import { StaticRouterProvider, createStaticRouter } from "react-router-dom/server"
import { routes } from "./routes"

addDeserializer({
    apply: req => req === "$request",
    deserialize: (value, ctx) => ctx.request,
})

export const requestHandler = async ({ request }: APIContext) => {
    if (hasHandler(new URL(request.url).pathname)) {
        return await handleFetch$({ request })
    }

    let { query } = createStaticHandler(routes)
    let context = await query(request)

    if (context instanceof Response) {
        throw context
    }

    let router = createStaticRouter(routes, context)

    return new Response(
        renderToString(
            <StaticRouterProvider router={router} context={context} nonce="the-nonce" />
        ),
        {
            headers: {
                "content-type": "text/html",
            },
        }
    )
}
