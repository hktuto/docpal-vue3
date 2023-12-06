<script setup lang="ts">
import {Field} from "~/components/Chevalier/chevalierType";

const props = defineProps<{
  field: Field
}>()
</script>

<template>
  <ElInputNumber :model-value="field.valueNumber" controls-position="right"/>
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
