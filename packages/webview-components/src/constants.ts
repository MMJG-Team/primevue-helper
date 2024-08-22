export const WEBVIEW_RECEIVE_MESSAGE = 'webview.message.flag';

export enum WEBVIEW_ACTIONS {
    INSERT_PROPS = 'webview.insert.props',
    INSERT_SLOTS = 'webview.insert.slots',
    INSERT_EMITS = 'webview.insert.emits',

    INSERT_CODE_SNIPPET = 'webview.insert.code.snippet',

    FETCH_COMPONENT_API_DOC = 'webview.fetch.component.api.doc',
    RECEIVE_COMPONENT_API_DOC = 'webview.receive.component.api.doc',
}