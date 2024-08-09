import * as vscode from 'vscode';
import * as path from 'node:path';
import * as fs from 'node:fs';
import { Node } from '../provider/component-tree-provider';

// esm __dirname
import { fileURLToPath } from 'node:url'
// @ts-ignore
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

namespace Core {
    export const registerCommand = (context: vscode.ExtensionContext) => {
        const clickCommand = vscode.commands.registerCommand('componentTree.click', (node: Node) => {
			insertCodeToActiveEditor(node)
		});

		context.subscriptions.push(clickCommand);
    }

    const getCodeSnippet = (node: Node) => {
        const jsonPath = path.join(__dirname, `../meta/primevue/components/${node.label.toLocaleLowerCase()}.json`)
        if (fs.existsSync(jsonPath)) {
            const json = JSON.parse(fs.readFileSync(jsonPath).toString())
            const { template } = json

            return template
        }
    }

    const insertCodeToActiveEditor = async (node: Node) => {
        if (node.children?.length) {
            return
        }

        const editor = vscode.window.activeTextEditor;
        console.log(editor)
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

export default Core