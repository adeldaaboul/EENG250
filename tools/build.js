// Writes every page of the site as plain HTML, so search engines can read it without running scripts:
//   index.html, topics/, one folder per chapter, one per practice sheet, 404.html and sitemap.xml,
//   plus chapter.html and sheet.html, which forward old links to the new addresses.
// Run it after changing anything in course/ or chapters/:   node tools/build.js
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const ROOT = path.resolve(__dirname, "..");
const read = (p) => fs.readFileSync(path.join(ROOT, p), "utf8");
const write = (p, text) => {
  const file = path.join(ROOT, p);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, text);
  written.push(p);
};
const written = [];

// Load the site's own scripts and data, exactly as the browser does.
const ctx = { console };
ctx.window = ctx;
vm.createContext(ctx);
const run = (p) => vm.runInContext(read(p), ctx, { filename: p });
["course/course.js", "assets/js/figures.js", "assets/js/site.js", "assets/js/sheet.js"].forEach(run);
const E = ctx.EENG;
const C = E.course;
C.chapters.forEach((ch) => {
  const dir = "chapters/" + E.pad(ch.n) + "/";
  if (fs.existsSync(path.join(ROOT, dir + "chapter.js"))) run(dir + "chapter.js");
  (ch.parts ? ch.parts.map((_, i) => "sheet-part" + (i + 1) + ".js") : ["sheet.js"]).forEach((f) => {
    if (fs.existsSync(path.join(ROOT, dir + f))) run(dir + f);
  });
});

const SITE = C.siteUrl;                       // https://…/EENG250/
const TODAY = new Date().toISOString().slice(0, 10);
const KATEX = "https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.16.9/";
const esc = (s) => String(s).replace(/&(?![a-z]+;|#\d+;)/gi, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
// Plain text for structured data: no tags, no TeX markup.
const plain = (s) => String(s).replace(/<[^>]+>/g, "").replace(/\$/g, "").replace(/\\[a-zA-Z]+/g, "").replace(/[{}]/g, "")
  .replace(/&rsquo;/g, "’").replace(/&eacute;/g, "é").replace(/&amp;/g, "&").replace(/&[a-z]+;/g, " ").replace(/\s+/g, " ").trim();

const author = { "@type": "Person", name: C.preparedBy };
const course = { "@type": "Course", name: C.code + " " + C.title, courseCode: C.code, url: SITE };

// One complete page. rel = the page's own path from the site root ("" for the home page).
// main is a function, so the content is built after E.root is set for this page.
function page({ rel, depth, title, description, bodyClass, main, scripts, call, jsonld, ogType }) {
  E.root = "../".repeat(depth);
  const r = E.root;
  const url = SITE + rel;
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<meta name="author" content="${esc(C.preparedBy)}">
<link rel="canonical" href="${url}">
<meta property="og:type" content="${ogType || "website"}">
<meta property="og:site_name" content="${esc(C.code + " " + C.title)}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${url}">
<meta property="og:image" content="${SITE}assets/social-card.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="${esc(C.code + " " + C.title + ": free lecture slides and practice problems")}">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="${r}assets/favicon.svg" type="image/svg+xml">
<link rel="stylesheet" href="${KATEX}katex.min.css">
<link rel="stylesheet" href="${r}assets/css/base.css">
<link rel="stylesheet" href="${r}assets/css/theme.css">
<script type="application/ld+json">${JSON.stringify(Object.assign({ "@context": "https://schema.org" }, jsonld)).replace(/</g, "\\u003c")}</script>
</head>
<body class="${bodyClass}">
<header class="site-header" id="site-header">${E.headerHTML()}</header>
<main class="site-main" id="main">${main()}</main>
<footer class="site-footer" id="site-footer">${E.footerHTML()}</footer>
<script>window.EENG_ROOT = "${r}";</script>
<script src="${KATEX}katex.min.js"></script>
<script src="${KATEX}contrib/auto-render.min.js"></script>
<script src="${r}course/course.js"></script>
<script src="${r}assets/js/figures.js"></script>
<script src="${r}assets/js/site.js"></script>
${scripts.map((s) => `<script src="${r}${s}"></script>`).join("\n")}${scripts.length ? "\n" : ""}<script>${call}</script>
</body>
</html>
`;
}

const urls = [];   // for the sitemap
const suffix = " | " + C.code + " " + C.title;

// Home
write("index.html", page({
  rel: "", depth: 0, title: C.seo.title, description: C.seo.description, bodyClass: "page-home",
  main: () => E.homeHTML(), scripts: [], call: "EENG.renderHome();",
  jsonld: Object.assign({}, course, {
    description: plain(C.seo.description), inLanguage: "en", educationalLevel: "Undergraduate", isAccessibleForFree: true, author,
    hasPart: C.chapters.filter((c) => c.status === "open").map((c) => ({ "@type": "LearningResource", name: "Chapter " + c.n + ": " + c.title, url: SITE + c.slug + "/" }))
  })
}));
urls.push(SITE);

// Topics
write("topics/index.html", page({
  rel: "topics/", depth: 1, title: "Electric Circuits Topics: Slides and Practice Problems" + suffix,
  description: "Browse every topic in " + C.code + " " + C.title + ", from the passive sign convention, KCL and KVL to node and mesh analysis, Thévenin and Norton, op amps and RC/RL circuits, each with free practice problems and answers.",
  bodyClass: "page-topics", main: () => E.topicsHTML(), scripts: [], call: "EENG.renderTopics();",
  jsonld: { "@type": "CollectionPage", name: "Electric circuits topics", url: SITE + "topics/", isPartOf: course, about: C.topics.map((t) => t.name) }
}));
urls.push(SITE + "topics/");

// Chapters and practice sheets
const forward = {};   // old ?ch= links -> new address
C.chapters.filter((ch) => ch.status === "open").forEach((ch) => {
  const nn = E.pad(ch.n);
  const data = E.chapters[ch.n] || {};
  const skills = (data.parts ? data.parts.flatMap((p) => p.checklist || []) : data.checklist || []).map(plain);
  const topics = C.topics.filter((t) => t.ch === ch.n).map((t) => t.name);
  forward[ch.n] = ch.slug;

  write(ch.slug + "/index.html", page({
    rel: ch.slug + "/", depth: 1, title: ch.seo.title + suffix, description: ch.seo.description, bodyClass: "page-chapter",
    main: () => E.chapterHTML(ch.n), scripts: ["chapters/" + nn + "/chapter.js"], call: "EENG.renderChapter(" + ch.n + ");",
    jsonld: {
      "@type": "LearningResource", name: "Chapter " + ch.n + ": " + ch.title, description: ch.seo.description, url: SITE + ch.slug + "/",
      learningResourceType: ["Lecture slides", "Lesson"], educationalLevel: "Undergraduate", inLanguage: "en", isAccessibleForFree: true,
      teaches: skills, about: topics, author, isPartOf: course
    }
  }));
  urls.push(SITE + ch.slug + "/");

  if (!ch.sheet) return;
  (ch.parts ? ch.parts.map((_, i) => i + 1) : [0]).forEach((p) => {
    const key = p ? ch.n + "-" + p : String(ch.n);
    if (!E.sheets[key]) { console.warn("No sheet data for " + key + "; skipped."); return; }
    const meta = p ? ch.seo.parts[p - 1] : ch.seo;
    const rel = ch.slug + "/" + (p ? "part-" + p + "/" : "") + "practice/";
    const sheetFile = "chapters/" + nn + "/" + (p ? "sheet-part" + p + ".js" : "sheet.js");
    write(rel + "index.html", page({
      rel, depth: p ? 3 : 2, title: meta.sheetTitle + suffix, description: meta.sheetDescription, bodyClass: "page-sheet",
      main: () => E.sheetHTML(ch.n, p), scripts: ["assets/js/sheet.js", "chapters/" + nn + "/chapter.js", sheetFile],
      call: "EENG.renderSheet(" + ch.n + ", " + p + ");",
      jsonld: {
        "@type": "Quiz", name: meta.sheetTitle, description: meta.sheetDescription, url: SITE + rel,
        learningResourceType: "Practice problems", educationalLevel: "Undergraduate", inLanguage: "en", isAccessibleForFree: true,
        about: topics.length ? topics : [ch.title], author, isPartOf: course
      }
    }));
    urls.push(SITE + rel);
  });
});

// Old addresses (chapter.html?ch=N, sheet.html?ch=N&part=P) forward to the new ones.
const forwarder = (sheet) => `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="robots" content="noindex">
<title>${esc(C.code + " " + C.title)}</title>
<script>
  var slugs = ${JSON.stringify(forward)};
  var q = new URLSearchParams(location.search), slug = slugs[q.get("ch")], part = q.get("part");
  location.replace(slug ? slug + "/" + (${sheet} ? (part ? "part-" + part + "/" : "") + "practice/" : "") : "./");
</script>
</head>
<body><p><a href="./">${esc(C.code + " " + C.title)}</a></p></body>
</html>
`;
write("chapter.html", forwarder(false));
write("sheet.html", forwarder(true));

// Not-found page (GitHub Pages serves it for any missing address, so links are absolute).
write("404.html", `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex">
<title>Page not found | ${esc(C.code + " " + C.title)}</title>
<link rel="icon" href="${SITE}assets/favicon.svg" type="image/svg+xml">
<link rel="stylesheet" href="${SITE}assets/css/base.css">
<link rel="stylesheet" href="${SITE}assets/css/theme.css">
</head>
<body>
<main class="site-main"><div class="wrap">
<h1>Page not found</h1>
<p class="lead">This page has moved or does not exist.</p>
<p><a class="btn" href="${SITE}">Go to the ${esc(C.code)} home page</a> &nbsp; <a href="${SITE}topics/">Browse by topic</a></p>
</div></main>
</body>
</html>
`);

// Sitemap: every page, plus every public PDF.
const pdfs = [];
C.chapters.forEach((ch) => (ch.files || []).forEach((f) => { if (f.href) pdfs.push(f.href); }));
const entry = (loc, lastmod) => `  <url><loc>${loc}</loc><lastmod>${lastmod}</lastmod></url>`;
write("sitemap.xml", `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => entry(u, TODAY)).concat(pdfs.map((p) => entry(SITE + p, fs.statSync(path.join(ROOT, p)).mtime.toISOString().slice(0, 10)))).join("\n")}
</urlset>
`);

console.log("Wrote " + written.length + " files (" + urls.length + " pages, " + pdfs.length + " PDFs in the sitemap):");
console.log(written.map((w) => "  " + w).join("\n"));
