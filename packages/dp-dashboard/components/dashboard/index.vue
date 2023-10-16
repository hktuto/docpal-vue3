<template>
    <div class="dashboard-container">
        <div>header</div>
        <div class="dashboard-main">
            <GridLayout :layout.sync="gridLayoutState.layout" 
                :col-num="12"
                :row-height="30"
                :is-draggable="gridLayoutState.draggable"
                :is-resizable="gridLayoutState.resizable">
                <GridItem v-for="(item, index) in gridLayoutState.layout"
                            class="dashboard-item"
                            :static="item.static"
                            :x="item.x"
                            :y="item.y"
                            :w="item.w"
                            :h="item.h"
                            :i="item.i"
                            @resized="chartResize(item)"
                    >
                    <component :is="DocMap[item.component]" :ref="el =>{sheetRefs[item.id] = el}"></component>
                </GridItem>    
            </GridLayout>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { GridLayout, GridItem } from "vue3-grid-layout-next"
import DocAddOrientation from '../doc/addOrientation.vue'
import DocTypePercentage from '../doc/typePercentage.vue'
import DocSizeStatistics from '../doc/sizeStatistics.vue'
const DocMap = {
    'DocAddOrientation': DocAddOrientation,
    'DocSizeStatistics': DocSizeStatistics,
    'DocTypePercentage': DocTypePercentage,
}
const sheetRefs = ref({})
const gridLayoutState = reactive({
    layout: [
        {id: '1', "x":0,"y":0,"w":2,"h":2,"i":"0", component: 'DocAddOrientation'},
        {id: '2', "x":8,"y":0,"w":2,"h":3,"i":"4", component: 'DocAddOrientation'},
        {id: '3', "x":10,"y":0,"w":2,"h":3,"i":"5", component: 'DocSizeStatistics'},
        {id: '4', "x":0,"y":5,"w":2,"h":5,"i":"6", component: 'DocTypePercentage'},
        {id: '5', "x":2,"y":5,"w":2,"h":5,"i":"7", component: 'DocAddOrientation'},
        {id: '6', "x":4,"y":5,"w":2,"h":5,"i":"8", component: 'DocAddOrientation'},
        {id: '7', "x":6,"y":4,"w":2,"h":4,"i":"9", static: true},
        {id: '8', "x":8,"y":4,"w":2,"h":4,"i":"10"},
        {id: '9', "x":10,"y":4,"w":2,"h":4,"i":"11"},
        {id: '10', "x":0,"y":10,"w":2,"h":5,"i":"12"},
        {id: '11', "x":2,"y":10,"w":2,"h":5,"i":"13"},
        {id: '12', "x":4,"y":8,"w":2,"h":4,"i":"14"},
        {id: '13', "x":6,"y":8,"w":2,"h":4,"i":"15"},
        {id: '14', "x":8,"y":10,"w":2,"h":5,"i":"16"},
        {id: '15', "x":10,"y":4,"w":2,"h":2,"i":"17"},
        {id: '16', "x":0,"y":9,"w":2,"h":3,"i":"18"},
        {id: '17', "x":2,"y":6,"w":2,"h":2,"i":"19"}
    ],
    draggable: true,
    resizable: true,
})
function removeLayout () {

}
function chartResize(row) {
    console.log(sheetRefs.value);
    console.log();
    sheetRefs.value[row.id].resize()
}
</script>

<style lang="scss" scoped>
.dashboard-container {
    display: grid;
    grid-template-rows: min-content 1fr;
    gap: var(--app-padding);
    height: 100%;
    overflow: hidden;
    position: relative;
};
.dashboard-main {
    overflow: auto;
};
.dashboard-item {
    background-color: aquamarine;
    :deep(.dashboard-item-main) {
        height: 100%;
    }
}
</style>
