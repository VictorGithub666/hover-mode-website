import { defineConfig } from "vite";
import glsl from "vite-plugin-glsl";
import path from "path";

export default defineConfig({
  base: "./",
  build: {
    outDir: "dist",
  },
  plugins: [glsl()],
  assetsInclude: ["**/*.glb"], // Allow GLB imports
});
