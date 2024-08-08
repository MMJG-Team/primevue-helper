import * as vscode from 'vscode';
import { COMPONENT_TREE_DATA } from './meta/primevue';
import { ComponentMeta } from './type';

export class ComponentTreeProvider implements vscode.TreeDataProvider<Node> {

	private _onDidChangeTreeData: vscode.EventEmitter<Node | undefined | void> = new vscode.EventEmitter<Node | undefined | void>();
	readonly onDidChangeTreeData: vscode.Event<Node | undefined | void> = this._onDidChangeTreeData.event;

	refresh(): void {
		this._onDidChangeTreeData.fire();
	}

	getTreeItem(element: Node): vscode.TreeItem {
		return element;
	}

	getChildren(element?: Node): Thenable<Node[]> {

		if (element) {

			if (element.children?.length) {
				return Promise.resolve(element.children.map(c  => new Node(
					c.label,
					vscode.TreeItemCollapsibleState.Collapsed,
					c.description,
					c.children ?? [],
				)));
			}
			
			return Promise.resolve([])
		}

		return Promise.resolve(COMPONENT_TREE_DATA.map(c  => new Node(
			c.label,
			vscode.TreeItemCollapsibleState.Collapsed,
			c.description,
			c.children ?? [],
		)))
	}
}

/**
 * tree node
 */
export class Node extends vscode.TreeItem {

	constructor(
		public readonly label: string,
		public readonly collapsibleState: vscode.TreeItemCollapsibleState,
		public readonly description: string,
		public readonly children: ComponentMeta[],
	) {
		super(label, collapsibleState);

		this.tooltip = `${this.label}-${description}`;
		this.children = children
		this.description = description;

		// define click event
		this.command = {
			command: 'componentTree.click',
			title: "click",
			arguments: [this]
		};
		
		if (!children?.length) {
			this.collapsibleState = vscode.TreeItemCollapsibleState.None
		}
	}

	contextValue = 'node';
}

export class ComponentTreeView {
	constructor(context: vscode.ExtensionContext) {
		const componentTreeProvider = new ComponentTreeProvider();

		const componentTreeView = vscode.window.createTreeView('component-tree', {
			treeDataProvider: componentTreeProvider
		})

		const clickCommand = vscode.commands.registerCommand('componentTree.click', (node: Node) => {
			vscode.window.showInformationMessage(`Node ${node.label} clicked`);
		});

		context.subscriptions.push(componentTreeView);
		context.subscriptions.push(clickCommand);
	}
}