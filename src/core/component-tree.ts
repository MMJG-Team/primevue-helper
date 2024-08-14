import * as vscode from 'vscode';
import { Node } from '../provider/component-tree';
import { EVENTS } from '../constants/event';
import { readComponentMetaJson } from './utils';

namespace ComponentTreeCore {
    export const registerCommand = (context: vscode.ExtensionContext) => {
        const clickCommand = vscode.commands.registerCommand(EVENTS.COMPONENT_TREE_CLICK, (node: Node) => {
            vscode.commands.executeCommand(EVENTS.API_DOC_SHOW, node);
		});

        const insertCodeCommand = vscode.commands.registerCommand(EVENTS.COMPONENT_TREE_INSERT_CODE, (node: Node) => {
			insertCodeToActiveEditor(node)
		});

		context.subscriptions.push(
            clickCommand,
            insertCodeCommand
        );
    }

    /**
     * get code snippet from meta of component
     * @param node 
     * @returns 
     */
    const getCodeSnippet = (node: Node) => {
        const json = readComponentMetaJson(node)
        return json?.template
    }

    /**
     * insert code snippet to active editor
     * @param node 
     * @returns 
     */
    const insertCodeToActiveEditor = async (node: Node) => {
        if (node.children?.length) {
            return
        }

        const editor = vscode.window.activeTextEditor;
        if (editor) {
            const position = editor.selection.start;
            const template = getCodeSnippet(node)

            if (template) {
                await editor.insertSnippet(new vscode.SnippetString(template), position)
                vscode.window.showInformationMessage(`Code snippet inserted: ${node.label}`);
            }
        }
    }
}

export default ComponentTreeCore