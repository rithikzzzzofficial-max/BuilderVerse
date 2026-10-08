import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  timeout: 90_000,
  expect: { timeout: 15_000 },
  fullyParallel: false,
  workers: 1,
  retries: 0,
  reporter: [["list"]],
  use: {
    baseURL: "http://localhost:3111",
    trace: "retain-on-failure",
    ...devices["Desktop Chrome"],
  },
  webServer: {
    // `next start` refuses to serve `output: "standalone"`, so build and then
    // run the same standalone server the Docker image ships.
    command: "npm run build && node scripts/e2e-server.mjs",
    url: "http://localhost:3111",
    env: { PORT: "3111", HOSTNAME: "0.0.0.0" },
    reuseExistingServer: false,
    timeout: 300_000,
  },
});