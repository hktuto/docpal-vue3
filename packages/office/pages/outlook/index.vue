<script setup lang="ts">
const { status, result, mineType, ext, host, ready, checkOffice } = useOffice()
const {externalEndpoint} = useSetting()

onMounted(() => {
  checkOffice()
})
</script>

<template>
  <NuxtLayout  name="addin" :pageTitle="host">
    <div v-if="ready" class="contentContainer">
    </div>
    <div v-else>
      Loading
    </div>
  </NuxtLayout>
</template>

<style scoped>

</style>