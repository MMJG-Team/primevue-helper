import * as vscode from 'vscode';
import ComponentTreeWebviewCore from './component-tree-webview';

class Core {
    public context: vscode.ExtensionContext

    public componentTreeWebviewCore: ComponentTreeWebviewCore

    constructor(context: vscode.ExtensionContext) {
        this.context = context

        this.componentTreeWebviewCore = new ComponentTreeWebviewCore(context)
    }
}

export default Core