// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import Core from 'src/core';
import eventMapping from './eventMapping'

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	console.log('Congratulations, your extension "Quick View" is now active!', vscode.env.language);

	eventMapping(context)

	const core = new Core(context)
}

// This method is called when your extension is deactivated
export function deactivate() {}
