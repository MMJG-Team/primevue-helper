import { EMITTER_EVENTS, EVENTS, TYPES_FOR_UI, WEBVIEW_MESSAGE_FLAG } from 'src/constants/event';
import Emitter from 'src/emitter';
import { ComponentMeta, Meta } from 'src/meta';
import * as vscode from 'vscode';

const WEBVIEW_COMPONENTS_PATH = 'packages/webview-components/dist';
const WEBVIEW_COMPONENTS_JS_PATH = `${WEBVIEW_COMPONENTS_PATH}/webview-components.umd.js`;
const WEBVIEW_COMPONENTS_CSS_PATH = `${WEBVIEW_COMPONENTS_PATH}/style.css`;

function getNonce() {
	let text = '';
	const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	for (let i = 0; i < 32; i++) {
		text += possible.charAt(Math.floor(Math.random() * possible.length));
	}
	return text;
}

export class ComponentTreeWebviewProvider implements vscode.WebviewViewProvider {
	private _view?: vscode.WebviewView;

	public static readonly viewType = 'component-tree-webview';

	public context: vscode.ExtensionContext;

	public treeData: ComponentMeta[]

	constructor(context: vscode.ExtensionContext, options: { treeData: ComponentMeta[] }) {
		this.context = context;
		this.treeData = options.treeData;
	}

	public resolveWebviewView(
		webviewView: vscode.WebviewView,
		context: vscode.WebviewViewResolveContext,
		_token: vscode.CancellationToken,
	) {
		this._view = webviewView;

		webviewView.webview.options = {
			// Allow scripts in the webview
			enableScripts: true,
		};

		webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);

		webviewView.webview.onDidReceiveMessage(message => {
			if (message.type !== WEBVIEW_MESSAGE_FLAG) {
				return
			}

			Emitter.emit(EMITTER_EVENTS.WEBVIEW_RECEIVE_MESSAGE, message);
		});
	}

	public postMessage(message: any) {
		if (this._view) {
			this._view.webview.postMessage({
				type: WEBVIEW_MESSAGE_FLAG,
				...message
			});
		}
	}

	/**
	 * register emit listener for receive message from webview
	 */
	public registerMessage(listener: (message: any) => void) {		
		Emitter.on(EMITTER_EVENTS.WEBVIEW_RECEIVE_MESSAGE, listener);
	}

	public dispose() {
		this._view = undefined;
	}

	private _getHtmlForWebview(webview: vscode.Webview) {
		const { context } = this
		// Use a nonce to only allow a specific script to be run.
		const nonce = getNonce();

		const webviewComponentJs = webview.asWebviewUri(
			vscode.Uri.joinPath(context.extensionUri, WEBVIEW_COMPONENTS_JS_PATH)
		);
	
		const webviewComponentCss = webview.asWebviewUri(
			vscode.Uri.joinPath(context.extensionUri, WEBVIEW_COMPONENTS_CSS_PATH)
		);
	
		const html = `
			<!DOCTYPE html>
			<html lang="en" class="theme-dark">
			<head>
				<meta charset="UTF-8">
				<meta name="viewport" content="width=device-width, initial-scale=1.0">
				<title>api doc</title>
				<link rel="stylesheet" href="${webviewComponentCss}">
				<style>
					html {
						font-size: 12px !important;
					}
	
					html,
					body,
					#app {
						padding: 0;
						margin: 0;
						height: 100%;
						width: 100%;
					}
				</style>
			</head>
			<body>
				<div id="app"></div>
			
				<script nonce="${nonce}" src="${webviewComponentJs}"></script>
				<script>
					if (window.WebviewComponents) {
						const vscode = acquireVsCodeApi();

						const data = ${JSON.stringify(this.treeData)};
						const componentTree = new WebviewComponents.ComponentTree('#app', {
							vscode,
							data,
						})
	
						componentTree.init()
						componentTree.render()
					}    
				</script>
			</body>
			</html>
		`;

		return html;
	}
}

export class ComponentTreeWebview {
	public type = TYPES_FOR_UI.PRIMEVUE;

	public componentTreeWebviewProvider: ComponentTreeWebviewProvider;

	constructor(context: vscode.ExtensionContext, type = TYPES_FOR_UI.PRIMEVUE ) {
		const treeData = Meta.get(type);

		this.type = type;

		this.componentTreeWebviewProvider = new ComponentTreeWebviewProvider(context, {
			treeData
		});

		context.subscriptions.push(
			vscode.window.registerWebviewViewProvider(
				ComponentTreeWebviewProvider.viewType,
				this.componentTreeWebviewProvider,
				{
					webviewOptions: {
					    retainContextWhenHidden: true
					}
				}
			)
		);
	}

	public toggle(type: TYPES_FOR_UI) {
		const treeData = Meta.get(type);
		// TODO: update treeData
	}

	public dispose() {
		this.componentTreeWebviewProvider.dispose();
	}
}