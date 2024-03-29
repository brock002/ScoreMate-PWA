import { defineConfig } from "vite"
import { VitePWA } from "vite-plugin-pwa"
import react from "@vitejs/plugin-react"

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        react(),
        VitePWA({
            includeAssets: ["favicon.ico", "apple-touch-icon.png"],
            manifest: {
                name: "CardScore Tracker",
                short_name: "CardScore Tracker",
                description:
                    "Your essential companion for effortless scorekeeping during card games, with real-time updates and customizable features.",
                theme_color: "#ffc15e",
                icons: [
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
                ],
            },
        }),
    ],
    server: { port: 3000, open: true },
    resolve: { alias: [{ find: "@", replacement: "/src" }] },
})
