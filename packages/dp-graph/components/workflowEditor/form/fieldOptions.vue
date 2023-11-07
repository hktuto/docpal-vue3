
<script lang="ts" setup>
import {fieldOptions, FormObject} from "../../../utils/formEditorHelper";

  const props = defineProps<{
    field: FormObject
  }>();
  const formEl = ref();
  const formField = ref({
    attr_field_label: props.field.attr_field_label || props.field.attr_name,
    attr_field_type: props.field.attr_field_type,
    attr_field_required: props.field.attr_field_required,
    attr_field_writable: props.field.attr_field_writable,
    attr_field_hidden: props.field.attr_field_hidden || false,
    attr_field_disabled: props.field.attr_field_disabled || false,
    ...props.field
  })
  const emit = defineEmits(['close', 'submit'])
  const rules = {
    attr_field_label: [
      { required: true, message: 'Please input field label', trigger: 'blur' },
    ],
    attr_field_type: [
      { required: true, message: 'Please select required', trigger: 'blur' },
    ],
  };
  function saveField(){
    formEl.value.validate((valid) => {
      if(!valid) return;
      emit('submit', formField.value)
      emit('close')
    })
  }
  
</script>

<template>
  
      <ElForm ref="formEl" :model="formField" :rules="rules" label-position="top">
        <ElFormItem label="Field label" prop="attr_field_label">
          <ElInput v-model="formField.attr_field_label" />
        </ElFormItem>
        <div class="row">
          
          <ElFormItem label="Required" prop="attr_field_required">
            <ElSwitch v-model="formField.attr_field_required" />
          </ElFormItem>
          <ElFormItem label="Writable" prop="attr_field_writable">
            <ElSwitch v-model="formField.attr_field_writable" />
          </ElFormItem>
          <ElFormItem label="Hidden" prop="attr_field_hidden">
            <ElSwitch v-model="formField.attr_field_hidden" />
          </ElFormItem>
          <ElFormItem label="Disabled" prop="attr_field_disabled">
            <ElSwitch v-model="formField.attr_field_disabled" />
          </ElFormItem>
        </div>
        <ElFormItem label="Input Type" prop="attr_field_type">
          <ElSelect v-model="formField.attr_field_type" placeholder="Select input type">
            <ElOption v-for="(value, key) in fieldOptions" :key="key" :label="value.label" :value="key" />
          </ElSelect>
        </ElFormItem>
        <ElDivider />
      </ElForm>
  
    <ElButton @click="$emit('close')">Close</ElButton>
    <ElButton type="primary" @click="saveField">Save</ElButton>
</template>

<style scoped lang="scss">
.row{
  display: flex;
  flex-flow: row nowrap;
  gap: var(--app-padding);
}
:deep(.el-select) {
  width: 1100%;
}
</style>