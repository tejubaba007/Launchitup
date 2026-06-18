import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// NOTE: 'base' must match your GitHub repo name exactly.
// If your repo is github.com/yourname/launchitup, base = "/launchitup/"
// If you later use a custom domain, change base back to "/"
export default defineConfig({
  plugins: [react()],
  base: "/launchitup/",
});
