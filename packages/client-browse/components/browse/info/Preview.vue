<script setup lang="ts">
import {DocumentThumbnailGetApi} from 'dp-api';
const props = defineProps<{
  doc: any
}>()
const previewUrl = ref("");
async function getPreview(){
  if(props.doc.isFolder) {
    previewUrl.value = "/icons/folder-normal.svg"
    return
  }
  const blob = await DocumentThumbnailGetApi(props.doc.id)
  if (blob) {
    const urlCreator = window.URL || window.webkitURL;
    previewUrl.value = urlCreator.createObjectURL(blob)
  }else {
    previewUrl.value = "/icons/file-normal.svg"
  }
}

watch(() => props.doc, () => {
  getPreview()
}, {immediate: true})
</script>

<template>
  <div class="previewContainer">
    <img v-if="previewUrl"  :src="previewUrl" />
  </div>
</template>

<style scoped lang="scss">
.previewContainer{
  aspect-ratio: 1 /1;
  max-width: 100%;
  height: 100%;
  max-height: 200px;
  margin: 0 auto;
  // border: 1px solid var(--color-grey-400);
  background: #fff;
  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
}
</style>
