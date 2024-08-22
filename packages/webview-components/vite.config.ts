import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VineVitePlugin } from 'vue-vine/vite'
import Components from 'unplugin-vue-components/vite';
import {PrimeVueResolver} from '@primevue/auto-import-resolver';
import { visualizer } from "rollup-plugin-visualizer";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        VineVitePlugin(),
        vue(),
        Components({
            resolvers: [
                PrimeVueResolver()
            ]
        }),
        visualizer({
            emitFile: true,
            filename: "stats.html",
        })
    ],
    define: {
        "process.env": {
            "NODE_ENV": JSON.stringify(process.env.NODE_ENV)
        }
    },
    resolve: {
        alias: {
            '@': '/src'
        }
    },
    build: {
        lib: {
            entry: 'src/modules/index.ts',
            name: 'WebviewComponents',
            formats: ['umd'],
            fileName: (format) => `webview-components.${format}.js`
        }
    }
})
