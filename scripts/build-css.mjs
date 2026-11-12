// Inline src/styles/index.css's @imports into dist/styles.css; tokens alone into dist/tokens.css.
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { dirname, resolve } from "node:path";

async function inline(file) {
  const css = await readFile(file, "utf8");
  const parts = [];
  for (const line of css.split("\n")) {
    const m = line.match(/^@import\s+"(.+)";\s*$/);
    parts.push(m ? await inline(resolve(dirname(file), m[1])) : line);
  }
  return parts.join("\n");
}

await mkdir("dist", { recursive: true });
await writeFile("dist/styles.css", await inline("src/styles/index.css"));
await writeFile("dist/tokens.css", await readFile("src/tokens/tokens.css", "utf8"));
for (const name of ["styles", "tokens"]) await writeFile(`dist/${name}.css.d.ts`, "export {};\n");
console.log("wrote dist/styles.css and dist/tokens.css");
