import * as vscode from 'vscode';
import { Node } from '../provider/component-tree';
import { EVENTS } from '../constants/event';
import { API_DOC_RECEIVE_MESSAGE, getApiDocPanel } from '../webview/api-doc';
import { readComponentMetaJson } from './utils';

class ApiDocCore {
    public context: vscode.ExtensionContext;

    constructor(context: vscode.ExtensionContext) {
        this.context = context;
    }

    public registerCommand() {
        const clickCommand = vscode.commands.registerCommand(EVENTS.API_DOC_SHOW, (node: Node) => {
			this.openDocumentView(node)
		});

		this.context.subscriptions.push(clickCommand);
    }

    /**
     * open api document in webview
     * @param context 
     * @param node 
     */
    public openDocumentView(node: Node) {
        const panel = getApiDocPanel(this.context)

        if (panel) {
            const json = readComponentMetaJson(node)

            panel.webview.postMessage({
                type: API_DOC_RECEIVE_MESSAGE,
                data: {
                    node: {
                        label: node.label,
                        description: node.description,
                    },
                    ...json
                }
            })
        }
    }
}

export default ApiDocCore