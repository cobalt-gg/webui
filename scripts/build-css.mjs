import { readFile, writeFile } from "node:fs/promises";
const tokens = await readFile("src/tokens/index.css", "utf8");
await writeFile("dist/tokens.css", tokens);
await writeFile(
  "dist/styles.css",
  tokens + "\n" + (await readFile("src/styles/components.css", "utf8")),
);

for (const name of ["styles", "tokens"])
  await writeFile(`dist/${name}.css.d.ts`, "export {};\n");
