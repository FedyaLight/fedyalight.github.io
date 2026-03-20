import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import CleanCSS from "clean-css";
import { minify as minifyHtml } from "html-minifier-terser";
import { minify as minifyJs } from "terser";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, "..");
const DIST = path.join(ROOT, "dist");

const ROOT_FILES_TO_COPY = ["CNAME", "_redirects", "yandex_71d480f8edeab671.html"];
const HTML_FILES = ["index.html", "project/index.html"];
const CSS_FILES = ["style.css"];
const JS_FILES = ["script.js", "assets/portfolio-main.js", "assets/project-page.js", "assets/projects.js"];

async function ensureParentDir(filePath) {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
}

async function minifyCssFile(relPath) {
  const src = path.join(ROOT, relPath);
  const dest = path.join(DIST, relPath);
  const raw = await fs.readFile(src, "utf8");
  const result = new CleanCSS({
    level: {
      1: {
        all: true
      },
      2: {
        all: true
      }
    }
  }).minify(raw);

  if (result.errors.length) {
    throw new Error(`CSS minification failed for ${relPath}: ${result.errors.join("; ")}`);
  }

  await ensureParentDir(dest);
  await fs.writeFile(dest, result.styles, "utf8");
}

async function minifyJsFile(relPath) {
  const src = path.join(ROOT, relPath);
  const dest = path.join(DIST, relPath);
  const raw = await fs.readFile(src, "utf8");
  const result = await minifyJs(raw, {
    compress: {
      passes: 2
    },
    mangle: true,
    format: {
      comments: false
    }
  });

  if (!result.code) {
    throw new Error(`JS minification produced empty output for ${relPath}`);
  }

  await ensureParentDir(dest);
  await fs.writeFile(dest, result.code, "utf8");
}

async function buildHtmlFile(relPath) {
  const src = path.join(ROOT, relPath);
  const dest = path.join(DIST, relPath);
  const raw = await fs.readFile(src, "utf8");
  const minified = await minifyHtml(raw, {
    collapseWhitespace: true,
    removeComments: true,
    useShortDoctype: true,
    removeRedundantAttributes: true,
    removeScriptTypeAttributes: true,
    removeStyleLinkTypeAttributes: true,
    minifyCSS: true
  });

  await ensureParentDir(dest);
  await fs.writeFile(dest, minified, "utf8");
}

async function build() {
  await fs.rm(DIST, { recursive: true, force: true });
  await fs.mkdir(DIST, { recursive: true });

  await fs.cp(path.join(ROOT, "assets"), path.join(DIST, "assets"), { recursive: true });

  for (const file of ROOT_FILES_TO_COPY) {
    const src = path.join(ROOT, file);
    const dest = path.join(DIST, file);
    try {
      await fs.copyFile(src, dest);
    } catch (error) {
      if (error && error.code === "ENOENT") {
        continue;
      }
      throw error;
    }
  }

  for (const htmlFile of HTML_FILES) {
    await buildHtmlFile(htmlFile);
  }

  for (const cssFile of CSS_FILES) {
    await minifyCssFile(cssFile);
  }

  for (const jsFile of JS_FILES) {
    await minifyJsFile(jsFile);
  }

  console.log("Build complete: dist/");
}

build().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
