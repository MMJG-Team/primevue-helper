import { EMITTER_EVENTS } from 'src/constants/event';
import Emitter from 'src/emitter';
import * as vscode from 'vscode';

const WEBVIEW_COMPONENTS_PATH = 'packages/webview-components/dist';
const WEBVIEW_COMPONENTS_JS_PATH = `${WEBVIEW_COMPONENTS_PATH}/webview-components.umd.js`;
const WEBVIEW_COMPONENTS_CSS_PATH = `${WEBVIEW_COMPONENTS_PATH}/style.css`;

let apiDocPanel: vscode.WebviewPanel | undefined;

export const API_DOC_RECEIVE_MESSAGE = 'api-doc-receive-message';

/**
 * get instance of webview
 * @param context 
 * @param autoCreate 
 * @returns 
 */
export function getApiDocPanel(context: vscode.ExtensionContext, autoCreate = true) {
    if (!apiDocPanel && autoCreate) {
        createApiDoc(context)
    }

    return apiDocPanel;
}

/**
 * display api document in webview
 * @param context 
 */
export function createApiDoc(context: vscode.ExtensionContext) {
    apiDocPanel = vscode.window.createWebviewPanel(
        'api doc',
        'Api Doc',
        vscode.ViewColumn.Nine,
        {
            // Enable scripts in the webview
            enableScripts: true,
            retainContextWhenHidden: true
        }
    );

    apiDocPanel.webview.html = getWebviewContent(context, apiDocPanel);

    /**
     * on visible of webview has changed
     */
    apiDocPanel.onDidChangeViewState((e) => {
        console.log('webview state changed', e.webviewPanel.active)
    })

    /**
     * on receive message from webview
     */
    apiDocPanel.webview.onDidReceiveMessage(message => {
        if (message.type !== API_DOC_RECEIVE_MESSAGE) {
            return;
        }

        Emitter.emit(EMITTER_EVENTS.WEBVIEW_RECEIVE_MESSAGE, message)
    })

    /**
     * on webview dispose
     */
    apiDocPanel.onDidDispose(() => {
        console.log('webview dispose')
        apiDocPanel = undefined;
    })
}

/**
 * return webview content
 * @param context 
 * @param panel 
 * @returns 
 */
function getWebviewContent(context: vscode.ExtensionContext, panel: vscode.WebviewPanel) {
    const webviewComponentJs = panel.webview.asWebviewUri(
        vscode.Uri.joinPath(context.extensionUri, WEBVIEW_COMPONENTS_JS_PATH)
    );

    const webviewComponentCss = panel.webview.asWebviewUri(
        vscode.Uri.joinPath(context.extensionUri, WEBVIEW_COMPONENTS_CSS_PATH)
    );

    return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>api doc</title>
            <link rel="stylesheet" href="${webviewComponentCss}">
            <style>
                html {
                    font-size: 12px !important;
                }

                html,
                body,
                #app {
                    padding: 0;
                    margin: 0;
                    height: 100%;
                    width: 100%;
                }
            </style>
        </head>
        <body>
            <div id="app"></div>
        
            <script src="${webviewComponentJs}"></script>
            <script>
                if (window.WebviewComponents) {
                    const vscode = acquireVsCodeApi();
                    const doc = new WebviewComponents.ApiDoc('#app', { vscode })

                    doc.init()
                    doc.render()
                }    
            </script>
        </body>
        </html>
    `;
}