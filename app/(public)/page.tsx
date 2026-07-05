import type { Metadata } from "next"
import { HomePageContent } from "@/components/home/home-page-content"

export const metadata: Metadata = {
  title: "Master Law with Expert-Led Preparation — Law LMS",
  description:
    "Build Legal Analysis, Case Briefing, Contract Drafting, and Advocacy skills through structured courses, live classes, and mock trials designed for serious law students.",
  openGraph: {
    title: "Law LMS",
    description:
      "Build Legal Analysis, Case Briefing, Contract Drafting, and Advocacy skills through structured courses and live classes.",
  },
}

export default function HomePage() {
  return <HomePageContent />
}
