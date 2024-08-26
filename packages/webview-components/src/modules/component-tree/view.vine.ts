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

    const menu = ref<ContextMenuMethods | null>(null)
    const contextMenuOptions = ref<MenuItem[]>([
        {
            label: 'Insert Code Snippet',
            icon: 'pi pi-code',
            command: () => store.insertCodeSnippet()
        },
        {
            label: 'Open API Doc',
            icon: 'pi pi-map',
            command: () => store.openDocument()
        },
        {
            label: 'Open Official Site',
            icon: 'pi pi-prime',
            command: () => store.openOfficialSite()
        }
    ])

    const title = computed(() => {
        if (!store.apiDocDataNode) {
            return ''
        }

        const { label, description } = store.apiDocDataNode
        if (label !== description && store.showChineseDescription) {
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

        store.setWorkingNode(node)
    }

    return vine`
        <ComponentTree
            v-model:searchValue="store.searchValue"
            :treeData="store.displayData"
            :showChineseDescription="store.showChineseDescription"
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

        <Drawer
            v-model:visible="store.officialSiteVisible"
            header="Primevue"
            position="full"

        >
            <iframe :src="store.officialSiteUrl" width="100%" height="100%" frameborder="0"></iframe>
        </Drawer>
    `
}