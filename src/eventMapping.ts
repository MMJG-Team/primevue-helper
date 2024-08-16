import * as vscode from 'vscode';
import { EMITTER_EVENTS, EVENT_MAP_TO_UI } from './constants/event';
import Emitter from './emitter';

export default function eventMapping(context: vscode.ExtensionContext) {
    
    const uiChangeCommands = Object.keys(EVENT_MAP_TO_UI).map((key) => {
		return vscode.commands.registerCommand(key, () => {
			const type = EVENT_MAP_TO_UI[key]

			Emitter.emit(EMITTER_EVENTS.COMPONENT_TREE_UI_CHANGE, type)
		})
	})

	context.subscriptions.push(
		...uiChangeCommands
	);
}