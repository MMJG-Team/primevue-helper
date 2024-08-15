import * as vscode from 'vscode';
import ApiDocCore from './api-doc';
import ComponentTreeCore from './component-tree';

class Core {
    public context: vscode.ExtensionContext

    public apiDocCore: ApiDocCore

    public componentTreeCore: ComponentTreeCore

    constructor(context: vscode.ExtensionContext) {
        this.context = context

        this.apiDocCore = new ApiDocCore(context)
        this.componentTreeCore = new ComponentTreeCore(context)
    }

    public registerCommand() {
        this.apiDocCore.registerCommand()
        this.componentTreeCore.registerCommand()
    }
}

export default Core