<template>
    <GridLayout 
        v-model:layout="layout" 
        :col-num="colNum"
        :margin="[20,20]"
        :row-height="rowHeight"
        :is-draggable="draggable"
        :is-resizable="resizable"
        :responsive="true"
        :verticalCompact="true"
        :preventCollision="false"
        :use-css-transforms="true"
    >
        <GridItem v-for="(item, index) in layout"
                    class="dashboard-item"
                    v-bind="item"
            >
            <component :is="widgetComponent[item.component]" :ref="el =>{sheetRefs[item.i] = el}" 
                :setting="item.setting"
                @delete="handleDelete(item)"
                @refreshSetting="(setting) => handleRefreshSetting(setting, item)"></component>
        </GridItem>    
    </GridLayout>
</template>

<script lang="ts" setup>
import { GridLayout, GridItem } from "vue3-grid-layout-next"
import {DashboardWidgetSetting, widgetComponent} from "~/utils/dashboardWidgetHelper";

const props = withDefaults( defineProps<{
    layout: DashboardWidgetSetting[],
    resizable?: boolean,
    draggable?: boolean,
    colNum?: number,
    rowHeight?: number,
}>() , {
    layout: [],
    resizable: true,
    draggable: true,
    colNum: 12,
    rowHeight: 130
})
const { layout} = toRefs(props)
const emits = defineEmits([
    'refreshSetting', 'delete'
])

const sheetRefs = ref<any>({})

function handleDelete (row:any) {
    emits('delete', row.i)
}
function handleRefreshSetting (setting:any, row:any) {
    row.setting = setting
    emits('refreshSetting', row)
}
function chartResize(row:any) {
    if(sheetRefs.value[row.i]) sheetRefs.value[row.i].resize()
}

function layoutUpdatedEvent(newLayout:any){
  console.log(newLayout)
}
</script>

<style lang="scss" scoped>
.dashboard-item {
    :deep(.dashboard-item-main) {
        height: 100%;
    }
}
</style>
