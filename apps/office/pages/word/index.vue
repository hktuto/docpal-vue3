<script setup lang="ts">

const state = ref<'Upload' | 'info'>('Upload');
const ready = ref(false);
onMounted(() => {
  Office.onReady(() => {
    wordInit()
  })
})

function wordInit() {
  ready.value = true;
}
</script>

<template>
  <NuxtLayout name="addin" pageTitle="Word">
    <div v-if="ready" class="contentContainer">
      <OfficeAddinUpload />
    </div>
  </NuxtLayout>
</template>

<style scoped lang="scss">
.contentContainer{
  padding: calc(var(--app-padding) * 2 );
}
</style>