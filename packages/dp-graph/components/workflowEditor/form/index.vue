
<template>
    <div class="workflowFormContainer">
        <ElForm :model="allFormField" class="formContainer" label-position="top">
            <div class="infoSection">
                <div class="title">
                    Info
                </div>
                <ElFormItem label="Name" >
                    <ElInput v-model="allFormField.attr_name" placeholder="Name" />
                </ElFormItem>
<!--                <ElFormItem v-if="data['attr_flowable:candidateStarterGroups']" label="Candidate Group">-->
<!--                    <ElInput v-model="data['attr_flowable:candidateStarterGroups']" placeholder="candidate groups" />-->
<!--                </ElFormItem>-->
            </div>
            <div class="fields">
                <div class="title">
                    All Form Fields
                </div>
                
                <table>
                    <tr>
                      <th>Id</th>
                        <th>Name</th>
                        <th>Type</th>
                    </tr>
                    <tr v-for="(value,key) in allFormField.form" :key="value.attr_id" >
                      <td>
                        <ElFormItem :prop="'form.' + key + '.attr_id'" :rules="nameRules">
                          <ElInput v-model="value.attr_id" placeholder="Name" disabled  />
                        </ElFormItem>
                      </td>
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
                    </tr>
                </table>
            </div>
        </ElForm>
        <div class="footer">
            <ElButton @click="$emit('close')">Close</ElButton>
            <ElButton type="primary" @click="$emit('submit', allFormField)">Save</ElButton>
        </div>

    </div>
</template>


<script lang="ts" setup>
import {useWorkflowGraph} from '../../../composables/useWorkflowGraph'

const emit = defineEmits(['submit', 'close'])

const {  nameChanged, formTypeOptions, allFormField } = useWorkflowGraph();


const nameRules = [
  {
    required: true,
    validator: nameChanged,
    trigger: 'blur'
  },
]


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