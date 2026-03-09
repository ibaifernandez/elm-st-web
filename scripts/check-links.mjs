import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const htmlFiles = [
  ...fs.readdirSync(root).filter((file) => file.endsWith(".html")),
  ...(fs.existsSync(path.join(root, "en"))
    ? fs
        .readdirSync(path.join(root, "en"))
        .filter((file) => file.endsWith(".html"))
        .map((file) => path.posix.join("en", file))
    : [])
];
const shouldCheckExternal = process.env.CHECK_EXTERNAL_LINKS === "true";
const ignoredExternalLinksPath = path.join(root, "scripts", "external-link-ignore.json");
const ignoredExternalLinks = new Set(
  fs.existsSync(ignoredExternalLinksPath)
    ? JSON.parse(fs.readFileSync(ignoredExternalLinksPath, "utf8"))
    : []
);
const redirectSources = new Set(
  fs
    .readFileSync(path.join(root, "_redirects"), "utf8")
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith("#"))
    .map((line) => line.split(/\s+/)[0])
);

const externalUrls = new Map();
const internalErrors = [];
const mixedContentErrors = [];
const parserRegex = /(?:href|src)=(["'])(.*?)\1/gi;

function shouldSkipHref(target) {
  return (
    !target ||
    target.startsWith("#") ||
    target.startsWith("mailto:") ||
    target.startsWith("tel:") ||
    target.startsWith("javascript:") ||
    target.startsWith("data:")
  );
}

function normalizePath(target, currentFile) {
  const withoutHash = target.split("#")[0].split("?")[0];
  if (!withoutHash) {
    return null;
  }

  if (withoutHash.startsWith("/")) {
    return withoutHash;
  }

  const resolved = path.normalize(path.join(path.dirname(`/${currentFile}`), withoutHash));
  return resolved.startsWith("/") ? resolved : `/${resolved}`;
}

function internalPathExists(normalizedPath) {
  if (redirectSources.has(normalizedPath)) {
    return true;
  }

  const base = path.join(root, normalizedPath);
  const candidates = [base];

  if (normalizedPath.endsWith("/")) {
    candidates.push(path.join(root, normalizedPath, "index.html"));
  } else {
    if (!path.extname(normalizedPath)) {
      candidates.push(path.join(root, `${normalizedPath}.html`));
      candidates.push(path.join(root, normalizedPath, "index.html"));
    }
  }

  return candidates.some((candidate) => fs.existsSync(candidate));
}

async function checkExternalUrl(url) {
  const timeoutMs = 12_000;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    let response = await fetch(url, {
      method: "HEAD",
      redirect: "follow",
      signal: controller.signal
    });

    if (response.status === 405 || response.status === 501) {
      response = await fetch(url, {
        method: "GET",
        redirect: "follow",
        signal: controller.signal
      });
    }

    if (response.status >= 400 && response.status !== 401 && response.status !== 403) {
      return `HTTP ${response.status}`;
    }

    return null;
  } catch (error) {
    return error.name === "AbortError" ? "timeout" : error.message;
  } finally {
    clearTimeout(timer);
  }
}

for (const file of htmlFiles) {
  const fullPath = path.join(root, file);
  const content = fs.readFileSync(fullPath, "utf8");
  const contentWithoutComments = content.replace(/<!--[\s\S]*?-->/g, "");

  const rawHttpMatches = contentWithoutComments.match(/http:\/\/[^\s"'<>]+/g) || [];
  for (const match of rawHttpMatches) {
    if (match.startsWith("http://www.w3.org/") || match.startsWith("http://www.sitemaps.org/")) {
      continue;
    }
    mixedContentErrors.push(`${file}: ${match}`);
  }

  let match;
  while ((match = parserRegex.exec(contentWithoutComments)) !== null) {
    const target = match[2].trim();

    if (shouldSkipHref(target)) {
      continue;
    }

    if (target.startsWith("http://")) {
      mixedContentErrors.push(`${file}: ${target}`);
      continue;
    }

    if (target.startsWith("https://")) {
      externalUrls.set(target, file);
      continue;
    }

    const normalizedPath = normalizePath(target, file);
    if (!normalizedPath) {
      continue;
    }

    if (!internalPathExists(normalizedPath)) {
      internalErrors.push(`${file}: missing internal target ${target}`);
    }
  }
}

const externalErrors = [];
if (shouldCheckExternal) {
for (const [url, source] of externalUrls.entries()) {
  if (ignoredExternalLinks.has(url)) {
    continue;
  }
  const error = await checkExternalUrl(url);
    if (error) {
      externalErrors.push(`${source}: ${url} (${error})`);
    }
  }
}

if (mixedContentErrors.length || internalErrors.length || externalErrors.length) {
  console.error("Link and mixed-content checks failed.");

  if (mixedContentErrors.length) {
    console.error("\nMixed content detected:");
    for (const issue of mixedContentErrors) {
      console.error(`- ${issue}`);
    }
  }

  if (internalErrors.length) {
    console.error("\nBroken internal links:");
    for (const issue of internalErrors) {
      console.error(`- ${issue}`);
    }
  }

  if (externalErrors.length) {
    console.error("\nBroken external links:");
    for (const issue of externalErrors) {
      console.error(`- ${issue}`);
    }
  }

  process.exit(1);
}

console.log(`Checked ${htmlFiles.length} HTML files and ${externalUrls.size} external URLs. All good.`);
if (!shouldCheckExternal) {
  console.log("External URL reachability was skipped (set CHECK_EXTERNAL_LINKS=true to enforce it).");
}
