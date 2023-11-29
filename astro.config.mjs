import path from "node:path";
import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig(() => {
  return {
    experimental: {
      i18n: {
        defaultLocale: "ru",
        locales: ["ru", "en"],
        routingStrategy: "prefix-other-locales",
      },
    },
    vite: {
      resolve: {
        alias: {
          "@": path.resolve(__dirname, "./src"),
        },
      },
      css: {
        modules: {
          localsConvention: "camelCase",
        },
      },
    },
  };
});
