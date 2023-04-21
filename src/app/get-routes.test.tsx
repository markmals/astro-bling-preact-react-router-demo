import { describe, expect, it } from "vitest"
import { RouteExport, getRoutes } from "./get-routes"
import Root from "./root"
import { routes } from "./routes"
import Index, { action as indexAction, loader as indexLoader } from "./routes/_index"
import Placeholder from "./routes/_index._placeholder"
import ViewContact, {
    action as contactAction,
    loader as contactLoader,
} from "./routes/_index.contact.$contactId"
import {
    ErrorBoundary as DestroyErrorBoundary,
    action as destroyAction,
} from "./routes/_index.contact.$contactId.destroy"
import EditContact, { action as editAction } from "./routes/_index.contact.$contactId.edit"

describe("given a routes file path object", () => {
    it("generates the correct routes for folders", () => {
        // Simulating `import.meta.glob` calls
        const ROOT: Record<string, RouteExport> = {
            "/src/app/root.tsx": {
                default: Root,
            },
        }

        const ROUTES: Record<string, RouteExport> = {
            "/src/app/routes/_index._placeholder/route.tsx": {
                default: Placeholder,
            },
            "/src/app/routes/_index.contact.$contactId.destroy/route.tsx": {
                action: destroyAction,
                ErrorBoundary: DestroyErrorBoundary,
            },
            "/src/app/routes/_index.contact.$contactId.edit/route.tsx": {
                action: editAction,
                default: EditContact,
            },
            "/src/app/routes/_index.contact.$contactId/route.tsx": {
                loader: contactLoader,
                action: contactAction,
                default: ViewContact,
            },
            "/src/app/routes/_index/route.tsx": {
                loader: indexLoader,
                action: indexAction,
                default: Index,
            },
            // Simulating having extreneous files in the file system.
            // These component files may be imported by route files, but they shouldn't be
            // made into routes themselves.
            "/src/app/routes/_index/MyComponent.tsx": {
                default: Index,
            },
            "/src/app/routes/_index/foo/MyOtherComponent.tsx": {
                default: Index,
            },
        }

        let generatedRoutes = getRoutes({ ...ROOT, ...ROUTES })

        expect(generatedRoutes).toEqual(routes)
    })

    it("generates the correct routes for non-folder files", () => {
        const ROOT = import.meta.glob<RouteExport>(["/src/app/root.tsx"], { eager: true })
        const ROUTES = import.meta.glob<RouteExport>(
            ["/src/app/routes/*/route.tsx", "/src/app/routes/*.tsx"], // TODO: js, jsx, ts
            { eager: true }
        )

        // console.log(Object.entries(ROOT).map(([path, module]) => path))
        // console.log(Object.entries(ROUTES).map(([path, module]) => path))

        let generatedRoutes = getRoutes({ ...ROOT, ...ROUTES })

        expect(generatedRoutes).toEqual(routes)
    })
})
