<template>
    <div class="userTaskFormContainer">
        <div class="header">
        </div>
        <div class="formContainer">
            <ElForm :data="data" >
                <ElFormItem label="Name" prop="attr_name">
                    <ElInput v-model="data.attr_name" placeholder="Name" />
                </ElFormItem>
            </ElForm>
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
        flex: 1 0 auto;
    }
}
</style>