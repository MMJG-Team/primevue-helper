import * as vscode from 'vscode';
import { EVENT_MAP_TO_UI, DEFAULT_UI_TYPE, TYPES_FOR_UI, EMITTER_EVENTS } from 'src/constants/event';
import Emitter from 'src/emitter';

export default class Common {
    public type = DEFAULT_UI_TYPE

    public context: vscode.ExtensionContext;

    constructor(context: vscode.ExtensionContext) {
        this.context = context;
    }

    public registerCommand() {
        Emitter.on(EMITTER_EVENTS.COMPONENT_TREE_UI_CHANGE, (type: TYPES_FOR_UI) => {
            if (this.type === type) {
                return;
            }

            this.type = type
            this.receiveUITypeChange(type)
        })
    }

    public receiveUITypeChange(type: TYPES_FOR_UI) {}
}