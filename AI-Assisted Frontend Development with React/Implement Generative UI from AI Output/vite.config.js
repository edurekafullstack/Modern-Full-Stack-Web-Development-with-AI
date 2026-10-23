import { defineConfig, loadEnv } from "vite";
import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import babel from "@rolldown/plugin-babel";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [
      react(),
      babel({ presets: [reactCompilerPreset()] }),
      tailwindcss(),
    ],
    server: {
      proxy: {
        "/restcountries": {
          target: "https://api.restcountries.com",
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/restcountries/, ""),
          headers: { Authorization: `Bearer ${env.RESTCOUNTRIES_API_KEY}` },
          configure: (proxy) => {
            proxy.on("proxyReq", (proxyReq) => proxyReq.removeHeader("origin"));
          },
        },
        "/api/chat": "http://localhost:8787",
        "/api/itinerary": "http://localhost:8787",
      },
    },
  };
});
