<script setup lang="ts">
const props = defineProps<{
  detail: any,
  doc: any
}>()

const emit = defineEmits(['show-relate', 'hide-relate'])
const viewType = ref<'TABLE' | 'MAP'>('TABLE')





watch(() => props.detail, (val) => {
  if(val) {
    getRelated()
  }
},{
  immediate: true
})


</script>

<template>
  <div id="relatedInfoContainer">
    {{detail}}
  </div>
</template>

<style scoped lang="scss">


</style>