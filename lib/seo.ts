import { getApiUrl as getConfiguredApiUrl } from "@/lib/api-url"
import { getAbsoluteMediaUrl } from "@/lib/media-url"

export function getSiteUrl(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`
  return "http://localhost:3000"
}

export function getApiUrl(): string {
  return getConfiguredApiUrl()
}

export const defaultOg = {
  siteName: "Law LMS",
  title: "Law LMS — Professional Legal Education & Courses",
  description:
    "Professional law preparation and legal studies. Structured courses, live classes, mock trials, and verifiable certificates.",
  type: "website" as const,
}

export function buildOgImage(thumbnailUrl: string | null | undefined): string | undefined {
  return getAbsoluteMediaUrl(thumbnailUrl) ?? undefined
}
