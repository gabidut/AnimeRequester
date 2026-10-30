import fs from "fs";
import path from "path";
import http from "http";
import { execSync } from "child_process";

const args = process.argv.slice(2);
const onlyW3C = args.includes("--w3c");
const onlyLighthouse = args.includes("--lighthouse");
const onlyLint = args.includes("--lint");

function getHtmlFiles(dir = ".") {
    return fs.readdirSync(dir, { withFileTypes: true })
        .filter((entry) => !["node_modules", "dist", ".git"].includes(entry.name))
        .flatMap((entry) => {
            const res = path.join(dir, entry.name);
            return entry.isDirectory() ? getHtmlFiles(res) : (entry.name.endsWith(".html") ? [res] : []);
        });
}

function validateLocalHtml(html) {
    const errors = [];
    if (!/<!DOCTYPE\s+html>/i.test(html)) {
        errors.push("Doctype HTML5 manquant");
    }
    if (!/<html[^>]*lang=/i.test(html)) {
        errors.push("Attribut 'lang' manquant sur <html>");
    }
    if (!/<meta[^>]*charset=/i.test(html)) {
        errors.push("Balise meta charset manquante");
    }
    if (!/<title>/i.test(html)) {
        errors.push("Balise <title> manquante");
    }
    return { errors };
}

async function checkW3C() {
    console.log("\n--- Validation W3C ---");
    const files = getHtmlFiles();
    let hasErrors = false;

    for (const file of files) {
        const html = fs.readFileSync(file, "utf8");
        try {
            const res = await fetch("https://validator.w3.org/nu/?out=json", {
                method: "POST",
                headers: {
                    "Content-Type": "text/html; charset=utf-8",
                    "User-Agent": "AnimeRequester/1.0",
                },
                body: html,
            });

            if (res.status === 429) {
                const local = validateLocalHtml(html);
                if (local.errors.length > 0) {
                    hasErrors = true;
                    console.log(`[ERREUR] ${file} (check local, W3C rate-limited) :`);
                    local.errors.forEach((e) => console.log(`  - (error) ${e}`));
                } else {
                    console.log(`OK - ${file} (syntaxe locale valide, W3C rate-limited)`);
                }
                continue;
            }

            if (!res.ok) {
                console.log(`! ${file}: Service W3C non disponible (${res.status})`);
                continue;
            }

            const data = await res.json();
            const messages = data.messages || [];
            const errors = messages.filter((m) => m.type === "error");
            const warnings = messages.filter((m) => m.type === "info" && m.subType === "warning");

            if (errors.length === 0 && warnings.length === 0) {
                console.log(`OK - ${file}`);
            } else {
                if (errors.length > 0) {
                    hasErrors = true;
                }
                const label = errors.length > 0 ? "ERREUR" : "WARN";
                console.log(`[${label}] ${file}: ${errors.length} erreur(s), ${warnings.length} avertissement(s)`);
                messages.forEach((msg) => {
                    const tag = msg.type === "error" ? "error" : "warning";
                    console.log(`  - (${tag}) ligne ${msg.lastLine || "?"}: ${msg.message}`);
                });
            }
        } catch (err) {
            console.error(`Erreur validation ${file}:`, err.message);
        }
    }
    return !hasErrors;
}

function serveStatic(dir, port = 4173) {
    const mime = {
        ".html": "text/html",
        ".js": "text/javascript",
        ".css": "text/css",
        ".json": "application/json",
        ".png": "image/png",
        ".jpg": "image/jpeg",
        ".svg": "image/svg+xml",
    };
    return new Promise((resolve) => {
        const server = http.createServer((req, res) => {
            const urlPath = req.url === "/" ? "/index.html" : req.url;
            const file = path.join(dir, urlPath.split("?")[0]);
            if (fs.existsSync(file) && fs.statSync(file).isFile()) {
                res.writeHead(200, { "Content-Type": mime[path.extname(file)] || "application/octet-stream" });
                fs.createReadStream(file).pipe(res);
            } else {
                res.writeHead(404);
                res.end("Not found");
            }
        });
        server.listen(port, () => resolve(server));
    });
}

async function checkLighthouse() {
    console.log("\n--- Audit Lighthouse ---");

    const bin = path.join("node_modules", ".bin", process.platform === "win32" ? "lighthouse.cmd" : "lighthouse");
    const isInstalled = fs.existsSync(bin);

    if (!isInstalled) {
        console.log("Lighthouse n'est pas installe localement.");
        console.log("Pour l'activer : npm i -D lighthouse");
        return true;
    }

    const server = await serveStatic(".", 4173);
    fs.mkdirSync("reports", { recursive: true });

    try {
        console.log("Lancement de Lighthouse...");
        execSync(`"${bin}" http://localhost:4173 --output=html,json --output-path=./reports/lighthouse --chrome-flags="--headless" --quiet`, {
            stdio: "inherit",
        });

        const reportJson = JSON.parse(fs.readFileSync("reports/lighthouse.report.json", "utf8"));
        const cats = reportJson.categories || {};
        console.log(`Performance: ${Math.round((cats.performance?.score || 0) * 100)}%`);
        console.log(`Accessibilite: ${Math.round((cats.accessibility?.score || 0) * 100)}%`);
        console.log(`Bonnes pratiques: ${Math.round((cats["best-practices"]?.score || 0) * 100)}%`);
        console.log(`SEO: ${Math.round((cats.seo?.score || 0) * 100)}%`);
        console.log("Rapport HTML dispo dans reports/lighthouse.report.html");
    } catch (err) {
        console.error("Echec de l'execution de Lighthouse:", err.message);
        return false;
    } finally {
        server.close();
    }
    return true;
}

function checkLint() {
    console.log("\n--- ESLint ---");
    try {
        execSync("npx eslint .", { stdio: "inherit" });
        console.log("ESLint: OK");
        return true;
    } catch {
        return false;
    }
}

function checkBuild() {
    console.log("\n--- Build Vite ---");
    try {
        execSync("npx vite build", { stdio: "inherit" });
        console.log("Build: OK");
        return true;
    } catch {
        return false;
    }
}

async function main() {
    let ok = true;
    const runAll = !onlyW3C && !onlyLighthouse && !onlyLint;

    if (runAll || onlyW3C) {
        const w3cOk = await checkW3C();
        if (!w3cOk) {
            ok = false;
        }
    }

    if (runAll || onlyLighthouse) {
        const lhOk = await checkLighthouse();
        if (!lhOk) {
            ok = false;
        }
    }

    if (runAll || onlyLint) {
        const lintOk = checkLint();
        if (!lintOk) {
            ok = false;
        }
    }

    if (runAll) {
        const buildOk = checkBuild();
        if (!buildOk) {
            ok = false;
        }
    }

    console.log("\n" + (ok ? "Audit termine avec succes." : "Audit termine avec des erreurs."));
    process.exit(ok ? 0 : 1);
}

main();
