let vscode: any;

export const setVsCode = (vsCodeInstance: any) => {
    vscode = vsCodeInstance;
}

export const postMessageForVsCode = (message: {
    type: string;
    action: string;
    data: any;
}) => {
    if (!vscode) {
        return;
    }

    vscode.postMessage(message);
}