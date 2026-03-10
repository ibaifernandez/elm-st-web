"use strict";

const TURNSTILE_VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

function getRemoteIp(headers) {
  const forwardedFor = headers["x-forwarded-for"];
  if (!forwardedFor) {
    return "";
  }
  return String(forwardedFor).split(",")[0].trim();
}

function buildJsonResponse(statusCode, payload) {
  return {
    statusCode,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store"
    },
    body: JSON.stringify(payload)
  };
}

exports.handler = async function handler(event) {
  if (event.httpMethod !== "POST") {
    return buildJsonResponse(405, { success: false, message: "Method not allowed." });
  }

  if (!process.env.TURNSTILE_SECRET_KEY) {
    return buildJsonResponse(503, { success: false, message: "Captcha secret not configured." });
  }

  let token = "";
  try {
    const parsed = event.body ? JSON.parse(event.body) : {};
    token = typeof parsed.token === "string" ? parsed.token.trim() : "";
  } catch (error) {
    return buildJsonResponse(400, { success: false, message: "Invalid JSON payload." });
  }

  if (!token) {
    return buildJsonResponse(400, { success: false, message: "Missing captcha token." });
  }

  const formData = new URLSearchParams();
  formData.set("secret", process.env.TURNSTILE_SECRET_KEY);
  formData.set("response", token);
  const remoteIp = getRemoteIp(event.headers || {});
  if (remoteIp) {
    formData.set("remoteip", remoteIp);
  }

  try {
    const verifyResponse = await fetch(TURNSTILE_VERIFY_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: formData.toString()
    });

    const verifyPayload = await verifyResponse.json();
    const isSuccessful = verifyResponse.ok && verifyPayload && verifyPayload.success === true;

    return buildJsonResponse(200, {
      success: isSuccessful,
      errors: verifyPayload && verifyPayload["error-codes"] ? verifyPayload["error-codes"] : []
    });
  } catch (error) {
    return buildJsonResponse(502, {
      success: false,
      message: "Captcha verification service unavailable."
    });
  }
};
