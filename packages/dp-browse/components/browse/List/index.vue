<template>
    <div class="listContainer">
        <div class="left">
            <el-tabs v-model="modelProps" @tab-click="tabChange">
            <el-tab-pane label="Table" name="table" class="h100">
                <browse-list-table v-if="modelProps === 'table'" :doc="doc" :loading="pending" 
                    @select-change="handleSelectionChange" />
            </el-tab-pane>
            <el-tab-pane label="Preview" name="preview" class="h100">
                <browse-list-preview v-if="modelProps === 'preview'" :doc="doc" :permission="permission" />
            </el-tab-pane>
            </el-tabs>
        </div>
        <div class="right">
            <slot :doc="doc" :permission="permission" />
        </div>
    </div>
</template>

<script lang="ts" setup>
import { GetChild } from 'dp-api'
import { ViewType } from "../../browseType";
const emits = defineEmits([
    'select-change',
    'update:viewType',
    'open-detail',
])
const props = withDefaults(defineProps<{
    doc?: any,
    permission?: any,
    view?: ViewType
}>(), {
    view: 'table'
})
const {doc} = toRefs(props)
const modelProps = ref('table')

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
.listContainer{
    display: grid;
    grid-template-columns: 1fr min-content;
    overflow: hidden;
}
.left, .right{
    height: 100%;
    overflow: hidden;
}
:deep {
        .el-tabs {
            height: 100%;
                overflow: hidden;
                display: flex;
                flex-flow: column;
                position: relative;
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