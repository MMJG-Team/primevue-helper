import * as vscode from 'vscode';
import type { Node } from 'src/provider';
import { ComponentTreeView } from 'src/provider';
import { EVENTS, TYPES_FOR_UI } from 'src/constants/event';
import { readComponentMetaJson } from './utils';
import Common from './common';

class ComponentTreeCore extends Common {
    public view: ComponentTreeView

    constructor(context: vscode.ExtensionContext) {
        super(context)

        this.view = new ComponentTreeView(context, this.type);
    }

    public registerCommand() {
        super.registerCommand()

        const { context } = this

        // register tree node click event
        const clickCommand = vscode.commands.registerCommand(EVENTS.COMPONENT_TREE_CLICK, (node: Node) => {
            console.log(node)
            // open api document
            vscode.commands.executeCommand(EVENTS.API_DOC_SHOW, node);
		});

        // register insert code event
        const insertCodeCommand = vscode.commands.registerCommand(EVENTS.COMPONENT_TREE_INSERT_CODE, (node: Node) => {
			this.insertCodeToActiveEditor(node)
		});

        console.log('component tree command registered')

		context.subscriptions.push(
            clickCommand,
            insertCodeCommand
        );
    }

    /**
     * called when ui type changed
     * @param type 
     */
    public receiveUITypeChange(type: TYPES_FOR_UI) {
        this.view.toggle(type)
    }

    /**
     * get code snippet from meta of component
     * @param node 
     * @returns 
     */
    public getCodeSnippet(node: Node) {
        const json = readComponentMetaJson(node)
        return json?.template
    }

    /**
     * insert code snippet to active editor
     * @param node 
     * @returns 
     */
    public async insertCodeToActiveEditor(node: Node) {
        if (node.children?.length) {
            return
        }

        const editor = vscode.window.activeTextEditor;
        if (editor) {
            const position = editor.selection.start;
            const template = this.getCodeSnippet(node)

            if (template) {
                await editor.insertSnippet(new vscode.SnippetString(template), position)
                vscode.window.showInformationMessage(`Code snippet inserted: ${node.label}`);
            }
        }
    }
}

export default ComponentTreeCore