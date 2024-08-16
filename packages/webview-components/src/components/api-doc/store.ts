import { defineStore } from 'pinia';

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

export const useStore = defineStore('store', {
    state: () => ({
        data: {} as ComponentDocMeta,
    }),
    getters: {
        node: (state) => state.data?.node,
        propColumns: (state) => state.data?.props ?? [],
        slotColumns: (state) => state.data?.slots ?? [],
        emitColumns: (state) => state.data?.emits ?? [],
    },
    actions: {
        setData(data: ComponentDocMeta) {
            this.data = data
        },
    },
})