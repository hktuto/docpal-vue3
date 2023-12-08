<script setup lang="ts">
import {Field} from "~/components/Chevalier/chevalierType";

const props = withDefaults(defineProps<{
  field?: Field
  type: string
}>(),{
  type: 'text'
})
const emit = defineEmits(['update:field'])
const displayField = computed({
  set(value){
    if(!props.field|| !props.field.content) {
      props.field = {
        content: value
      }
    }else{
      props.field.content = value
    }
    emit('update:field',  props.field)
  },
  get(){
    if(props.field){
      return props.field
    }
    return {
      content:""
    }
  }
})


function selectField() {
  const ev = new CustomEvent('draw-step', {detail: props.field})
  document.dispatchEvent(ev)
}
</script>

<template>
  <ElInput :type="type" v-model="displayField.content" @click="selectField"/>
</template>

<style scoped lang="scss">

</style>
