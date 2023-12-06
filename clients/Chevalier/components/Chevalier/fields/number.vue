<script setup lang="ts">
import {Field} from "~/components/Chevalier/chevalierType";

const props = defineProps<{
  field: Field
  type: string
}>()
</script>

<template>
  <ElInput type="type" :value="field.content" />
</template>

<style scoped lang="scss">

</style>
