import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VineVitePlugin } from 'vue-vine/vite'
import Components from 'unplugin-vue-components/vite';
import {PrimeVueResolver} from '@primevue/auto-import-resolver';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        VineVitePlugin(),
        vue(),
        Components({
            resolvers: [
                PrimeVueResolver()
            ]
        })
    ],
    define: {
        "process.env": {
            "NODE_ENV": JSON.stringify(process.env.NODE_ENV)
        }
    },
    build: {
        lib: {
            entry: 'src/components/index.ts',
            name: 'WebviewComponents',
            formats: ['umd'],
            fileName: (format) => `webview-components.${format}.js`
        }
    }
})
