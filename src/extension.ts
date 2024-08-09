// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { ComponentTreeView } from './provider';
import Core from './core';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	console.log('Congratulations, your extension "QVC" is now active!');

	const rootPath = (
		vscode.workspace.workspaceFolders &&
		(vscode.workspace.workspaceFolders.length > 0)
	)
		? vscode.workspace.workspaceFolders[0].uri.fsPath
		: undefined;

	// Samples of `window.registerTreeDataProvider`
	// const componentTreeProvider = new ComponentTreeProvider();
	// vscode.window.registerTreeDataProvider('component-tree', componentTreeProvider);

	new ComponentTreeView(context)

	Core.registerCommand(context)

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	// const disposable = vscode.commands.registerCommand('quick-view-config.helloWorld', () => {
	// 	vscode.window.showInformationMessage('Hello World from quick-view-config!');
	// });
	// context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}
