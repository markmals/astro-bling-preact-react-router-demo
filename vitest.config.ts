import preact from "@preact/preset-vite"
import prefresh from "@prefresh/vite"
import { fileURLToPath, URL } from "url"
import { defineConfig } from "vitest/config"

export default defineConfig({
    plugins: [preact(), prefresh()],
    resolve: {
        alias: {
            "~": fileURLToPath(new URL("./src/app", import.meta.url)),
            react: "./node_modules/preact/compat",
            "react-dom": "./node_modules/preact/compat",
        },
    },
})
