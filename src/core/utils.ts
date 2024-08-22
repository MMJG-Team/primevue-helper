import * as path from 'node:path';
import * as fs from 'node:fs';
import { TYPES_FOR_UI } from 'src/constants/event';

// esm __dirname
import { fileURLToPath } from 'node:url'
// @ts-ignore
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export const readComponentMetaJson = (type: TYPES_FOR_UI, node: { label: string }) => {
    const jsonPath = path.join(__dirname, `../meta/${type}/components/${node.label.toLocaleLowerCase()}.json`)
    if (fs.existsSync(jsonPath)) {
        try {
            const json = JSON.parse(fs.readFileSync(jsonPath).toString())
            return json
        } catch (e) {
            console.error(e)
        }
    }

    return {}
}