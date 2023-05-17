<script setup lang="ts">
import {DocumentThumbnailGetApi} from 'dp-api';
const props = defineProps<{
  doc: any
}>()
const previewUrl = ref("");
async function getPreview(){
  const blob = await DocumentThumbnailGetApi(props.doc.id)
  if (blob) {
    const urlCreator = window.URL || window.webkitURL;
    previewUrl.value = urlCreator.createObjectURL(blob)
  }
}

watch(() => props.doc, () => {
  getPreview()
}, {immediate: true})
</script>

<template>
  <div class="previewContainer">
    <img v-if="!doc.isFolder" :src="previewUrl" />
  </div>
</template>

<style scoped lang="scss">
.previewContainer{
  aspect-ratio: 1 /1;
  max-width: 100%;
  height: 100%;
  max-height: 200px;
  margin: 0 auto;
  border: 1px solid var(--color-grey-400);
  background: var(--color-grey-0000);
  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
}
</style>
