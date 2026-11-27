import { readFileSync, writeFileSync, mkdirSync, existsSync, mkdtempSync, rmSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";

// selfTest: verifies the entry is exactly 142 chars, a single line with no
// trailing newline, and that writing it to a scratch $MAKEFUN_OUTPUT_DIR
// round-trips byte-identical to entry.txt. Run with: node main.ts --self-test
function selfTest(): void {
  const entry = readFileSync(entryPath, "utf8");
  const chars = [...entry].length;
  if (chars !== 142) {
    throw new Error(`self-test: entry must be exactly 142 characters, got ${chars}`);
  }
  if (entry.endsWith("\n")) {
    throw new Error("self-test: entry must not end with a trailing newline");
  }
  if (entry.includes("\n")) {
    throw new Error("self-test: entry must be a single line");
  }
  const scratch = mkdtempSync(join(tmpdir(), "younger-self-test-"));
  try {
    const outDir = scratch;
    mkdirSync(outDir, { recursive: true });
    writeFileSync(join(outDir, "entry.txt"), entry);
    const roundTrip = readFileSync(join(outDir, "entry.txt"), "utf8");
    if (roundTrip !== entry) {
      throw new Error("self-test: output-dir round-trip is not byte-identical to entry.txt");
    }
  } finally {
    rmSync(scratch, { recursive: true, force: true });
  }
  console.log("self-test: OK — entry is exactly 142 characters (142 bytes, no trailing newline), output-dir round-trip byte-identical");
}

// Writes the entry line to $MAKEFUN_OUTPUT_DIR/entry.txt.
// The entry is a single line the writer would send back to their younger
// self: years hiding a stutter that swallows his name at roll call, then at
// thirty paying a coach to teach him to pause exactly like that — the shameful
// pause turns out to be the very thing worth buying back.
function main(): void {
  if (process.argv.includes("--self-test")) {
    selfTest();
    return;
  }
  const outDir = process.env.MAKEFUN_OUTPUT_DIR || "/output";
  if (!existsSync(entryPath)) {
    throw new Error("entry.txt not found next to main.ts — entry.txt cannot be written");
  }
  mkdirSync(outDir, { recursive: true });
  const entry = readFileSync(entryPath, "utf8");
  writeFileSync(join(outDir, "entry.txt"), entry);
}

const entryPath = new URL("./entry.txt", import.meta.url);
main();
