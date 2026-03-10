import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";

const host = "127.0.0.1";
const port = 4173;
const rootDir = process.cwd();

const mimeTypes = new Map([
  [".html", "text/html; charset=utf-8"],
  [".css", "text/css; charset=utf-8"],
  [".js", "application/javascript; charset=utf-8"],
  [".json", "application/json; charset=utf-8"],
  [".xml", "application/xml; charset=utf-8"],
  [".txt", "text/plain; charset=utf-8"],
  [".svg", "image/svg+xml"],
  [".png", "image/png"],
  [".jpg", "image/jpeg"],
  [".jpeg", "image/jpeg"],
  [".gif", "image/gif"],
  [".ico", "image/x-icon"],
  [".woff", "font/woff"],
  [".woff2", "font/woff2"],
  [".ttf", "font/ttf"],
  [".eot", "application/vnd.ms-fontobject"],
  [".mp4", "video/mp4"],
  [".webm", "video/webm"]
]);

function isTextLike(contentType) {
  return (
    contentType.startsWith("text/") ||
    contentType.includes("javascript") ||
    contentType.includes("json") ||
    contentType.includes("xml")
  );
}

function safeResolvePath(urlPath) {
  const cleanPath = decodeURIComponent(urlPath.split("?")[0].split("#")[0]);
  const relativePath = cleanPath === "/" ? "/index.html" : cleanPath;
  const normalizedPath = path.normalize(relativePath).replace(/^(\.\.[/\\])+/, "");
  return path.join(rootDir, normalizedPath);
}

function sendNotFound(response) {
  const notFoundPath = path.join(rootDir, "404.html");
  if (fs.existsSync(notFoundPath)) {
    const body = fs.readFileSync(notFoundPath);
    response.writeHead(404, {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-store"
    });
    response.end(body);
    return;
  }

  response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
  response.end("Not Found");
}

function sendJson(response, payload, statusCode = 200) {
  response.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store"
  });
  response.end(JSON.stringify(payload));
}

const server = http.createServer((request, response) => {
  try {
    const requestPath = request.url || "/";

    if (requestPath.startsWith("/.netlify/functions/runtime-config")) {
      sendJson(response, {
        turnstileSiteKey: "",
        sentryDsn: "",
        sentryEnvironment: "test",
        sentryRelease: ""
      });
      return;
    }

    if (requestPath.startsWith("/.netlify/functions/verify-turnstile")) {
      sendJson(response, { success: true });
      return;
    }

    let filePath = safeResolvePath(requestPath);

    if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
      filePath = path.join(filePath, "index.html");
    }

    if (!fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) {
      sendNotFound(response);
      return;
    }

    const extension = path.extname(filePath).toLowerCase();
    const contentType = mimeTypes.get(extension) || "application/octet-stream";
    const fileBuffer = fs.readFileSync(filePath);

    const headers = {
      "Content-Type": contentType,
      "Cache-Control": "no-store",
      "Vary": "Accept-Encoding"
    };

    const acceptsGzip = (request.headers["accept-encoding"] || "").includes("gzip");
    const compressible = acceptsGzip && isTextLike(contentType) && fileBuffer.length > 1024;

    if (compressible) {
      headers["Content-Encoding"] = "gzip";
      response.writeHead(200, headers);
      response.end(zlib.gzipSync(fileBuffer, { level: zlib.constants.Z_BEST_SPEED }));
      return;
    }

    response.writeHead(200, headers);
    response.end(fileBuffer);
  } catch (error) {
    response.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
    response.end(`Server error: ${error.message}`);
  }
});

server.listen(port, host, () => {
  console.log(`Available on http://${host}:${port}`);
});
