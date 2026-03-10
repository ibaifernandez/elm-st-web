"use strict";

exports.handler = async function handler() {
  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store"
    },
    body: JSON.stringify({
      turnstileSiteKey: process.env.TURNSTILE_SITE_KEY || ""
    })
  };
};
