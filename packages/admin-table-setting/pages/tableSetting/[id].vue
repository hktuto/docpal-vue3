<template>
    <NuxtLayout >
        <div class="mainContent">
            <div class="padding flex-x-between">
                <div class="title">{{route.params.id}}</div>
                <div>
                    <el-button @click="handleOpenAdd">add column</el-button>
                    <el-button @click="handleSave">save</el-button>
                </div>
            </div>
            <draggable
                :list="tableColumns"
                item-key="id"
                class="table-setting"
                ghost-class="ghost"
                :move="checkMove"
                @start="dragging = true"
                @end="dragging = false"
            >
                <template #item="{ element, index }">
                    <el-card>
                        <template #header>
                            <div class="flex-x-between">
                                <span>column-{{index + 1}}</span>
                                <el-button v-if="!element.default" class="button" :icon="Delete" @click="handleDeleteColumn(element,index)"></el-button>
                            </div>
                        </template>
                        <TableColumnEdit :ref="(el) => tableColumnEditRefs[element.id] = el" :column="element"></TableColumnEdit>
                    </el-card>
                </template>
            </draggable>
        </div>
        <TableColumnAdd ref="tableColumnAddRef"
            @add="handleColumnAdd"></TableColumnAdd>
    </NuxtLayout>
</template>


<script lang="ts" setup>
import draggable from 'vuedraggable'
import { Delete } from '@element-plus/icons-vue'
import { SaveTableColumnSetting } from 'dp-api'
const route = useRoute()
const { tableColumnSetting } = toRefs(useSetting())
const tableColumnEditRefs = ref({})
const tableColumnAddRef = ref()
const tableColumns = ref([])

function initTableColumns(id) {
    if(id === 'trash') {
        tableColumns.value = [
            { id: '1', label: 'tableHeader_name', prop: 'name' },
            { id: '2', label: 'tableHeader_path', prop: 'logicalPath' },
            { id: '3', label: 'tableHeader_type', prop: 'type' },
            { id: '4', label: 'trash_deleteBy', prop: 'properties.principalName' },
            { id: '5', label: 'trash_date', prop: "properties.trashed_date", type: 'date' }
        ]
    } else {
        tableColumns.value = tableColumnSetting.value[id]
    }
}
function handleSave () {
    const columns = []
    const columnIds = tableColumns.value.reduce((prev, item) => {
        prev.push(item.id)
        return prev
    },[])
    columnIds.forEach(id => {
        columns.push(tableColumnEditRefs.value[id].getForm())
    })
    const setting = deepCopy(tableColumnSetting.value)
    setting[route.params.id] = columns
    SaveTableColumnSetting(setting)
}
function handleColumnAdd (column) {
    column.id = new Date().valueOf().toString()
    tableColumns.value.push(column)
}
function handleDeleteColumn (column,index) {
    tableColumns.value.splice(index, 1)
}
function handleOpenAdd () {
    tableColumnAddRef.value.handleOpen()
}
watch(
        () => route.params,
        async (newval) => {
            initTableColumns(newval.id)
        },
        { immediate: true }
    )
// #region module: draggable
    const dragEnabled = ref(true) // 为true时方可拖拽 
    const dragging = ref(false)
    function checkMove (e) {
        console.log("Future index: " + e.draggedContext.futureIndex);
    }
// #endregion


</script>

<style lang="scss" scoped>
.mainContent {
    --card-height: 480px;
    --card-width: 280px;
    padding: var(--app-padding);
    display: grid;
    grid-template-rows: min-content 1fr;
    height: 100%;
    .table-setting {
        overflow: auto;
        display: grid;
        grid-template-columns: repeat(auto-fill, var(--card-width));
        align-content: start;
        gap: var(--app-padding) 0;
        overflow: auto;
        .el-card {
            margin: var(--app-padding);
            height: var(--card-height);
        }
    }
}
.padding {
    padding: var(--app-padding)
}
.ghost {
  opacity: 0.5;
  background: #c8ebfb;
}
.title{
    font-size: 1.6rem;
    font-weight: 900;
}
</style>