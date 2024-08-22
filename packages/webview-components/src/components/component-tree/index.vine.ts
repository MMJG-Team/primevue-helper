import { computed, onMounted, ref, watchEffect } from 'vue';
import Fieldset from 'primevue/fieldset';
import Tag from 'primevue/tag';
import IconField from 'primevue/iconfield';
import InputIcon from 'primevue/inputicon';
import InputText from 'primevue/inputtext';
import './style.less'

import { postMessageForVsCode } from '@/vscode-extension-api';
import { WEBVIEW_RECEIVE_MESSAGE, WEBVIEW_ACTIONS } from '@/constants';
import { ApiDocView } from '@/components/api-doc/index.vine'
import type { ComponentTreeMeta } from '@/types/component-tree';


export function ComponentTree(props: {
    searchValue: string,
    treeData: ComponentTreeMeta[],
    onNodeClick: (node: ComponentTreeMeta) => void
    onNodeContextmenu: (e: Event, ode: ComponentTreeMeta) => void
}) {
    const emit = vineEmits<{
        'update:searchValue': [value: string]
    }>()

    const onSearch = (value: string) => emit('update:searchValue', value)

    const formattedLabel = (item: ComponentTreeMeta) => `${item.label} (${item.description})`

    return vine`
        <div class="component-tree">
            <IconField>
                <InputIcon class="pi pi-search" />
                <InputText
                    :modelValue="searchValue"
                    @update:modelValue="onSearch"
                    placeholder="Search Component"
                    class="component-tree-search"
                />
            </IconField>

            <Fieldset
                v-for="{ label, description, children } in treeData"
                :legend="label + ' ' + description"
            >
                <Tag
                    v-for="component in children"
                    :value="formattedLabel(component)"
                    @click="onNodeClick(component)"
                    @contextmenu="(e: Event) => onNodeContextmenu(e, component)"
                    class="component-tree-item"
                ></Tag>
            </Fieldset>
        </div>
    `
}