export type ComponentMeta = {
    label: string,
    description: string,
    children?: ComponentMeta[]
}

namespace Meta {
    const __META__ = new Map<string, ComponentMeta[]>()

    export const register = (key: string, data: ComponentMeta[]) => {
        __META__.set(key, data)
    }

    export const get = (key: string) => {
        return __META__.get(key)
    }
}

export default Meta