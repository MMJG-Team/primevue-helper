import * as fs from 'node:fs'
import * as path from 'node:path'

// esm __dirname
import { fileURLToPath } from 'node:url'
// @ts-ignore
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)


function main_primevue() {
    const ROOT_PATH = path.resolve(__dirname, '../ui-repos/primevue')
    const DOC_ROOT_PATH = path.resolve(ROOT_PATH, 'apps/showcase/doc')
    const OUTPUT_PATH = path.resolve(__dirname, '../src/meta/primevue/components')

    if (!fs.existsSync(OUTPUT_PATH)) {
        fs.mkdirSync(OUTPUT_PATH, { recursive: true })
    }

    // extract template from doc file
    const docs = fs.readdirSync(DOC_ROOT_PATH)
    docs.forEach(doc => {
        const docPath = path.resolve(DOC_ROOT_PATH, doc, 'BasicDoc.vue')

        if (fs.existsSync(docPath)) {
            const code = fs.readFileSync(docPath).toString()

            // extract the content of the script tag
            const objString = code.match(/(?<=<script>[\s\S]*export default)[\s\S]*(?=<\/script>)/g)?.[0]
            if (objString) {
                const jsonPath = path.resolve(OUTPUT_PATH, `${doc}.json`)
                const obj = new Function(`return ${objString}`)()

                try {
                    const { basic } = obj.data().code

                    const json = {
                        template: basic,
                    }

                    fs.writeFileSync(jsonPath, JSON.stringify(json, null, 4))
                } catch (error) {
                    console.log(error)
                }
            }
        }
    })

    console.log(docs)
}

main_primevue()