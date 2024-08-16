import { computed, onMounted, ref, watchEffect } from 'vue';
import { useScroll } from '@vueuse/core'
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Accordion from "primevue/accordion";
import AccordionPanel from "primevue/accordionpanel";
import AccordionHeader from "primevue/accordionheader";
import AccordionContent from "primevue/accordioncontent";
import Tag from 'primevue/tag';
import ProgressBar from 'primevue/progressbar';
import { useStore } from './store';

export function View() {
    const el = ref<HTMLElement>()

    const store = useStore()
    const { y } = useScroll(el)

    const title = computed(() => {
        if (!store.node) {
            return ''
        }

        const { label, description } = store.node
        if (label !== description) {
            return `${label} - ${description}`
        }

        return label
    })

    const yPercent = computed(() => {
        if (!el.value) {
            return 100
        }

        if (el.value.scrollHeight < window.innerHeight) {
            return 100
        }

        return Number(((y.value + window.innerHeight) / el.value?.scrollHeight! * 100).toFixed(2))
    })

    vineStyle(css`
        .api-doc {
            --p-progressbar-height: 2px;

            width: 100%;
            height: 100%;
            padding: 0 24px 24px 24px;
            background-color: var(--p-surface-50);
            overflow: auto;
        }

        .api-doc-header {
            position: sticky;
            top: 0;
            padding: 16px 8px;
            z-index: 1000;
            background-color: var(--p-highlight-background);
        }

        .api-doc-description {
            white-space: pre-wrap;
        }
    `)

    return vine`
        <div class="api-doc api-doc-dark" ref="el">
            <div class="api-doc-header">
                <Tag v-if="title" class="!text-lg">{{title}}</Tag>
                <ProgressBar :value="yPercent" :showValue="false"></ProgressBar>
            </div>    

            <Accordion value="0">
                <AccordionPanel value="0">
                    <AccordionHeader>Props</AccordionHeader>
                    <AccordionContent>
                        <DataTable :value="store.propColumns">
                            <Column
                                field="name"
                                header="name"
                            >
                                <template #body="slotProps">
                                    <Tag severity="primary">{{ slotProps.data.name }}</Tag>
                                </template>
                            </Column>
                            <Column
                                field="type"
                                header="type"
                            >
                                <template #body="slotProps">
                                    <Tag severity="secondary">{{ slotProps.data.type }}</Tag>
                                </template>
                            </Column>
                            <Column
                                field="default"
                                header="default"
                            >
                                <template #body="slotProps">
                                    <Tag severity="info">{{ slotProps.data.default }}</Tag>
                                </template>
                            </Column>
                            <Column
                                class="api-doc-description"
                                field="description"
                                header="description"
                            />
                        </DataTable>
                    </AccordionContent>
                </AccordionPanel>
                <AccordionPanel value="1">
                    <AccordionHeader>Slots</AccordionHeader>
                    <AccordionContent>
                        <DataTable :value="store.slotColumns">
                            <Column
                                field="name"
                                header="name"
                            >
                                <template #body="slotProps">
                                    <Tag severity="primary">{{ slotProps.data.name }}</Tag>
                                </template>
                            </Column>
                            <Column
                                field="parameters"
                                header="parameters"
                            >
                                <template #body="slotProps">
                                    <Tag
                                        v-for="{ name, type } in slotProps.data.parameters"
                                        severity="secondary"
                                        class="overflow-auto !justify-start"
                                        style="max-width: 256px;"
                                    >
                                        <!-- <span>{{ name }}:</span> -->
                                        <pre v-html="type" style="{ margin: 0 }"></pre>
                                    </Tag>
                                </template>
                            </Column>
                            <Column
                                field="returnType"
                                header="returnType"
                            >
                                <template #body="slotProps">
                                    <Tag severity="info">{{ slotProps.data.returnType }}</Tag>
                                </template>
                            </Column>
                            <Column
                                class="api-doc-description"
                                field="description"
                                header="description"
                            />
                        </DataTable>
                    </AccordionContent>
                </AccordionPanel>
                <AccordionPanel value="2">
                    <AccordionHeader>Emits</AccordionHeader>
                    <AccordionContent>
                        <DataTable :value="store.emitColumns">
                            <Column
                                field="name"
                                header="name"
                            >
                                <template #body="slotProps">
                                    <Tag severity="primary">{{ slotProps.data.name }}</Tag>
                                </template>
                            </Column>
                            <Column
                                field="parameters"
                                header="parameters"
                            >
                                <template #body="slotProps">  
                                    <Tag
                                        v-for="{ name, type } in slotProps.data.parameters"
                                        severity="secondary"
                                    >
                                        <span>{{ name }}:</span>
                                        <pre v-html="type" style="{ margin: 0 }"></pre>
                                    </Tag>
                                </template>
                            </Column>
                            <Column
                                field="returnType"
                                header="returnType"
                            >
                                <template #body="slotProps">
                                    <Tag severity="info">{{ slotProps.data.returnType }}</Tag>
                                </template>
                            </Column>
                            <Column
                                class="api-doc-description"
                                field="description"
                                header="description"
                            />
                        </DataTable>
                    </AccordionContent>
                </AccordionPanel>
            </Accordion>
        </div>
    `
}