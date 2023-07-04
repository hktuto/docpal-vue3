<script setup lang="ts">

const { status, result, mineType, ext, host, ready, checkOffice } = useOffice()
const {externalEndpoint} = useSetting()


onMounted(() => {
  checkOffice()
})

function openUrl(){
  console.log("openUrl", externalEndpoint.value.docpal, result.value.path)
  console.log(`https://${externalEndpoint.value.docpal}/browse?path=${result.value.path}`)
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
    <div v-else>
      Loading
    </div>
  </NuxtLayout>
</template>

<style scoped lang="scss">
.contentContainer{
  padding: calc(var(--app-padding) * 2 );
}
</style>