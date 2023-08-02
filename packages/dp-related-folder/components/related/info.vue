<script setup lang="ts">
import { useRelatedFolder } from '~/composables/relatedFolder';

const props = defineProps<{
  detail: any,
  permission: any,
}>()

const emit = defineEmits(['show-relate', 'hide-relate'])

const {doc, relatedChildren,} = useRelatedFolder();

function openMap() {
  const ev = new CustomEvent('show-relate-map',{detail:{
    doc: props.detail,
    permission: props.permission
  }})
  document.dispatchEvent(ev)
}

watch(() => props.detail, (val) => {
  doc.value = val
},{
  immediate: true
})


</script>

<template>
  <div id="relatedInfoContainer">
    
    <div class="header">
      <!-- <div v-if="relatedChildren.length > 0" class="action" @click="openMap">
        {{ $t('related_view_map') }}
        <SvgIcon src="/icons/map.svg" />
      </div> -->
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
.header {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  .action {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
    color: var(--color-grey-600);
    font-size: 0.8rem;
    &:hover {
      color: var(--primary-color);
    }
  }
}
</style>