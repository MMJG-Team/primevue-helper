import { computed, onMounted, ref, watchEffect } from 'vue';
import { postMessageForVsCode } from '@/vscode-extension-api';
import { WEBVIEW_RECEIVE_MESSAGE, WEBVIEW_ACTIONS } from '@/constants';
import { ApiDocView } from '@/components/api-doc/index.vine'

import { useStore } from './store';
import type { PropsType } from '@/types/api-doc';

export function View() {
    const store = useStore()

    const title = computed(() => {
        if (!store.node) {
            return ''
        }

        const { label, description } = store.node
        if (label !== description) {
            return `${label} - ${description}`
        }

        return label
    })

    const onPropNameClick = (row: PropsType) => {
        postMessageForVsCode({
            type: WEBVIEW_RECEIVE_MESSAGE,
            action: WEBVIEW_ACTIONS.INSERT_PROPS,
            data: { ...row }
        })
    }

    return vine`
        <ApiDocView
            :title="title"
            :propColumns="store.propColumns"
            :slotColumns="store.slotColumns"
            :emitColumns="store.emitColumns"
            :onPropNameClick="onPropNameClick"
        ></ApiDocView>
    `
}