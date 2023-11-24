<script lang="ts" setup>
import {FormObject} from "../../../utils/formEditorHelper";

const props = defineProps<{
  currentForm: any
}>()

const { formTypeOptions, idChanged, newNameChanged, allFormField } = useWorkflowGraph()
const emit = defineEmits(['submit', 'close'])



const selectedNewField = ref("");
const newFieldOptions = computed(() => {
  return Object.keys(allFormField.value.form).filter((key) => {
    return !props.currentForm.extensionElements['flowable:formProperty'].some((item) => item.attr_id === key)
  }).map((key) => {
    return allFormField.value.form[key]
  })
})

const isNewField = computed(()=> {
  if(!selectedNewField.value) return false
  const isNew = !allFormField.value.form[selectedNewField.value]
  if(isNew) newFieldForm.value.attr_id = selectedNewField.value
  return isNew
})

const newFieldFormEl = ref();
const newFieldForm = ref<FormObject>({
  attr_id: '',
  attr_name: '',
  attr_type: 'string',
})

const newFieldRules= {
  attr_id: [{
    required: true,
    validator: idChanged,
    trigger: 'blur'
  }],
  attr_name: [{
    required: true,
    validator: newNameChanged,
    trigger: 'blur'
  }],
}

function resetNewFieldForm() {
  newFieldForm.value = {
    attr_id: '',
    attr_name: '',
    attr_type: 'string',
  }
}

function add() {
  // validate newFieldForm
  if(!selectedNewField.value) return
  if(isNewField.value){
    if(newFieldForm.value.type.attr_type === 'date') {
      newFieldForm.value.attr_datePattern = "yyyy-MM-dd HH:mm:ss"
    }
    emit('submit', newFieldForm.value)
    return
  }
  emit('submit', allFormField.value.form[selectedNewField.value])
}
</script>

<template>
  <div class="newFieldFormContainer">
  </div>
  <ElForm ref="newFieldFormEl" :model="newFieldForm" :rules="newFieldRules" label-position="top" >
    <ElFormItem label="Field">
      <ElSelect v-model="selectedNewField" placeholder="Select Field" filterable allow-create>
        <ElOption v-for="item in newFieldOptions" :key="item.attr_id" :label="item.attr_name" :value="item.attr_id" />
      </ElSelect>
    </ElFormItem>
    <ElFormItem v-if="isNewField" label="Id" prop="attr_id">
      <ElInput v-model="newFieldForm.attr_id" placeholder="id" />
    </ElFormItem>
    <ElFormItem v-if="isNewField" label="Name" prop="attr_name">
      <ElInput v-model="newFieldForm.attr_name" placeholder="Name" />
    </ElFormItem>
    <ElFormItem v-if="isNewField" label="Type" prop="attr_type">
      <ElSelect v-model="newFieldForm.attr_type">
        <ElOption v-for="option in formTypeOptions" :key="option.value" :label="option.label" :value="option.value" />
      </ElSelect>
    </ElFormItem>
    <ElFormItem>
      <ElButton type="primary" @click="add">
        {{ isNewField ? 'Add New Field' : 'Add from workflow' }}
      </ElButton>
    </ElFormItem>
  </ElForm>
</template>

<style scoped lang="scss">

</style>