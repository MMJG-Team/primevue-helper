import { computed, onMounted, ref, watchEffect } from 'vue';
import Fieldset from 'primevue/fieldset';
import Tag from 'primevue/tag';
import IconField from 'primevue/iconfield';
import InputIcon from 'primevue/inputicon';
import InputText from 'primevue/inputtext';
import Drawer from 'primevue/drawer';
import ContextMenu from 'primevue/contextmenu';

import { postMessageForVsCode } from '@/vscode-extension-api';
import { WEBVIEW_RECEIVE_MESSAGE, WEBVIEW_ACTIONS } from '@/constants';
import { ComponentTree } from '@/components/component-tree/index.vine'
import { ApiDocView } from '@/components/api-doc/index.vine'

import 'primeicons/primeicons.css'
import './style.less'

import { useStore } from './store';
import type { PropsType, SlotsOrEmitsType } from '@/types/api-doc';
import type { ContextMenuMethods } from 'primevue/contextmenu';
import type { ComponentTreeMeta } from '@/types/component-tree';
import type { MenuItem } from 'primevue/menuitem';


export function View() {
    const store = useStore();

    let currentNode: ComponentTreeMeta
    const menu = ref<ContextMenuMethods | null>(null)
    const contextMenuOptions = ref<MenuItem[]>([
        {
            label: 'Insert Code Snippet',
            icon: 'pi pi-code',
            command: () => store.insertCodeSnippet(currentNode)
        },
        {
            label: 'Open API Doc',
            icon: 'pi pi-map',
            command: () => store.openDocument(currentNode)
        }
    ])

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

    const onNodeContextmenu = (e: Event, node: ComponentTreeMeta) => {
        menu.value && menu.value.show(e)
        currentNode = node
    }

    return vine`
        <ComponentTree
            v-model:searchValue="store.searchValue"
            :treeData="store.displayData"
            :onNodeClick="store.openDocument"
            :onNodeContextmenu="onNodeContextmenu"
        ></ComponentTree>

        <ContextMenu ref="menu" :model="contextMenuOptions" />

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