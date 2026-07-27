import puppeteer from "puppeteer-core";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.dirname(fileURLToPath(import.meta.url));
const url = process.argv[2] || "http://localhost:3000";
const label = process.argv[3] || "";
const width = Number(process.argv[4]) || 1440;
const height = Number(process.argv[5]) || 900;

const outDir = path.join(root, "temporary screenshots");
fs.mkdirSync(outDir, { recursive: true });

let n = 1;
while (fs.existsSync(path.join(outDir, `screenshot-${n}${label ? "-" + label : ""}.png`))) {
  n++;
}
const outFile = path.join(outDir, `screenshot-${n}${label ? "-" + label : ""}.png`);

const executablePath = process.env.CHROME_PATH ||
  "/home/szymon/.cache/puppeteer/chrome/linux-150.0.7871.24/chrome-linux64/chrome";

const browser = await puppeteer.launch({
  executablePath,
  headless: true,
  args: ["--no-sandbox", "--disable-setuid-sandbox"],
});
const page = await browser.newPage();
await page.setViewport({ width, height });
await page.goto(url, { waitUntil: "networkidle0", timeout: 30000 });
await page.screenshot({ path: outFile, fullPage: true });
await browser.close();

console.log(`Saved ${outFile}`);
