import * as fs from 'node:fs'
import * as path from 'node:path'
import { get } from 'radash'

type GenerateParams = {
    ROOT_PATH: string,
    OUTPUT_PATH: string
}

const TEMPLATE_FILE_NAME = 'BasicDoc.vue'

export default function generate(params: GenerateParams) {
    let counter = 0
    const { ROOT_PATH, OUTPUT_PATH } = params

    const DOC_ROOT_PATH = path.resolve(ROOT_PATH, 'apps/showcase/doc')
    const COMPONENT_META_PATH = path.resolve(DOC_ROOT_PATH, 'common/apidoc/index.json')

    if (!fs.existsSync(OUTPUT_PATH)) {
        fs.mkdirSync(OUTPUT_PATH, { recursive: true })
    }

    const componentMeta = generateComponentMeta(COMPONENT_META_PATH)

    const allComponentTypes = [...new Set([
        // from component dir
        ...fs.readdirSync(DOC_ROOT_PATH),
        // from component meta
        ...Object.keys(componentMeta)
    ])].filter(type => !type.includes('/'))

    allComponentTypes.forEach(type => {
        const docRootPath = path.resolve(DOC_ROOT_PATH, type) 

        // doc code
        const code = getTemplateCode(docRootPath)
        const meta = componentMeta[type]

        if (!meta) {
            return;
        }
        
        // meta data for describe the component
        const metaJson = {
            ...meta,
            // extract template from doc file
            template: extractCodeTemplate(code) || '<div>not found template</div>',
        }

        counter++;

        // output path of meta data 
        const metaJsonPath = path.resolve(OUTPUT_PATH, `${type}.json`)
        console.log(metaJsonPath)
        fs.writeFileSync(metaJsonPath, JSON.stringify(metaJson, null, 4))
    })

    return counter
}

/**
 * get template code 
 * @param docRootPath 
 * @returns 
 */
function getTemplateCode(docRootPath: string) {
    if (!fs.existsSync(docRootPath)) {
        return ''
    }

    // get all vue files in root directory of doc
    const files = fs.readdirSync(docRootPath).filter(file => file.endsWith('.vue'))

    if (!files.length) {
        return ''
    }

    const docName = files.includes(TEMPLATE_FILE_NAME) ? TEMPLATE_FILE_NAME : files[0]
    const docPath = path.resolve(docRootPath, docName)

    const code = fs.readFileSync(docPath).toString()

    return code
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

        if (props.length || slots.length || emits.length) {
            meta[key] = {
                props,
                slots,
                emits
            }
        }

        return meta
    }, {} as Record<string, any>)
}
