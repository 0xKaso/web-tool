import { defineConfig } from "umi";

export default defineConfig({
  routes: [
    { path: "/", component: "index" },
    { path: "/wallet", component: "wallet" },
    { path: "/query", component: "query" },
    { path: "/interacted", component: "interacted" },
  ],

  npmClient: "yarn",
  tailwindcss: {},
  plugins: ["@umijs/plugins/dist/tailwindcss", "@umijs/plugins/dist/model"],
  title: "工具箱",
  model: {},
});
