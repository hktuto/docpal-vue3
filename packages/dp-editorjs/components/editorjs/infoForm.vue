<script setup lang="ts">
const props = defineProps<{
  data: any;
}>();
</script>

<template>
  <div class="infoFormContainer">
    <ElForm class="form" label-position="top">
      <ElFormItem label="Label">
        <ElInput v-model="data.label"></ElInput>
      </ElFormItem>
      <ElFormItem label="Subject">
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