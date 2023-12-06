<script setup lang="ts">
import { PDFDocument } from 'pdf-lib'
import { onMounted, reactive, ref } from 'vue';
import {useEventListener} from "@vueuse/core";
const props = defineProps<{
  data: any
}>()
const {public:{pdfReaderUrl}} = useRuntimeConfig();
const pageImage = ref("");
const iframe = ref();
const {data} = toRefs(props)
const pdfLib = ref();
const canvas = ref(null)
const ready = ref(false)
const currentPage = ref(1)

async function loadPdf() {
  
  // load pdf blob from server
  const buffer = await fetch(data.value.pdf).then(r => r.arrayBuffer())
  pdfLib.value = await PDFDocument.load(buffer)
  
  pageImage.value =  await pdfLib.value.saveAsBase64({ dataUri: true });

}

async function draw(polygon:number[], pageNumber:number = 1, pageSize:number[], rotate:number) {
  const pdfPage = await pdfLib.value.getPage(pageNumber)
  
  
}


defineExpose({
  draw
})

watch(data, () => {
  if(data.value){
    loadPdf()
  }
},{
  immediate: true
})


</script>

<template>
  <div class="viewerContainer">
    <iframe  ref="iframe" :src="pageImage" allowfullscreen />
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
