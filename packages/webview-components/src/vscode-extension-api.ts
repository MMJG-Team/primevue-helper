import { WEBVIEW_ACTIONS } from "./constants";

export type MessageData = {
    type: string;
    action: WEBVIEW_ACTIONS;
    data?: any;
}

let vscode: any;

export const setVsCode = (vsCodeInstance: any) => {
    vscode = vsCodeInstance;
}

export const postMessageForVsCode = (message: MessageData) => {
    if (!vscode) {
        return;
    }

    vscode.postMessage(message);
}