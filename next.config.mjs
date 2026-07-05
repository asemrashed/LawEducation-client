import bundleAnalyzer from "@next/bundle-analyzer"
import path from "path"
import { fileURLToPath } from "url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@fxprime/types"],
  turbopack: {
    root: __dirname,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    // Next 16 blocks image optimizer fetches to 127.0.0.1 (upload rewrite target).
    dangerouslyAllowLocalIP:
      process.env.NODE_ENV !== "production" ||
      /localhost|127\.0\.0\.1/.test(
        process.env.API_INTERNAL_URL ||
          process.env.BACKEND_INTERNAL_URL ||
          "http://127.0.0.1:4000"
      ),
    localPatterns: [
      { pathname: "/uploads/**" },
      { pathname: "/logo/**" },
      { pathname: "/graduate.png" },
      { pathname: "/Hero-Image.jpeg" },
      { pathname: "/Heor-Image.jpeg" },
      { pathname: "/Demo.avif" },
      { pathname: "/placeholder.svg" },
      { pathname: "/placeholder-logo.svg" },
      { pathname: "/icon.svg" },
    ],
    remotePatterns: [
      { protocol: "http", hostname: "localhost", pathname: "/uploads/**" },
      { protocol: "https", hostname: "law-education.vercel.app", pathname: "/uploads/**" },
      { protocol: "https", hostname: "phynixeducation.com", pathname: "/uploads/**" },
      { protocol: "https", hostname: "api.phynixeducation.com", pathname: "/uploads/**" },
      { protocol: "https", hostname: "**.ngrok-free.app", pathname: "/**" },
      { protocol: "https", hostname: "**.ngrok-free.dev", pathname: "/**" },
      { protocol: "https", hostname: "**.ngrok.io", pathname: "/**" },
      { protocol: "https", hostname: "images.unsplash.com", pathname: "/**" },
      { protocol: "https", hostname: "img.youtube.com", pathname: "/vi/**" },
      { protocol: "https", hostname: "**.amazonaws.com", pathname: "/**" },
    ],
  },
  
  async rewrites() {
    const backend = (
      process.env.API_INTERNAL_URL ||
      process.env.BACKEND_INTERNAL_URL ||
      "http://127.0.0.1:4000"
    ).replace(/\/$/, "")

    return [
      {
        source: "/api/v1/:path*",
        destination: `${backend}/api/v1/:path*`,
      },
      {
        source: "/uploads/:path*",
        destination: `${backend}/uploads/:path*`,
      },
      {
        source: "/socket.io/:path*",
        destination: `${backend}/socket.io/:path*`,
      },
    ]
  },
}

export default withBundleAnalyzer(nextConfig)
