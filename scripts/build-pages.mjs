import { spawnSync } from "node:child_process";
import { readdir, readFile, writeFile } from "node:fs/promises";
import { extname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
const build = spawnSync(process.execPath, ["node_modules/next/dist/bin/next", "build"], {
  cwd: root,
  env: { ...process.env, GITHUB_PAGES: "true" },
  stdio: "inherit",
});
if (build.error) throw build.error;
if (build.status !== 0) process.exit(build.status ?? 1);

// Pages has no rewrite proxy. Keep external media on its original host,
// in both prerendered HTML and hydration payloads, without changing local mode.
let rewritten = 0;
async function prepare(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) {
      await prepare(path);
    } else if ([".html", ".css", ".js", ".json", ".txt"].includes(extname(path))) {
      const original = await readFile(path, "utf8");
      const updated = original.replaceAll("/source-assets/", "https://holdingtotal.com.br/imersao/");
      if (updated !== original) {
        await writeFile(path, updated);
        rewritten++;
      }
    }
  }
}
await prepare(join(root, "out"));
await writeFile(join(root, "out", ".nojekyll"), "");
console.log(`GitHub Pages ready in out/; external media updated in ${rewritten} files.`);
