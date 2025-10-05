import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: "PostScript Journaling™ - AI Workflow Tracking | PS-LANG",
  description: "Track AI workflows, benchmark improvements, and maintain secure audit trails with PostScript Journaling. Premium feature for PS-LANG users with end-to-end encryption.",
  keywords: "AI workflow tracking, postscript journal, AI benchmarking, prompt history, workflow audit trail, encrypted journaling",
  alternates: {
    canonical: 'https://ps-lang.dev/journal',
  },
  openGraph: {
    title: "PostScript Journaling™ - AI Workflow Tracking",
    description: "Track and benchmark AI workflows with secure, encrypted journaling",
    url: "https://ps-lang.dev/journal",
    siteName: "PS-LANG",
    type: "website",
    images: [
      {
        url: 'https://ps-lang.dev/og-image.png',
        width: 1200,
        height: 630,
        alt: 'PS-LANG PostScript Journaling',
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "PostScript Journaling™",
    description: "Encrypted AI workflow tracking and benchmarking",
    images: ['https://ps-lang.dev/og-image.png'],
  },
}

export default function JournalLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
