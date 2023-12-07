<script setup lang="ts">
import {Field} from "~/components/Chevalier/chevalierType";

const props = defineProps<{
  field: Field
}>()
function selectField() {
  const ev = new CustomEvent('draw-step', {detail: props.field})
  document.dispatchEvent(ev)
}
</script>

<template>
  <ElInputNumber v-model="field.valueNumber" controls-position="right" @click="selectField"/>
</template>

<style scoped lang="scss">
.el-input-number{
  width:100%;
  :deep{
    .el-input__inner{
      text-align: left;
    }
  }
}
</style>
