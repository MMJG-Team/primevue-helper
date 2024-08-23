import { createApp } from "vue";
import { createPinia } from "pinia";
import PrimeVue from 'primevue/config';
import { definePreset } from '@primevue/themes';
import Aura from '@primevue/themes/aura';
import ToastService from 'primevue/toastservice';
import Tooltip from "primevue/tooltip";

import { WEBVIEW_ACTIONS, WEBVIEW_RECEIVE_MESSAGE } from "@/constants";
import { MessageData } from "@/vscode-extension-api";
import { ComponentTreeMeta } from "@/types/component-tree";

import { useStore } from './store'
import { Component } from "../base";
import { View } from "./view.vine";

export { ComponentTreeMockData } from './mock.data'

const PRESET = definePreset(Aura, {
    semantic: {
        primary: {
            50: '{indigo.50}',
            100: '{indigo.100}',
            200: '{indigo.200}',
            300: '{indigo.300}',
            400: '{indigo.400}',
            500: '{indigo.500}',
            600: '{indigo.600}',
            700: '{indigo.700}',
            800: '{indigo.800}',
            900: '{indigo.900}',
            950: '{indigo.950}'
        }
    }
});

const THEME = {
    preset: PRESET,
    options: {
        darkModeSelector: '.theme-dark',
    }
}

export default class ComponentTree extends Component {
    static __VIEW__ = View

    init() {
        this.registerEvent()

        this.__app__ = createApp(View)

        // use ext
        this.__app__
            .use(PrimeVue, {
                theme: THEME
            })
            .use(createPinia())
            .use(ToastService)
            
        // use directive
        this.__app__.directive('tooltip', Tooltip)

        return this;
    }

    render() {
        this.setData(this.options.data)
        this.setShowChineseDescription(this.options.showChineseDescription)

        this.__app__ && this.__app__.mount(this.root)
        return this;
    }

    setData(data: ComponentTreeMeta[]) {
        data && useStore().setData(data)
    }

    setShowChineseDescription(visible: boolean = true) {
        useStore().setShowChineseDescription(visible)
    }

    /**
     * receive message of component-api-document from vscode
     * @param message 
     */
    receiveComponentApiDoc(message: MessageData) {
        const { action, data } = message

        if (action === WEBVIEW_ACTIONS.RECEIVE_COMPONENT_API_DOC) {
            useStore().setApiDocData(data)
        }
    }

    registerEvent() {
        window.addEventListener('message', event => {
            const message = event.data; // The JSON data our extension sent

            if (message.type !== WEBVIEW_RECEIVE_MESSAGE) {
                return;
            }

            this.receiveComponentApiDoc(message)
        });
    }
}