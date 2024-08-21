export type SlotsOrEmitsType = {
    name: string,
    parameters: {
        name: string,
        optional: boolean,
        type: string,
        description?: string
    }[],
    returnType: string,
    description?: string
}

export type PropsType = {
    name: string,
    optional: boolean,
    readonly: boolean,
    type: null | string | string[],
    default: string,
    description?: string
}

export type ComponentDocMeta = {
    props: PropsType[],
    slots: SlotsOrEmitsType[],
    emits: SlotsOrEmitsType[]

    node?: {
        label: string,
        description?: string
    }
}