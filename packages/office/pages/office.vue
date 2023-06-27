<script setup lang="ts">
import {useUpload} from "~/compositbles/upload";

const { status, result, mineType, ext } = useUpload()
const {externalEndpoint} = useSetting()
const host = ref();
const ready = ref(false);

const checkReadyInterval = ref();

function initOffice() {
  Office.onReady((info:any) => {
    host.value = info.host;
    if(info.host === Office.HostType.Word){
     mineType.value = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ext.value = '.docx'
    }
    if(info.host === Office.HostType.Excel){
      mineType.value = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      ext.value = '.xlsx'
    }
    if(info.host === Office.HostType.PowerPoint){
      mineType.value = 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
      ext.value = '.pptx'
    }
    
    ready.value = true;
  })
}
onMounted(() => {
  initOffice();
    checkReadyInterval.value = setInterval(() => {
      if(ready.value){
        clearInterval(checkReadyInterval.value)
      }else {
        initOffice();
      }
    }, 500)
  })

function openUrl(){
  window.open(`https://${externalEndpoint.value.docpal}/browse?path=${result.value.path}`, '_blank');
}

function close(){
  try{
    status.value = 'NOT_STARTED'
  }catch(err){

  }
}


</script>

<template>
  <NuxtLayout  name="addin" :pageTitle="host">
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