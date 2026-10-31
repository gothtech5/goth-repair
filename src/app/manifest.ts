import type { MetadataRoute } from "next"

/** Web app manifest: the icon Android uses when someone adds GothTech to the home screen. */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "GothTech — Phone & iPad Repair Minneapolis",
    short_name: "GothTech",
    start_url: "/",
    display: "browser",
    background_color: "#ffffff",
    theme_color: "#ffffff",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/maskable-192.png", sizes: "192x192", type: "image/png", purpose: "maskable" },
      { src: "/maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  }
}
