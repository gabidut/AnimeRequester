import { resolve } from "path";
import { defineConfig } from "vite";

export default defineConfig({
    base: "./",
    build: {
        rollupOptions: {
            input: {
                main: resolve(import.meta.dirname, "index.html"),
                advancedSearch: resolve(import.meta.dirname, "advanced-search.html"),
                ranking: resolve(import.meta.dirname, "ranking.html"),
            },
        },
    },
});
