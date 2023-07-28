<script setup lang="ts">
import { useRelatedFolder } from '~/composables/relatedFolder';

const props = defineProps<{
  detail: any
}>()

const emit = defineEmits(['show-relate', 'hide-relate'])
const viewType = ref<'TABLE' | 'MAP'>('TABLE')

const {doc, relatedChildren,} = useRelatedFolder();



watch(() => props.detail, (val) => {
  doc.value = val
},{
  immediate: true
})


</script>

<template>
  <div id="relatedInfoContainer">
    
    <div class="header">

    </div>
    <div class="content">
      <RelatedTable v-for="item in relatedChildren" :key="item.id" :data="item"></RelatedTable>
    </div>
  </div>
</template>

<style scoped lang="scss">
#relatedInfoContainer{
  height: 100%;
  display: grid;
  grid-template-rows: min-content 1fr;
  gap: var(--app-padding);
  .content{
    overflow: auto;
  }
}

</style>