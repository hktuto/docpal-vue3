<template>
    <div class="browseDetailContainer">
        <div v-if="show" class="dialog">
            <div class="header">
                {{pdfReaderUrl}}
            </div>
            <div class="content">
                <iframe ref="iframe" :src="pdfReaderUrl" crossOrigin />
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { vOnKeyStroke } from '@vueuse/components'
import { onKeyStroke } from '@vueuse/core'

// get pdf reader url from env
const {public:{pdfReaderUrl}} = useRuntimeConfig();

const iframe = ref<HTMLElement>();
const props = defineProps<{
    doc: Object
    show: boolean
}>();
const {show} = toRefs(props);
const emit = defineEmits(['close'])
const { token } = useUser()


onKeyStroke("Escape", (e) => {
    if(props.show) {
        emit('close')
    }
})

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

async function sendTokenAndPath() {
    const blob = await GetDocumentPreview(props.doc.id);
    
    const annotations = await getAnnotation()
    
    const frame = iframe.value.contentWindow;
    frame.postMessage({blob, filename: props.doc.name, annotations}, '*')
}

function gotMessageFromIframe(message:MessageEvent) {
    const { data } = message;
    if(!data) return;

    if(data.type === 'ready' ) {
        sendTokenAndPath()
    }
}

onMounted(() => {
    window.addEventListener('message', gotMessageFromIframe, false)
})




</script>

<style lang="scss" scoped>
.dialog{
    position: fixed;
    left:0;
    top:0;
    width: 100vw;
    height: 100vh;
    z-index: 3;
    background-color: rgba(0,0,0,0.8);
    display: grid;
    grid-template-rows: min-content 1fr;
}
.header{
    min-height: 40px;;
}
.content{
    width: 100%;
    height: 100%;
    display: flex;
    place-items: center;
    padding: var(--el-component-size-small);
    iframe {
        width: 100%;
        max-width: 800px;
        height: 100%;
        margin: 0 auto;
        background: #fff;
        border-radius: 12px;
        overflow: hidden;
    }
}
</style>