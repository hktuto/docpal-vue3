<template>
    <div class="contentContainer" v-loading="loading">
        <iframe ref="iframe" :src="pdfReaderUrl" allowfullscreen />
    </div>
</template>

<script lang="ts" setup>
import {GetDocumentPreview, GetAnnotation, SaveAnnotation} from 'dp-api'

import { useEventListener } from '@vueuse/core'
type PdfJsOptions = {
    print: boolean,
    loadAnnotations: boolean,
}
const props = withDefaults(defineProps<{
    doc?: any,
    options: PdfJsOptions
}>(),{
    options:{
        print: false,
        loadAnnotations: false,
    }
})

const iframe = ref<HTMLIFrameElement>();
const {public:{pdfReaderUrl}} = useRuntimeConfig();
const loading = ref(false);
// const colorMode = useColorMode();
const {locale} = useI18n()
const { options } = toRefs(props)

async function getAnnotation():Promise<Object> {
    dpLog(props.options.loadAnnotations)
    if(!props.options.loadAnnotations) return new Map();
    const annotation = await GetAnnotation(props.doc.id);
    let annotationObj = []
    if(annotation.length > 0) {
        if(annotation[0].object.paths) {
            annotationObj = Array.isArray(JSON.parse(annotation[0].object.paths)) ? JSON.parse(annotation[0].object.paths) : []
        }
    }
    const annotationMap = new Map();
    annotationObj.forEach((item:any) => {
        annotationMap.set(item.id, item);
    });
    return annotationMap;
}

async function sendPdfAndAnnotation() {
    if(props.doc.isFolder) return; // 如果是文件夹，不要拿预览
    loading.value = true;
    try {
        const blob = await GetDocumentPreview(props.doc.id);
        const annotations = await getAnnotation()
        const frame = iframe.value?.contentWindow;
        dpLog(annotations)
        frame?.postMessage({blob, filename: props.doc.name, annotations, locale: locale.value, options: props.options }, '*');
    } catch (error) {
        dpLog(error);
    }
    loading.value = false;
}

function gotMessageFromIframe(message:MessageEvent) {
    dpLog(message)
    const { data:{ data, type} } = message;
    if(!data && !type ) return;
    switch(type) {
        case 'ready':
            sendPdfAndAnnotation()
            break;
        case 'annotation':
            saveAnnotation(data)
            break;
        default:
            break;
    }

}

async function saveAnnotation(annotation:Map<string, object>) {
    //return if annotation is empty

    // convert Map to array of objects
    const paths:any[] = [];
    const comments = [];

    annotation.forEach((value:any, key:any) => {
        if(value.annotationType === 3){
            comments.push({text:value.value});
          }
      paths.push({id: key, ...value});
    });
    const param = {
        documentIdOrPath: props.doc.id,
        object: {
            paths: JSON.stringify(paths)
        },
        comments
    }
    await SaveAnnotation([param])
    //  TODO : show notification
    dpLog("Annotation saved successfully");

}

useEventListener(window, 'message', gotMessageFromIframe)

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
iframe {
        width: 100%;
        height: 100%;
        border: none;
    }
</style>
