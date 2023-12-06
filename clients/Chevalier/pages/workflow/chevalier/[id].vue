<script setup lang="ts">
const state = reactive({
  batchIndex: 0
})
</script>

<template>
  <NuxtLayout class="fit-height withPadding ">
    <div class="chevalierContainer">
      <div class="left">
        <div class="header">
            <h1>Batch Index: {{state.batchIndex}}</h1>
        </div>
        <div class="formContainer">

        </div>
      </div>
      <div class="right">
        <div class="previewContainer">

        </div>
      </div>
    </div>
  </NuxtLayout>
</template>

<style scoped lang="scss">
.chevalierContainer{
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--app-padding);
}
</style>
