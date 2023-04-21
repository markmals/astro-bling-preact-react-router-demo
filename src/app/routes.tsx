import type { Component } from "preact"
import type { ActionFunction, LoaderFunction, Route, RouteObject } from "react-router-dom"
import { ErrorPage } from "./error-page"
import Root from "./root"
import Index, { action as indexAction, loader as indexLoader } from "./routes/_index"
import Placeholder from "./routes/_index._placeholder"
import Contact, {
    action as contactAction,
    loader as contactLoader,
} from "./routes/_index.contact.$contactId"
import { ErrorBoundary, action as destroyAction } from "./routes/_index.contact.$contactId.destroy"
import EditContact, { action as editAction } from "./routes/_index.contact.$contactId.edit"

interface RouteExport {
    default: Component
    ErrorBoundary?: Component
    loader?: LoaderFunction
    action?: ActionFunction
}

function recordToRouteObj(path: string, route: RouteExport, index: boolean): RouteObject {
    const filename = path.replace(/^.*[\\\/]/, "")
    return {
        action: route.action,
        children: [],
        element: route.default,
        errorElement: route.ErrorBoundary,
        loader: route.loader,
        path: "",
    }
}

const ROOT = import.meta.glob<RouteExport>(["/src/app/root.tsx"], { eager: true })
const ROUTES = import.meta.glob<RouteExport>(
    ["/src/app/routes/*/route.tsx", "/src/app/routes/*.tsx"], // TODO: js*, ts*
    {
        eager: true,
    }
)

console.log(Object.entries(ROOT).map(e => e[0]))
console.log(Object.entries(ROUTES).map(e => e[0]))

// const rootElement: RouteObject =

// const newRoutes: RouteObject[] =

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

const FILES = import.meta.glob<RouteExport>([
    "/app/routes/**/*.ts",
    "/src/app/routes/**/*.ts",
    "/src/app/pages/**/*.page.ts",
])

/**
 * Function used to parse list of files and return
 * configuration of routes.
 *
 * @param files
 * @returns Array of routes
 */
export function getRoutes(files: Record<string, () => Promise<RouteExport | string>>): Route[] {
    const ROUTES = Object.keys(files).sort((a, b) => a.length - b.length)

    const routeConfigs = ROUTES.reduce<RouteObject[]>((routes: RouteObject[], key: string) => {
        const module = files[key]

        const segments = key
            .replace(/^\/(.*?)\/routes|^\/(.*?)\/pages|\/app\/routes|(\.(tsx?|jsx?)$)/g, "")
            .replace(/\$/, "**")
            .replace(/\$[^.]/g, ":$1")
            .replace(/\/route$/, "")
            .split("/")
            .filter(Boolean)

        segments.reduce((parent, segment, index) => {
            const path = segment.replace(/_index|^\(.*?\)$/g, "").replace(/\./g, "/")
            const isIndex = !path
            const isCatchall = path === "**"
            const pathMatch = isIndex ? "full" : "prefix"
            const root = index === 0
            const leaf = index === segments.length - 1 && segments.length > 1
            const node = !root && !leaf
            const insert = /^\w|\//.test(path) && !isCatchall ? "unshift" : "push"

            if (root) {
                const dynamic = path.startsWith(":")
                if (dynamic) return parent

                const last = segments.length === 1
                if (last) {
                    const newRoute = {
                        path,
                        pathMatch,
                        _module: () => module(),
                        loadChildren: () =>
                            module().then(m => [
                                {
                                    path: "",
                                    component: m.default,
                                    ...toRouteConfig(m.routeMeta as RouteMeta | undefined),
                                },
                            ]),
                    }

                    routes?.[insert](newRoute)
                    return parent
                }
            }

            if (root || node) {
                const current = root ? routes : parent._children
                const found = current?.find((route: any) => route.path === path)

                if (found) {
                    if (!found._children) {
                        found._children = []
                    }

                    found.pathMatch = pathMatch
                } else {
                    current?.[insert]({
                        path,
                        pathMatch,
                        _module: () => module(),
                        loadChildren: () =>
                            module().then(m => [
                                {
                                    path: "",
                                    component: m.default,
                                    ...toRouteConfig(m.routeMeta as RouteMeta | undefined),
                                },
                            ]),
                    })
                }

                return found || (current?.[insert === "unshift" ? 0 : current.length - 1] as Route)
            }

            if (leaf) {
                parent?._children?.[insert]({
                    path,
                    pathMatch,
                    _module: () => module(),
                    loadChildren: () =>
                        module().then(m => [
                            {
                                path: "",
                                component: m.default,
                                ...toRouteConfig(m.routeMeta as RouteMeta | undefined),
                            },
                        ]),
                })
            }

            if (parent._children) {
                parent.loadComponent = () => parent._module().then((m: RouteExport) => m.default)
                parent.loadChildren = () =>
                    parent._module().then((m: RouteExport) => {
                        return [
                            {
                                path: "",
                                children: parent._children,
                                ...toRouteConfig(m.routeMeta as RouteMeta | undefined),
                            },
                        ]
                    })
            }

            return parent
        }, {} as Route & { _module: () => Promise<RouteExport>; _children: any[] })

        return routes
    }, [])

    return routeConfigs
}

// export const routes: Route[] = [...getRoutes({ ...FILES })]
