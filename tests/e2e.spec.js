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

test.describe("404 localization and shared shell", () => {
  test("renders styled Spanish 404 with dossier CTA on missing root route", async ({ page }) => {
    const response = await page.goto("/ruta-inexistente", { waitUntil: "domcontentloaded" });
    expect(response && response.status()).toBe(404);

    await expect(page.locator("#error-title")).toHaveText("Página no encontrada");
    await expect(page.locator("header nav .ownmenu li.menu-cta a")).toHaveAttribute("href", "/dossier-tecnico.html");
    await expect(page.locator(".language-fab a")).toHaveAttribute("href", "/en/");

    const shellState = await page.evaluate(() => {
      const errorBlock = document.querySelector(".error-404");
      const logo = document.querySelector(".logo img");

      return {
        backgroundImage: window.getComputedStyle(errorBlock).backgroundImage,
        logoSrc: logo ? logo.getAttribute("src") : ""
      };
    });

    expect(shellState.backgroundImage).toContain("fondo-reel");
    expect(shellState.logoSrc).toBe("/images/logo.png");
  });

  test("renders styled English 404 with English navigation on missing EN route", async ({ page }) => {
    const response = await page.goto("/en/vwre", { waitUntil: "domcontentloaded" });
    expect(response && response.status()).toBe(404);

    await expect(page.locator("html")).toHaveAttribute("lang", "en");
    await expect(page.locator("#nav-home")).toHaveText("Home");
    await expect(page.locator("#nav-about")).toHaveText("About");
    await expect(page.locator("#nav-portfolio")).toHaveText("Portfolio");
    await expect(page.locator("#nav-contact")).toHaveText("Contact");
    await expect(page.locator("#nav-dossier")).toHaveAttribute("href", "/en/technical-dossier.html");
    await expect(page.locator("#error-title")).toHaveText("Page not found");
    await expect(page.locator(".language-fab a")).toHaveAttribute("href", "/");

    const shellState = await page.evaluate(() => {
      const errorBlock = document.querySelector(".error-404");
      const logo = document.querySelector(".logo img");

      return {
        backgroundImage: window.getComputedStyle(errorBlock).backgroundImage,
        logoSrc: logo ? logo.getAttribute("src") : ""
      };
    });

    expect(shellState.backgroundImage).toContain("fondo-reel");
    expect(shellState.logoSrc).toBe("/images/logo.png");
  });
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

test.describe("Dossier source docs modal", () => {
  test("opens README.md inside modal on Spanish dossier", async ({ page }) => {
    await page.goto("/dossier-tecnico.html", { waitUntil: "domcontentloaded" });

    await page.click('.doc-modal-link[data-doc-path="/README.md"]');

    const modal = page.locator("#doc-modal");
    const modalTitle = page.locator("#doc-modal-title");
    const modalContent = page.locator("#doc-modal-content");

    await expect(modal).toBeVisible();
    await expect(modalTitle).toHaveText("README.md");
    await expect(modalContent).toContainText("elm-st-web");

    await page.keyboard.press("Escape");
    await expect(modal).toBeHidden();
  });

  test("opens ARCHITECTURE.md inside modal on English dossier", async ({ page }) => {
    await page.goto("/en/technical-dossier.html", { waitUntil: "domcontentloaded" });

    await page.click('.doc-modal-link[data-doc-path="/docs/ARCHITECTURE.md"]');

    const modal = page.locator("#doc-modal");
    const modalTitle = page.locator("#doc-modal-title");
    const modalContent = page.locator("#doc-modal-content");

    await expect(modal).toBeVisible();
    await expect(modalTitle).toHaveText("ARCHITECTURE.md");
    await expect(modalContent).toContainText("ARCHITECTURE");

    await page.keyboard.press("Escape");
    await expect(modal).toBeHidden();
  });
});

test.describe("Dossier structure order", () => {
  test("places objective callout before section title in Spanish dossier", async ({ page }) => {
    await page.goto("/dossier-tecnico.html", { waitUntil: "domcontentloaded" });
    const order = await page.evaluate(() => {
      const callout = document.querySelector(".dossier-main .dossier-callout");
      const title = document.querySelector(".dossier-main .tittle");
      if (!callout || !title) {
        return null;
      }
      return callout.compareDocumentPosition(title);
    });

    expect(order).not.toBeNull();
    expect(order & 4).toBeTruthy();
  });

  test("renders six dossier cards in deterministic sequence on desktop", async ({ page }) => {
    await page.setViewportSize({ width: 1366, height: 1000 });
    await page.goto("/dossier-tecnico.html", { waitUntil: "domcontentloaded" });

    const positions = await page.evaluate(() => {
      const nodes = Array.from(document.querySelectorAll(".dossier-grid .dossier-grid-item"));
      return nodes.map((node, index) => {
        const rect = node.getBoundingClientRect();
        return {
          index,
          top: Math.round(rect.top),
          left: Math.round(rect.left)
        };
      });
    });

    expect(positions).toHaveLength(6);
    expect(positions[0].left).toBeLessThan(positions[1].left);
    expect(positions[0].top).toBe(positions[1].top);
    expect(positions[2].top).toBeGreaterThan(positions[0].top);
    expect(positions[2].left).toBeLessThan(positions[3].left);
    expect(positions[4].top).toBeGreaterThan(positions[2].top);
    expect(positions[4].left).toBeLessThan(positions[5].left);
  });
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
