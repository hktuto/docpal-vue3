
<template>
    <div class="workflowFormContainer">
        <ElForm class="formContainer" label-position="top">
            <div class="infoSection">
                <div class="title">
                    Info
                </div>
                <ElFormItem label="Name" >
                    <ElInput v-model="data.attr_name" placeholder="Name" />
                </ElFormItem>
                <ElFormItem label="Candidate Group">
                    <ElInput v-model="data['attr_flowable:candidateStarterGroups']" placeholder="candidate groups" />
                </ElFormItem>
            </div>
            <div class="fields">
                <div class="title">
                    Form Fields
                </div>
                <table>
                    <tr>
                        <th>Id</th>
                        <th>Name</th>
                        <th>Type</th>
                        <th></th>
                    </tr>
                    <tr v-for="(value,key) in data.form" :key="value.attr_id">
                        <td>
                            <ElInput v-model="value.attr_id" placeholder="id" />
                        </td>
                        <td>
                            <ElInput v-model="value.attr_name" placeholder="Name" @change="nameChanged"  />
                        </td>
                        <td>
                            <ElSelect v-model="value.attr_type">
                                <ElOption v-for="option in formTypeOptions" :key="option.value" :label="option.label" :value="option.value" />
                            </ElSelect>
                        </td>
                        <td>
                            <SvgIcon @click="removeFormItem(key)" :src="'/icons/delete.svg'" />
                        </td>
                    </tr>
                </table>
            </div>
            <div class="add">
                <ElButton type="primary" size="small" @click="add">Add</ElButton>
            </div>
        </ElForm>
        <div class="footer">
            <ElButton @click="$emit('close')">Close</ElButton>
            <ElButton type="primary" @click="$emit('submit', data)">Save</ElButton>
        </div>
    </div>
</template>


<script lang="ts" setup>
const props = defineProps({
    data: any,
})
defineEmits([])

const { formTypeOptions } = useGraph();
function add() {
    
}

function removeFormItem(key: any) {
    console.log(props.data.form[key]);
}

function nameChanged(newValue:string) {
    
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