import { computed, onMounted, ref, watchEffect } from 'vue';
import Fieldset from 'primevue/fieldset';
import Tag from 'primevue/tag';
import IconField from 'primevue/iconfield';
import InputIcon from 'primevue/inputicon';
import InputText from 'primevue/inputtext';
import Drawer from 'primevue/drawer';

import { postMessageForVsCode } from '@/vscode-extension-api';
import { WEBVIEW_RECEIVE_MESSAGE, WEBVIEW_ACTIONS } from '@/constants';
import { ComponentTree } from '@/components/component-tree/index.vine'
import { ApiDocView } from '@/components/api-doc/index.vine'

import 'primeicons/primeicons.css'
import './style.less'

import { useStore } from './store';
import { PropsType, SlotsOrEmitsType } from '@/types/api-doc';


export function View() {
    const store = useStore();

    const title = computed(() => {
        if (!store.apiDocDataNode) {
            return ''
        }

        const { label, description } = store.apiDocDataNode
        if (label !== description) {
            return `${label} - ${description}`
        }

        return label
    })

    const onPropNameClick = (prop: PropsType) => {
        store.insertProp(prop)
    }

    const onSlotNameClick = (slot: SlotsOrEmitsType) => {
        store.insertSlot(slot)
    }

    const onEmitNameClick = (emit: SlotsOrEmitsType) => {
        store.insertEmit(emit)
    }

    return vine`
        <ComponentTree
            v-model:searchValue="store.searchValue"
            :treeData="store.displayData"
            :onNodeClick="store.openDocument"
        />

        <Drawer
            v-model:visible="store.apiDocVisible"
            header="API"
            position="full"
        >
            <ApiDocView
                :title="title"
                :propColumns="store.apiDocDataPropColumns"
                :slotColumns="store.apiDocDataSlotColumns"
                :emitColumns="store.apiDocDataEmitColumns"
                :onPropNameClick="onPropNameClick"
                :onSlotNameClick="onSlotNameClick"
                :onEmitNameClick="onEmitNameClick"
            ></ApiDocView>
        </Drawer>
    `
}