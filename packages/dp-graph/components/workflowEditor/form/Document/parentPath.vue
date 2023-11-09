<script lang="ts" setup>
  
  import formJson from '../../../../assets/formJson/pathSelector.json'
  const FromRendererRef = ref()
  
  const props = defineProps<{
    modelValue: any,
  }>();
  



  onMounted(() => {
    nextTick( () => {
      FromRendererRef.value.vFormRenderRef.setFormData({
        modelValue: props.modelValue
      })
    })
  })
  
  
</script>

<template>
  <FromRenderer ref="FromRendererRef" :form-json="formJson" >
    <template v-slot:tableForm>
      
    </template>
  </FromRenderer>
</template>

<style scoped lang="scss">

</style>