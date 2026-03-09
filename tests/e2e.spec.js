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

test.describe("Language switch visibility", () => {
  const languageSwitchRoutes = [
    { route: "/", label: "EN", href: "/en/" },
    { route: "/nosotros.html", label: "EN", href: "/en/about.html" },
    { route: "/portafolio.html", label: "EN", href: "/en/portfolio.html" },
    { route: "/contacto.html", label: "EN", href: "/en/contact.html" },
    { route: "/en/", label: "ES", href: "/" },
    { route: "/en/about.html", label: "ES", href: "/nosotros.html" },
    { route: "/en/portfolio.html", label: "ES", href: "/portafolio.html" },
    { route: "/en/contact.html", label: "ES", href: "/contacto.html" }
  ];

  for (const langRoute of languageSwitchRoutes) {
    test(`shows language switch on ${langRoute.route}`, async ({ page }) => {
      await page.goto(langRoute.route, { waitUntil: "domcontentloaded" });
      const switchLink = page.locator("li.lang-switch a").first();
      await expect(switchLink).toHaveText(langRoute.label);
      await expect(switchLink).toHaveAttribute("href", langRoute.href);
    });
  }
});

test("header stays above choose-tab section", async ({ page }) => {
  await page.goto("/", { waitUntil: "domcontentloaded" });
  const zIndexes = await page.evaluate(() => {
    const header = document.querySelector("header.main-header");
    const chooseTab = document.querySelector(".sec-choose .choose-tab");

    if (!header || !chooseTab) {
      return { headerZ: null, chooseTabZ: null };
    }

    const headerZ = Number.parseInt(getComputedStyle(header).zIndex || "0", 10);
    const chooseTabZ = Number.parseInt(getComputedStyle(chooseTab).zIndex || "0", 10);

    return { headerZ, chooseTabZ };
  });

  expect(zIndexes.headerZ).toBeGreaterThan(zIndexes.chooseTabZ);
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
