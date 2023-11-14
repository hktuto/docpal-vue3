<template>
    <el-card class="dashboard-item dashboard-item-main" :style="`--setting-color:${setting.color}`">
        <template #header="{ close, titleId, titleClass }">
            <h4>{{setting.workflow}}
                <DashboardUserFilter class="el-icon--right" :user="state.filterUser"
                    :show="setting.showUserFilter"
                    @refreshSetting="handleFilterUser"></DashboardUserFilter>
            </h4>
            <SvgIcon v-if="!hideSetting" src="/icons/setting.svg" style="--icon-size: 16px; --icon-color: #8796A4"
                @click="openSetting"/>
        </template>
        <div class="chartContainer">
            <component v-for="(item, index) in setting.displayList" 
                class="chartContainer-item"
                :is="widgetComponent[item]" :ref="el =>{ displayListRef[item] = el }" 
                :workflow="setting.workflow"
                :user="state.filterUser"></component>
        </div>
        <WorkflowCoCountDialog ref="settingRef" 
            @delete="handleDelete"
            @refresh="handleRefresh"/>
    </el-card>
</template>

<script lang="ts" setup>
import { } from 'dp-api'
const props = withDefaults( defineProps<{
    setting?: any;
    hideSetting?: boolean,
}>() , {
    setting: {},
    hideSetting: false
})
const emits = defineEmits([
    'refreshSetting', 'delete'
])
const state = reactive({
    filterUser: ''
})
const displayListRef = ref({})
function resize() {
    Object.keys(displayListRef.value).forEach(key => {
        const item = displayListRef.value[key]
        if(item) item.resize()
    })
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
function handleFilterUser (user) {
    state.filterUser = user
}
watch(() => props.setting, (newValue) => {
    state.filterUser = newValue.user
}, {
    immediate: true,
    deep: true
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
    background-color: var(--setting-color, #fff);
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
    padding: var(--app-padding);
    h4 {
        padding: unset;
        margin: unset;
        color: #464646;
        font-size: 18px;
        font-family: Arial;
    }
}
.chartContainer {
    height: 100%;
    max-width: 100%;
    overflow-y: auto;
    display: flex;
    flex-flow: row wrap;
    container-type: inline-size;
    &-item {
        min-height: 300px;
    }
}
@container (min-width: 640px){
  .co-count{
    flex: 1 0 50%;
    max-width: 50% ;
  }
}
</style>
