<template>
    <div class="iframeContainer" >
        <iframe ref="iframe" :src="pdfReaderUrl" allowfullscreen />
    </div>
</template>

<script lang="ts" setup>
import {useI18n} from 'vue-i18n';
import { useEventListener } from '@vueuse/core'
const props = defineProps<{
    annotations: Array,
    blob: Blob,
    name: String
}>()

const iframe = ref<HTMLElement>();
const { public:{ pdfReaderUrl } } = useRuntimeConfig();
const { locale } = useI18n()
async function sendPdfAndAnnotation() {
    const frame = iframe.value.contentWindow;
    const sendMessage = frame.postMessage({ 
        blob:props.blob, 
        filename: props.name, 
        annotations: props.annotations, 
        locale: locale.value, 
    }, '*'); 
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