import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: "1-Shot Prompt Editor | PS-LANG Zone-Based Prompt Builder",
  description: "Build privacy-first prompts with zone syntax. Interactive editor for creating multi-agent workflows with context control. Test zone-based prompts for Claude, GPT, Cursor, and Copilot.",
  keywords: "prompt editor, zone-based prompts, AI prompt builder, context control, privacy zones",
  alternates: {
    canonical: 'https://ps-lang.dev/playground/prompt-editor',
  },
  openGraph: {
    title: "1-Shot Prompt Editor | PS-LANG Zone-Based Prompt Builder",
    description: "Build privacy-first prompts with zone syntax. Interactive editor for creating multi-agent workflows with context control.",
    url: "https://ps-lang.dev/playground/prompt-editor",
    siteName: "PS-LANG",
    type: "website",
    images: [
      {
        url: 'https://ps-lang.dev/og-image.png',
        width: 1200,
        height: 630,
        alt: 'PS-LANG Prompt Editor',
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "1-Shot Prompt Editor | Zone-Based Prompt Builder",
    description: "Build privacy-first prompts with PS-LANG zone syntax. Interactive editor for multi-agent workflows with context control.",
    images: ['https://ps-lang.dev/og-image.png'],
  },
}

export default function PromptEditorLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
