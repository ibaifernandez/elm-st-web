const { test, expect } = require("@playwright/test");

const routes = [
  "/",
  "/nosotros.html",
  "/portafolio.html",
  "/contacto.html",
  "/dossier-tecnico.html",
  "/en/",
  "/en/about.html",
  "/en/portfolio.html",
  "/en/contact.html",
  "/en/technical-dossier.html"
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
    { route: "/", href: "/en/", expectedAria: "English" },
    { route: "/nosotros.html", href: "/en/about.html", expectedAria: "English" },
    { route: "/portafolio.html", href: "/en/portfolio.html", expectedAria: "English" },
    { route: "/contacto.html", href: "/en/contact.html", expectedAria: "English" },
    { route: "/dossier-tecnico.html", href: "/en/technical-dossier.html", expectedAria: "English" },
    { route: "/en/", href: "/", expectedAria: "español" },
    { route: "/en/about.html", href: "/nosotros.html", expectedAria: "español" },
    { route: "/en/portfolio.html", href: "/portafolio.html", expectedAria: "español" },
    { route: "/en/contact.html", href: "/contacto.html", expectedAria: "español" },
    { route: "/en/technical-dossier.html", href: "/dossier-tecnico.html", expectedAria: "español" }
  ];

  for (const langRoute of languageSwitchRoutes) {
    test(`shows language switch on ${langRoute.route}`, async ({ page }) => {
      await page.goto(langRoute.route, { waitUntil: "domcontentloaded" });
      const switchLink = page.locator(".language-fab a").first();
      await expect(switchLink).toBeVisible();
      await expect(switchLink).toHaveAttribute("href", langRoute.href);
      await expect(switchLink).toHaveAttribute("aria-label", new RegExp(langRoute.expectedAria, "i"));
    });
  }
});

test.describe("Dossier menu CTA", () => {
  const dossierMenuRoutes = [
    { route: "/", href: "dossier-tecnico.html" },
    { route: "/nosotros.html", href: "dossier-tecnico.html" },
    { route: "/portafolio.html", href: "dossier-tecnico.html" },
    { route: "/contacto.html", href: "dossier-tecnico.html" },
    { route: "/dossier-tecnico.html", href: "/dossier-tecnico.html" },
    { route: "/en/", href: "/en/technical-dossier.html" },
    { route: "/en/about.html", href: "/en/technical-dossier.html" },
    { route: "/en/portfolio.html", href: "/en/technical-dossier.html" },
    { route: "/en/contact.html", href: "/en/technical-dossier.html" },
    { route: "/en/technical-dossier.html", href: "/en/technical-dossier.html" }
  ];

  for (const menuRoute of dossierMenuRoutes) {
    test(`shows dossier CTA on ${menuRoute.route}`, async ({ page }) => {
      await page.goto(menuRoute.route, { waitUntil: "domcontentloaded" });
      const dossierLink = page.locator("header nav .ownmenu li.menu-cta a").first();
      await expect(dossierLink).toBeVisible();
      await expect(dossierLink).toHaveAttribute("href", menuRoute.href);
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
  test("contact page submits via POST /.netlify/functions/submit-contact", async ({ page }) => {
    let posted = false;

    await page.route("**/*", async (route) => {
      const req = route.request();
      if (req.method() === "POST" && req.url().includes("/.netlify/functions/submit-contact")) {
        posted = true;
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({ success: true, message: "Message received." })
        });
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

  test("home page submits via POST /.netlify/functions/submit-contact", async ({ page }) => {
    let posted = false;

    await page.route("**/*", async (route) => {
      const req = route.request();
      if (req.method() === "POST" && req.url().includes("/.netlify/functions/submit-contact")) {
        posted = true;
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({ success: true, message: "Message received." })
        });
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

  test("english contact page submits via POST /.netlify/functions/submit-contact", async ({ page }) => {
    let posted = false;

    await page.route("**/*", async (route) => {
      const req = route.request();
      if (req.method() === "POST" && req.url().includes("/.netlify/functions/submit-contact")) {
        posted = true;
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({ success: true, message: "Message received." })
        });
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
