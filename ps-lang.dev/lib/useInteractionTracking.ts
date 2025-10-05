import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { useCallback, useEffect, useState } from "react";

// Generate or retrieve session ID
function getSessionId(): string {
  if (typeof window === 'undefined') return '';

  let sessionId = sessionStorage.getItem('ps_lang_session_id');

  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
    sessionStorage.setItem('ps_lang_session_id', sessionId);
  }

  return sessionId;
}

export function useInteractionTracking(page: string, pageId?: string) {
  const { user } = useUser();
  const trackInteraction = useMutation(api.userInteractions.track);
  const [sessionId, setSessionId] = useState<string>('');

  useEffect(() => {
    setSessionId(getSessionId());
  }, []);

  const track = useCallback(
    async (params: {
      interactionType: string;
      category: string;
      target: string;
      value?: any;
      metadata?: {
        paperTitle?: string;
        paperCategory?: string;
        referrer?: string;
        userAgent?: string;
        viewport?: string;
      };
    }) => {
      if (!sessionId) return;

      // Track in Convex
      await trackInteraction({
        userId: user?.id,
        sessionId,
        page,
        pageId,
        interactionType: params.interactionType,
        category: params.category,
        target: params.target,
        value: params.value,
        metadata: params.metadata,
      });

      // Also track in PostHog
      if (typeof window !== 'undefined' && (window as any).posthog) {
        (window as any).posthog.capture(`${page}_${params.category}`, {
          interaction_type: params.interactionType,
          target: params.target,
          page_id: pageId,
          ...params.value,
          ...params.metadata,
        });
      }

      // Also track in Google Analytics
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', params.interactionType, {
          event_category: params.category,
          event_label: params.target,
          page,
          page_id: pageId,
          ...params.metadata,
        });
      }
    },
    [trackInteraction, user?.id, sessionId, page, pageId]
  );

  return { track, sessionId };
}
