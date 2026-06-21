import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import posthog from "posthog-js";
import { PostHogProvider as PHProvider } from "posthog-js/react";

const token = import.meta.env.VITE_POSTHOG_PROJECT_TOKEN;
const host = import.meta.env.VITE_POSTHOG_HOST || "https://us.i.posthog.com";

if (token && !posthog.__loaded) {
  posthog.init(token, {
    api_host: host,
    capture_pageview: false,
    capture_pageleave: true,
    autocapture: false,
    person_profiles: "identified_only",
    defaults: "2026-01-30",
    loaded: (client) => {
      if (import.meta.env.DEV) {
        client.debug();
        client.capture("posthog_setup_test", {
          source: "public_website",
          environment: "development",
        });
      }
    },
  });
}

function PostHogPageView() {
  const location = useLocation();

  useEffect(() => {
    if (!token) return;
    posthog.capture("$pageview", {
      $current_url: `${location.pathname}${location.search}`,
    });
  }, [location.pathname, location.search]);

  return null;
}

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  return (
    <PHProvider client={posthog}>
      <PostHogPageView />
      {children}
    </PHProvider>
  );
}
