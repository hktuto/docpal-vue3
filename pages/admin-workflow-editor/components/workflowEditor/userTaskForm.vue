<template>
    <div class="userTaskFormContainer">
        <div class="header">
        </div>
        <div class="formContainer">
            <ElForm :data="data" label-position="top">
                <ElFormItem label="Name" prop="attr_name">
                    <ElInput v-model="data.attr_name" placeholder="Name" />
                </ElFormItem>
              <div v-if="canAutoAssignee" class="el-form-item">
                <ElFormItem  label="Auto Assign" >
                  <ElSwitch v-model="autoApproval" @change="autoApprovalChanged"/>
                </ElFormItem>

                <ElFormItem v-if="autoApproval" label="Assignee" >
                  <ElSelect v-model="autoAssignField" placeholder="Select Field" v-if="autoApproval">
                    <ElOption v-for="item in autoApprovalOptions" :key="item.value" :label="item.label" :value="item.value" />
                  </ElSelect>
                  <!-- TODO : if flowable:taskListener-->
                </ElFormItem>
              </div>
                
            </ElForm>
            <div class="selectedField">
              <div class="title">
                Form Field
              </div>
              <table>
                <tr>
                  <th>Name</th>
                  <th>Hide</th>
                  <th></th>
                </tr>
                <tr v-for="(value, index) in data.extensionElements['flowable:formProperty']">
                  <td>{{value.attr_name}}</td>
                  <td>
                    <ElSwitch v-model="value.attr_readable" />
                  </td>
                  <td>
                    <SvgIcon @click="removeFormItem(index)" :src="'/icons/delete.svg'" />
                  </td>
                </tr>
              </table>
            </div>
            <div v-if="newFieldOptions.length > 0" class="action">
              <ElButton type="primary" @click="addFromOpened = true">Add Field</ElButton>
            </div>
        </div>
        <div class="footer">
            <ElButton @click="$emit('close')">Close</ElButton>
            <ElButton type="primary" @click="$emit('submit', data)">Save</ElButton>
        </div>
      <ElDialog v-model="addFromOpened" append-to-body>
        <ElSelect v-model="selectedNewField" placeholder="Select Field">
          <ElOption v-for="item in newFieldOptions" :key="item.attr_id" :label="item.attr_name" :value="item.attr_id" />
        </ElSelect>
        <ElButton type="primary" @click="addFormItem">Add</ElButton>
      </ElDialog>
    </div>
</template>


<script lang="ts" setup>
const props = defineProps<{
  data: any,
  allField: any,
}>()

const emit = defineEmits(['close', 'submit'])
const addFromOpened = ref(false)
const selectedNewField = ref('')
const newFieldOptions = computed(() => {
  return Object.keys(props.allField).filter((key) => {
    return !props.data.extensionElements['flowable:formProperty'].some((item) => item.attr_id === key)
  }).map((key) => {
    return props.allField[key]
  })
})
const autoApproval = ref(false);
const autoApprovalOptions = computed(() => {
  return Object.keys(props.allField).map( (key) => {
        return {
          label: props.allField[key].attr_name,
          value: key
        }
      }
  )
})
const autoAssignField = computed({
  get() {
    const f = props.data.extensionElements['flowable:taskListener']['flowable:field']['flowable:expression']['__cdata'];
    // extract variable name from ${variables:get(variableName)}
    return f.substring(16, f.length - 2);
  },
  set(value) {
    props.data.extensionElements['flowable:taskListener'] = createAutoAssignee(value)
    console.log('autoAssignField set', props.data )
  }
})
function autoApprovalChanged(newVal: boolean) {
  if(newVal) {
    props.data.extensionElements['flowable:taskListener'] = createAutoAssignee(autoAssignField.value || "")
  } else {
    delete props.data.extensionElements['flowable:taskListener']
  }
  emit('submit', props.data)
}
function createAutoAssignee (autoAssignField:string) {
  return {
    "attr_delegateExpression": "${autoAssignTaskListener}",
    "attr_event": "create",
    "flowable:field": {
      "attr_name" : "assignee",
      "flowable:expression" : {
        "__cdata" : '${variables:get(' + autoAssignField + ')}'
      }
    }
  }
}

const canAutoAssignee = computed(() => !(props.data.attr_id === 'start'))


function addFormItem() {
  if(!addFormItem) return
  const form = props.data.extensionElements['flowable:formProperty'].push(props.allField[selectedNewField.value])
  emit('submit', form);
  selectedNewField.value = ""
  addFromOpened.value = false;
}


function removeFormItem(key){
  // remove from props.data.extensionElements['flowable:formProperty']
  props.data.extensionElements['flowable:formProperty'].splice(key, 1)
  emit('submit', props.data);
}

watch(props.data, () => {
  console.log('change')
  autoApproval.value = props.data.extensionElements['flowable:taskListener'] && props.data.extensionElements['flowable:taskListener']['attr_event'] === 'create'
},{
  immediate: true
})

</script>

<style lang="scss" scoped>
.userTaskFormContainer{
    width: 100%;
    max-width: 600px;
    min-width: 280px;
    display: flex;
    flex-flow: column nowrap;
    justify-content: flex-start;
    align-items: stretch;
    height: 100%;
    padding: var(--app-padding);
    .formContainer{
       overflow: auto;
    }
}
</style>