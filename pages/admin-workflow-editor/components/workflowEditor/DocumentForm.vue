<script lang="ts" setup>
import {GetAllEmailTemplatePageApi, GetAllTemplatePageApi, GetTemplatePageApi, GetTemplateVariablesApi} from "dp-api";

const props = defineProps<{
  data: any,
  allField: any,
}>();
const emit = defineEmits(['close', 'submit'])

const allDocumentTemplates = ref([]);

async function getDocumentTemplates() {
  const entryList = await GetAllTemplatePageApi();
  allDocumentTemplates.value = entryList.map((item: any) => {
    return {
      id: '${variables:get(' + item.id + ')}',
      name: item.name,
    }
  });
}

const templateVariables = computed(() => {
  const item = props.data.extensionElements['flowable:field'].filter((item: any) => !(item.attr_name === "templateId"));
  return item;
})
function fieldMappingUpdate(index, newVal) {
  props.data.extensionElements['flowable:field'][index + 1]['flowable:expression'].__cdata = newVal;
  emit('submit', props.data)
}
const allFieldOptions = computed(() => {
  return Object.keys(props.allField).map((key) => {
    return {
      label: props.allField[key].attr_name,
      value: '${variables:get(' + props.allField[key].attr_id + ')}'
    }
  })
})

const selectedDocumentTemplate = computed({
  get() {
    const index = props.data.extensionElements['flowable:field'].findIndex((item: any) => item.attr_name === "templateId");
    // props.data.extensionElements['flowable:field']['flowable:string']['__cdata'];
    return props.data.extensionElements['flowable:field'][index]['flowable:expression']['__cdata'];
  },
  async set(value) {
    const index = props.data.extensionElements['flowable:field'].findIndex((item: any) => item.attr_name === "templateId");
    const item = props.data.extensionElements['flowable:field'][index];
    item['flowable:expression']['__cdata'] = value;
    // get value from ${variables:get(id)}  
    const id = value.replace('${variables:get(', '').replace(')}', '');
    const {templateVariable} = await GetTemplateVariablesApi(id);
    const varList = [...new Set(JSON.parse(templateVariable))]
    if(!varList ) {
      props.data.extensionElements['flowable:field'] = [
        item
      ]
      return;
    }
    props.data.extensionElements['flowable:field'] = [
      item,
      ...varList.map((item: any) => {
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
  await getDocumentTemplates();
})

</script>

<template>
  <div class="emailTaskFormContainer">
    <div class="header">
    </div>
    <div class="formContainer">
      <ElForm :model="data" label-position="top">
        <ElFormItem label="Email template">
          <ElSelect v-model="selectedDocumentTemplate" placeholder="Select email template" class="fullwidth">
            <ElOption v-for="item in allDocumentTemplates" :key="item.id" :label="item.name" :value="item.id"></ElOption>
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