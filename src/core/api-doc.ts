import * as vscode from 'vscode';
import { Node } from '../provider/component-tree';
import { EVENTS } from '../constants/event';
import { API_DOC_RECEIVE_MESSAGE, getApiDocPanel } from '../webview/api-doc';
import { readComponentMetaJson } from './utils';

namespace ApiDocCore {
    export const registerCommand = (context: vscode.ExtensionContext) => {
        const clickCommand = vscode.commands.registerCommand(EVENTS.API_DOC_SHOW, (node: Node) => {
			openDocumentView(context, node)
		});

		context.subscriptions.push(clickCommand);
    }

    /**
     * open api document in webview
     * @param context 
     * @param node 
     */
    const openDocumentView = (context: vscode.ExtensionContext, node: Node) => {
        const panel = getApiDocPanel(context)

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