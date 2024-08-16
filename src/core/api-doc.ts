import * as vscode from 'vscode';
import { isEmpty, debounce } from 'radash'
import { Node } from 'src/provider/component-tree';
import { EVENTS, TYPES_FOR_UI } from 'src/constants/event';
import { API_DOC_RECEIVE_MESSAGE, getApiDocPanel } from 'src/webview/api-doc';
import { readComponentMetaJson } from './utils';
import Common from './common';

class ApiDocCore extends Common {

    public registerCommand() {
        super.registerCommand()

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
        const json = readComponentMetaJson(node)
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
            data
        })
    }
}

export default ApiDocCore