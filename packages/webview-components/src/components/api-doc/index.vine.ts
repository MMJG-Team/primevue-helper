import { computed, onMounted, ref, watchEffect } from 'vue';
import { useScroll } from '@vueuse/core'
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Accordion from "primevue/accordion";
import AccordionPanel from "primevue/accordionpanel";
import AccordionHeader from "primevue/accordionheader";
import AccordionContent from "primevue/accordioncontent";
import Tag from 'primevue/tag';
import Toast from 'primevue/toast';
import { useToast } from 'primevue/usetoast';
import ProgressBar from 'primevue/progressbar';
import './style.less'

export type SlotsOrEmitsType = {
    name: string,
    parameters: {
        name: string,
        optional: boolean,
        type: string,
        description?: string
    }[],
    returnType: string,
    description?: string
}

export type PropsType = {
    name: string,
    optional: boolean,
    readonly: boolean,
    type: null | string | string[],
    default: string,
    description?: string
}

export function ApiDocView(props: {
    title: string,
    propColumns: PropsType[],
    slotColumns: SlotsOrEmitsType[],
    emitColumns: SlotsOrEmitsType[],
    onPropNameClick?: (prop: PropsType) => void,
    onSlotNameClick?: (prop: SlotsOrEmitsType) => void,
    onEmitNameClick?: (prop: SlotsOrEmitsType) => void,
}) {
    const el = ref<HTMLElement>()

    const toast = useToast();
    const { y } = useScroll(el)

    const yPercent = computed(() => {
        if (!el.value) {
            return 100
        }

        if (el.value.scrollHeight < window.innerHeight) {
            return 100
        }

        return Number(((y.value + window.innerHeight) / el.value?.scrollHeight! * 100).toFixed(2))
    })

    return vine`
        <div class="api-doc" ref="el">
            <Toast />
            <div class="api-doc-header">
                <Tag v-if="title" class="!text-lg">{{title}}</Tag>
                <ProgressBar :value="yPercent" :showValue="false"></ProgressBar>
            </div> 

            <Accordion value="0">
                <AccordionPanel value="0">
                    <AccordionHeader>Props</AccordionHeader>
                    <AccordionContent>
                        <DataTable :value="propColumns">
                            <Column
                                field="name"
                                header="name"
                            >
                                <template #body="slotProps">
                                    <Tag
                                        v-tooltip="slotProps.data.description"
                                        class="!cursor-pointer"
                                        severity="primary"
                                        @click="onPropNameClick(slotProps.data)"
                                    >
                                        {{ slotProps.data.name }}
                                    </Tag>
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
                        </DataTable>
                    </AccordionContent>
                </AccordionPanel>
                <AccordionPanel value="1">
                    <AccordionHeader>Slots</AccordionHeader>
                    <AccordionContent>
                        <DataTable :value="slotColumns">
                            <Column
                                field="name"
                                header="name"
                            >
                                <template #body="slotProps">
                                    <Tag
                                        v-tooltip="slotProps.data.description"
                                        severity="primary"
                                        @click="onSlotNameClick(slotProps.data)"
                                    >{{ slotProps.data.name }}</Tag>
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
                        </DataTable>
                    </AccordionContent>
                </AccordionPanel>
                <AccordionPanel value="2">
                    <AccordionHeader>Emits</AccordionHeader>
                    <AccordionContent>
                        <DataTable :value="emitColumns">
                            <Column
                                field="name"
                                header="name"
                            >
                                <template #body="slotProps">
                                    <Tag
                                        v-tooltip="slotProps.data.description"
                                        severity="primary"
                                        @click="onEmitNameClick(slotProps.data)"
                                    >{{ slotProps.data.name }}</Tag>
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
                        </DataTable>
                    </AccordionContent>
                </AccordionPanel>
            </Accordion>
        </div>
    `
}