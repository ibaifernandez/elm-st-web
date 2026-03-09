const { test, expect } = require("@playwright/test");
const AxeBuilder = require("@axe-core/playwright").default;

const pages = [
  "/",
  "/nosotros.html",
  "/portafolio.html",
  "/contacto.html",
  "/en/",
  "/en/about.html",
  "/en/portfolio.html",
  "/en/contact.html"
];

test.describe("Accessibility automated checks", () => {
  for (const route of pages) {
    test(`axe scan ${route}`, async ({ page }) => {
      await page.goto(route, { waitUntil: "domcontentloaded" });

      const results = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa"])
        .analyze();

      const blockingViolations = results.violations.filter(
        (violation) => violation.impact === "critical" || violation.impact === "serious"
      );

      expect(
        blockingViolations,
        `Blocking axe violations on ${route}: ${JSON.stringify(blockingViolations, null, 2)}`
      ).toEqual([]);
    });
  }
});
