import fs from "node:fs";

const requiredFiles = [
  "netlify.toml",
  "_redirects",
  "_headers",
  "index.html",
  "404.html",
  "en/index.html",
  "en/about.html",
  "en/portfolio.html",
  "en/contact.html"
];
const missingFiles = requiredFiles.filter((file) => !fs.existsSync(file));

if (missingFiles.length) {
  console.error("Missing required Netlify files:", missingFiles.join(", "));
  process.exit(1);
}

const redirects = fs
  .readFileSync("_redirects", "utf8")
  .split("\n")
  .map((line) => line.trim())
  .filter((line) => line && !line.startsWith("#"));

const requiredRedirectRules = [
  "/index.html / 301!",
  "/inicio.html / 301!",
  "/nosotros /nosotros.html 200",
  "/portafolio /portafolio.html 200",
  "/contacto /contacto.html 200",
  "/en/about /en/about.html 200",
  "/en/portfolio /en/portfolio.html 200",
  "/en/contact /en/contact.html 200",
  "/LLM.txt /llms.txt 301!",
  "/* /404.html 404"
];

const missingRedirectRules = requiredRedirectRules.filter((rule) => !redirects.includes(rule));
if (missingRedirectRules.length) {
  console.error("Missing required redirect rules:");
  for (const rule of missingRedirectRules) {
    console.error(`- ${rule}`);
  }
  process.exit(1);
}

const headersContent = fs.readFileSync("_headers", "utf8");
const requiredHeaders = [
  "X-Frame-Options: SAMEORIGIN",
  "X-Content-Type-Options: nosniff",
  "Referrer-Policy: strict-origin-when-cross-origin",
  "Permissions-Policy:",
  "Strict-Transport-Security:",
  "Content-Security-Policy:"
];

const missingHeaders = requiredHeaders.filter((header) => !headersContent.includes(header));
if (missingHeaders.length) {
  console.error("Missing required security headers:");
  for (const header of missingHeaders) {
    console.error(`- ${header}`);
  }
  process.exit(1);
}

const robots = fs.readFileSync("robots.txt", "utf8");
if (!robots.includes("https://elmst.ibaifernandez.com/sitemap.xml")) {
  console.error("robots.txt must point to the production sitemap URL.");
  process.exit(1);
}

const mainJs = fs.readFileSync("js/main.js", "utf8");
if (mainJs.includes("php/submit.php")) {
  console.error("Legacy PHP submit endpoint is still referenced in js/main.js");
  process.exit(1);
}

const phpDirExists = fs.existsSync("php");
if (phpDirExists) {
  const phpFiles = fs.readdirSync("php").filter((file) => file.endsWith(".php"));
  if (phpFiles.length) {
    console.error(`Legacy PHP files should be removed for Netlify static deploy: ${phpFiles.join(", ")}`);
    process.exit(1);
  }
}

console.log("Netlify config checks passed.");
