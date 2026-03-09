const { test, expect } = require("@playwright/test");

const routes = [
  "/",
  "/nosotros.html",
  "/portafolio.html",
  "/contacto.html",
  "/en/",
  "/en/about.html",
  "/en/portfolio.html",
  "/en/contact.html"
];

test.describe("Critical route availability", () => {
  for (const route of routes) {
    test(`loads ${route}`, async ({ page }) => {
      const response = await page.goto(route, { waitUntil: "domcontentloaded" });
      expect(response && response.ok()).toBeTruthy();
      await expect(page.locator("body")).toBeVisible();
    });
  }
});

test.describe("Netlify form behavior", () => {
  test("contact page submits via POST /", async ({ page }) => {
    let posted = false;

    await page.route("**/*", async (route) => {
      const req = route.request();
      if (req.method() === "POST" && req.url().endsWith("/")) {
        posted = true;
        await route.fulfill({ status: 200, body: "ok" });
        return;
      }
      await route.continue();
    });

    await page.goto("/contacto.html", { waitUntil: "domcontentloaded" });
    await page.fill("#name", "Prueba Elm St");
    await page.fill("#email", "test@example.com");
    await page.fill("#phone", "+573001112233");
    await page.fill("#subject", "Mensaje de prueba");
    await page.fill("#message", "Este es un test automatizado.");

    page.once("dialog", async (dialog) => {
      expect(dialog.message()).toContain("Gracias");
      await dialog.accept();
    });

    await page.click("#btn_submit");
    await expect.poll(() => posted).toBeTruthy();
  });

  test("home page submits via POST /", async ({ page }) => {
    let posted = false;

    await page.route("**/*", async (route) => {
      const req = route.request();
      if (req.method() === "POST" && req.url().endsWith("/")) {
        posted = true;
        await route.fulfill({ status: 200, body: "ok" });
        return;
      }
      await route.continue();
    });

    await page.goto("/", { waitUntil: "domcontentloaded" });
    await page.fill("#name", "Prueba Elm St");
    await page.fill("#email", "test@example.com");
    await page.fill("#phone", "+573001112233");
    await page.fill("#subject", "Mensaje de prueba");
    await page.fill("#message", "Este es un test automatizado.");

    page.once("dialog", async (dialog) => {
      expect(dialog.message()).toContain("Gracias");
      await dialog.accept();
    });

    await page.click("#btn_submit");
    await expect.poll(() => posted).toBeTruthy();
  });

  test("english contact page submits via POST /", async ({ page }) => {
    let posted = false;

    await page.route("**/*", async (route) => {
      const req = route.request();
      if (req.method() === "POST" && req.url().endsWith("/")) {
        posted = true;
        await route.fulfill({ status: 200, body: "ok" });
        return;
      }
      await route.continue();
    });

    await page.goto("/en/contact.html", { waitUntil: "domcontentloaded" });
    await page.fill("#name", "Elm St Test");
    await page.fill("#email", "test@example.com");
    await page.fill("#phone", "+12025550123");
    await page.fill("#subject", "Test message");
    await page.fill("#message", "Automated EN test.");

    page.once("dialog", async (dialog) => {
      expect(dialog.message().toLowerCase()).toContain("thank");
      await dialog.accept();
    });

    await page.click("#btn_submit");
    await expect.poll(() => posted).toBeTruthy();
  });
});
