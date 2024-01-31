<template>
    <NuxtLayout class="fit-height withPadding" backPath="/master-table" :pageTitle="`${$t('admin_master-table')}/${masterTable.name}`">
        
        <Table ref="tableRef" v-loading="state.loading" :columns="tableSetting.columns" :table-data="state.tableData" :options="state.options"
            @command="handleAction"
            @row-dblclick="handleDblclick"
            @pagination-change="handlePaginationChange">
            <template #preSortButton>
                <ResponsiveFilter ref="ResponsiveFilterRef" @form-change="handleFilterFormChange"
                    inputKey="q"
                    inputPlaceHolder="tip.fuzzySearch"/>
            </template>  
            <template #suffixSortButton>
                <el-button :loading="state.importLoading" type="info" @click="handleImport()">{{$t('button.import')}}</el-button>
                <el-button :loading="state.exportLoading" type="info" @click="handleExport()">{{$t('button.export')}}</el-button>
                <el-button type="primary" @click="handleAddRow()">{{$t('button.add')}}</el-button>
            </template>
            <template #defaultHeader="{column}">
                <div class="column-dynamic" :style="`--column-color: ${getColor(column.property)}`"> {{ $t(column.label) }}
                    <div class="column-dynamic-point"></div>
                </div>
            </template>
        </Table>
        <input v-show="false"  ref="inputRef" type="file" accept=".csv" @change="handleFile"/>
        <MasterTableNewRowDialog ref="MasterTableNewRowDialogRef" :ignoreList="ignoreList" @refresh="handlePaginationChange(1)"/>
        <div class="marsterTable-note">
            <div v-for="item in ['optional', 'unique', 'required' ]" class="column-dynamic" :style="`--column-color: ${getColor('',item)}`"> {{ $t(`marsterTable.${item}`) }}
                <div class="column-dynamic-point"></div>
            </div>   
        </div>
    </NuxtLayout>
</template>

<script lang="ts" setup>
import { ElNotification } from 'element-plus'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
    DeleteMasterTablesRecordApi,
    GetMasterTablesRecordPageApi,
    GetMasterTablesDetailApi,
    ExportMasterTablesRecordApi,
    ImportMasterTablesRecordApi,
    ExportMasterTablesDownloadFailureListApi,
    defaultTableSetting, TABLE, TableAddColumns,
    
} from 'dp-api'

// #region module: page
    const route = useRoute()
    const router = useRouter()
    const pageParams = {
        pageNum: 0,
        pageSize: 20,
        // orderBy: 'createdDate',
        // isDesc: true
    }
    const tableSetting = ref({
        columns: [
            { id: '1', label: 'docType_id', prop: 'id', defaultColumn: true },
            { id: '2', label: 'workflow_createDate', prop: 'created_date', width: 140, 
                formatList: [
                    {
                        "joiner": "",
                        "prop": "created_date",
                        "formatFun": "dateFormat",
                        "params": {
                            "format": ""
                        },
                        "index": 0
                    }
                ]
            },
            { id: '3', label: 'tableHeader_modifiedDate', prop: 'modified_date', width: 140, 
                formatList: [
                    {
                        "joiner": "",
                        "prop": "modified_date",
                        "formatFun": "dateFormat",
                        "params": {
                            "format": ""
                        },
                        "index": 0
                    }
                ]
            },
            { id: '4', label: 'modified_by', prop: 'modified_by', width: 110 },
            {   
                id: '5',
                "type": "",
                "label": "dpTable_actions",
                class: "slotTopRight",
                "prop": "",
                "align": "center",
                "width": 100,
                "hide": false,
                "system": false,
                "showOverflowTooltip": false,
                "formatList": [],
                "buttons": [
                    {
                        "name": "",
                        "type": "text",
                        "command": "edit",
                        "suffixIcon": "/icons/edit.svg",
                        "index": 0
                    },
                    {
                        "name": "",
                        "type": "text",
                        "command": "delete",
                        "suffixIcon": "/icons/menu/trash.svg",
                        "index": 0
                    }
                ],
                "prefixIcon": "",
                "suffixIcon": "",
            }
        ],
        events: ['delete'],
        slots: [
        ],
        options: { pageSize: 20 }
    })
    const state = reactive<State>({
        loading: false,
        tableData: [],
        options: {
            multiSelect: true,
            showPagination: true,
            paginationConfig: {
                total: 0,
                currentPage: 1,
                pageSize: pageParams.pageSize
            },
            rowKey: 'id',
            sortKey: `mt_${route.params.id}`
        },
        extraParams: {},
        importLoading: false,
        exportLoading: false
    })
    const masterTable = reactive({
        name: '',
        fields: [],
        columns: [],
    })


    async function getList (param) {
        state.loading = true
        try {
            const res = await GetMasterTablesRecordPageApi({ ...param, ...state.extraParams, id: route.params.id })
            state.tableData = res.entryList
            state.options.paginationConfig.total = res.totalSize
            state.options.paginationConfig.pageSize = param.pageSize
            state.options.paginationConfig.currentPage = param.pageNum + 1
        } catch (error) {

        }
        state.loading = false
    }
    function handlePaginationChange (page: number, pageSize: number) {
        if(!page) page = pageParams.pageNum + 1
        if(!pageSize) pageSize = pageParams.pageSize
        const time = new Date().valueOf().toString()
        // scroll top
        router.push({
            query: { page, pageSize, time }
        })
    }
    watch(
        () => route.query,
        async (newval) => {
            const { page, pageSize } = newval
            nextTick(() => {

              pageParams.pageNum = (Number(page) - 1) || 0
              pageParams.pageSize = Number(pageSize) || pageParams.pageSize
              getList(pageParams)
            })
        },
        { immediate: true }
    )
// #endregion
function handleAction (command, row: any, index: number) {
    switch (command) {
        case 'delete':
            handleDelete(row.id)
            break
        case 'edit':
            handleAddRow(row)
            break
        default:
            break
    }
}
async function handleDelete(id: string) {
    const action = await ElMessageBox.confirm(`${$t('msg_confirmWhetherToDelete')}`)
    if(action !== 'confirm') return
    await DeleteMasterTablesRecordApi(route.params.id, id)
    handlePaginationChange(pageParams.pageNum + 1)
}
function handleDblclick(row) {
    handleAddRow(row)
}
function getColor(prop, option?: 'unique' | 'required' | 'optional') {
    try {
        if(!!prop) {
            const mItem = masterTable.fields.find(item => item.columnName === prop)
            if (mItem.unique) return '#0099FF'
            else if (mItem.required) return '#7B61FF'
        }
    } catch (error) {
    }
    switch (option) {
        case 'unique':
            return '#0099FF'
        case 'required':
            return '#7B61FF'
        default:
            break;
    }
    console.log(option);
    
    // return 'red'
    return '#373D43'
}
const MasterTableNewRowDialogRef = ref()
function handleAddRow (row) {
    MasterTableNewRowDialogRef.value.handleOpen(masterTable.fields, row)
}
// #region module: ResponsiveFilterRef
    function handleFilterFormChange(formModel) {
        state.extraParams = formModel
        handlePaginationChange(1)
    }
// #endregion
const tableRef = ref()
const ignoreList = ['id', 'created_date','modified_date', 'modified_by']
async function initTableColumns() {
    const res = await GetMasterTablesDetailApi(route.params.id)
    masterTable.name = res.name
    masterTable.fields = res.fields

    masterTable.fields.forEach((item, index) => {
        if(ignoreList.includes(item.columnName)) return
        const _item = {
            id: item.columnName,
            label: item.columnName,
            prop: item.columnName,
            headerSlot: 'defaultHeader'
        }
        if(item.dataType === 'timestamp') _item.type = 'date'
        TableAddColumns(_item, tableSetting.value.columns, index)
    })
    tableRef.value.reorderColumn(tableSetting.value.columns)
}
// #region module: export import
    async function handleExport() {
        state.exportLoading = true
        try {
            const res = await ExportMasterTablesRecordApi(route.params.id)
            downloadBlob(res, masterTable.name)
        } catch (error) {
        }
        state.exportLoading = false
    }
    const inputRef = ref()
    function handleImport() {
        inputRef.value.click()
    }
    async function handleFile(event) {
        state.importLoading = true
        try {
            const formData = new FormData()
            formData.append('file', event.target.files[0])
            formData.append('id', route.params.id)
            event.target.value = ''
            const data = await ImportMasterTablesRecordApi(formData)
            if (data?.failureNumber > 0) downloadFailList(data.failureNumber)
            handlePaginationChange(1)
        } catch (error) {
        }
        state.importLoading = false
    }
    async function downloadFailList (failureNumber) {
        const noti = ElNotification({
            title: $t('masterTable.importFailList'),
            showClose: true,
            duration: 0,
            type: 'warning'
        });
        const res = await ExportMasterTablesDownloadFailureListApi(route.params.id)
        downloadBlob(res, masterTable.name + '-failure')
    }
// #endregion
onMounted(() => {
    initTableColumns()
})
</script>

<style lang="scss" scoped>
:deep(.tableHeader) {
    margin-bottom: 10px;
    & > .el-button {
        margin: unset;
    }
}
.emailActionButton {
    padding: unset;
}
.column-dynamic {
    color: var(--column-color);
    display: flex;
    align-items: center;
    &-point {
        width: 8px;
        height: 8px;
        margin-left: 3px;
        border-radius: 50%;
        background-color: var(--column-color);
    }
}
.marsterTable-note {
    position: absolute;
    top: 20px;
    right: 30px;
    display: flex;
    &>div {
        margin-left: var(--app-padding)
    }
}
</style>
