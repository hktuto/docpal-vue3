<script setup lang="ts">
const props = defineProps<{
  row: any[],
  column: Table.Column[],
}>();
const emits = defineEmits(['row-contextmenu', 'selection-change', 'row-click', 'row-dblclick', 'cell-click', 'sort-change', 'expand-change'])
</script>

<template>
  <div class="cardContainer"
    @click="(event) => $emit('row-click', row , column, event)"
    @dblclick="(event) => $emit('row-dblclick', row , column, event)"
    @contextmenu="(event) => $emit('row-contextmenu', row , column, event)"
  >
    <slot />
  </div>
</template>

<style scoped lang="scss">
.cardContainer{
  border-radius: var(--app-padding);
  background: var(--color-grey-0000);
  padding: var(--app-padding);
  border:1px solid var(--color-grey-050);
  box-shadow: 0 2px 5px rgba(0,0,0,.2);
  position: relative;
  width: 100%;
  :deep {
    .cardContent + .cardContent {
      border-top: 1px solid var(--color-grey-050);
    }
  }
}
</style>
