import { describe, expect, it } from "vitest"
import { RouteExport, getRoutes } from "./get-routes"
import Root, { action as layoutAction } from "./root"
import { routes } from "./routes"
import ContactsLayout, { loader as layoutLoader } from "./routes/_contacts"
import Index from "./routes/_contacts._index"
import ViewContact, {
    action as contactAction,
    loader as contactLoader,
} from "./routes/_contacts.contact.$contactId"
import {
    ErrorBoundary as DestroyErrorBoundary,
    action as destroyAction,
} from "./routes/_contacts.contact.$contactId_.destroy"
import EditContact, { action as editAction } from "./routes/_contacts.contact.$contactId_.edit"

describe("given a routes file path object", () => {
    it("generates the correct routes for folders", () => {
        // Simulating `import.meta.glob` calls
        const ROOT: Record<string, RouteExport> = {
            "/src/app/root.tsx": {
                default: Root,
            },
        }

        const ROUTES: Record<string, RouteExport> = {
            "/src/app/routes/_contacts/route.tsx": {
                loader: layoutLoader,
                action: layoutAction,
                default: ContactsLayout,
            },
            "/src/app/routes/_contacts._index/route.tsx": {
                default: Index,
            },
            "/src/app/routes/_contacts.contact.$contactId_.destroy/route.tsx": {
                action: destroyAction,
                ErrorBoundary: DestroyErrorBoundary,
            },
            "/src/app/routes/_contacts.contact.$contactId_.edit/route.tsx": {
                action: editAction,
                default: EditContact,
            },
            "/src/app/routes/_contacts.contact.$contactId/route.tsx": {
                loader: contactLoader,
                action: contactAction,
                default: ViewContact,
            },
            // Simulating having extreneous files in the file system.
            // These component files may be imported by route files, but they shouldn't be
            // made into routes themselves.
            "/src/app/routes/_contacts/MyComponent.tsx": {
                default: Index,
            },
            "/src/app/routes/_contacts/foo/MyOtherComponent.tsx": {
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
