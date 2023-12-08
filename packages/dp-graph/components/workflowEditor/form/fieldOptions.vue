
<script lang="ts" setup>
import { fieldGroup } from 'dp-form'
import {FormObject} from "../../../utils/formEditorHelper";
  const {bpmnJson} = useWorkflowGraph();
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
    attr_target_step: [
      {
        required: false,
        validator: approveTypeCheck,
        trigger: 'blur'
      }
    ]
  };
  
  const approvableTarget = computed(() => {
    console.log(bpmnJson.value.definitions)
    // check userTask is Array
    if(!Array.isArray(bpmnJson.value.definitions.process.userTask)) {
      if( bpmnJson.value.definitions.process.userTask['attr_flowable:candidateGroups']) {
        return [bpmnJson.value.definitions.process.userTask]
      }
      return []
    }
    return bpmnJson.value.definitions.process.userTask.find((el) => el['attr_flowable:candidateGroups'])
  })

function approveTypeCheck(rule:any, value:any, callback:any) {
    if(formField.attr_field_type !== "approve_user_dropdown" && !value) {
      callback(new Error('Please select approve target'))
      return
    }
    callback()
}
function typeChange(newVal) {
    // 如果type改變了，清理特殊欄目的資料
    if(newVal !== "approve_user_dropdown"){
      formField.value.attr_target_step = null;
    }
    if(newVal !== 'file') {
      formField.value.attr_file_limit = null;
    }
}
  function saveField(){
    try{
      
    formEl.value.validate((valid) => {
      console.log(valid, formField.value)
      if(!valid) {
        return;
      }
      emit('submit', formField.value)
      emit('close')
    })
    } catch (e) {
      console.log(e)
    }
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
          <ElSelect v-model="formField.attr_field_type" placeholder="Select input type" @change="typeChange">
            <ElOptionGroup v-for="group in fieldGroup" :key="group.label" :label="group.label">
              <ElOption v-for="item in group.options" :key="item.value" :label="item.label" :value="item.value" />
            </ElOptionGroup>
<!--            <ElOption v-for="(value, key) in fieldOptions" :key="key" :label="value.label" :value="key" />-->
          </ElSelect>
        </ElFormItem>
        <ElFormItem v-if="formField.attr_field_type === 'approve_user_dropdown'" label="Approve Target" prop="attr_target_step">
          <ElSelect v-model="formField.attr_target_step" clearable filterable>
            <ElOption v-for="(value, key) in approvableTarget" :key="key" :label="value.attr_name" :value="value.attr_id" />
          </ElSelect>
        </ElFormItem>
        <ElFormItem v-if="formField.attr_field_type === 'file'" label="File Limit" prop="attr_file_limit">
          <ElInput v-model="formField.attr_file_limit" placeholder="File Limit" step="1" />
        </ElFormItem>
        <ElDivider />
      </ElForm>
  
    <ElButton @click="$emit('close')">Close</ElButton>
<!--    <ElButton type="primary" @click="saveField">Save</ElButton>-->
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