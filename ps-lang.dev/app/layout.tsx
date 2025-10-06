import type React from "react"
import Script from "next/script"
import { ClerkProvider } from '@clerk/nextjs'
import ConvexClientProvider from '@/components/convex-client-provider'

import "./globals.css"
import PostHogIdentifier from '@/components/posthog-identifier'
import AnnouncementBar from '@/components/announcement-bar'
import Navigation from '@/components/navigation'
import Footer from '@/components/footer'
import CookieConsent from '@/components/cookie-consent'
import { siteConfig } from '@/config/site'

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
          siteConfig.urls.github
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
      },
      {
        "@type": "FAQPage",
        "@id": "https://ps-lang.dev/#faq",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "What is PS-LANG?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "PS-LANG is a zone-based syntax language for controlling what AI agents see in multi-agent workflows. It provides 7 privacy zones that let you control context flow between agents, reduce token usage by up to 60%, and create cleaner agent handoffs in AI pipelines."
            }
          },
          {
            "@type": "Question",
            "name": "How does PS-LANG reduce token usage?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "PS-LANG uses zone-based syntax to mark content with specific privacy levels. When agents process prompts, they only see content within zones they have access to, reducing unnecessary context and cutting token usage by up to 60% in multi-agent workflows."
            }
          },
          {
            "@type": "Question",
            "name": "What are PS-LANG zones?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "PS-LANG has 7 privacy zones: public (<@. .>), internal (<. .>), confidential (<#. #>), agent-specific (<.agent .agent>), bookmark (<.bm .bm>), log (<.log .log>), and system (<sys. .sys>). Each zone controls who can see the content inside."
            }
          },
          {
            "@type": "Question",
            "name": "Is PS-LANG backwards compatible?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes, PS-LANG is designed to be backwards compatible. You can add zone syntax to existing prompts without breaking them. Agents that don't understand PS-LANG will simply ignore the zone markers and process the full text."
            }
          },
          {
            "@type": "Question",
            "name": "How do I install PS-LANG?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Install PS-LANG using npm: 'npx ps-lang@alpha init'. This initializes PS-LANG in your project and sets up the necessary configuration for zone-based context control in your AI workflows."
            }
          },
          {
            "@type": "Question",
            "name": "What is PostScript Journaling?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "PostScript Journaling is PS-LANG's premium feature for tracking AI workflows, benchmarking improvements, and maintaining secure audit trails. It uses end-to-end encryption to store prompt history and workflow analytics."
            }
          },
          {
            "@type": "Question",
            "name": "Does PS-LANG work with MCP?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes, PS-LANG integrates seamlessly with Model Context Protocol (MCP) agent chains. You can use zone syntax within MCP workflows to control context between different agents in your pipeline."
            }
          },
          {
            "@type": "Question",
            "name": "How accurate are PS-LANG benchmarks?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "PS-LANG improves benchmark accuracy by controlling exactly what context each agent sees. This eliminates context contamination between test runs and ensures consistent, reproducible benchmark results."
            }
          }
        ]
      }
    ]
  };

  return (
    <ConvexClientProvider>
      <ClerkProvider>
        <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable} ${courierPrime.variable} ${crimsonText.variable} antialiased`}>
        <head>
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        {/* Consent-Gated Google Analytics */}
        <Script id="ga-consent-check" strategy="afterInteractive">
          {`
            (function() {
              const consent = localStorage.getItem('ps_lang_cookie_consent');
              if (consent === 'granted' && '${process.env.NEXT_PUBLIC_GA_ID}') {
                // Load Google Analytics
                var script = document.createElement('script');
                script.src = 'https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}';
                script.async = true;
                document.head.appendChild(script);

                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}', {
                  custom_map: {
                    'ps_lang_project': '${process.env.NEXT_PUBLIC_PARENT_COMPANY}_property'
                  }
                });
              }
            })();
          `}
        </Script>

        {/* Consent-Gated PostHog Analytics */}
        <Script id="posthog-consent-check" strategy="afterInteractive">
          {`
            (function() {
              const consent = localStorage.getItem('ps_lang_cookie_consent');
              if (consent === 'granted' && '${process.env.NEXT_PUBLIC_POSTHOG_KEY}') {
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
              }
            })();
          `}
        </Script>

        {/* Consent-Gated Text Selection Tracking */}
        <Script id="selection-tracking" strategy="afterInteractive">
          {`
            (function() {
              const consent = localStorage.getItem('ps_lang_cookie_consent');
              if (consent !== 'granted') return;

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
            })();
          `}
        </Script>

        {/* Consent-Gated Zoom/Pinch Tracking */}
        <Script id="zoom-tracking" strategy="afterInteractive">
          {`
            (function() {
              const consent = localStorage.getItem('ps_lang_cookie_consent');
              if (consent !== 'granted') return;

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
            })();
          `}
        </Script>

        {/* Consent-Gated Core Web Vitals Tracking */}
        <Script id="web-vitals" strategy="afterInteractive">
          {`
            (function() {
              const consent = localStorage.getItem('ps_lang_cookie_consent');
              if (consent !== 'granted') return;
              // Largest Contentful Paint (LCP)
              if (typeof PerformanceObserver !== 'undefined') {
                try {
                  const lcpObserver = new PerformanceObserver((entryList) => {
                    const entries = entryList.getEntries();
                    const lastEntry = entries[entries.length - 1];
                    const lcpValue = lastEntry.renderTime || lastEntry.loadTime;

                    if (window.gtag) {
                      window.gtag('event', 'web_vitals', {
                        event_category: 'Web Vitals',
                        event_label: 'LCP',
                        value: Math.round(lcpValue),
                        metric_rating: lcpValue <= 2500 ? 'good' : lcpValue <= 4000 ? 'needs improvement' : 'poor',
                        page: window.location.pathname
                      });
                    }

                    if (window.posthog) {
                      window.posthog.capture('core_web_vital_lcp', {
                        value: Math.round(lcpValue),
                        rating: lcpValue <= 2500 ? 'good' : lcpValue <= 4000 ? 'needs_improvement' : 'poor',
                        page: window.location.pathname
                      });
                    }
                  });
                  lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });
                } catch (e) {
                  console.error('LCP observer error:', e);
                }

                // First Input Delay (FID)
                try {
                  const fidObserver = new PerformanceObserver((entryList) => {
                    const entries = entryList.getEntries();
                    entries.forEach((entry) => {
                      const fidValue = entry.processingStart - entry.startTime;

                      if (window.gtag) {
                        window.gtag('event', 'web_vitals', {
                          event_category: 'Web Vitals',
                          event_label: 'FID',
                          value: Math.round(fidValue),
                          metric_rating: fidValue <= 100 ? 'good' : fidValue <= 300 ? 'needs improvement' : 'poor',
                          page: window.location.pathname
                        });
                      }

                      if (window.posthog) {
                        window.posthog.capture('core_web_vital_fid', {
                          value: Math.round(fidValue),
                          rating: fidValue <= 100 ? 'good' : fidValue <= 300 ? 'needs_improvement' : 'poor',
                          page: window.location.pathname
                        });
                      }
                    });
                  });
                  fidObserver.observe({ type: 'first-input', buffered: true });
                } catch (e) {
                  console.error('FID observer error:', e);
                }

                // Cumulative Layout Shift (CLS)
                try {
                  let clsValue = 0;
                  const clsObserver = new PerformanceObserver((entryList) => {
                    const entries = entryList.getEntries();
                    entries.forEach((entry) => {
                      if (!entry.hadRecentInput) {
                        clsValue += entry.value;
                      }
                    });
                  });
                  clsObserver.observe({ type: 'layout-shift', buffered: true });

                  // Report CLS on page hide
                  window.addEventListener('visibilitychange', () => {
                    if (document.visibilityState === 'hidden') {
                      if (window.gtag) {
                        window.gtag('event', 'web_vitals', {
                          event_category: 'Web Vitals',
                          event_label: 'CLS',
                          value: Math.round(clsValue * 1000),
                          metric_rating: clsValue <= 0.1 ? 'good' : clsValue <= 0.25 ? 'needs improvement' : 'poor',
                          page: window.location.pathname
                        });
                      }

                      if (window.posthog) {
                        window.posthog.capture('core_web_vital_cls', {
                          value: Math.round(clsValue * 1000) / 1000,
                          rating: clsValue <= 0.1 ? 'good' : clsValue <= 0.25 ? 'needs_improvement' : 'poor',
                          page: window.location.pathname
                        });
                      }
                    }
                  });
                } catch (e) {
                  console.error('CLS observer error:', e);
                }
              }
            })();
          `}
        </Script>
        </head>
        <body className="min-h-screen bg-stone-50 text-stone-900 font-light flex flex-col">
          <PostHogIdentifier />
          <AnnouncementBar />
          <Navigation />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
          <CookieConsent />
        </body>
      </html>
    </ClerkProvider>
    </ConvexClientProvider>
  )
}
