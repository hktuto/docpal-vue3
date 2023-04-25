<template>
    <div class="listContainer">
        <el-tabs v-model="modelProps" @tab-click="tabChange">
        <el-tab-pane label="Table" name="table" class="h100">
            <browse-list-table :doc="doc" :loading="pending" 
                @select-change="handleSelectionChange"/>
        </el-tab-pane>
        <el-tab-pane label="Preview" name="preview" class="h100">
            <browse-list-preview :doc="doc" :permission="permission" :data="data" />
        </el-tab-pane>
        </el-tabs>
        <!-- <div v-else-if="viewType === 'tree'">
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
const emits = defineEmits([
    'select-change',
    'update:viewType'
])
const props = withDefaults(defineProps<{
    doc?: any,
    permission?: any,
    view?: ViewType
}>(), {
    view: 'table'
})
const {doc} = toRefs(props)
const modelProps = computed({
    get: () => props.view, 
    set: (value) => { emits('update:view', value) }
})

function tabChange(tab: TabsPaneContext, event: Event) {
    modelProps.value = tab.paneName
}
function handleSelectionChange (rows) {
    emits('select-change', rows)
}
</script>
<style lang="scss" scoped>
.h100 {
    height: 100%;
}
.listContainer {
    overflow: hidden;
}
:deep {
        .el-tabs {
                overflow: hidden;
    display: flex;
    flex-flow: column;
        }
        .el-tab-pane{
            height: 100%;
            overflow: hidden;
        }
        .el-tabs__content{
            height: 100%;
            overflow-y: auto;
            overflow-x: hidden;
        }
    }
</style>