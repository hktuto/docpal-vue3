<script setup lang="ts">
import { PDFDocument, rgb, degrees } from 'pdf-lib'
import { onMounted, reactive, ref } from 'vue';
import {useEventListener} from "@vueuse/core";
import {Content} from "./chevalierType";
const props = defineProps<{
  data: any
}>()
const pageImage = ref("");
const iframe = ref();
const {data} = toRefs(props)
const pdfLib = ref();
const canvas = ref(null)
const ready = ref(false)
const currentPage = ref(0);
const sourcePdf = ref();

async function loadPdf() {
  
  // load pdf blob from server
  sourcePdf.value = await fetch(data.value.pdf).then(r => r.arrayBuffer())
  pdfLib.value = await PDFDocument.load(sourcePdf.value)
  
  pageImage.value =  await pdfLib.value.saveAsBase64({ dataUri: true });

}

async function draw(step:Content) {
  if(!step || !step.boundingRegions) return;
  pdfLib.value = await PDFDocument.load(sourcePdf.value)
  const boundary = step.boundingRegions[0]
  const pageNumber = boundary.pageNumber -1;
  
  const pdfPage = await pdfLib.value.getPage(pageNumber);
  const pageSize = pdfPage.getSize()
  const {x, y, width, height} = polygonToXYWH(boundary.polygon, pageSize);

  pdfPage.drawRectangle({x, y, width, height,   color: rgb(1, 1, 0),opacity:0.3 })
  pageImage.value =  await pdfLib.value.saveAsBase64({ dataUri: true });
}

function polygonToXYWH (polygon:number[], sizeInPixel: { width: number; height: number; }) {
  // get page in inch
  const {width, height} = props.data.json.analyzeResult.pages[currentPage.value];
  // convert to pixel
  // convert anchor from bottom left to top left
  const [x1, y1, x2, y2, x3, y3, x4, y4] = getXYPercentage({width, height}, polygon, sizeInPixel)

  return {
    x: x1 - 2,
    y: y1 + 4,
    width: (x2 - x1) + 4 ,
    height: (y4 - y1) - 8
  }
  
}
function getXYPercentage({width, height}, polygon:number[], pixelSize: { width: number; height: number; }) {
  return [
    pixelSize.width * (polygon[0] / width),
    pixelSize.height * (1 - polygon[1] / height),
    pixelSize.width * (polygon[2] / width),
    pixelSize.height *(1 - polygon[3] / height),
    pixelSize.width * (polygon[4] / width),
    pixelSize.height *(1 - polygon[5] / height),
    pixelSize.width * (polygon[6] / width),
    pixelSize.height *(1 - polygon[7] / height)
  ]
}


defineExpose({
  draw
})

useEventListener(document, 'draw-step', (e) => {
  draw(e.detail)
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
