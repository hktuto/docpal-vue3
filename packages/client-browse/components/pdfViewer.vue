<template>
    <div class="contentContainer" v-loading="loading">
        <iframe ref="iframe" :src="pdfReaderUrl" allowfullscreen />
    </div>
</template>

<script lang="ts" setup>
import {GetDocumentPreview, GetAnnotation, SaveAnnotation} from 'dp-api'
import {useI18n} from 'vue-i18n';
import { useEventListener } from '@vueuse/core'

const props = defineProps<{
    doc: any
}>()

const iframe = ref<HTMLIFrameElement>();
const {public:{pdfReaderUrl}} = useRuntimeConfig();
const loading = ref(false);
// const colorMode = useColorMode();
const {locale} = useI18n()

async function getAnnotation():Promise<Object> {
    const annotation = await GetAnnotation(props.doc.id )
    console.log(annotation);
    let annotationObj = []
    if(annotation.length > 0) {
        if(annotation[0].object.paths) {
            annotationObj = Array.isArray(JSON.parse(annotation[0].object.paths)) ? JSON.parse(annotation[0].object.paths) : []
        }
    }
    console.log(annotationObj);
    const annotationMap = new Map();
    annotationObj.forEach((item:any) => {
        annotationMap.set(item.id, item);
    });
    return annotationMap;
}

async function sendPdfAndAnnotation() {
    loading.value = true;
    try {
        const blob = await GetDocumentPreview(props.doc.id);
        const annotations = await getAnnotation()
        const frame = iframe.value?.contentWindow;
        frame?.postMessage({blob, filename: props.doc.name, annotations, locale: locale.value, }, '*');
    } catch (error) {
        console.log(error);
    }
    loading.value = false;
}

function gotMessageFromIframe(message:MessageEvent) {
    console.log(message.data.type);
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
            break;
    }

}

async function saveAnnotation(annotation:Map<string, object>) {
    //return if annotation is empty
    if(!annotation || annotation.size === 0) return;

    // convert Map to array of objects
    const paths:any[] = [];
    annotation.forEach((value:any, key:any) => {
      paths.push({id: key, ...value});
    });
    const param = {
        documentIdOrPath: props.doc.id,
        object: {
            paths: JSON.stringify(paths)
        },
        comments: []
    }
    await SaveAnnotation([param])
    //  TODO : show notification
    console.log("Annotation saved successfully");

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
