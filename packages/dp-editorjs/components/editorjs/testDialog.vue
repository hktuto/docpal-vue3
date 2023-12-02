<script setup lang="ts">
  import {api} from "dp-api";
  import {useEditor} from "~/composables/useEditorjs";

  const props = defineProps<{
    options:any,
    data:any,
  }>();
  const {variables} = useEditor()
  
  const testForm = ref({
    to: '',
    templateId: props.data.id,
    variables: variables.value.reduce((acc:any, cur:any) => {
      acc[cur] = '';
      return acc;
    }, {})
  })
  
  const displayVariables = computed(() => {
    // if item contain ',' , that mean it a array
    //TODO need backend support array,, skip from now
    return variables.value.filter((item:any) => {
      return !item.includes(',')
    })
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
          <ElFormItem v-for="item in displayVariables" :label="item" :key="item">
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