<script setup lang="ts">
import {Field} from "~/components/Chevalier/chevalierType";

const props = withDefaults(defineProps<{
  field?: Field
}>(),{
})
</script>

<template>
  <ElDatePicker  :model-value="field.content" style="--el-date-editor-width:100%;" />
</template>

<style scoped lang="scss">

</style>
