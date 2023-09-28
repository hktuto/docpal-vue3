<script setup lang="ts">
  import {api} from "dp-api";

  const props = defineProps<{
    options:any,
    data:any,
    variables:any
  }>();
  const { variables } = toRefs(props);
  
  const testForm = ref({
    to: '',
    templateId: props.data.id,
    variables: props.variables.reduce((acc:any, cur:any) => {
      acc[cur] = '';
      return acc;
    }, {})
  })
  
  async function send() {
    console.log(testForm.value)
    const res = await api.post('/docpal/template/email/send', testForm.value);
  }
  
  defineExpose({
    send
  })
  
  
</script>

<template>
  <div class="dialogContentContainer">
    <div class="form">
        <ElForm :data="testForm" label-position="top">
          <ElFormItem label="To">
            <ElInput v-model="testForm.to"></ElInput>
          </ElFormItem>
          <ElFormItem v-for="item in variables" :label="item" :key="item">
            <ElInput v-model="testForm.variables[item]"></ElInput>
          </ElFormItem>
        </ElForm>
    </div>
      
  </div>
 
</template>

<style scoped lang="scss">
.dialogContentContainer{
  
}
</style>