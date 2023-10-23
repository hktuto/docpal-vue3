<template>
    <el-card class="dashboard-item-main">
        <template #header="{ close, titleId, titleClass }">
            <h4>This is a custom header!</h4>
            <SvgIcon src="/icons/setting.svg" style="--icon-size: 16px; --icon-color: #8796A4"
                @click="openSetting"/>
        </template>
        <div class="trendContainer">
            <DocCoCountFileCount ref="DocCoCountCountRef" :documentType="setting.documentType" />
            <DocCoCountSize ref="DocCoCountSizeRef" :documentType="setting.documentType" />
        </div>
        <div class="metaContainer" style="--trend-columns: 1fr 1fr 1fr 1fr">
        
        </div>
        <DocCoCountDialog ref="settingRef" 
            @delete="handleDelete"
            @refresh="handleRefresh"/>
    </el-card>
</template>

<script lang="ts" setup>
const props = withDefaults( defineProps<{
    setting?: any;
}>() , {
    setting: {}
})
const emits = defineEmits([
    'refreshSetting', 'delete'
])
const DocCoCountCountRef = ref()
const DocCoCountSizeRef = ref()
function resize() {
    DocCoCountCountRef.value.resize()
    DocCoCountSizeRef.value.resize()
}
const settingRef = ref()
function openSetting() {
    settingRef.value.handleOpen(props.setting)
}
function handleDelete() {
    emits('delete')
}
function handleRefresh(chartSetting) {
    emits('refreshSetting', chartSetting)
}
watch(() => props.setting, (newSetting) => {
    console.log(newSetting);
    
}, {
    immediate: true
})
defineExpose({
    resize
})
</script>

<style lang="scss" scoped>
.dashboard-item-main {
    display: grid;
    grid-template-rows: min-content 1fr;
    overflow: hidden;
}
.dashboard-item-main :deep(.el-card__body) {
    height: 100%;
    overflow-y: auto;
    overflow-x: hidden;
}
.dashboard-item-main :deep(.el-card__header) {
    display: flex;
    justify-content: space-between;
    border-bottom: unset;
    padding: var(--app-padding) var(--app-padding) 0;
    h4 {
        padding: unset;
        margin: unset;
        color: #464646;
        font-size: 18px;
        font-family: Arial;
    }
}
.trendContainer {
    display: flex;
    div {
        flex: 1;
    }
}
.metaContainer {
    display: flex;
    flex-wrap: wrap;
    div {
        flex: 0 0 25%;
        background-color: red;
    }
}
:deep(.co-count-chart) {
    width: 100%;
    height: 100%;
    min-height: 300px;
}
</style>
