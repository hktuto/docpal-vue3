<script setup lang="ts">
  import {getOcrDocApi} from "dp-api";

  const props = defineProps<{
    doc: any
  }>()
  
  const hocrUrl = ref();
  
  async function getOcr():Promise<void> {
    try{
      const newBlob = await getOcrDocApi(props.doc.id)
      const urlCreator = window.URL || window.webkitURL
      const url = urlCreator.createObjectURL(newBlob)
      hocrUrl.value = url
    }catch(err) {
      hocrUrl.value = null;
    }
    
  }

  watch(
    () => props.doc,
    async (newDoc) => {
      if (newDoc.path) {
        await getOcr()
      }
    },
    {
      immediate: true,
    })
</script>

<template>
  <div class="ocrContainer">
    <iframe v-if="hocrFile" :src="hocrUrl" frameborder="0" width="100%" height="100%" ></iframe>
    <div v-else class="loadingContainer">
      no data
    </div>
  </div>
</template>

<style scoped lang="scss">

</style>