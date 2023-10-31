<template>
    <GridLayout 
        v-model:layout="layout" 
        :col-num="12"
        :margin="[20,20]"
        :row-height="130"
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
                    @resized="chartResize(item)"
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
}>() , {
    layout: [],
    resizable: true,
    draggable: true,
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
    sheetRefs.value[row.i].resize()
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
