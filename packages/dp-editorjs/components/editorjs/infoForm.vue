<script setup lang="ts">
const formEl = ref()
const props = defineProps<{
  data: any;
}>();
const rules = {
  label: [
    { required: true, message: 'Please input label', trigger: 'blur' },
  ],
  subject: [
    { required: true, message: 'Please input subject', trigger: 'blur' },
  ],
};

function validate():Promise<boolean> {
  return new Promise((resolve, reject) => {
    formEl.value.validate((valid:boolean) => {
      if (valid) {
        resolve(true)
      } else {
        reject(false)
      }
    })
  })
}

defineExpose({
  validate,
})
</script>

<template>
  <div class="infoFormContainer">
    <ElForm ref="formEl" :model="data" class="form" label-position="top">
      <ElFormItem label="Label" required prop="label">
        <ElInput v-model="data.label"></ElInput>
      </ElFormItem>
      <ElFormItem label="Subject" required prop="subject">
        <ElInput v-model="data.subject"></ElInput>
      </ElFormItem>

      <ElFormItem label="To">
        <ElInput v-model="data.to"></ElInput>
      </ElFormItem>

      <ElFormItem label="CC">
        <ElInput v-model="data.cc"></ElInput>
      </ElFormItem>

      <ElFormItem label="BCC">
        <ElInput v-model="data.bcc"></ElInput>
      </ElFormItem>
    </ElForm>
    
  </div>
</template>

<style scoped lang="scss">

</style>