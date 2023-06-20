<script setup lang="ts">
import {useUpload} from "~/compositbles/upload";

const { status, result } = useUpload()
const {externalEndpoint} = useSetting()
const ready = ref(false);
onMounted(() => {
  console.log('mounted', Office)
  Office.onReady(() => {
    wordInit()
  })
})

function wordInit() {
  ready.value = true;
}

function openUrl(){
  window.open(`${externalEndpoint.value.docpal}/browse?path=${result.value.path}`);
}

function close(){
  try{
    status.value = 'NOT_STARTED'
  }catch(err){
    
  }
}
</script>

<template>
  <NuxtLayout name="addin" pageTitle="Word">
    <div v-if="ready" class="contentContainer">
      
      <OfficeAddinUpload v-if="status === 'NOT_STARTED'" />
      <div v-if="status === 'UPLOADING'">
        loading
      </div>
      <div v-if="status === 'SUCCESS'" class="SUCCESS">
        <h1>Success</h1>
        <el-button @click="openUrl">Open in Docpal</el-button>
        <el-button @click="close">Back</el-button>
      </div>
    </div>
    
  </NuxtLayout>
</template>

<style scoped lang="scss">
.contentContainer{
  padding: calc(var(--app-padding) * 2 );
}
</style>