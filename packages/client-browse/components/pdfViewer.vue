<template>
    <div class="contentContainer" v-loading="loading">
        <iframe ref="iframe" :src="pdfReaderUrl" allowfullscreen />
    </div>
</template>

<script lang="ts" setup>
import { GetDocumentPreview, GetAnnotation } from 'dp-api'
import {useI18n} from 'vue-i18n';
import { useEventListener } from '@vueuse/core'
const props = defineProps<{
    doc: object
}>()

const iframe = ref<HTMLElement>();
const {public:{pdfReaderUrl}} = useRuntimeConfig();
const loading = ref(false);
// const colorMode = useColorMode();
const {locale} = useI18n()

async function getAnnotation():Promise<Object> {
    const annotation = await GetAnnotation(props.doc.id )
    let annotationObj = {}
    if(annotation.length > 0) {
        if(annotation[0].object.paths) {
            annotationObj = JSON.parse(annotation[0].object.paths)
        }
    }
    return annotationObj;
}

async function sendPdfAndAnnotation() {
    loading.value = true;
    try {
        const blob = await GetDocumentPreview(props.doc.id);
        const annotations = await getAnnotation()
        const frame = iframe.value.contentWindow;
        const sendMessage = frame.postMessage({blob, filename: props.doc.name, annotations, locale: locale.value, }, '*'); 
    } catch (error) {
        console.log(error);
    }
    loading.value = false;
}

function gotMessageFromIframe(message:MessageEvent) {
    const { data } = message;
    if(!data) return;

    if(data.type === 'ready' ) {
        sendPdfAndAnnotation()
    }
}

useEventListener(window, 'message', gotMessageFromIframe)

</script> 

<style lang="scss" scoped>
.contentContainer{
     width: 100%;
    max-width: 800px;
    height: 100%;
    margin: 0 auto;
    background: #fff;
    border-radius: 12px;
    overflow: hidden;
}
iframe {
        width: 100%;
        height: 100%;
        border: none;
    }
</style>