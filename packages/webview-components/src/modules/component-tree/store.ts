import { WEBVIEW_ACTIONS, WEBVIEW_RECEIVE_MESSAGE } from '@/constants';
import { postMessageForVsCode } from '@/vscode-extension-api';
import { ComponentDocMeta, PropsType, SlotsOrEmitsType } from '@/types/api-doc';
import { defineStore } from 'pinia';
import { ComponentTreeMeta } from '@/types/component-tree';
import { toRaw } from 'vue';


export const useStore = defineStore('store', {
    state: () => ({
        data: [] as ComponentTreeMeta[],

        searchValue: '',

        apiDocVisible: false,
        apiDocData: {} as ComponentDocMeta
    }),
    getters: {
        displayData(): ComponentTreeMeta[] {
            return this.data.reduce((result, _group) => {
                const group = {
                    ..._group,
                    children: _group.children.filter((component) => {
                        return component.label.toLocaleLowerCase().includes(this.searchValue.toLocaleLowerCase())
                    })
                }

                if (group.children.length) {
                    result.push(group)
                }

                return result
            }, [] as ComponentTreeMeta[])
        },

        apiDocDataNode: (state) => state.apiDocData?.node,
        apiDocDataPropColumns: (state) => state.apiDocData?.props ?? [],
        apiDocDataSlotColumns: (state) => state.apiDocData?.slots ?? [],
        apiDocDataEmitColumns: (state) => state.apiDocData?.emits ?? [],
    },
    actions: {
        setData(data: ComponentTreeMeta[]) {
            this.data = data
        },

        setApiDocVisible(visible: boolean) {
            this.apiDocVisible = visible
        },

        setApiDocData(data: ComponentDocMeta) {
            this.apiDocData = data
            this.setApiDocVisible(true)
        },

        openDocument(component: ComponentTreeMeta) {
            postMessageForVsCode({
                type: WEBVIEW_RECEIVE_MESSAGE,
                action: WEBVIEW_ACTIONS.FETCH_COMPONENT_API_DOC,
                data: toRaw(component)
            })

            // for test
            // postMessage({
            //     type: WEBVIEW_RECEIVE_MESSAGE,
            //     action: WEBVIEW_ACTIONS.RECEIVE_COMPONENT_API_DOC,
            //     data: ApiDocMockData
            // })
        },

        insertProp(prop: PropsType) {
            postMessageForVsCode({
                type: WEBVIEW_RECEIVE_MESSAGE,
                action: WEBVIEW_ACTIONS.INSERT_PROPS,
                data: toRaw(prop)
            })
        },

        insertSlot(slot: SlotsOrEmitsType) {
            postMessageForVsCode({
                type: WEBVIEW_RECEIVE_MESSAGE,
                action: WEBVIEW_ACTIONS.INSERT_SLOTS,
                data: toRaw(slot)
            })
        },

        insertEmit(emit: SlotsOrEmitsType) {
            postMessageForVsCode({
                type: WEBVIEW_RECEIVE_MESSAGE,
                action: WEBVIEW_ACTIONS.INSERT_EMITS,
                data: toRaw(emit)
            })
        },

        insertCodeSnippet(component: ComponentTreeMeta) {
            if (!component) return;

            postMessageForVsCode({
                type: WEBVIEW_RECEIVE_MESSAGE,
                action: WEBVIEW_ACTIONS.INSERT_CODE_SNIPPET,
                data: toRaw(component)
            })
        },
    },
})