<script setup lang="ts">
import {Field} from "~/components/Chevalier/chevalierType";

const props = withDefaults(defineProps<{
  field?: Field
}>(),{
})
function selectField() {
  const ev = new CustomEvent('draw-step', {detail: props.field})
  document.dispatchEvent(ev)
}
</script>

<template>
  <div @click="selectField">
    <ElDatePicker  :model-value="field.content" style="--el-date-editor-width:100%;" />
  </div>
</template>

<style scoped lang="scss">

</style>
