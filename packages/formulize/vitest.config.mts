import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    setupFiles: "./test-setup.ts",
    environment: "jsdom",
    coverage: {
      enabled: true,
      reporter: ["text", "text-summary", "html"],
      provider: "v8",
      reportsDirectory: "./coverage",
    },
    benchmark: {
      reporters: ["verbose"],
    },
  },
});
