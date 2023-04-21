import type { JSXInternal } from "preact/src/jsx"
import type { ActionFunction, LoaderFunction, RouteObject } from "react-router-dom"

export interface RouteExport {
    default?: () => JSXInternal.Element
    ErrorBoundary?: () => JSXInternal.Element
    loader?: LoaderFunction
    action?: ActionFunction
}

// function recordToRouteObj(path: string, route: RouteExport, index: boolean): RouteObject {
//     const filename = path.replace(/^.*[\\\/]/, "")
//     return {
//         action: route.action,
//         children: [],
//         element: route.default,
//         errorElement: route.ErrorBoundary,
//         loader: route.loader,
//         path: "",
//     }
// }

type RouteExtras = { _module?: RouteExport; _children?: TempRouteObject[] }
type TempRouteObject = RouteObject & RouteExtras

// https://github.com/analogjs/analog/blob/main/packages/router/src/lib/routes.ts
/**
 * Function used to parse list of files and return
 * configuration of routes.
 *
 * @param files
 * @returns Array of routes
 */
export function getRoutes(files: Record<string, RouteExport>): RouteObject[] {
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
            // We'll need this for paths named `_index`:
            const isIndex = !path
            const isCatchall = path === "**"
            const root = index === 0
            const leaf = index === segments.length - 1 && segments.length > 1
            const node = !root && !leaf
            const insert = /^\w|\//.test(path) && !isCatchall ? "unshift" : "push"

            if (root) {
                const dynamic = path.startsWith(":")
                if (dynamic) return parent

                const last = segments.length === 1
                if (last) {
                    const Component = module.default!
                    const newRoute: TempRouteObject = {
                        path,
                        _module: module,
                        children: [
                            {
                                path: "",
                                element: <Component />,
                                loader: module.loader,
                                action: module.action,
                                errorElement: module.ErrorBoundary,
                            },
                        ],
                    }

                    routes?.[insert](newRoute)
                    return parent
                }
            }

            if (root || node) {
                const current = root ? (routes as TempRouteObject[]) : parent!._children
                const found = current?.find((route: any) => route.path === path)

                if (found) {
                    if (!found._children) {
                        found._children = []
                    }
                } else {
                    const Component = module.default!
                    current?.[insert]({
                        path,
                        _module: module,
                        children: [
                            {
                                path: "",
                                element: <Component />,
                                loader: module.loader,
                                action: module.action,
                                errorElement: module.ErrorBoundary,
                            },
                        ],
                    })
                }

                return found || current?.[insert === "unshift" ? 0 : current.length - 1]
            }

            if (leaf) {
                const Component = module.default!
                parent?._children?.[insert]({
                    path,
                    _module: module,
                    children: [
                        {
                            path: "",
                            element: <Component />,
                            loader: module.loader,
                            action: module.action,
                            errorElement: module.ErrorBoundary,
                        },
                    ],
                })
            }

            if (parent?._children) {
                const Component = parent!._module!.default!
                parent!.element = <Component />
                parent!.children = [
                    {
                        path: "",
                        children: parent!._children,
                        loader: module.loader,
                        action: module.action,
                        errorElement: module.ErrorBoundary,
                    },
                ]
            }

            return parent
        }, {} as TempRouteObject | undefined)

        return routes
    }, [])

    return routeConfigs
}
