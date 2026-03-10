"use strict";

function sanitizeSentryDsn(rawDsn) {
  const value = typeof rawDsn === "string" ? rawDsn.trim() : "";
  if (!value) {
    return "";
  }

  try {
    const parsedUrl = new URL(value);
    if (!parsedUrl.username) {
      return "";
    }
    parsedUrl.password = "";
    return parsedUrl.toString();
  } catch (error) {
    return "";
  }
}

exports.handler = async function handler() {
  const sentryEnvironment = (process.env.SENTRY_ENVIRONMENT || "production").trim() || "production";
  const sentryRelease = (process.env.SENTRY_RELEASE || "").trim();

  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store"
    },
    body: JSON.stringify({
      turnstileSiteKey: process.env.TURNSTILE_SITE_KEY || "",
      sentryDsn: sanitizeSentryDsn(process.env.SENTRY_DSN),
      sentryEnvironment: sentryEnvironment,
      sentryRelease: sentryRelease
    })
  };
};
