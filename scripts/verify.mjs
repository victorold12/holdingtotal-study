import { chromium } from "playwright";
import { mkdir, writeFile } from "node:fs/promises";
import assert from "node:assert/strict";
import { fileURLToPath } from "node:url";

const root = new URL("../", import.meta.url);
const out = new URL("reference/verification/", root);
await mkdir(out, { recursive: true });
const browser = await chromium.launch({
  executablePath:
    process.env.STUDY_CHROME ||
    "C:/Users/VTz produti/AppData/Local/ms-playwright/chromium-1243/chrome-win64/chrome.exe",
  headless: true,
});
const report = {
  date: new Date().toISOString(),
  checks: [],
  console: [],
  comparisons: [],
  limitations: [
    "Pixel screenshots normalize CSS animations and transitions on both pages. External checkout/video content is excluded from pixel equality. Touch tests use emulated events, not a physical device.",
  ],
};
const check = (name, value, detail) => {
  report.checks.push({ name, pass: !!value, detail });
  if (!value) console.error("FAIL", name, detail);
};
const selectors = [
  ".nossa-hero",
  ".comparison-section",
  ".video-carousel-header",
  ".for-you-section",
  ".offer-left",
  ".guarantee-section",
  ".mentor-section",
  ".faq-section",
  ".final-parallax",
  ".footer",
];
const localUrl = "http://127.0.0.1:3081/imersao";

try {
  for (const viewport of [
    { width: 1440, height: 1000 },
    { width: 768, height: 1024 },
    { width: 390, height: 844 },
  ]) {
    for (const [kind, url] of [
      ["original", "https://holdingtotal.com.br/imersao/"],
      ["local", localUrl],
    ]) {
      const context = await browser.newContext({
        viewport,
        deviceScaleFactor: 1,
        hasTouch: true,
        locale: "pt-BR",
        timezoneId: "America/Sao_Paulo",
        reducedMotion: "no-preference",
        serviceWorkers: "block",
      });
      // Isolate static comparison from third-party checkout height, live media,
      // and analytics. The untouched REA capture is kept separately.
      await context.route("**/*", (route) => {
        const u = new URL(route.request().url());
        if (
          [
            "127.0.0.1",
            "holdingtotal.com.br",
            "fonts.googleapis.com",
            "fonts.gstatic.com",
            "cdn.jsdelivr.net",
          ].includes(u.hostname)
        )
          return route.continue();
        return route.fulfill({
          status: 200,
          contentType:
            route.request().resourceType() === "script"
              ? "application/javascript"
              : "text/html",
          body: "",
        });
      });
      const page = await context.newPage();
      page.on("pageerror", (error) =>
        report.console.push({
          kind,
          width: viewport.width,
          type: "pageerror",
          text: error.message,
        }),
      );
      page.on("console", (message) => {
        if (["error", "warning"].includes(message.type()))
          report.console.push({
            kind,
            width: viewport.width,
            type: message.type(),
            text: message.text(),
          });
      });
      await page.goto(url, { waitUntil: "load" });
      await page.evaluate(() => document.fonts.ready);
      await page.waitForTimeout(1600);
      const metrics = await page.evaluate((selectors) => {
        const result = {};
        for (const selector of selectors) {
          const el = document.querySelector(selector);
          const box = el.getBoundingClientRect();
          const c = getComputedStyle(el);
          result[selector] = {
            x: box.x,
            y: box.y + scrollY,
            width: box.width,
            height: box.height,
            font: c.fontFamily,
            fontSize: c.fontSize,
            lineHeight: c.lineHeight,
            padding: c.padding,
            background: c.backgroundColor,
          };
        }
        return {
          sections: result,
          viewport: innerWidth,
          scrollWidth: document.documentElement.scrollWidth,
          bodyWidth: document.body.scrollWidth,
          heroText: document
            .querySelector("h1")
            .textContent.replace(/\s+/g, " ")
            .trim(),
          heroFont: getComputedStyle(document.querySelector("h1")).fontSize,
          carouselTransition: getComputedStyle(
            document.querySelector(".video-carousel-track"),
          ).transition,
          faqTransition: getComputedStyle(
            document.querySelector(".faq-item__a"),
          ).transition,
          buttons: document.querySelectorAll(".btn").length,
        };
      }, selectors);
      report.comparisons.push({ kind, width: viewport.width, metrics });
      if (kind === "local") {
        check(
          `${viewport.width}:no-horizontal-overflow`,
          metrics.scrollWidth <= viewport.width &&
            metrics.bodyWidth <= viewport.width,
          metrics,
        );
        check(
          `${viewport.width}:9-sections-plus-banner-and-footer`,
          (await page.locator("main > section").count()) === 9,
        );
        check(
          `${viewport.width}:noindex`,
          (
            await page.locator('meta[name="robots"]').getAttribute("content")
          ).includes("noindex"),
        );
        check(
          `${viewport.width}:carousel-motion`,
          metrics.carouselTransition.includes("0.45s") &&
            metrics.carouselTransition.includes("0.16, 1, 0.3, 1"),
          metrics.carouselTransition,
        );
        check(
          `${viewport.width}:faq-motion`,
          metrics.faqTransition.includes("0.35s"),
          metrics.faqTransition,
        );
      }
      // Disable only time-dependent paint after recording original motion.
      await page.addStyleTag({
        content:
          "html{scroll-behavior:auto!important}*,*::before,*::after{animation:none!important;transition:none!important}",
      });
      await page.screenshot({
        path: fileURLToPath(new URL(`${kind}-${viewport.width}-top.png`, out)),
      });
      for (const [index, selector] of selectors.entries()) {
        const el = page.locator(selector);
        await el.scrollIntoViewIfNeeded();
        await page.waitForTimeout(100);
        await el.screenshot({
          path: fileURLToPath(
            new URL(`${kind}-${viewport.width}-region-${index}.png`, out),
          ),
          animations: "disabled",
        });
      }
      if (kind === "local") {
        const questions = page.locator(".faq-item__q");
        await questions.nth(0).click();
        check(
          `${viewport.width}:faq-open`,
          (await questions.nth(0).getAttribute("aria-expanded")) === "true",
        );
        await questions.nth(1).click();
        check(
          `${viewport.width}:faq-exclusive`,
          (await page.locator(".faq-item.open").count()) === 1 &&
            (await questions.nth(0).getAttribute("aria-expanded")) === "false",
        );
        await questions.nth(1).click();
        check(
          `${viewport.width}:faq-close`,
          (await page.locator(".faq-item.open").count()) === 0,
        );
        await page.locator(".video-section").scrollIntoViewIfNeeded();
        const next = page.getByRole("button", { name: "Próximo", exact: true });
        await next.click();
        check(
          `${viewport.width}:carousel-next`,
          (await page
            .locator(".video-carousel-dot")
            .nth(1)
            .getAttribute("aria-selected")) === "true",
        );
        await page
          .getByRole("button", { name: "Anterior", exact: true })
          .click();
        check(
          `${viewport.width}:carousel-prev`,
          (await page
            .locator(".video-carousel-dot")
            .nth(0)
            .getAttribute("aria-selected")) === "true",
        );
        const track = page.locator(".video-carousel-track");
        const touch = (type, x) =>
          track.evaluate(
            (el, { type, x }) => {
              const point = new Touch({
                identifier: 1,
                target: el,
                clientX: x,
                clientY: 200,
              });
              el.dispatchEvent(
                new TouchEvent(type, {
                  bubbles: true,
                  touches: type === "touchstart" ? [point] : [],
                  changedTouches: [point],
                }),
              );
            },
            { type, x },
          );
        await touch("touchstart", 280);
        await touch("touchend", 200);
        check(
          `${viewport.width}:carousel-swipe`,
          (await page
            .locator(".video-carousel-dot")
            .nth(1)
            .getAttribute("aria-selected")) === "true",
        );
        await touch("touchstart", 200);
        await touch("touchend", 220);
        check(
          `${viewport.width}:swipe-threshold`,
          (await page
            .locator(".video-carousel-dot")
            .nth(1)
            .getAttribute("aria-selected")) === "true",
        );
        const dotCount =
          viewport.width <= 640 ? 5 : viewport.width <= 1024 ? 4 : 3;
        check(
          `${viewport.width}:visible-count`,
          (await page.locator(".video-carousel-dot").count()) === dotCount,
        );
        await page.locator(".video-carousel-dot").last().click();
        check(`${viewport.width}:carousel-end`, await next.isDisabled());
        await page.evaluate(() => scrollTo({ top: 0, behavior: "instant" }));
        await page.locator(".nossa-hero .btn").click();
        await page.waitForFunction(
          () =>
            Math.abs(
              document.getElementById("offer-grid").getBoundingClientRect()
                .top - 24,
            ) < 2,
        );
        check(`${viewport.width}:cta-scroll-offset`, true);
        if (viewport.width === 390) {
          check(
            "mobile:audience-sticky",
            (await page
              .locator(".for-you-card")
              .first()
              .evaluate((el) => getComputedStyle(el).position)) === "sticky",
          );
          check(
            "mobile:sticky-last-offset",
            (await page
              .locator(".for-you-card")
              .last()
              .evaluate((el) => getComputedStyle(el).top)) === "144px",
          );
        }
      }
      await context.close();
    }
  }
  // Actual, unnormalized local runtime: integrations initialize, motion stays on.
  report.integrations = [];
  for (const [kind, url] of [
    ["original", "https://holdingtotal.com.br/imersao/"],
    ["local", localUrl],
  ]) {
    const live = await browser.newContext({
      viewport: { width: 1440, height: 1000 },
      locale: "pt-BR",
    });
    const page = await live.newPage();
    const errors = [];
    const denied = [];
    page.on("pageerror", (e) =>
      errors.push({ type: "pageerror", text: e.message }),
    );
    page.on("response", (response) => {
      if (response.status() >= 400)
        denied.push({ status: response.status(), url: response.url() });
    });
    page.on("console", (message) => {
      if (message.type() === "error")
        errors.push({
          type: "console",
          text: message.text(),
          location: message.location(),
        });
    });
    await page.goto(url, { waitUntil: "load" });
    await page.waitForTimeout(3000);
    await page.locator(".video-section").scrollIntoViewIfNeeded();
    await page.waitForFunction(
      () =>
        document.querySelector(".voomly-embed")?.shadowRoot?.childElementCount >
        0,
      null,
      { timeout: 20000 },
    );
    if (kind === "local") {
      check(
        "live:voomly-real-runtime",
        (await page.locator("script[data-voomly-study]").count()) === 1,
      );
      check(
        "live:hotmart-source",
        await page
          .locator("#hotmart-checkout-iframe")
          .getAttribute("src")
          .then((src) => src?.startsWith("https://pay.hotmart.com/")),
      );
      check(
        "live:button-pulse",
        (await page
          .locator(".nossa-hero .btn")
          .evaluate((el) => getComputedStyle(el).animationDuration)) === "2.2s",
      );
      check(
        "live:card-reveal",
        (await page
          .locator(".comp-card")
          .first()
          .evaluate((el) => el.style.opacity)) === "1",
      );
    }
    await page.locator(".video-slide-inner").first().click();
    await page.waitForTimeout(3500);
    const video = await page
      .locator(".voomly-embed")
      .first()
      .evaluate((el) => {
        const v = el.shadowRoot?.querySelector("video");
        return v
          ? {
              paused: v.paused,
              currentTime: v.currentTime,
              readyState: v.readyState,
              source: v.currentSrc,
            }
          : null;
      });
    report.integrations.push({
      kind,
      errors,
      denied,
      video,
      playback: video?.currentTime > 0 ? "OBSERVED_PLAYING" : "NOT_PROVEN",
    });
    await page.screenshot({
      path: fileURLToPath(new URL(`${kind}-live-video.png`, out)),
    });
    await live.close();
  }
  // Keyboard + reduced motion and precise breakpoint transitions.
  const a11y = await browser.newContext({
    viewport: { width: 390, height: 844 },
    reducedMotion: "reduce",
  });
  const reduced = await a11y.newPage();
  await reduced.goto(localUrl, { waitUntil: "load" });
  check(
    "a11y:reduced-motion",
    (await reduced
      .locator(".nossa-hero .btn")
      .evaluate((el) => getComputedStyle(el).animationName)) === "none",
  );
  await reduced.locator(".faq-item__q").first().focus();
  await reduced.keyboard.press("Enter");
  check(
    "a11y:faq-keyboard",
    (await reduced
      .locator(".faq-item__q")
      .first()
      .getAttribute("aria-expanded")) === "true",
  );
  for (const width of [320, 360, 640, 641, 767, 1024, 1025, 1200, 1920]) {
    await reduced.setViewportSize({ width, height: 900 });
    await reduced.waitForTimeout(200);
    check(
      `${width}:responsive-width`,
      await reduced.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    );
    check(
      `${width}:carousel-resize`,
      (await reduced.locator(".video-carousel-dot").count()) ===
        (width <= 640 ? 5 : width <= 1024 ? 4 : 3),
    );
  }
  await a11y.close();
} catch (error) {
  report.fatal = String(error.stack || error);
  console.error(report.fatal);
} finally {
  report.pass = report.checks.filter((c) => c.pass).length;
  report.fail = report.checks.filter((c) => !c.pass).length;
  await writeFile(new URL("checks.json", out), JSON.stringify(report, null, 2));
  await browser.close();
  console.log(
    JSON.stringify({
      pass: report.pass,
      fail: report.fail,
      fatal: report.fatal,
      console: report.console.length,
      integrations: report.integrations,
    }),
  );
}
assert(
  !report.fatal && report.fail === 0,
  "Verification failed; see reference/verification/checks.json",
);
