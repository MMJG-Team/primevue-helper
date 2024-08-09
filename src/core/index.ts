import * as vscode from 'vscode';
import { Node } from '../provider/component-tree-provider';

namespace Core {
    export const registerCommand = (context: vscode.ExtensionContext) => {
        const clickCommand = vscode.commands.registerCommand('componentTree.click', (node: Node) => {
			insertCodeToActiveEditor(node)
		});

		context.subscriptions.push(clickCommand);
    }

    const insertCodeToActiveEditor = (node: Node) => {
        const editor = vscode.window.activeTextEditor;
        console.log(editor)
        if (editor) {
            const position = editor.selection.start;
            editor.edit((editBuilder) => {
                editBuilder.insert(position, node.label);
            }).then(() => {
                vscode.window.showInformationMessage(`Code snippet inserted: ${node.label}`);
            });
        }
    }
}

export default Core