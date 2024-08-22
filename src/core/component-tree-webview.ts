import * as vscode from 'vscode';
import { ComponentTreeWebview } from 'src/provider';
import { TYPES_FOR_UI, WEBVIEW_ACTIONS } from 'src/constants/event';
import { readComponentMetaJson } from './utils';
import Common from './common';
import { isEmpty } from 'radash';

export type SlotsOrEmitsType = {
    name: string,
    parameters: {
        name: string,
        optional: boolean,
        type: string,
        description?: string
    }[],
    returnType: string,
    description?: string
}

export type PropsType = {
    name: string,
    optional: boolean,
    readonly: boolean,
    type: null | string | string[],
    default: string,
    description?: string
}

function pascalCase(word: string) {
    const words = word.split('')
    words[0] = words[0].toUpperCase()
    return words.join('')
}

class ComponentTreeWebviewCore extends Common {
    public view: ComponentTreeWebview

    constructor(context: vscode.ExtensionContext) {
        super(context)

        this.view = new ComponentTreeWebview(context, this.type);

        this.registerCommand()
    }

    public registerCommand() {
        super.registerCommand()

        const { componentTreeWebviewProvider } = this.view

        componentTreeWebviewProvider.registerMessage((message) => {
            console.log(message)
            const { action, data } = message

            if (action === WEBVIEW_ACTIONS.FETCH_COMPONENT_API_DOC) {
                this.openDocumentView(data)
                return
            }

            if (action === WEBVIEW_ACTIONS.INSERT_CODE_SNIPPET) {
                this.insertTemplate(data)
                return
            }

            if (action === WEBVIEW_ACTIONS.INSERT_PROPS) {
                this.insertProp(data)
                return
            }

            if (action === WEBVIEW_ACTIONS.INSERT_PROPS) {
                this.insertProp(data)
                return
            }

            if (action === WEBVIEW_ACTIONS.INSERT_SLOTS) {
                this.insertSlot(data)
                return
            }

            if (action === WEBVIEW_ACTIONS.INSERT_EMITS) {
                this.insertEmit(data)
                return
            }
        })
    }

    /**
     * open api document in webview
     * @param context 
     * @param node 
     */
    public openDocumentView(node: { label: string, description: string }) {
        const { componentTreeWebviewProvider } = this.view
        
        const json = readComponentMetaJson(this.type, node)
        if (isEmpty(json)) {
            console.log(node.label, 'api doc not found')
            return;
        }

        const data = {
            node: {
                label: node.label,
                description: node.description,
            },
            ...json
        }

        componentTreeWebviewProvider.postMessage({
            action: WEBVIEW_ACTIONS.RECEIVE_COMPONENT_API_DOC,
            data
        })
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
    public getCodeSnippet(node: { label: string, description: string }) {
        const json = readComponentMetaJson(this.type, node)
        return json?.template
    }

    /**
     * insert code snippet to active editor
     * @param code 
     */
    public async insertCodeToActiveEditor(code: string) {
        const editor = vscode.window.activeTextEditor;
        if (editor) {
            const position = editor.selection.start;

            if (code) {
                await editor.insertSnippet(new vscode.SnippetString(code), position)
            }
        }
    }

    /**
     * insert component template
     * @param node 
     * @returns 
     */
    public async insertTemplate(node: { label: string, description: string }) {
        const template = this.getCodeSnippet(node)
        return this.insertCodeToActiveEditor(template)
    }

    /**
     * insert component prop
     * @param node 
     * @returns 
     */
    public async insertProp(prop: PropsType) {
        const template = `${prop.name}="${prop.default}"`
        return this.insertCodeToActiveEditor(template)
    }

    public async insertSlot(slot: SlotsOrEmitsType) {
        const template = `
<template #${slot.name}="slotProps">
    <div>${slot.name}</div>
</template>
`
        return this.insertCodeToActiveEditor(template)
    }

    public async insertEmit(emit: SlotsOrEmitsType) {
        const { name } = emit;
        
        const fnName = name.split(':').map(word => pascalCase(word)).join('')

        const template = `@${emit.name}="on${fnName}()"`
        return this.insertCodeToActiveEditor(template)
    }
}

export default ComponentTreeWebviewCore