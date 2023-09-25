import { useGraph } from "../../composables/userGraph";

<template>
    <div class="workflowFormContainer">
        <div class="formContainer">
            <div class="infoSection">
                <div class="title">
                    Info
                </div>
                <ElInput v-model="data.attr_name" placeholder="Name" />
                <ElInput v-model="data['attr_flowable:candidateStarterGroups']" placeholder="candidate groups" />
            </div>
            <div class="fields">
                <div class="title">
                    Form Fields
                </div>
                <div v-for="(value,key) in data.form" :key="value.attr_id" class="field">
                    <ElInput v-model="value.attr_id" placeholder="id" />
                    <ElInput v-model="value.attr_name" placeholder="Name" @change="nameChanged"  />
                    <ElSelect v-model="value.attr_type">
                        <ElOption v-for="option in formTypeOptions" :key="option.value" :label="option.label" :value="option.value" />
                    </ElSelect>
                    <SvgIcon :src="'/icons/delete.svg'" />
                </div>
            </div>
            <div class="add">
                <ElButton type="primary" @click="add">Add</ElButton>
            </div>
        </div>
        <div class="footer">
            <ElButton @click="$emit('close')">Close</ElButton>
            <ElButton type="primary" @click="$emit('submit', data)">Save</ElButton>
        </div>
    </div>
</template>


<script lang="ts" setup>
defineProps({
    data: Object,
})
defineEmits([])

const { formTypeOptions } = useGraph();
function add() {
    
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
    .formContainer{
        overflow: auto;
    }
}
.fields{
    display: flex;
    flex-flow: column nowrap;
    gap: var(--app-padding);
}
.field{
    display: grid;
    grid-template-columns: 1fr 1fr 1fr min-content;
    gap: var(--app-padding);
}
</style>