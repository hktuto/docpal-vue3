<template>
    <div class="checkbox-card">
        <SearchBar2Condition v-model="state.value" v-bind="condition"></SearchBar2Condition>
        <el-button style="width: 100%;margin-top: 20px;" type="primary" @click="handleConfirm">{{ $t('dpButtom_confirm') }}</el-button>
    </div>
</template>
<script lang="ts" setup>
const props = defineProps(['tag', 'condition'])
const emits = defineEmits(['confirm'])

const state = reactive<any>({
    value: []
})
function handleConfirm() {
    emits('confirm', {
        [props.tag.key]: state.value
    })
}
watch(() => props.tag.value, (val) => {
    if(val) state.value = val
    else state.value = []
}, { immediate: true, deep: true })
</script>
<style lang="scss" scoped>
.checkbox-card {
    display: grid;
    max-height: 65vh;
    overflow: hidden;
    grid-template-rows: 1fr min-content;
    .checkbox-group-container {
        overflow: hidden;
        display: grid;
        grid-template-rows: min-content min-content 1fr;
        :deep(.el-checkbox-group) {
            overflow: auto;
        }
    }
}
</style>