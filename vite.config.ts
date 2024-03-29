import { defineConfig } from "vite"
import { VitePWA } from "vite-plugin-pwa"
import react from "@vitejs/plugin-react"

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        react(),
        VitePWA({
            includeAssets: [
                "favicon.ico",
                "apple-touch-icon.png",
                "mask-icon.png",
            ],
            manifest: {
                name: "Score Mate",
                short_name: "Score Mate",
                description:
                    "Your essential companion for effortless scorekeeping during card games, with real-time updates and customizable features.",
                theme_color: "#ffc15e",
                display: "standalone",
                icons: [
                    {
                        src: "/apple-touch-icon.png",
                        sizes: "180x180",
                        type: "image/png",
                        purpose: "apple touch icon",
                    },
                    {
                        src: "/pwa-192x192.png",
                        sizes: "192x192",
                        type: "image/png",
                        purpose: "any",
                    },
                    {
                        src: "/pwa-512x512.png",
                        sizes: "512x512",
                        type: "image/png",
                        purpose: "any",
                    },
                    {
                        src: "/pwa-maskable-192x192.png",
                        sizes: "192x192",
                        type: "image/png",
                        purpose: "maskable",
                    },
                    {
                        src: "/pwa-maskable-512x512.png",
                        sizes: "512x512",
                        type: "image/png",
                        purpose: "maskable",
                    },
                    {
                        src: "/mask-icon.png",
                        sizes: "500x500",
                        type: "image/png",
                        purpose: "any maskable",
                    },
                ],
            },
        }),
    ],
    server: { port: 3000, open: true },
    resolve: { alias: [{ find: "@", replacement: "/src" }] },
})
