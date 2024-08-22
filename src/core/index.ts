import * as vscode from 'vscode';
import ApiDocCore from './api-doc';
import ComponentTreeCore from './component-tree';
import ComponentTreeWebviewCore from './component-tree-webview';

class Core {
    public context: vscode.ExtensionContext

    // public apiDocCore: ApiDocCore

    // public componentTreeCore: ComponentTreeCore

    public componentTreeWebviewCore: ComponentTreeWebviewCore

    constructor(context: vscode.ExtensionContext) {
        this.context = context

        // this.apiDocCore = new ApiDocCore(context)
        // this.componentTreeCore = new ComponentTreeCore(context)
        this.componentTreeWebviewCore = new ComponentTreeWebviewCore(context)
    }
}

export default Core