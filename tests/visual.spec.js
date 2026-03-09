const { test, expect } = require("@playwright/test");

const pages = [
  { route: "/", slug: "home" },
  { route: "/nosotros.html", slug: "nosotros" },
  { route: "/portafolio.html", slug: "portafolio" },
  { route: "/contacto.html", slug: "contacto" }
];

async function stabilizePage(page) {
  await page.addStyleTag({
    content:
      "*, *::before, *::after { animation: none !important; transition: none !important; scroll-behavior: auto !important; }"
  });
}

async function loadLazyAssets(page) {
  await page.evaluate(async () => {
    const step = Math.max(240, Math.floor(window.innerHeight * 0.85));
    const maxScroll = document.documentElement.scrollHeight;

    for (let y = 0; y <= maxScroll; y += step) {
      window.scrollTo(0, y);
      await new Promise((resolve) => setTimeout(resolve, 60));
    }

    window.scrollTo(0, 0);
  });
  await page.waitForLoadState("networkidle");
}

test.describe("Visual regression", () => {
  for (const view of [
    { name: "desktop", width: 1440, height: 900 },
    { name: "mobile", width: 390, height: 844 }
  ]) {
    for (const pageConfig of pages) {
      test(`${pageConfig.slug} ${view.name}`, async ({ page }) => {
        await page.setViewportSize({ width: view.width, height: view.height });
        await page.goto(pageConfig.route, { waitUntil: "networkidle" });
        await stabilizePage(page);
        await loadLazyAssets(page);
        await expect(page).toHaveScreenshot(`${pageConfig.slug}-${view.name}.png`, {
          fullPage: true,
          animations: "disabled"
        });
      });
    }
  }
});
