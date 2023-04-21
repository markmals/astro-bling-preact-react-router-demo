import { defineConfig } from "astro/config"

import node from "@astrojs/node"
import preact from "@astrojs/preact"
import prefresh from "@prefresh/vite"
import { astroBling as bling } from "@tanstack/bling/astro"

export default defineConfig({
    output: "server",
    adapter: node({ mode: "standalone" }),
    integrations: [preact({ compat: true }), bling()],
    vite: {
        plugins: [prefresh()],
        ssr: { noExternal: ["react-router", "react-router-dom"] },
    },
})
