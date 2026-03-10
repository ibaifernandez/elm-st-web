import fs from "node:fs";
import path from "node:path";

const LIGHTHOUSE_DIR = path.resolve(".lighthouseci");
const BUDGETS_PATH = path.resolve("performance-budgets.json");

function median(values) {
  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  if (sorted.length % 2 === 0) {
    return (sorted[middle - 1] + sorted[middle]) / 2;
  }
  return sorted[middle];
}

function loadJson(filePath) {
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
    const requestItems = audits["network-requests"] && audits["network-requests"].details
      ? audits["network-requests"].details.items
      : [];
    return requestItems.length;
  }

  const audit = audits[key];
  if (!audit || typeof audit.numericValue !== "number") {
    return NaN;
  }
  return audit.numericValue;
}

function formatNumber(value, digits = 3) {
  if (!Number.isFinite(value)) {
    return "n/a";
  }
  return value.toFixed(digits);
}

const budgets = loadJson(BUDGETS_PATH);
const lhrFiles = findLhrFiles();

if (!lhrFiles.length) {
  console.error("No Lighthouse JSON reports found in .lighthouseci/. Run `npm run test:lighthouse` first.");
  process.exit(1);
}

const routeMap = buildRouteMap(lhrFiles);
const routeEntries = Object.entries(budgets.routes || {});
const failures = [];
const rows = [];

for (const [route, routeBudget] of routeEntries) {
  const reports = routeMap.get(route) || [];
  if (!reports.length) {
    failures.push(`[${route}] Missing Lighthouse runs for this route.`);
    continue;
  }

  const minScores = routeBudget.minScores || {};
  const maxMetrics = routeBudget.maxMetrics || {};

  for (const [scoreKey, minValue] of Object.entries(minScores)) {
    const values = reports.map((report) => getScore(report, scoreKey)).filter(Number.isFinite);
    if (!values.length) {
      failures.push(`[${route}] Missing score '${scoreKey}'.`);
      continue;
    }

    const observed = median(values);
    rows.push(`${route} | score:${scoreKey} | observed=${formatNumber(observed)} | threshold>=${formatNumber(minValue)}`);
    if (observed < minValue) {
      failures.push(
        `[${route}] score '${scoreKey}' median ${formatNumber(observed)} < minimum ${formatNumber(minValue)}`
      );
    }
  }

  for (const [metricKey, maxValue] of Object.entries(maxMetrics)) {
    const values = reports.map((report) => getMetric(report, metricKey)).filter(Number.isFinite);
    if (!values.length) {
      failures.push(`[${route}] Missing metric '${metricKey}'.`);
      continue;
    }

    const observed = median(values);
    rows.push(`${route} | metric:${metricKey} | observed=${formatNumber(observed)} | threshold<=${formatNumber(maxValue)}`);
    if (observed > maxValue) {
      failures.push(
        `[${route}] metric '${metricKey}' median ${formatNumber(observed)} > maximum ${formatNumber(maxValue)}`
      );
    }
  }
}

console.log("Performance budgets (median by route):");
for (const row of rows) {
  console.log(`- ${row}`);
}

if (failures.length) {
  console.error("\nBudget failures:");
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log("\nAll performance budgets passed.");
