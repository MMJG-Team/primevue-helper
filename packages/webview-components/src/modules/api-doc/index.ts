import { createApp } from "vue";
import { createPinia } from "pinia";
import PrimeVue from 'primevue/config';
import { definePreset } from '@primevue/themes';
import Aura from '@primevue/themes/aura';
import ToastService from 'primevue/toastservice';

import { useStore } from './store'
import { Component } from "../base";
import { View } from "./view.vine";
import { WEBVIEW_RECEIVE_MESSAGE } from "../../constants";
import { ComponentDocMeta } from "@/types/api-doc";

export { default as ApiDocMockData } from './mock.json'

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

export default class ApiDoc extends Component {
    static __VIEW__ = View

    init() {
        this.registerEvent()

        this.__app__ = createApp(View)

        this.__app__
            .use(PrimeVue, {
                theme: THEME
            })
            .use(createPinia())
            .use(ToastService)

        return this;
    }

    render() {
        this.setData(this.options.data)

        this.__app__ && this.__app__.mount(this.root)
        return this;
    }

    setData(data: ComponentDocMeta) {
        data && useStore().setData(data)
    }

    registerEvent() {
        window.addEventListener('message', event => {
            const message = event.data; // The JSON data our extension sent
            
            if (message.type !== WEBVIEW_RECEIVE_MESSAGE) {
                return;
            }

            if (message.action === 'update.api.doc') {
                this.setData(message.data)
            }
        });
    }
}