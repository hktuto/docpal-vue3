<script setup lang="ts">

const state = ref<'Upload' | 'info'>('Upload');

onMounted(() => {
  Office.onReady(() => {
    wordInit()
  })
})

function wordInit() {
  console.log("wordInit")
}
</script>

<template>
  <NuxtLayout name="addin" pageTitle="Word">
    <div class="contentContainer">
      
      <OfficeAddinUpload />
    </div>
  </NuxtLayout>
</template>

<style scoped lang="scss">
.contentContainer{
  padding: calc(var(--app-padding) * 2 );
}
</style>