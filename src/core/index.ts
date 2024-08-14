import * as vscode from 'vscode';
import ApiDocCore from './api-doc';
import ComponentTreeCore from './component-tree';

namespace Core {
    export const registerCommand = (context: vscode.ExtensionContext) => {
        ApiDocCore.registerCommand(context)
        ComponentTreeCore.registerCommand(context)
    }
}

export default Core