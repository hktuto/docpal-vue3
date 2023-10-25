<template>
    <div class="userTaskFormContainer">
        <div class="header">
        </div>
        <div class="formContainer">
            <ElForm :data="data" label-position="top">
                <ElFormItem label="Name" prop="attr_name">
                    <ElInput v-model="data.attr_name" placeholder="Name" />
                </ElFormItem>
              {{canAutoAssignee}}
                <ElFormItem v-if="canAutoAssignee" label="Assignee" >
                  
                    <!-- TODO : if flowable:taskListener-->
                </ElFormItem>
            </ElForm>
            <div class="selectedField">
              <table>
                <tr>
                  <th>Name</th>
                  <th>Hide</th>
                  <th></th>
                </tr>
                <tr v-for="(value, key) in data.extensionElements['flowable:formProperty']">
                  <td>{{value.attr_name}}</td>
                  <td>
                    <ElSwitch v-model="value.attr_readable" />
                  </td>
                  <td>
                    <SvgIcon @click="removeFormItem(key)" :src="'/icons/delete.svg'" />
                  </td>
                </tr>
              </table>
            </div>
        </div>
        <div class="footer">
            <ElButton @click="$emit('close')">Close</ElButton>
            <ElButton type="primary" @click="$emit('submit', data)">Save</ElButton>
        </div>
    </div>
</template>


<script lang="ts" setup>
const props = defineProps<{
  data: any,
  allField: any,
}>()


const canAutoAssignee = computed(() => !props.data.attr_name === 'Start')
const haveAutoAssignee = computed(() => {
  return props.data.extensionElements['flowable:taskListener'] && props.data.extensionElements['flowable:taskListener']['attr_event'] === 'create'
})
function createAutoAssignee (autoAssignField:string) {
  return {
    "flowable:taskListener": {
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
}

function removeFormItem(key){
  const form = props.data.extensionElements['flowable:formProperty'];
  delete form[key];
}

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