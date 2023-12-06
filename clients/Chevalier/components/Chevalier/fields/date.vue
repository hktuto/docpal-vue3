<script setup lang="ts">
import {Field} from "~/components/Chevalier/chevalierType";

const props = withDefaults(defineProps<{
  field?: Field
  type: string
}>(),{
  type: 'text'
})
</script>

<template>
  <ElInput :type="type" :value="field.content" />
</template>

<style scoped lang="scss">

</style>
