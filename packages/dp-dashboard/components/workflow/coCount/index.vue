<template>
    <el-card class="dashboard-item-co-main">
        <DashboardDetail 
            ref="DashboardDetailRef" 
            v-model:layout="state.layout"
            :resizable="true"
            :draggable="true"
            :colNum="4"
            :rowHeight="80"
            @refreshSetting="handleRefresh"></DashboardDetail>
    </el-card>
</template>

<script lang="ts" setup> 
import { GridLayout, GridItem } from "vue3-grid-layout-next"
import { ElNotification } from 'element-plus'
import { GetDashboardApi, UpdateDashboardApi, QueryDocumentTypeSizeApi, QueryDocumentTypeCountApi, deepCopy } from 'dp-api'
import {
} from "~/utils/dashboardWidgetHelper";
const props = withDefaults( defineProps<{
    setting?: any;
}>() , {
    setting: {}
})
const route = useRoute()
const state = reactive({
    info: {
        name: ''
    } as any,
    layout: [] as DashboardWidgetSetting[],
    loading: false,
    saveLoading: false
})

function handleDelete(i:string) {
    const index = state.layout.findIndex((item) =>  item.i === i)
    state.layout.splice(index, 1)
}
function handleRefresh (layoutSetting:any) {
    const index = state.layout.findIndex((item) =>  item.i === layoutSetting.i)
    state.layout[index] = deepCopy(layoutSetting)
}
function resize() {
}
function getLayout(s) {
    if(!s.layout) s.layout = []
    state.layout = s.displayList.reduce((prev,item, index) => {
        let layoutItem =  s.layout.find(lItem => lItem.component === item)
        if(!layoutItem) {
            layoutItem = {
                minW: 2,
                minH: 2,
                maxW: 4,
                maxH: 4,
                w: 2,
                h: 2,
                x: ((s.layout.length + index + 1) * 2) % 4,
                y: s.layout.length +  4 + index + 1, // puts it at the bottom
                i: new Date().valueOf() + index + 1,
                component: item,
                setting: s
            }
        } else {
            layoutItem.setting = { ...layoutItem.setting, ...s }
        }
        prev.push(layoutItem)
        return prev
    }, [])
}
watch(() => props.setting, (newSetting) => {
    console.log(deepCopy(newSetting))
    if(newSetting && newSetting.displayList) getLayout(deepCopy(newSetting))
}, {
    immediate: true
})
defineExpose({
    resize
})
</script>

<style lang="scss" scoped>
.dashboard-item-co-main {
    height: 100%;
    overflow: hidden;
}
.dashboard-item-co-main :deep(.el-card__body) {
    height: 100%;
    overflow-y: auto;
    overflow-x: hidden;
}
.dashboard-item-co-main :deep(.el-card__header) {
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
</style>
