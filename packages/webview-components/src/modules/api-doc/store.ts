import { ComponentDocMeta } from '@/types/api-doc';
import { defineStore } from 'pinia';

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