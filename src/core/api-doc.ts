import * as vscode from 'vscode';
import { isEmpty, debounce } from 'radash'
import { Node } from 'src/provider/component-tree';
import { EMITTER_EVENTS, EVENTS, TYPES_FOR_UI, WEBVIEW_ACTIONS } from 'src/constants/event';
import { API_DOC_RECEIVE_MESSAGE, getApiDocPanel } from 'src/webview/api-doc';
import { readComponentMetaJson } from './utils';
import Common from './common';
import Emitter from 'src/emitter';

class ApiDocCore extends Common {

    public registerCommand() {
        super.registerCommand()

        this.registerVsCodeCommand()
        this.registerWebviewMessage()
    }

    /**
     * register command for receive message from vscode
     */
    public registerVsCodeCommand () {
        const clickCommand = vscode.commands.registerCommand(EVENTS.API_DOC_SHOW, (node: Node) => {
			this.openDocumentView(node)
		});

        const selectionChange = vscode.window.onDidChangeTextEditorSelection(
            debounce({ delay: 300 }, (e) => {
                const { textEditor, selections } = e
                
                const code = textEditor.document.getText(selections[0])

                const node = new Node(code)
                this.openDocumentView(node)
            })
        )

		this.context.subscriptions.push(
            clickCommand,
            selectionChange
        );
    }

    /**
     * register listener for receive message from webview
     */
    public registerWebviewMessage() {
        Emitter.on(EMITTER_EVENTS.WEBVIEW_RECEIVE_MESSAGE, (message) => {
            console.log('api doc message', message)
            const { action, data } = message
            if (action === WEBVIEW_ACTIONS.INSERT_PROPS) {
                const editor = vscode.window.activeTextEditor;
                if (editor) {
                    const position = editor.selection.start;
                    const template = `${data.name}="${data.default}"`

                    if (template) {
                        editor.insertSnippet(new vscode.SnippetString(template), position)
                        // vscode.window.showInformationMessage(`Code snippet inserted: ${node.label}`);
                    }
                }
            }
        })
    }

    /**
     * called when ui type change
     * @param type 
     */
    public receiveUITypeChange(type: TYPES_FOR_UI) {
        const panel = getApiDocPanel(this.context, false)!
        if (panel) {
            panel.dispose()
        }
    }

    /**
     * open api document in webview
     * @param context 
     * @param node 
     */
    public openDocumentView(node: Node) {
        const json = readComponentMetaJson(this.type, node)
        if (isEmpty(json)) {
            console.log(node.label, 'api doc not found')
            return;
        }

        const panel = getApiDocPanel(this.context)!

        const data = {
            node: {
                label: node.label,
                description: node.description,
            },
            ...json
        }

        panel.webview.postMessage({
            type: API_DOC_RECEIVE_MESSAGE,
            action: 'update.api.doc',
            data
        })
    }
}

export default ApiDocCore