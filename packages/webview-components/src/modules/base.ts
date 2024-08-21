import { App, Plugin } from "vue";
import { setVsCode } from "../vscode-extension-api";

export class Component {
    __app__: App | null = null

    root: HTMLElement;

    options: Record<string, any>;

    constructor(root: string | HTMLElement, options: Record<string, any> = {}) {
        this.root = typeof root === 'string' ? document.querySelector(root)! : root;
        this.options = options;

        if (options.vscode) {
            setVsCode(options.vscode);
        }
    }

    use<Options extends any[]>(plugin: Plugin<Options>, ...options: Options) {
        this.__app__?.use(plugin, options)
        return this;
    }

    init() {
        return this
    }

    render() {
        return this
    }

    dispose() {
        this.__app__?.unmount();
        this.__app__ = null;
        return this
    }
}