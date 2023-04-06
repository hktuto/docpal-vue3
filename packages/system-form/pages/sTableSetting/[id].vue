<template>
<div class="mainContent">
    <div class="padding flex-x-between">
        <div class="title">{{route.params.id}}</div>
        <div>
            <el-button @click="handlePreview">{{$t('preview')}}</el-button>
            <el-button @click="handleOpenAdd">{{$t('addColumn')}}</el-button>
            <el-button @click="handleSave">{{$t('save')}}</el-button>
        </div>
    </div>
    <TableColumnDrag ref="TableColumnDragRef" :tableColumns="tableColumns"></TableColumnDrag>
    <TablePreviewDialog ref="TablePreviewDialogRef"></TablePreviewDialog>
    <TableColumnAdd ref="tableColumnAddRef" :typeList="typeList"
        @add="handleColumnAdd"></TableColumnAdd>
</div>
</template>


<script lang="ts" setup>
import { tableSettingJson } from 'dp-api'

const route = useRoute()
const tableColumnAddRef = ref()
const state = reactive({
    setting: {},
    tableColumns: [],
    typeList: []
})

function initTableColumns(tableKey) {
    console.log({tableSettingJson});
    
    state.setting = deepCopy(tableSettingJson[tableKey])
    state.tableColumns = state.setting.columns
    const defaultSlot = state.setting.slots
    const defaultEvents = state.setting.events
    if (defaultSlot && defaultSlot.length > 0) state.typeList.push('slot')
    if (defaultEvents && defaultEvents.length > 0) state.typeList.push('buttons')
}
const { tableColumns, typeList } = toRefs(state)
async function handleSave () {
    const columns = TableColumnDragRef.value.getColumns()
    const setting = deepCopy(tableSettingJson)
    setting[route.params.id].columns = columns
    console.log({setting});
    
    const save = await $fetch('/table/save', { method:'post', body: setting })
    console.log({save});
}
function handleColumnAdd (column) {
    column.id = new Date().valueOf().toString()
    state.tableColumns.push(column)
}
function handleDeleteColumn (column,index) {
    state.tableColumns.splice(index, 1)
}
function handleOpenAdd () {
    tableColumnAddRef.value.handleOpen()
}
const TablePreviewDialogRef = ref()
const TableColumnDragRef = ref()
function handlePreview () {
    const columns = TableColumnDragRef.value.getColumns()
    TablePreviewDialogRef.value.handleOpen(columns)
}

watch(() => route.params, async (newval) => {
    initTableColumns(newval.id)
},{ immediate: true })


</script>

<style lang="scss" scoped>
.mainContent {
    --card-height: 520px;
    --card-width: 400px;
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
            overflow: hidden;
            display: grid;
            grid-template-rows: min-content 1fr;
            :deep(.el-card__body) {
                overflow: auto;
            }
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