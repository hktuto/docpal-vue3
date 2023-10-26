
<template>
    <div class="workflowFormContainer">
        <ElForm :model="data" class="formContainer" label-position="top">
            <div class="infoSection">
                <div class="title">
                    Info
                </div>
                <ElFormItem label="Name" >
                    <ElInput v-model="data.attr_name" placeholder="Name" />
                </ElFormItem>
                <ElFormItem v-if="data['attr_flowable:candidateStarterGroups']" label="Candidate Group">
                    <!-- TODO : change to user group filter -->
                    <ElInput v-model="data['attr_flowable:candidateStarterGroups']" placeholder="candidate groups" />
                </ElFormItem>
            </div>
            <div class="fields">
                <div class="title">
                    Form Fields
                </div>
                <table>
                    <tr>
                        <th>Name</th>
                        <th>Type</th>
                        <th></th>
                    </tr>
                    <tr v-for="(value,key) in data.form" :key="value.attr_id" >
                        <td>
                          <ElFormItem :prop="'form.' + key + '.attr_name'" :rules="nameRules">
                            <ElInput v-model="value.attr_name" placeholder="Name" @change="(newVal) => nameChanged(newVal, key)"  />
                          </ElFormItem>
                        </td>
                        <td>
                            <ElFormItem>
                              <ElSelect v-model="value.attr_type">
                                  <ElOption v-for="option in formTypeOptions" :key="option.value" :label="option.label" :value="option.value" />
                              </ElSelect>
                            </ElFormItem>
                        </td>
                        <td>
                          <ElFormItem>
                            <SvgIcon @click="removeFormItem(key)" :src="'/icons/delete.svg'" />
                          </ElFormItem>
                        </td>
                    </tr>
                </table>
            </div>
            <div class="add">
                <ElButton type="primary" size="small" @click="newFieldDialogOpened = true;">Add</ElButton>
            </div>
        </ElForm>
        <div class="footer">
            <ElButton @click="$emit('close')">Close</ElButton>
            <ElButton type="primary" @click="$emit('submit', data)">Save</ElButton>
        </div>
      
      <ElDialog v-model="newFieldDialogOpened" append-to-body >
          <ElForm ref="newFieldFormEl" :model="newFieldForm" :rules="newFieldRules" label-position="top" >
            <ElFormItem label="Id" prop="attr_id">
              <ElInput v-model="newFieldForm.attr_id" placeholder="id" />
            </ElFormItem>
            <ElFormItem label="Name" prop="attr_name">
              <ElInput v-model="newFieldForm.attr_name" placeholder="Name" />
            </ElFormItem>
            <ElFormItem label="Type" prop="attr_type">
              <ElSelect v-model="newFieldForm.attr_type">
                  <ElOption v-for="option in formTypeOptions" :key="option.value" :label="option.label" :value="option.value" />
              </ElSelect>
            </ElFormItem>
            <ElFormItem>
              <ElButton type="primary" @click="add">
                Confirm
              </ElButton>
            </ElFormItem>
          </ElForm>
      </ElDialog>
    </div>
</template>


<script lang="ts" setup>
const props = defineProps<{
  data: any
}>()
const emit = defineEmits(['submit', 'close'])
const newFieldDialogOpened = ref(false);
const newFieldFormEl = ref();
const newFieldForm = ref({
  attr_id: '',
  attr_name: '',
  attr_type: 'String',
})
const { formTypeOptions } = useGraph();
function add() {
  // validate newFieldForm
  newFieldFormEl.value.validate((valid: any) => {
    if(!valid) return
    // TODO : add form to data, and reset form
    // data.form.push()
    emit('submit', {
      ...props.data, form: {
        ...props.data.form,
        [newFieldForm.value.attr_id]: newFieldForm.value
      }
    })
    resetNewFieldForm()
  })
}

function resetNewFieldForm() {
  newFieldForm.value = {
    attr_id: '',
    attr_name: '',
    attr_type: 'string',
  }
}


function removeFormItem(key: any) {
    console.log(props.data.form[key]);
    const form = props.data.form;
    delete form[key];
}


const nameRules = [
  {
    required: true,
    validator: nameChanged,
    trigger: 'blur'
  },
]

function newNameChanged(rule: any, value: any, callback: any) {
  if (!value) {
    return callback(new Error('Please input Name'))
  }
  const formArray = Object.keys(props.data.form).map((key) => props.data.form[key]);
  const isDuplicatedItem = formArray.some((item:any) => item.attr_name === value)
  if(isDuplicatedItem ) {
    return callback(new Error('Name is duplicated'))
  }
}
function nameChanged(rule: any, value: any, callback: any) {
  console.log('nameChanged', value)
  if (!value) {
    return callback(new Error('Please input Name'))
  }
  const formArray = Object.keys(props.data.form).map((key) => props.data.form[key]);
  const isDuplicatedItem = formArray.filter((item:any) => item.attr_name === value)
  if(isDuplicatedItem && isDuplicatedItem.length > 1) {
    return callback(new Error('Name is duplicated'))
  }
}

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
function idChanged(rule: any, value: any, callback: any) {
  if (!value) {
    return callback(new Error('Please input id'))
  }
  const formArray = Object.keys(props.data.form).map((key) => props.data.form[key]);
  const isDuplicatedItem = formArray.filter((item:any) => item.attr_id === value)
  if(isDuplicatedItem && isDuplicatedItem.length > 1) {
    return callback(new Error('Id is duplicated'))
  }
}

</script>

<style lang="scss" scoped>
.workflowFormContainer{
    width: 100%;
    max-width: 600px;
    min-width: 280px;
    display: flex;
    flex-flow: column nowrap;
    justify-content: flex-start;
    align-items: stretch;
    height: 100%;
    padding: var(--app-padding);
    overflow: hidden;
    .formContainer{
        overflow: auto;
    }
}
.fields{
    display: flex;
    flex-flow: column nowrap;
    gap: var(--app-padding);
    overflow: auto;
}
.field{
    display: grid;
    grid-template-columns: 1fr 1fr 1fr min-content;
    gap: var(--app-padding);
}
th{
    font-size: .8rem;
    font-weight: normal;
    text-align: left;
}
</style>