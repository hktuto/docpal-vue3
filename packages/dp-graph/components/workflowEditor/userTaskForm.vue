<template>
    <div class="userTaskFormContainer">
        <div class="header">
        </div>
        <div class="formContainer">
            <ElForm :data="data" label-position="top">
              <ElFormItem label="Id" prop="attr_name">
                <ElInput v-model="data.attr_id" placeholder="Name" disabled />
              </ElFormItem>
                <ElFormItem label="Name" prop="attr_name">
                    <ElInput v-model="data.attr_name" placeholder="Name" />
                </ElFormItem>
              
              <div v-if="canAutoAssignee" class="el-form-item">
                <ElFormItem label="Candidate Group">
                  <ElSelect v-model="candidateGroup" placeholder="Select Group" v-if="haveCandidateGroup">
                    <ElOption v-for="item in allUserGroup" :key="item.id" :label="item.name" :value="item.id" />
                  </ElSelect>
                </ElFormItem>
                
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
                <draggable v-model="data.extensionElements['flowable:formProperty']" tag="tbody" item-key="name">
                  <template #item="{ element, index }">
                    <tr >
                      <td scope="row"> <SvgIcon src="/icons/move-handle.svg" /></td>
                      <td>
                        <div :class="{fieldName:true, required:element.attr_required }">
                        {{element.attr_name}}
                        </div>
                      </td>
                      <td>
                        <div class="actions">
                          
                        <WorkflowEditorFormFieldOptions :field="element" />
                        <SvgIcon @click="removeFormItem(index)" :src="'/icons/delete.svg'" />
                        </div>
                      </td>
                    </tr>
                  </template>
                </draggable>
              </table>
            </div>
          <div class="actions">
            
            <div v-if="newFieldOptions.length > 0" class="action">
              <ElButton type="primary" @click="addFromOpened = true">Add Field</ElButton>
            </div>
            <div class="action">
              <ElButton type="primary" @click="previewForm">Preview Form</ElButton>
            </div>
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
      
      <ElDialog v-model="previewFormOpened" append-to-body>
        
      </ElDialog>
      
      <ElDialog v-model="editFormFieldDialog" append-to-body>
        
      </ElDialog>
    </div>
</template>


<script lang="ts" setup>
import {GetGroupListApi} from "dp-api";
import {ElMessage} from 'element-plus'
import draggable from "vuedraggable";
import {bpmnStepToForm, fieldType, FormObject} from "../../utils/formEditorHelper";
const props = defineProps<{
  data: any,
  allField: any,
}>()

const emit = defineEmits(['close', 'submit'])
const addFromOpened = ref(false)
const selectedNewField = ref('')
const previewFormOpened = ref(false)
const editFormFieldDialog = ref(false)
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


function previewForm(){
  const form = bpmnStepToForm(props.data.extensionElements['flowable:formProperty'])
  console.log(form)
}

const canAutoAssignee = computed(() => !(props.data.attr_id === 'start'))


const haveCandidateGroup = computed(() => {
  return props.data.extensionElements['modeler:activiti-idm-candidate-group'] && props.data.extensionElements['modeler:activiti-idm-candidate-group']["__cdata"] === 'true'
})

const allUserGroup = ref([]);


async function getAllUserGroup(){
  allUserGroup.value = await GetGroupListApi(true)
}

const candidateGroup = computed({
  get() {
    const extensionElements = props.data.extensionElements;
    // check any item name contain modeler:group-info-name-
    const currentGroup = Object.keys(extensionElements).find((key) => {
      return key.includes('modeler:group-info-name-')
    });
    return currentGroup ? extensionElements[currentGroup]["__cdata"] : ""
  },
  async set(value){
    // remove old modeler:group-info-name-*
    const extensionElements = props.data.extensionElements;
    const currentGroup = Object.keys(extensionElements).find((key) => {
      return key.includes('modeler:group-info-name-')
    });
    if(currentGroup) {
      delete extensionElements[currentGroup]
    }
    const group = allUserGroup.value.find((item) => item.id === value)
    if(group) {
      props.data.extensionElements['modeler:group-info-name-' + group.id] = {
        ['attr_xmlns:modeler'] : "http://flowable.org/modeler",
        "__cdata": group.name
      }
    }
    console.log('set', props.data)
    emit('submit', props.data)
  }
})

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
  autoApproval.value = props.data.extensionElements['flowable:taskListener'] && props.data.extensionElements['flowable:taskListener']['attr_event'] === 'create'
},{
  immediate: true
})

onMounted(async() => {
  await getAllUserGroup()
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
table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: var(--app-padding);
  tbody > tr {
    padding: var(--app-padding);
  }
}
.actions{
  display: flex;
  gap: .6rem;
  --icon-color: var(--color-grey-500);
  --icon-size: 1rem;
}
</style>