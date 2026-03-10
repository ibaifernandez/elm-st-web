"use strict";

const crypto = require("node:crypto");

const TURNSTILE_VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";
const EMAIL_PATTERN = /^([A-Za-z0-9._%+-])+@([A-Za-z0-9.-])+\.([A-Za-z]{2,})$/;

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

function decodeBody(event) {
  if (!event || !event.body) {
    return "";
  }
  if (event.isBase64Encoded) {
    return Buffer.from(event.body, "base64").toString("utf8");
  }
  return String(event.body);
}

function getHeader(headers, key) {
  if (!headers) {
    return "";
  }

  const exactMatch = headers[key];
  if (exactMatch) {
    return String(exactMatch);
  }

  const loweredKey = key.toLowerCase();
  const altMatch = headers[loweredKey];
  return altMatch ? String(altMatch) : "";
}

function getRemoteIp(headers) {
  const forwardedFor = getHeader(headers, "x-forwarded-for");
  if (!forwardedFor) {
    return "";
  }
  return forwardedFor.split(",")[0].trim();
}

function sanitizeField(value, maxLength) {
  const text = typeof value === "string" ? value.trim() : "";
  if (!text) {
    return "";
  }
  return text.slice(0, maxLength);
}

function parsePayload(event) {
  const rawBody = decodeBody(event);
  const contentType = getHeader(event && event.headers, "content-type").toLowerCase();

  if (!rawBody) {
    return {};
  }

  if (contentType.includes("application/json")) {
    try {
      const parsed = JSON.parse(rawBody);
      return parsed && typeof parsed === "object" ? parsed : {};
    } catch (error) {
      return {};
    }
  }

  const params = new URLSearchParams(rawBody);
  const parsed = {};
  for (const [key, value] of params.entries()) {
    parsed[key] = value;
  }
  return parsed;
}

async function verifyTurnstileToken(token, remoteIp) {
  const secret = sanitizeField(process.env.TURNSTILE_SECRET_KEY, 512);
  if (!secret) {
    return {
      ok: true
    };
  }

  if (!token) {
    return {
      ok: false,
      message: "Missing captcha token."
    };
  }

  const payload = new URLSearchParams();
  payload.set("secret", secret);
  payload.set("response", token);
  if (remoteIp) {
    payload.set("remoteip", remoteIp);
  }

  try {
    const verifyResponse = await fetch(TURNSTILE_VERIFY_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: payload.toString()
    });

    const verifyPayload = await verifyResponse.json();
    const verified = verifyResponse.ok && verifyPayload && verifyPayload.success === true;
    if (verified) {
      return { ok: true };
    }

    return {
      ok: false,
      message: "Captcha verification failed.",
      errors: verifyPayload && verifyPayload["error-codes"] ? verifyPayload["error-codes"] : []
    };
  } catch (error) {
    return {
      ok: false,
      message: "Captcha verification service unavailable."
    };
  }
}

function validateSubmission(fields) {
  const errors = [];
  if (!fields.name) {
    errors.push("Name is required.");
  }
  if (!fields.email) {
    errors.push("Email is required.");
  } else if (!EMAIL_PATTERN.test(fields.email)) {
    errors.push("Email format is invalid.");
  }
  if (!fields.subject) {
    errors.push("Subject is required.");
  }
  if (!fields.message) {
    errors.push("Message is required.");
  }
  return errors;
}

async function persistSubmission(submission) {
  const id = crypto.randomUUID();
  console.log("contact-submission", JSON.stringify(submission));
  return { id };
}

async function sendEmailWithResendIfConfigured(submission) {
  const resendApiKey = sanitizeField(process.env.RESEND_API_KEY, 512);
  const toEmail = sanitizeField(process.env.CONTACT_TO_EMAIL, 320);

  if (!resendApiKey || !toEmail) {
    return {
      delivered: false,
      mode: "storage-only"
    };
  }

  const fromEmail = sanitizeField(process.env.CONTACT_FROM_EMAIL, 320) || "Elm St <no-reply@elmst.ibaifernandez.com>";
  const emailPayload = {
    from: fromEmail,
    to: [toEmail],
    reply_to: submission.email,
    subject: `[Elm St] New contact: ${submission.subject}`,
    text: [
      `Date: ${submission.createdAt}`,
      `Name: ${submission.name}`,
      `Email: ${submission.email}`,
      `Phone: ${submission.phone || "-"}`,
      `Subject: ${submission.subject}`,
      "",
      "Message:",
      submission.message
    ].join("\n")
  };

  const resendResponse = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${resendApiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(emailPayload)
  });

  if (!resendResponse.ok) {
    const rawError = await resendResponse.text();
    throw new Error(`Resend delivery failed with status ${resendResponse.status}: ${rawError.slice(0, 300)}`);
  }

  return {
    delivered: true,
    mode: "resend"
  };
}

exports.handler = async function handler(event) {
  if (!event || event.httpMethod !== "POST") {
    return buildJsonResponse(405, {
      success: false,
      message: "Method not allowed."
    });
  }

  const payload = parsePayload(event);
  const botField = sanitizeField(payload["bot-field"], 256);
  if (botField) {
    return buildJsonResponse(200, {
      success: true,
      message: "Message received."
    });
  }

  const submission = {
    createdAt: new Date().toISOString(),
    name: sanitizeField(payload.name, 120),
    email: sanitizeField(payload.email, 320),
    phone: sanitizeField(payload.phone, 80),
    subject: sanitizeField(payload.subject, 180),
    message: sanitizeField(payload.message, 4000),
    locale: sanitizeField(payload.locale || payload.lang, 16) || "es",
    sourcePath: sanitizeField(payload.sourcePath, 200) || "/",
    userAgent: sanitizeField(getHeader(event.headers, "user-agent"), 500),
    remoteIp: sanitizeField(getRemoteIp(event.headers), 100)
  };

  const validationErrors = validateSubmission(submission);
  if (validationErrors.length) {
    return buildJsonResponse(400, {
      success: false,
      message: validationErrors.join(" ")
    });
  }

  const captchaToken = sanitizeField(payload["cf-turnstile-response"], 4096);
  const captchaCheck = await verifyTurnstileToken(captchaToken, submission.remoteIp);
  if (!captchaCheck.ok) {
    return buildJsonResponse(400, {
      success: false,
      message: captchaCheck.message || "Captcha verification failed.",
      errors: captchaCheck.errors || []
    });
  }

  try {
    const saved = await persistSubmission(submission);
    let deliveryMode = "storage-log-only";
    try {
      const delivery = await sendEmailWithResendIfConfigured(submission);
      if (delivery && delivery.mode) {
        deliveryMode = delivery.mode;
      }
    } catch (emailError) {
      console.error("submit-contact email delivery failed", emailError);
    }

    return buildJsonResponse(200, {
      success: true,
      message: "Message received.",
      submissionId: saved.id,
      delivery: deliveryMode
    });
  } catch (error) {
    console.error("submit-contact failed", error);
    return buildJsonResponse(500, {
      success: false,
      message: "Unable to process message at this moment."
    });
  }
};
