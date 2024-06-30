import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["**/__tests__/**/*.{js,ts}"],
    coverage: {
      enabled: true,
      include: ["lib/utils.ts"],
      reporter: ["text", "html"], // Adjust as needed
      reportsDirectory: "./coverage",
    },
  },
});
