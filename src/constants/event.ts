export const EVENTS = {
    API_DOC_SHOW: 'apiDoc.show',
    COMPONENT_TREE_CLICK: 'componentTree.click',
    COMPONENT_TREE_INSERT_CODE: 'componentTree.insertCode',

    COMPONENT_TREE_UI_PRIMEVUE: 'componentTree.ui.primevue',
    COMPONENT_TREE_UI_ANTD: 'componentTree.ui.antd',
    COMPONENT_TREE_UI_VANT: 'componentTree.ui.vant',
}

export enum EMITTER_EVENTS {
    COMPONENT_TREE_UI_CHANGE = 'componentTree.ui.change',

    WEBVIEW_RECEIVE_MESSAGE = 'webview.receive.message',
}

export const WEBVIEW_MESSAGE_FLAG = 'webview.message.flag';

export enum WEBVIEW_ACTIONS {
    INSERT_PROPS = 'webview.insert.props',
    INSERT_SLOTS = 'webview.insert.slots',
    INSERT_EMITS = 'webview.insert.emits',

    INSERT_CODE_SNIPPET = 'webview.insert.code.snippet',

    FETCH_COMPONENT_API_DOC = 'webview.fetch.component.api.doc',
    RECEIVE_COMPONENT_API_DOC = 'webview.receive.component.api.doc',
}

export enum TYPES_FOR_UI {
    PRIMEVUE = 'primevue',
    ANT_DESIGN = 'antd',
    VANT = 'vant'
}

export const DEFAULT_UI_TYPE = TYPES_FOR_UI.PRIMEVUE

export const EVENT_MAP_TO_UI = {
    [EVENTS.COMPONENT_TREE_UI_PRIMEVUE]: TYPES_FOR_UI.PRIMEVUE,
    [EVENTS.COMPONENT_TREE_UI_ANTD]: TYPES_FOR_UI.ANT_DESIGN,
    [EVENTS.COMPONENT_TREE_UI_VANT]: TYPES_FOR_UI.VANT
}