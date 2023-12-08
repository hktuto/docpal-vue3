<script setup lang="ts">
import {Field} from "~/components/Chevalier/chevalierType";

const props = defineProps<{
  field: Field
}>()
function selectField() {
  const ev = new CustomEvent('draw-step', {detail: props.field})
  document.dispatchEvent(ev)
}
const emit = defineEmits(['update:field'])

const displayValue = computed({
  get() {
    if(props.field && props.field.valueNumber) {
      return props.field.valueNumber
    }
    console.log(props.field)
    return {
      valueNumber:0
    }
  },
  set(value) {
    if(!props.field) {
      props.field = {
        valueNumber: value
      }
    }else{
      props.field.valueNumber = value
    }
    emit('update:field', props.field)
  }
})
</script>

<template>
  <ElInputNumber v-model="displayValue" controls-position="right" @click="selectField"/>
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
