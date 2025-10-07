import * as Sentry from "@sentry/astro";

Sentry.init({
  dsn: "https://78f63aad60959eca71e6a6dbbbdacad0@o4510126970765312.ingest.de.sentry.io/4510127019327568",
  // Adds request headers and IP for users, for more info visit:
  // https://docs.sentry.io/platforms/javascript/guides/astro/configuration/options/#sendDefaultPii
  sendDefaultPii: true,
});
