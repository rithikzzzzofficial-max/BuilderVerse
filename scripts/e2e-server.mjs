import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";

/**
 * Serves the e2e suite from the exact artifact Docker ships:
 * `.next/standalone/server.js` (Next warns that `next start` ignores
 * `output: "standalone"`). Run from the repo root after `next build`.
 */

const root = process.cwd();
const standalone = path.join(root, ".next", "standalone");

fs.cpSync(path.join(root, "public"), path.join(standalone, "public"), {
  recursive: true,
});
fs.cpSync(path.join(root, ".next", "static"), path.join(standalone, ".next", "static"), {
  recursive: true,
});

// server.js calls process.chdir(__dirname), so the DB path must be absolute.
// Each run starts from a clean test database — never the dev one.
const dbPath = path.join(root, "data", "e2e.db");
for (const suffix of ["", "-wal", "-shm"]) {
  fs.rmSync(dbPath + suffix, { force: true });
}
process.env.DATABASE_PATH = dbPath;
process.env.PORT = process.env.PORT || "3111";
process.env.HOSTNAME = process.env.HOSTNAME || "0.0.0.0";

createRequire(import.meta.url)(path.join(standalone, "server.js"));
