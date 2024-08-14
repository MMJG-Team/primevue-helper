import * as fs from 'node:fs'
import * as path from 'node:path'
import { get } from 'radash'

type GenerateParams = {
    ROOT_PATH: string,
    OUTPUT_PATH: string
}

export default function generate(params: GenerateParams) {
    const { ROOT_PATH, OUTPUT_PATH } = params

    const DOC_ROOT_PATH = path.resolve(ROOT_PATH, 'apps/showcase/doc')
    const COMPONENT_META_PATH = path.resolve(DOC_ROOT_PATH, 'common/apidoc/index.json')

    if (!fs.existsSync(OUTPUT_PATH)) {
        fs.mkdirSync(OUTPUT_PATH, { recursive: true })
    }

    const componentMeta = generateComponentMeta(COMPONENT_META_PATH)

    // extract template from doc file
    const docs = fs.readdirSync(DOC_ROOT_PATH)
    docs.forEach(doc => {
        const docPath = path.resolve(DOC_ROOT_PATH, doc, 'BasicDoc.vue')

        if (fs.existsSync(docPath)) {
            // doc code
            const code = fs.readFileSync(docPath).toString()
            // output path of meta data 
            const metaJsonPath = path.resolve(OUTPUT_PATH, `${doc}.json`)

            // meta data for describe the component
            const metaJson = {
                ...componentMeta[doc],
                template: extractCodeTemplate(code),
            }

            fs.writeFileSync(metaJsonPath, JSON.stringify(metaJson, null, 4))
        }
    })
}

/**
 * extract the code template of the script tag in doc
 * @param docCode 
 * @returns 
 */
function extractCodeTemplate(docCode: string) {
    const objString = docCode.match(/(?<=<script>[\s\S]*export default)[\s\S]*(?=<\/script>)/g)?.[0]
    if (objString) {
        const obj = new Function(`return ${objString}`)()

        try {
            const { basic } = obj.data().code
            return basic;
        } catch (error) {
            console.log(error)
        }
    }

    return ''
}

/**
 * generate meta data of component
 */
function generateComponentMeta(path: string): Partial<{
    [key: string]: {
        props: Record<string, any>
    }
}> {
    if (!fs.existsSync(path)) {
        return {}
    }

    const componentMeta = JSON.parse(fs.readFileSync(path).toString())
    
    return Object.keys(componentMeta).reduce((meta, key) => {
        const item = componentMeta[key]
        const values = get(item, `interfaces.values`, {})
        
        const usefulMap = Object.keys(values).reduce((map, valueKey) => {
            if (valueKey.toLocaleLowerCase() === `${key}props`) {
                map.props = valueKey
            }
            if (valueKey.toLocaleLowerCase() === `${key}slots`) {
                map.slots = valueKey
            }
            if (valueKey.toLocaleLowerCase() === `${key}emitsoptions`) {
                map.emits = valueKey
            }

            return map
        }, {} as Record<string, any>)

        const props = get(values, `${usefulMap.props}.props`, [])
        const slots = get(values, `${usefulMap.slots}.methods`, [])
        const emits = get(values, `${usefulMap.emits}.methods`, [])

        meta[key] = {
            props,
            slots,
            emits
        }

        return meta
    }, {} as Record<string, any>)
}
