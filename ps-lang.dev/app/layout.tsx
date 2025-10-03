import type React from "react"
import Script from "next/script"
import { ClerkProvider } from '@clerk/nextjs'

import "./globals.css"
import PostHogIdentifier from '@/components/posthog-identifier'
import Navigation from '@/components/navigation'
import Footer from '@/components/footer'

import { Courier_Prime, Crimson_Text, Inter, JetBrains_Mono } from 'next/font/google'

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter"
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono"
})

const courierPrime = Courier_Prime({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-courier",
})

const crimsonText = Crimson_Text({
  weight: ["400", "600", "700"],
  subsets: ["latin"],
  variable: "--font-crimson",
})

export const metadata = {
  title: "PS-LANG - Multi-Agent Context Control Language",
  description: "Control what each AI agent sees in multi-agent workflows. Clean handoffs, better benchmarks, precise context control.",
  keywords: "ps-lang, multi-agent, AI pipelines, agent handoff, context control, benchmarking, MCP integration, agent workflows",
  authors: [{ name: "Anton K." }],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: 'https://ps-lang.dev',
  },
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-48x48.png', sizes: '48x48', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      { rel: 'icon', url: '/favicon.ico' },
    ],
  },
  openGraph: {
    title: "PS-LANG - Multi-Agent Context Control Language",
    description: "Control what each AI agent sees in multi-agent workflows. Clean handoffs, better benchmarks, precise context control.",
    url: "https://ps-lang.dev",
    siteName: "PS-LANG",
    type: "website",
    images: [
      {
        url: 'https://ps-lang.dev/og-image.png',
        width: 1200,
        height: 630,
        alt: 'PS-LANG - Multi-Agent Context Control',
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "PS-LANG - Multi-Agent Context Control",
    description: "Clean handoffs for AI agent pipelines",
    images: ['https://ps-lang.dev/og-image.png'],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://ps-lang.dev/#organization",
        "name": "Vummo Labs",
        "url": "https://vummo.com",
        "logo": {
          "@type": "ImageObject",
          "url": "https://ps-lang.dev/ps-lang-logomark.png",
          "width": 200,
          "height": 200
        },
        "sameAs": [
          "https://github.com/vummo/ps-lang"
        ]
      },
      {
        "@type": "SoftwareApplication",
        "@id": "https://ps-lang.dev/#softwareapplication",
        "name": "PS-LANG",
        "applicationCategory": "DeveloperApplication",
        "description": "Multi-Agent Context Control Language for AI workflows. Control what each AI agent sees in agent pipelines with clean handoffs and accurate benchmarks.",
        "url": "https://ps-lang.dev",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD"
        },
        "operatingSystem": "Cross-platform",
        "publisher": {
          "@id": "https://ps-lang.dev/#organization"
        },
        "softwareVersion": "0.1.0-alpha.1",
        "releaseNotes": "Multi-agent context control with 7 privacy zones",
        "keywords": "multi-agent, AI pipelines, agent handoff, context control, benchmarking, MCP integration"
      },
      {
        "@type": "WebSite",
        "@id": "https://ps-lang.dev/#website",
        "url": "https://ps-lang.dev",
        "name": "PS-LANG",
        "description": "Control what each AI agent sees in multi-agent workflows",
        "publisher": {
          "@id": "https://ps-lang.dev/#organization"
        },
        "inLanguage": "en-US"
      }
    ]
  };

  return (
    <ClerkProvider>
      <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable} ${courierPrime.variable} ${crimsonText.variable} antialiased`}>
        <head>
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        {/* Google Analytics */}
        {process.env.NEXT_PUBLIC_GA_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}', {
                  custom_map: {
                    'ps_lang_project': '${process.env.NEXT_PUBLIC_PARENT_COMPANY}_property'
                  }
                });
              `}
            </Script>
          </>
        )}

        {/* PostHog Analytics */}
        {process.env.NEXT_PUBLIC_POSTHOG_KEY && (
          <Script id="posthog-init" strategy="afterInteractive">
            {`
              !function(t,e){var o,n,p,r;e.__SV||(window.posthog=e,e._i=[],e.init=function(i,s,a){function g(t,e){var o=e.split(".");2==o.length&&(t=t[o[0]],e=o[1]);t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}}(p=t.createElement("script")).type="text/javascript",p.async=!0,p.src=s.api_host+"/static/array.js",(r=t.getElementsByTagName("script")[0]).parentNode.insertBefore(p,r);var u=e;for(void 0!==a?u=e[a]=[]:a="posthog",u.people=u.people||[],u.toString=function(t){var e="posthog";return"posthog"!==a&&(e+="."+a),t||(e+=" (stub)"),e},u.people.toString=function(){return u.toString(1)+".people (stub)"},o="capture identify alias people.set people.set_once set_config register register_once unregister opt_out_capturing has_opted_out_capturing opt_in_capturing reset isFeatureEnabled onFeatureFlags getFeatureFlag getFeatureFlagPayload reloadFeatureFlags group updateEarlyAccessFeatureEnrollment getEarlyAccessFeatures getActiveMatchingSurveys getSurveys getNextSurveyStep onSessionId".split(" "),n=0;n<o.length;n++)g(u,o[n]);e._i.push([i,s,a])},e.__SV=1)}(document,window.posthog||[]);
              posthog.init('${process.env.NEXT_PUBLIC_POSTHOG_KEY}', {
                api_host: '${process.env.NEXT_PUBLIC_POSTHOG_HOST}',
                person_profiles: 'identified_only',
                session_recording: {
                  enabled: true,
                  maskAllInputs: true,
                  maskTextSelector: '.ph-no-capture, [data-private]',
                  recordCanvas: false,
                  recordCrossOriginIframes: false
                }
              });
            `}
          </Script>
        )}

        {/* Text Selection Tracking */}
        <Script id="selection-tracking" strategy="afterInteractive">
          {`
            document.addEventListener('mouseup', function() {
              const selectedText = window.getSelection().toString().trim();
              if (selectedText && selectedText.length > 3) {
                const selection = window.getSelection();
                const container = selection.anchorNode?.parentElement?.closest('[data-track-section]');
                const section = container?.getAttribute('data-track-section') || 'unknown';

                // PostHog tracking
                if (window.posthog) {
                  window.posthog.capture('text_selected', {
                    selected_text: selectedText,
                    text_length: selectedText.length,
                    section: section,
                    page: window.location.pathname
                  });
                }

                // Google Analytics tracking
                if (window.gtag) {
                  window.gtag('event', 'text_selection', {
                    event_category: 'engagement',
                    event_label: section,
                    text_length: selectedText.length,
                    selected_text: selectedText.substring(0, 100) // First 100 chars
                  });
                }
              }
            });
          `}
        </Script>

        {/* Zoom/Pinch Tracking */}
        <Script id="zoom-tracking" strategy="afterInteractive">
          {`
            let initialPinchDistance = 0;
            let currentZoomLevel = 1;

            // Track pinch-to-zoom on mobile
            document.addEventListener('touchstart', function(e) {
              if (e.touches.length === 2) {
                initialPinchDistance = Math.hypot(
                  e.touches[0].pageX - e.touches[1].pageX,
                  e.touches[0].pageY - e.touches[1].pageY
                );
              }
            });

            document.addEventListener('touchmove', function(e) {
              if (e.touches.length === 2) {
                const currentDistance = Math.hypot(
                  e.touches[0].pageX - e.touches[1].pageX,
                  e.touches[0].pageY - e.touches[1].pageY
                );
                const zoomChange = currentDistance / initialPinchDistance;

                if (Math.abs(zoomChange - currentZoomLevel) > 0.2) {
                  currentZoomLevel = zoomChange;

                  // Find what element is being zoomed
                  const centerX = (e.touches[0].pageX + e.touches[1].pageX) / 2;
                  const centerY = (e.touches[0].pageY + e.touches[1].pageY) / 2;
                  const element = document.elementFromPoint(centerX, centerY);
                  const section = element?.closest('[data-track-section]')?.getAttribute('data-track-section') || 'unknown';

                  if (window.posthog) {
                    window.posthog.capture('pinch_zoom', {
                      zoom_level: zoomChange.toFixed(2),
                      direction: zoomChange > 1 ? 'zoom_in' : 'zoom_out',
                      section: section,
                      page: window.location.pathname
                    });
                  }
                }
              }
            });

            // Track browser zoom (Ctrl/Cmd + scroll)
            let lastZoomLevel = window.devicePixelRatio;
            window.addEventListener('resize', function() {
              const currentDPR = window.devicePixelRatio;
              if (Math.abs(currentDPR - lastZoomLevel) > 0.1) {
                if (window.posthog) {
                  window.posthog.capture('browser_zoom', {
                    zoom_level: (currentDPR * 100).toFixed(0) + '%',
                    direction: currentDPR > lastZoomLevel ? 'zoom_in' : 'zoom_out',
                    page: window.location.pathname
                  });
                }
                lastZoomLevel = currentDPR;
              }
            });
          `}
        </Script>
        </head>
        <body className="min-h-screen bg-stone-50 text-stone-900 font-light flex flex-col">
          <PostHogIdentifier />
          <Navigation />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </body>
      </html>
    </ClerkProvider>
  )
}
