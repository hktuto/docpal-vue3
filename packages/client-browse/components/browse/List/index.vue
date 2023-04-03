<template>
    <div class="listContainer">
        <div v-if="viewType === 'table'" class="h100">
            <browse-list-table :data="data" :loading="pending" @right-click="handleRightClick"/>
        </div>
        <!-- <div v-else-if="viewType === 'preview'">
            <browse-preview :doc="doc" :permission="permission" :data="data" :pending="pending" />
        </div>
        <div v-else-if="viewType === 'tree'">
            <browse-tree :doc="doc" :permission="permission" :data="data" :pending="pending" />
        </div>
        <div v-else-if="viewType === 'column'">
            <browse-column :doc="doc" :permission="permission" :data="data" :pending="pending" />
        </div> -->
    </div>
</template>

<script lang="ts" setup>
import { GetChild } from 'dp-api'
import { ViewType } from "../../browseType";
const props = withDefaults(defineProps<{
    doc?: any,
    permission?: any,
    viewType?: ViewType
}>(), {
    viewType: 'table'
})
const {doc} = toRefs(props)
function handleRightClick(data) {
    console.log({data});
    
}
</script>
<style lang="scss" scoped>
.h100 {
    height: 100%;
}
.listContainer {
    overflow: hidden;
}
</style>