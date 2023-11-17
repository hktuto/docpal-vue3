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
    const body = testForm.value;
    // loop variables in body , and replace /n with <br>
    Object.keys( body.variables).forEach((key) => {
      // remove line break to <br/>
      body.variables[key] = body.variables[key].replace(/(?:\r\n|\r|\n)/g, '<br/>');
    })
    console.log(body)
    const res = await api.post('/docpal/template/email/send', body);
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
            <ElInput type="textarea" v-model="testForm.variables[item]"></ElInput>
          </ElFormItem>
        </ElForm>
    </div>
      
  </div>
 
</template>

<style scoped lang="scss">
.dialogContentContainer{
  
}
</style>