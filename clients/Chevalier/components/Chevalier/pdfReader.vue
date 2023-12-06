<script setup lang="ts">

import { onMounted, reactive, ref } from 'vue';
import {useEventListener} from "@vueuse/core";
const props = defineProps<{
  data: any
}>()
const {public:{pdfReaderUrl}} = useRuntimeConfig();
const iframe = ref();
const {data} = toRefs(props)
const docs = ref();
const canvas = ref(null)
const ready = ref(false)
const currentPage = ref(1)

async function loadPdf() {
  
  // load pdf blob from server
  console.log(data.value)
  const blob = await fetch(data.value.pdf).then(r => r.blob())
  const frame = iframe.value?.contentWindow;
  frame?.postMessage({blob:blob, filename: props.data.name, annotations:[], locale: 'en-US', options: {
      print: false,
      loadAnnotations: true,
      readOnly: false
    }, actions:{
      rotate: 90
    } }, '*');

}

function gotMessageFromIframe(message:MessageEvent) {
  const { data:{ data, type} } = message;
  if(!data && !type ) return;
  switch(type) {
    case 'ready':
      loadPdf()
      break;
    case 'annotation':
      // ignore
      break;
    default:
      break;
  }

}

useEventListener(window, 'message', gotMessageFromIframe)

defineExpose({

})

watch(data, () => {
  ready.value = false
  if(data.value){
    nextTick(() => {
      ready.value = true
    })
  }
},{
  immediate: true
})


</script>

<template>
  <div class="viewerContainer">
    <iframe v-if="ready" ref="iframe" :src="pdfReaderUrl" allowfullscreen />
  </div>
</template>

<style scoped lang="scss">
.viewerContainer{
  width:100%;
  height: 100%;
  display: block;
  position: relative;
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
