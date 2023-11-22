<script lang="ts" setup>
import {GetAllEmailTemplatePageApi, GetAllTemplatePageApi, GetTemplatePageApi, GetTemplateVariablesApi} from "dp-api";
import formJson from '../../../assets/formJson/pathSelector.json'
const FromRendererRef = ref()
const props = defineProps<{
  data: any,
  allField: any,
}>();
const emit = defineEmits(['close', 'submit'])
const { allFormFieldArray} = useWorkflowGraph();
const formVariable = ref([]);

const allDocumentTemplates = ref([]);




async function getDocumentTemplates() {
  const entryList = await GetAllTemplatePageApi();
  allDocumentTemplates.value = entryList.map((item: any) => {
    return {
      id: item.id,
      name: item.name,
    }
  });
}

const templateVariables = computed(() => {
  return props.data.extensionElements['flowable:field'];
})
function fieldMappingUpdate(index, newVal) {
  props.data.extensionElements['flowable:field'][index + 1]['flowable:expression'].__cdata = newVal;
  emit('submit', props.data)
}
const allFieldOptions = computed(() => {
  return Object.keys(props.allField).map((key) => {
    return {
      label: props.allField[key].attr_name,
      value: props.allField[key].attr_id
    }
  })
})

const documentName = computed({
  get(){
    const item = props.data.extensionElements['flowable:field'].find((item: any) => item.attr_name === "documentName");
    if(!item) return [];
    console.log('get', item.attr_path)
    return item.attr_path ? JSON.parse(item.attr_path) : [];
  },
  set(value) {
    let item = props.data.extensionElements['flowable:field'].find((item: any) => item.attr_name === "documentName");
    if(!item){
      // push documentName to extensionElements
      props.data.extensionElements['flowable:field'].push({
        attr_name: "documentName",
        attr_type: "string",
        attr_value: "",
        attr_required: "false",
        attr_path: value ? JSON.stringify(value) : "[]",
        "flowable:expression": {
          __cdata: value ? value[value.length - 1] : ""
        }
      })
    }
    item = props.data.extensionElements['flowable:field'].find((item: any) => item.attr_name === "documentName");
    item.attr_path = value ? JSON.stringify(value) : "[]";
    const allLabel = value.map((item:any) => {
      //check item type
      if(item.attr_type = 'date') {
        
      }
      return '${' + item.attr_id + '}'
    }) ;

    item['flowable:expression']['__cdata'] = allLabel.join('-');
    console.log(value, item)
    save();
  }
})

function handleDocNameChange({dropList, dragList}) {
  documentName.value = dropList;
  
}



const selectedDocumentTemplate = computed({
  get() {
    const index = props.data.extensionElements['flowable:field'].findIndex((item: any) => item.attr_name === "templateId");
    // props.data.extensionElements['flowable:field']['flowable:string']['__cdata'];
    return props.data.extensionElements['flowable:field'][index]['flowable:expression']['__cdata'];
  },
  async set(value) {
    const index = props.data.extensionElements['flowable:field'].findIndex((item: any) => item.attr_name === "templateId");
    const item = props.data.extensionElements['flowable:field'][index];
    // if item['flowable:expression']['__cdata']  == value, do nothing
    if(item['flowable:expression']['__cdata'] === value) return;
    item['flowable:expression']['__cdata'] = value;
    const variableField  = props.data.extensionElements['flowable:field'].find((item: any) => item.attr_name === "variables");
    // get value from ${variables:get(id)}  
    if(!value) {
      variableField['flowable:expression']['__cdata'] = "{}";
      formVariable.value = [];
      return;
    }
    const {templateVariable} = await GetTemplateVariablesApi(value);
    const varList = [...new Set(JSON.parse(templateVariable))]
   
    variableField['flowable:expression']['__cdata'] = JSON.stringify(varList.reduce((acc, cur) => {
      acc[cur] = '';
      return acc;
    }, {}));
    formVariable.value = varList.map((item) => ({
      key:item,
      value:""
    }));
    
    emit('submit', props.data)
  }
})

const formData = computed(() => {
  const parentPathField = props.data.extensionElements['flowable:field'].find((item: any) => item.attr_name === "parentPath");
  const documentTypeField = props.data.extensionElements['flowable:field'].find((item: any) => item.attr_name === "documentType");
  const documentPropertiesField = props.data.extensionElements['flowable:field'].find((item: any) => item.attr_name === "documentProperties");
  const variablesField = props.data.extensionElements['flowable:field'].find((item: any) => item.attr_name === "variables");
  const templateIdField = props.data.extensionElements['flowable:field'].find((item: any) => item.attr_name === "templateId");
  const vari = variablesField['flowable:expression']['__cdata'] ? JSON.parse(variablesField['flowable:expression']['__cdata']) : {};
  // loop throught vari and set value to formVariable and remove ${variables:get()}
  formVariable.value = Object.keys(vari).map((key) => {
    return {
      key,
      value: vari[key].replace('${variables:get(', '').replace(')}', '')
    }
  });
  console.log('formVariable', formVariable.value)
  // formVariable.value = variablesField['flowable:expression']['__cdata'] ? JSON.parse(variablesField['flowable:expression']['__cdata']) : {};
  return {
    templateId: templateIdField['flowable:expression']['__cdata'],
    parentPath: parentPathField.attr_path ? JSON.parse(parentPathField.attr_path) : [],
    documentType: documentTypeField['flowable:expression']['__cdata'],
    // documentProperties: documentPropertiesField['flowable:expression']['__cdata'] || "",
    variables: variablesField['flowable:expression']['__cdata'] ? JSON.parse(variablesField['flowable:expression']['__cdata']) : {},
  }
})

function valueChange({fieldName,newValue, oldValue}) {
  if(fieldName === 'templateId') {
    selectedDocumentTemplate.value = newValue;
    return
  }
  
  const item = props.data.extensionElements['flowable:field'].find((item: any) => item.attr_name === fieldName);
  if(fieldName === 'parentPath') {
    item.attr_path = newValue ? JSON.stringify(newValue) : "[]";
    item['flowable:expression']['__cdata'] = newValue ? newValue[newValue.length -1 ] : "";
  } else {
    item['flowable:expression']['__cdata'] = newValue;
  }
  save();
}

function emailVariableChange(newVal, key) {
  const variables = props.data.extensionElements['flowable:field'].find((item: any) => item.attr_name === "variables");
  const json = JSON.parse(variables['flowable:expression']['__cdata']);
  json[key] = newVal ? '${variables:get(' + newVal + ')}' : "";
  variables['flowable:expression']['__cdata'] = JSON.stringify(json);
  const formIndex = formVariable.value.findIndex((item) => item.key === key);
  formVariable.value[formIndex].value = newVal;
  save();
}

function save() {
  console.log('save', props.data)
  emit('submit', props.data)
}

onMounted(async() => {
  await getDocumentTemplates();
  
  nextTick( () => {
    FromRendererRef.value.vFormRenderRef.setFormData(formData.value)
  })
})


</script>

<template>
  <div class="emailTaskFormContainer">
    <div class="header">
    </div>
    <div class="formContainer">
      <FromRenderer ref="FromRendererRef" :form-json="formJson" @formChange="valueChange">
        <template v-slot:tableForm>
          <!-- {{ allFormFieldArray }} -->
          <ElFormItem label="Document Name">
            <DragSelect :dragList="allFormFieldArray" :dropList="documentName" itemKey="attr_field_label" nullTip="No Field in workflow" @change="handleDocNameChange"/>
          </ElFormItem>
          <h3>Document Variable</h3>
          <ElFormItem v-for="item in formVariable" :key="item.key" :label="item.key">
            <ElSelect v-model="item.value" @change="(val) => emailVariableChange(val, item.key)">
              <ElOption v-for="option in allFieldOptions" :key="option.value" :label="option.label" :value="option.value"></ElOption>
            </ElSelect>
          </ElFormItem>
        </template>
      </FromRenderer>
      
    </div>
    <div class="footer">
      <ElButton @click="$emit('close')">Close</ElButton>
      <ElButton type="primary" @click="save">Save</ElButton>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.emailTaskFormContainer{
  width: 100%;
  max-width: 600px;
  min-width: 320px;
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
.fullwidth{
  width: 100%;
}
</style>