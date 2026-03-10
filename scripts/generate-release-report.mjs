import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";

const LIGHTHOUSE_DIR = path.resolve(".lighthouseci");
const BUDGETS_PATH = path.resolve("performance-budgets.json");
const LINKS_PATH = path.resolve(".lighthouseci/links.json");

function parseArgs(argv) {
  const args = {};
  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (token === "--output") {
      args.output = argv[index + 1];
      index += 1;
    }
  }
  return args;
}

function median(values) {
  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  if (sorted.length % 2 === 0) {
    return (sorted[middle - 1] + sorted[middle]) / 2;
  }
  return sorted[middle];
}

function loadJson(filePath, fallback = null) {
  if (!fs.existsSync(filePath)) {
    return fallback;
  }
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function findLhrFiles() {
  if (!fs.existsSync(LIGHTHOUSE_DIR)) {
    return [];
  }
  return fs
    .readdirSync(LIGHTHOUSE_DIR)
    .filter((file) => /^lhr-\d+\.json$/.test(file))
    .map((file) => path.join(LIGHTHOUSE_DIR, file));
}

function buildRouteMap(lhrFiles) {
  const routeMap = new Map();
  for (const filePath of lhrFiles) {
    const report = loadJson(filePath);
    const url = report.finalDisplayedUrl || report.requestedUrl;
    if (!url) {
      continue;
    }
    const existing = routeMap.get(url) || [];
    existing.push(report);
    routeMap.set(url, existing);
  }
  return routeMap;
}

function getScore(report, key) {
  const categories = report.categories || {};
  if (key === "performance") {
    return categories.performance ? categories.performance.score : NaN;
  }
  if (key === "accessibility") {
    return categories.accessibility ? categories.accessibility.score : NaN;
  }
  if (key === "seo") {
    return categories.seo ? categories.seo.score : NaN;
  }
  if (key === "best-practices") {
    return categories["best-practices"] ? categories["best-practices"].score : NaN;
  }
  return NaN;
}

function getMetric(report, key) {
  const audits = report.audits || {};
  if (key === "network-requests") {
    const items = audits["network-requests"] && audits["network-requests"].details
      ? audits["network-requests"].details.items
      : [];
    return items.length;
  }

  const audit = audits[key];
  if (!audit || typeof audit.numericValue !== "number") {
    return NaN;
  }
  return audit.numericValue;
}

function formatScore(score) {
  if (!Number.isFinite(score)) {
    return "n/a";
  }
  return `${Math.round(score * 100)}`;
}

function formatMetric(value, digits = 0) {
  if (!Number.isFinite(value)) {
    return "n/a";
  }
  return value.toFixed(digits);
}

function runGit(command, fallback = "n/a") {
  try {
    return execSync(command, { encoding: "utf8" }).trim();
  } catch (error) {
    return fallback;
  }
}

const args = parseArgs(process.argv.slice(2));
const today = new Date().toISOString().slice(0, 10);
const outputPath = path.resolve(args.output || `reports/releases/${today}.md`);

const budgets = loadJson(BUDGETS_PATH, { routes: {} });
const links = loadJson(LINKS_PATH, {});
const routeEntries = Object.entries(budgets.routes || {});
const lhrFiles = findLhrFiles();
const routeMap = buildRouteMap(lhrFiles);

const sha = runGit("git rev-parse --short HEAD");
const branch = runGit("git rev-parse --abbrev-ref HEAD");
const generatedAt = new Date().toISOString();

const reportRows = [];
for (const [route, budget] of routeEntries) {
  const reports = routeMap.get(route) || [];
  if (!reports.length) {
    reportRows.push({
      route,
      status: "MISSING",
      performance: "n/a",
      accessibility: "n/a",
      seo: "n/a",
      bestPractices: "n/a",
      lcp: "n/a",
      tbt: "n/a",
      cls: "n/a",
      bytes: "n/a",
      requests: "n/a"
    });
    continue;
  }

  const perf = median(reports.map((report) => getScore(report, "performance")).filter(Number.isFinite));
  const a11y = median(reports.map((report) => getScore(report, "accessibility")).filter(Number.isFinite));
  const seo = median(reports.map((report) => getScore(report, "seo")).filter(Number.isFinite));
  const bp = median(reports.map((report) => getScore(report, "best-practices")).filter(Number.isFinite));
  const lcp = median(reports.map((report) => getMetric(report, "largest-contentful-paint")).filter(Number.isFinite));
  const tbt = median(reports.map((report) => getMetric(report, "total-blocking-time")).filter(Number.isFinite));
  const cls = median(reports.map((report) => getMetric(report, "cumulative-layout-shift")).filter(Number.isFinite));
  const bytes = median(reports.map((report) => getMetric(report, "total-byte-weight")).filter(Number.isFinite));
  const requests = median(reports.map((report) => getMetric(report, "network-requests")).filter(Number.isFinite));

  const status = (
    perf >= budget.minScores.performance &&
    a11y >= budget.minScores.accessibility &&
    seo >= budget.minScores.seo &&
    bp >= budget.minScores["best-practices"] &&
    lcp <= budget.maxMetrics["largest-contentful-paint"] &&
    tbt <= budget.maxMetrics["total-blocking-time"] &&
    cls <= budget.maxMetrics["cumulative-layout-shift"] &&
    bytes <= budget.maxMetrics["total-byte-weight"] &&
    requests <= budget.maxMetrics["network-requests"]
  ) ? "PASS" : "FAIL";

  reportRows.push({
    route,
    status,
    performance: formatScore(perf),
    accessibility: formatScore(a11y),
    seo: formatScore(seo),
    bestPractices: formatScore(bp),
    lcp: formatMetric(lcp, 0),
    tbt: formatMetric(tbt, 0),
    cls: formatMetric(cls, 3),
    bytes: formatMetric(bytes, 0),
    requests: formatMetric(requests, 0)
  });
}

const passCount = reportRows.filter((row) => row.status === "PASS").length;
const failCount = reportRows.filter((row) => row.status === "FAIL").length;
const missingCount = reportRows.filter((row) => row.status === "MISSING").length;

const lines = [];
lines.push(`# Release Technical Report - ${today}`);
lines.push("");
lines.push(`- Generated: ${generatedAt}`);
lines.push(`- Git SHA: \`${sha}\``);
lines.push(`- Branch: \`${branch}\``);
lines.push(`- Budget status: PASS ${passCount} | FAIL ${failCount} | MISSING ${missingCount}`);
lines.push("");
lines.push("## Route Metrics (median)");
lines.push("");
lines.push("| Route | Status | Perf | A11y | SEO | BP | LCP(ms) | TBT(ms) | CLS | Bytes | Requests |");
lines.push("|---|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|");
for (const row of reportRows) {
  lines.push(
    `| ${row.route} | ${row.status} | ${row.performance} | ${row.accessibility} | ${row.seo} | ${row.bestPractices} | ${row.lcp} | ${row.tbt} | ${row.cls} | ${row.bytes} | ${row.requests} |`
  );
}
lines.push("");
lines.push("## Lighthouse Public Reports");
lines.push("");
if (links && Object.keys(links).length) {
  for (const [url, reportUrl] of Object.entries(links)) {
    lines.push(`- ${url} -> ${reportUrl}`);
  }
} else {
  lines.push("- No `links.json` found. Run `npm run test:lighthouse` first.");
}

fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, `${lines.join("\n")}\n`, "utf8");

console.log(`Release report generated at ${outputPath}`);
