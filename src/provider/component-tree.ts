import * as vscode from 'vscode';
import { ComponentMeta, Meta } from 'src/meta';
import { EVENTS, TYPES_FOR_UI } from 'src/constants/event';

export class ComponentTreeProvider implements vscode.TreeDataProvider<Node> {

	private _onDidChangeTreeData: vscode.EventEmitter<Node | undefined | void> = new vscode.EventEmitter<Node | undefined | void>();
	
	readonly onDidChangeTreeData: vscode.Event<Node | undefined | void> = this._onDidChangeTreeData.event;

	public context: vscode.ExtensionContext;
	
	public treeData: ComponentMeta[];
	
	constructor(context: vscode.ExtensionContext, treeData: ComponentMeta[]) {
	    this.context = context;
		this.treeData = treeData;
	}

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

		return Promise.resolve(this.treeData.map(c  => new Node(
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
		public readonly collapsibleState = vscode.TreeItemCollapsibleState.Expanded,
		public readonly description: string = label,
		public readonly children: ComponentMeta[] = [],
	) {
		super(label, collapsibleState);

		this.tooltip = `${this.label}-${description}`;
		this.children = children
		this.description = description;

		// define click event
		this.command = {
			command: EVENTS.COMPONENT_TREE_CLICK,
			title: "click",
			arguments: [this]
		};
		
		const isLeafNode = !children?.length;
		if (isLeafNode) {
			this.collapsibleState = vscode.TreeItemCollapsibleState.None
			this.contextValue = 'leafNode'
		}
	}
}

export class ComponentTreeView {
	public type = TYPES_FOR_UI.PRIMEVUE;

	public componentTreeView: vscode.TreeView<Node>;
	public componentTreeProvider: ComponentTreeProvider;

	constructor(context: vscode.ExtensionContext, type = TYPES_FOR_UI.PRIMEVUE ) {
		const treeData = Meta.get(type);

		this.type = type;

		this.componentTreeProvider = new ComponentTreeProvider(context, treeData);

		this.componentTreeView = vscode.window.createTreeView('component-tree', {
			treeDataProvider: this.componentTreeProvider,
		})

		context.subscriptions.push(this.componentTreeView);
	}

	public toggle(type: TYPES_FOR_UI) {
		this.componentTreeProvider.treeData = Meta.get(type);
		this.componentTreeProvider.refresh();
	}

	public dispose() {
		this.componentTreeView.dispose();
	}
}