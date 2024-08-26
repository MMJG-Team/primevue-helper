import * as path from 'node:path'
import generate from './primevue'

// esm __dirname
import { fileURLToPath } from 'node:url'

// @ts-ignore
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)


function main_primevue() {
    const ROOT_PATH = path.resolve(__dirname, '../ui-repos/primevue')
    const OUTPUT_PATH = path.resolve(__dirname, '../src/meta/primevue/components')

    const counter = generate({
        ROOT_PATH,
        OUTPUT_PATH
    })

    console.log(`generate ${counter} components`)
}

main_primevue()