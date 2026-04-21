const fs = require("fs");
const path = require("path");
const { chromium } = require("playwright");

const logFile = path.join(__dirname, "capture.log");

function log(msg) {
  fs.appendFileSync(logFile, `[${new Date().toISOString()}] ${msg}\n`);
}

async function main() {
  const base = "http://127.0.0.1:4173";
  const outDir = path.join(__dirname, "..", "..", "readme-assets", "screenshots");
  const viewport = { width: 1280, height: 800 };

  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport,
    deviceScaleFactor: 1,
  });

  // Предзаполняем локальное состояние для избранного и сохранённых фильтров
  await context.addInitScript(() => {
    localStorage.setItem(
      "savedCatalogFilters",
      JSON.stringify({ category: "Природа", search: "", orientation: "landscape" })
    );
    localStorage.setItem("favoritePhotos", JSON.stringify(["photo-1", "photo-2"]));
  });

  const page = await context.newPage();

  const capture = async (url, file, before) => {
    log(`capture start ${file} -> ${url}`);
    await page.goto(url, { waitUntil: "networkidle" });
    await page.waitForTimeout(700);

    // фиксируем шапку
    await page.evaluate(() => {
      const header = document.querySelector("header");
      if (header) {
        header.style.position = "sticky";
        header.style.top = "0";
        header.style.zIndex = "100";
      }
    });

    if (before) await before();
    await page.screenshot({
      path: path.join(outDir, file),
      fullPage: false,
      type: "jpeg",
      quality: 85,
      clip: { x: 0, y: 0, width: viewport.width, height: viewport.height },
    });
    log(`capture done ${file}`);
  };

  // 1) О чём сайт — первый экран
  await capture(`${base}/`, "p1_home_hero.jpg");

  // 2) Витрина — блок «Последние добавления» (#catalog), без произвольного scroll по пикселям
  await capture(`${base}/`, "p2_home_showcase.jpg", async () => {
    const catalog = await page.$("#catalog");
    if (catalog) {
      await catalog.scrollIntoViewIfNeeded();
    } else {
      await page.evaluate(() => window.scrollTo({ top: 480, behavior: "auto" }));
    }
    await page.waitForTimeout(400);
  });

  // 6/9) Тематические материалы / техническое — доверие + подписка
  await capture(`${base}/`, "p6_home_trust_subscribe.jpg", async () => {
    const el = await page.$(".trust-block");
    if (el) await el.scrollIntoViewIfNeeded();
  });

  // 3) Решение задачи — поиск/фильтры каталога
  await capture(`${base}/catalog/photos`, "p3_catalog_filters.jpg");

  // 5) Интерактив — скролл ленты
  await capture(`${base}/catalog/photos`, "p5_catalog_scrolled.jpg", async () => {
    await page.evaluate(() => window.scrollTo({ top: 900, behavior: "auto" }));
    await page.waitForTimeout(400);
  });

  // 8) Возвраты — избранное и сохранённые фильтры
  await capture(`${base}/catalog/photos`, "p8_catalog_favorites.jpg", async () => {
    const btn = await page.$(".photo-card__favorite-btn");
    if (btn) await btn.click({ force: true });
  });

  // 4) Навигация — хлебные крошки/назад в категорию
  await capture(`${base}/photo/photo-1`, "p4_photo_breadcrumbs.jpg");

  // 7) Перелинковка — теги/похожие/следующее фото
  await capture(`${base}/photo/photo-1`, "p7_photo_similar.jpg", async () => {
    await page.evaluate(() => {
      const nav = document.querySelector(".photo-detail-navigation");
      if (nav) nav.scrollIntoView({ behavior: "auto", block: "start" });
    });
    await page.waitForTimeout(400);
  });

  // 9) Техническое состояние — повторный контроль загрузки
  await capture(`${base}/`, "p9_home_tech.jpg");

  await browser.close();
  log("done");
}

main().catch((err) => {
  log(`error ${err?.stack || err}`);
  process.exit(1);
});
