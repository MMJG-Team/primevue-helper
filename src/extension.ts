// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import Core from 'src/core';

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

	const core = new Core(context)

	core.registerCommand()
}

// This method is called when your extension is deactivated
export function deactivate() {}
