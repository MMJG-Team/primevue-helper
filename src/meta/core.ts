import { TYPES_FOR_UI } from 'src/constants/event'

export type ComponentMeta = {
    label: string,
    description: string,
    children?: ComponentMeta[]
}

namespace Meta {
    const __META__ = new Map<string, ComponentMeta[]>()

    export const register = (key: TYPES_FOR_UI, data: ComponentMeta[]) => {
        if (!Object.values(TYPES_FOR_UI).includes(key)) {
            return
        }

        if (!data?.length) {
            return
        }

        __META__.set(key, data)
    }

    export const get = (key: string) => {
        return __META__.get(key) ?? []
    }
}

export default Meta