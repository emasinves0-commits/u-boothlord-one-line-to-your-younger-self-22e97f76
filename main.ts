import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { join } from "node:path";

// Writes the entry line to $MAKEFUN_OUTPUT_DIR/entry.txt.
// The entry is a single line the writer would send back to their younger
// self: years hiding a stutter that swallows his name at roll call, then at
// thirty paying a coach to teach him to pause exactly like that — the shameful
// pause turns out to be the very thing worth buying back.
const outDir = process.env.MAKEFUN_OUTPUT_DIR || "/output";
const entryPath = new URL("./entry.txt", import.meta.url);
if (!existsSync(entryPath)) {
  throw new Error("entry.txt not found next to main.ts — entry.txt cannot be written");
}
mkdirSync(outDir, { recursive: true });
const entry = readFileSync(entryPath, "utf8");
writeFileSync(join(outDir, "entry.txt"), entry);
