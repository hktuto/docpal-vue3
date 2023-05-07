<template>
    <div class="iframeContainer" >
        <iframe ref="iframe" :src="pdfReaderUrl" allowfullscreen />
    </div>
</template>

<script lang="ts" setup>

import { useEventListener } from '@vueuse/core'
const props = defineProps<{
    annotations: Map<string,any>,
    blob: Blob,
    name: String
}>()

const { annotations, blob, name } = toRefs(props)

const readerReady = ref(false);

const iframe = ref<HTMLIFrameElement>();
const { public:{ pdfReaderUrl } } = useRuntimeConfig();
const { locale } = useI18n()
const colorMode = useColorMode();

const emits = defineEmits(['saveAnnotation'])

async function sendPdfAndAnnotation() {
    readerReady.value = true;
    // return if no blob
    if(!props.blob) return;
    const frame = iframe.value?.contentWindow;
    
    // return if no contentWindow
    if(!frame) return;
    const message = {
        blob:props.blob,
        filename: props.name,
        annotations: new Map(props.annotations),  
        locale: locale.value
    }
    dpLog("frame",message);
    frame.postMessage(message, '*');
}  


function gotMessageFromIframe(message:MessageEvent) {
    const { data } = message;
    if(!data) return;

    switch(data.type) {
        case 'ready':
            sendPdfAndAnnotation()
            break;
        case 'annotation':
            saveAnnotation(data.data)
            break;
        default:
            break
    };
    
}
function saveAnnotation(annotation:Map<string,any>) {
    // this function is called when the user clicks the save button on the annotation form
    // we send the annotation data to the server
    emits("saveAnnotation",annotation)
}
useEventListener(window, 'message', gotMessageFromIframe)

watch(blob, () => {sendPdfAndAnnotation()});
</script>

<style lang="scss" scoped>
.contentContainer{
    width: 100%;
    height: 100%;
    margin: 0 auto;
    background: #fff;
    border-radius: 12px;
    overflow: hidden;
}
.iframeContainer{
    width: 100%;
    height: 100%;
    margin: 0 auto;
}
iframe {
        width: 100%;
        height: 100%;
        border: none;
    }
</style>
