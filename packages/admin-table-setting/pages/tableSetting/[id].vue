<template>
        <div class="mainContent">
            <div class="padding flex-x-between">
                <div class="title">{{route.params.id}}</div>
                <div>
                    <el-button @click="handlePreview">{{$t('preview')}}</el-button>
                    <el-button @click="handleOpenAdd">{{$t('addColumn')}}</el-button>
                    <el-button @click="handleSave">{{$t('common_save')}}</el-button>
                </div>
            </div>
           <TableColumnDrag ref="TableColumnDragRef" :tableColumns="tableColumns"></TableColumnDrag>
        </div>
        <TableColumnAdd ref="tableColumnAddRef" :typeList="typeList"
            @add="handleColumnAdd"></TableColumnAdd>
        <TablePreviewDialog ref="TablePreviewDialogRef"></TablePreviewDialog>
</template>


<script lang="ts" setup>
import draggable from 'vuedraggable'
import { Delete, Rank } from '@element-plus/icons-vue'
import { SaveTableColumnSetting } from 'dp-api'
import { defaultTableSetting } from 'dp-api/src/model/Table'

const route = useRoute()
const { tableColumnSetting } = toRefs(useSetting())
const tableColumnAddRef = ref()
const tableColumns = ref([])
const typeList = ref([])

function initTableColumns(id) {
    const defaultSlot = defaultTableSetting[route.params.id].slots
    const defaultEvents = defaultTableSetting[route.params.id].events
    if (defaultSlot && defaultSlot.length > 0) typeList.value.push('slot')
    if (defaultEvents && defaultEvents.length > 0) typeList.value.push('buttons')
    tableColumns.value = tableColumnSetting.value[id].columns    
}

const TableColumnDragRef = ref()
function handleSave () {
    dpLog('save');
    const columns = TableColumnDragRef.value.getColumns()
    const setting = deepCopy(tableColumnSetting.value)
    setting[route.params.id].columns = columns
    dpLog({setting});
    // SaveTableColumnSetting(setting)
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
const TablePreviewDialogRef = ref()
function handlePreview () {
    const columns = TableColumnDragRef.value.getColumns()
    TablePreviewDialogRef.value.handleOpen(columns)
}

watch(
        () => route.params,
        async (newval) => {
            initTableColumns(newval.id)
        },
        { immediate: true }
    )


</script>

<style lang="scss" scoped>
.mainContent {
    --card-height: 520px;
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
</style>