import { createServer } from "node:http";
import { readFile, stat, mkdir, writeFile } from "node:fs/promises";
import { extname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import assert from "node:assert/strict";
import { chromium } from "playwright";

const root = fileURLToPath(new URL("../", import.meta.url));
const output = join(root, "out");
const basePath = "/holdingtotal-study";
const mime = { ".html": "text/html", ".js": "application/javascript", ".css": "text/css", ".txt": "text/plain", ".json": "application/json" };
let server;
let url = process.env.PAGES_TEST_URL;
if (!url) {
  server = createServer(async (request, response) => {
    try {
      const pathname = decodeURIComponent(new URL(request.url, "http://localhost").pathname);
      assert(pathname.startsWith(`${basePath}/`));
      let path = resolve(output, `.${pathname.slice(basePath.length)}`);
      assert(path === output || path.startsWith(`${output}/`) || path.startsWith(`${output}\\`));
      if ((await stat(path)).isDirectory()) path = join(path, "index.html");
      response.writeHead(200, { "Content-Type": mime[extname(path)] || "application/octet-stream" });
      response.end(await readFile(path));
    } catch {
      response.writeHead(404);
      response.end("Not found");
    }
  });
  await new Promise((done) => server.listen(0, "127.0.0.1", done));
  url = `http://127.0.0.1:${server.address().port}${basePath}/`;
}
const browser = await chromium.launch({
  executablePath: process.env.STUDY_CHROME || (process.platform === "win32"
    ? "C:/Users/VTz produti/AppData/Local/ms-playwright/chromium-1243/chrome-win64/chrome.exe"
    : undefined),
  headless: true,
});
const report = { date: new Date().toISOString(), url, checks: [], internalFailures: [], pageErrors: [] };
function check(name, pass) {
  report.checks.push({ name, pass: !!pass });
}
try {
  for (const width of [1440, 768, 390]) {
    const page = await browser.newPage({ viewport: { width, height: 1000 } });
    page.on("pageerror", (error) => report.pageErrors.push(error.message));
    page.on("response", (response) => {
      if (new URL(response.url()).origin === new URL(url).origin && response.status() >= 400)
        report.internalFailures.push({ url: response.url(), status: response.status() });
    });
    const response = await page.goto(url, { waitUntil: "load" });
    check(`${width}:http-200`, response.status() === 200);
    await page.waitForFunction(() => document.querySelectorAll(".video-carousel-dot").length > 0);
    check(`${width}:sections`, await page.locator("main > section").count() === 9);
    check(`${width}:noindex`, (await page.locator('meta[name="robots"]').getAttribute("content")).includes("noindex"));
    check(`${width}:no-overflow`, await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
    check(`${width}:images`, await page.locator("img").evaluateAll((images) => images.every((image) => image.complete && image.naturalWidth > 0)));
    check(`${width}:external-media`, await page.locator("img").evaluateAll((images) => images.every((image) => image.src.startsWith("https://holdingtotal.com.br/imersao/"))));
    await page.locator(".faq-item__q").first().click();
    check(`${width}:faq`, await page.locator(".faq-item__q").first().getAttribute("aria-expanded") === "true");
    await page.getByRole("button", { name: "Próximo", exact: true }).click();
    check(`${width}:carousel`, await page.locator(".video-carousel-dot").nth(1).getAttribute("aria-selected") === "true");
    await page.locator(".nossa-hero .btn").click();
    await page.waitForFunction(() => Math.abs(document.getElementById("offer-grid").getBoundingClientRect().top - 24) < 2);
    check(`${width}:cta-scroll`, true);
    await page.close();
  }
  const page = await browser.newPage();
  check("imersao-route", (await page.goto(new URL("imersao/", url).href)).status() === 200);
  check("robots", (await (await page.request.get(new URL("robots.txt", url).href)).text()).includes("Disallow: /"));
  check("no-internal-http-failures", report.internalFailures.length === 0);
  check("no-page-errors", report.pageErrors.length === 0);
} catch (error) {
  report.fatal = String(error.stack || error);
} finally {
  await browser.close();
  if (server) await new Promise((done) => server.close(done));
  const directory = join(root, "reference", "pages");
  await mkdir(directory, { recursive: true });
  const kind = process.env.PAGES_TEST_URL ? "live" : "local";
  await writeFile(join(directory, `${kind}.json`), JSON.stringify(report, null, 2));
}
const pass = report.checks.filter((check) => check.pass).length;
const fail = report.checks.length - pass;
console.log(JSON.stringify({ pass, fail, fatal: report.fatal, internalFailures: report.internalFailures, pageErrors: report.pageErrors }));
assert(!report.fatal && fail === 0, "Pages verification failed");
