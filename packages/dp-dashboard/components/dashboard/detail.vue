<template>
    <GridLayout :layout.sync="layout" 
        :col-num="24"
        :row-height="30"
        :is-draggable="draggable"
        :is-resizable="resizable">
        <GridItem v-for="(item, index) in layout"
                    class="dashboard-item"
                    :static="item.static"
                    :x="item.x"
                    :y="item.y"
                    :w="item.w"
                    :h="item.h"
                    :i="item.i"
                    @resized="chartResize(item)"
            >
            <component :is="DocMap[item.component]" :ref="el =>{sheetRefs[item.i] = el}" 
                :setting="item.setting"
                @delete="handleDelete(item)"
                @refreshSetting="(setting) => handleRefreshSetting(setting, item)"></component>
        </GridItem>    
    </GridLayout>
</template>

<script lang="ts" setup>
import { GridLayout, GridItem } from "vue3-grid-layout-next"
import DocTypeCoCount from '../doc/coCount/index.vue'
import DocTypeCount from '../doc/count.vue'
import DocSizeStatistics from '../doc/sizeStatistics.vue'
const props = withDefaults( defineProps<{
    layout: any[];
    resizable?: boolean;
    draggable?: boolean
}>() , {
    layout: [],
    resizable: true,
    draggable: true,
})
const emits = defineEmits([
    'refreshSetting', 'delete'
])
const DocMap = {
    'DocTypeCoCount': DocTypeCoCount,
    'DocTypeCount': DocTypeCount,
    'DocSizeStatistics': DocSizeStatistics,
}
const sheetRefs = ref({})

function handleDelete (row) {
    emits('delete', row.i)
}
function handleRefreshSetting (setting, row) {
    row.setting = setting
    emits('refreshSetting', row)
}
function chartResize(row) {
    sheetRefs.value[row.i].resize()
}
</script>

<style lang="scss" scoped>
.dashboard-item {
    :deep(.dashboard-item-main) {
        height: 100%;
    }
}
</style>
