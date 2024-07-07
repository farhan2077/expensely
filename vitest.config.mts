import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      // include: ["libs/**/*.{js,ts}"],
      include: ["libs/utils.ts", "libs/formatters.tsx"],
      exclude: [
        "node_modules/**",
        "dist/**",
        "**/*.d.ts",
        "**/*.test.{js,ts}",
        "**/*.spec.{js,ts}",
      ],
    },
  },
});
