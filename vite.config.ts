import { defineConfig } from "vite";
import { resolve } from "path";

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    lib: {
      // Could also be a dictionary or array of multiple entry points
      entry: resolve(__dirname, "index.ts"),
      name: "ArcgisJsUtils",
      // the proper extensions will be added
      fileName: "arcgis-js-utils",
    },
    rollupOptions: {
      // 确保外部化处理那些你不想打包进库的依赖
      // 需要和引入语句中写法完全一致
      external: [
        "@arcgis/core/Map",
        "@arcgis/core/widgets/Locate",
        "@arcgis/core/layers/FeatureLayer",
        "@arcgis/core/views/MapView",
      ],
      output: {
        // 在 UMD 构建模式下为这些外部化的依赖提供一个全局变量
        globals: {
          "@arcgis/core/Map": "ArcgisCoreMap",
          "@arcgis/core/views/MapView": "ArcgisCoreMapView",
          "@arcgis/core/widgets/Locate": "ArcgisCoreLocate",
          "@arcgis/core/layers/FeatureLayer": "ArcgisCoreMap",
        },
      },
    },
  },
});
