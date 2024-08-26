import { WEBVIEW_ACTIONS, WEBVIEW_RECEIVE_MESSAGE } from '@/constants';
import { postMessageForVsCode } from '@/vscode-extension-api';
import { ComponentDocMeta, PropsType, SlotsOrEmitsType } from '@/types/api-doc';
import { defineStore } from 'pinia';
import { ComponentTreeMeta } from '@/types/component-tree';
import { toRaw } from 'vue';


export const useStore = defineStore('store', {
    state: () => ({
        data: [] as ComponentTreeMeta[],

        showChineseDescription: true,

        searchValue: '',

        workingNode: null as (ComponentTreeMeta | null),

        apiDocVisible: false,
        apiDocData: {} as ComponentDocMeta,

        officialSiteVisible: false,
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

        officialSiteUrl: (state) => {
            const baseUrl = 'https://primevue.org/'
            
            const { label } = state.workingNode ?? {}
            const type = label ? label.toLocaleLowerCase() : ''

            return `${baseUrl}${type}`
        },
    },
    actions: {
        setData(data: ComponentTreeMeta[]) {
            this.data = data
        },

        setWorkingNode(node: ComponentTreeMeta) {
            this.workingNode = node
        },

        setShowChineseDescription(visible: boolean) {
            this.showChineseDescription = visible
        },

        setApiDocVisible(visible: boolean) {
            this.apiDocVisible = visible
        },

        setApiDocData(data: ComponentDocMeta) {
            this.apiDocData = data
            this.setApiDocVisible(true)
        },

        openDocument() {
            if (!this.workingNode) return;

            postMessageForVsCode({
                type: WEBVIEW_RECEIVE_MESSAGE,
                action: WEBVIEW_ACTIONS.FETCH_COMPONENT_API_DOC,
                data: toRaw(this.workingNode)
            })

            // for test
            // postMessage({
            //     type: WEBVIEW_RECEIVE_MESSAGE,
            //     action: WEBVIEW_ACTIONS.RECEIVE_COMPONENT_API_DOC,
            //     data: ApiDocMockData
            // })
        },

        openOfficialSite() {
            if (!this.workingNode) return;

            this.officialSiteVisible = true
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

        insertCodeSnippet() {
            if (!this.workingNode) return;

            postMessageForVsCode({
                type: WEBVIEW_RECEIVE_MESSAGE,
                action: WEBVIEW_ACTIONS.INSERT_CODE_SNIPPET,
                data: toRaw(this.workingNode)
            })
        },
    },
})