<script lang="ts" setup>
import {GetAllEmailTemplatePageApi} from "dp-api";

const props = defineProps<{
  data: any,
  allField: any,
}>();
const emit = defineEmits(['close', 'submit'])

const allEmailTemplates = ref([]);
const defaultWorkflowVariable =ref(['HostUrl',"ProcessInstanceId"])

async function getEmailTemplates() {
  const entryList = await GetAllEmailTemplatePageApi()
  allEmailTemplates.value = entryList;

  const index = props.data.extensionElements['flowable:field'].findIndex((item: any) => item.attr_name === "notificationType");
  const item = props.data.extensionElements['flowable:field'][index];
  if(!item) return;
  const varList = allEmailTemplates.value.find((ii: any) => ii.id === item['flowable:string']['__cdata']).emailTemplateVariable;
  if(!varList || !JSON.parse(varList)) {
    props.data.extensionElements['flowable:field'] = [
      item
    ]
    return;
  }
  props.data.extensionElements['flowable:field'] = [
    item,
    ...JSON.parse(varList).map((item: any) => {
      // check if item already exist
      const exist = props.data.extensionElements['flowable:field'].find((field: any) => field.attr_name === item);
      if(exist) return exist;
      return {
        "attr_name": item,
        "flowable:expression": {
          "__cdata": ''
        }
      }
    })
  ]
}

const templateVariables = computed(() => {
  console.log(props.data)
  if(!Array.isArray(props.data?.extensionElements['flowable:field'] )) {
    props.data.extensionElements['flowable:field'] = [props.data.extensionElements['flowable:field'] ]
  }
  const item = props.data.extensionElements['flowable:field'].filter((item: any) => !(item.attr_name === "notificationType"));
  return item;
})
function fieldMappingUpdate(index, newVal) {
  props.data.extensionElements['flowable:field'][index + 1]['flowable:expression'].__cdata = newVal;
  emit('submit', props.data)
}
const allFieldOptions = computed(() => {
  const all = Object.keys(props.allField).map((key) => {
    return {
      label: props.allField[key].attr_name,
      value: '${variables:get(' + props.allField[key].attr_id + ')}'
    }
  })
  all.push(...defaultWorkflowVariable.value.map((item) => {
    return {
      label: item,
      value: '${variables:get(' + item + ')}'
    }
  }))
  return all;
})

const selectedEmailTemplate = computed({
  get() {
    const index = props.data.extensionElements['flowable:field'].findIndex((item: any) => item.attr_name === "notificationType");
    // props.data.extensionElements['flowable:field']['flowable:string']['__cdata'];
    
    return props.data.extensionElements['flowable:field'][index]['flowable:string']['__cdata'];
  },
  set(value) {
    const index = props.data.extensionElements['flowable:field'].findIndex((item: any) => item.attr_name === "notificationType");
    const item = props.data.extensionElements['flowable:field'][index];
    item['flowable:string']['__cdata'] = value;
    
    const varList = allEmailTemplates.value.find((item: any) => item.id === value).emailTemplateVariable;
    if(!varList || !JSON.parse(varList)) {
      props.data.extensionElements['flowable:field'] = [
        item
      ]
      return;
    }
    props.data.extensionElements['flowable:field'] = [
      item,
      ...JSON.parse(varList).map((item: any) => {
        return {
          "attr_name": item,
          "flowable:expression": {
            "__cdata": ''
          }
        }
      })
    ]
    emit('submit', props.data)
  }
})

onMounted(async() => {
  await getEmailTemplates();
})

</script>

<template>
  <div class="emailTaskFormContainer">
    <div class="header">
    </div>
    <div class="formContainer">
      <ElForm :model="data" label-position="top">
        <ElFormItem label="Email template">
          <ElSelect v-model="selectedEmailTemplate" placeholder="Select email template" class="fullwidth" filterable>
            <ElOption v-for="item in allEmailTemplates" :key="item.id" :label="item.label" :value="item.id"></ElOption>
          </ElSelect>
        </ElFormItem>
      </ElForm>
      <table>
        <tr>
          <th>Email Variable</th>
          <th>Form field</th>
        </tr>
        <tr v-for="(item, index) in templateVariables" :key="item.attr_name">
          <td>{{item.attr_name}}</td>
          <td>
            <ElSelect v-model="item['flowable:expression'].__cdata" placeholder="Select form field" class="fullwidth" clearable @change="(val) => fieldMappingUpdate(index, val)">
              <ElOption v-for="item in allFieldOptions" :key="item.value" :label="item.label" :value="item.value"></ElOption>
            </ElSelect>
          </td>
        </tr>
      </table>
    </div>
    <div class="footer">
      <ElButton @click="$emit('close')">Close</ElButton>
      <ElButton type="primary" @click="$emit('submit', data)">Save</ElButton>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.emailTaskFormContainer{
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
.fullwidth{
  width: 100%;
}
</style>