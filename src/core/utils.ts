import { TYPES_FOR_UI } from 'src/constants/event';

export const readComponentMetaJson = async (type: TYPES_FOR_UI, node: { label: string }) => {
    try {
        const json = await import(`../meta/${type}/components/${node.label.toLocaleLowerCase()}.json`)
        return json.default
    } catch (error) {
        console.error(error)
    }

    return {}
}