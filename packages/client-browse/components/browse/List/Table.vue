<template>
<div class="tableContainer"  >
    <Table
        v-if="tableData"
        v-loading="loading"
        :columns="tableSetting.columns"
        :table-data="tableData"
        :options="options"
            @command="handleAction"
            @row-dblclick="handleDblclick"
            @row-contextmenu="handleRightClick"
            @selection-change="handleSelect"
            @contextmenu="handleEmptyRightClick">
            <template #docName="{ row, index }">
                <div class="nameContainer">
                    <BrowseItemIcon :type="row.isFolder ? 'folder' : 'file'"/>
                    <div class="label">{{row.name}}</div>
                </div>
            </template>
    </Table>
</div>
</template>


<script lang="tsx" setup>
import { GetChildThumbnail, GetDocDetail, TABLE, defaultTableSetting, GetDocPermission } from 'dp-api'
import {TableV2FixedDir} from 'element-plus'
import type { Column, RowClassNameGetter } from 'element-plus'
const emit = defineEmits([
    'right-click',
    'select-change'
])

const props = defineProps<{doc: any}>();
// #region module: page
const { t } = useI18n()
    const route = useRoute()
    const router = useRouter()
    const pageParams = ref({
        idOrPath: '/',
        pageIndex: 1,
        pageSize: 100
    })
    const state = reactive<State>({
        loading: false,
        tableData: [],
        options: {
            multiSelect: true,
            showPagination: false,
            selectable: (row, index) => {
                return !row.isFolder
            }
        },
        curDoc: {}
    })
    const tableKey = TABLE.CLIENT_BROWSE
    const tableSetting = defaultTableSetting[tableKey]

    async function getList (param:any) {
        const res = await GetChildThumbnail(param)
        if(res.totalSize === 0){
            return;
        }
        state.tableData.push(...res.entryList)
        if(state.tableData.length < res.totalSize) {
            param.pageIndex++;
            return getList(param)
        }else {
            return
        }
    }

    function getTableData(param:any) {
        getList(param)
    }

    async function cleanList () {
        state.tableData = []
    }

    function handleAction (command:string, row: any, rowIndex: number) {
        switch (command) {
            case 'disabled':
                handleDisabled(row)
                break
        }
    }

    function handleDisabled (_row) {

    }
    watch(
        () => route.query,
        async (newVal) => {

            const { path, isFolder } = newVal
            // 点击导航头时，isFolder 为 undefined,需要排除 undefined 的情况
            if (isFolder === 'false') return
            // 重置數據
            cleanList()
            pageParams.value = {
                idOrPath: path || '/',
                pageIndex: 1,
                pageSize: 100
            }
            pageParams.idOrPath = path || '/'
            getTableData(pageParams.value)
        },
        { immediate: true }
    )
    const { tableData, options, loading } = toRefs(state)
// #endregion


function handleDblclick (row) {
    state.curDoc = row
    router.push({
        path:'/browse',
        query: {
            path: row.path,
            isFolder: row.isFolder
        }
    })
}
async function handleEmptyRightClick(event: MouseEvent) {
    event.preventDefault()
    const data = {
        doc: props.doc,
        isFolder: props.doc.isFolder,
        idOrPath: props.doc.path,
        pageX: event.pageX,
        pageY: event.pageY,
        actions: {
            cut: false,
            copy: false,
            rename: false,
            delete: false
        }
    }
    const ev = new CustomEvent('fileRightClick',{ detail: prp })
    document.dispatchEvent(ev)
}

function handleRightClick (row: any, column: any, event: MouseEvent) {
    console.log(event);
    event.preventDefault()
    event.stopPropagation();
    const data = {
        doc: row,
        isFolder: row.isFolder,
        idOrPath: row.path,
        pageX: event.pageX,
        pageY: event.pageY,
    }
    const ev = new CustomEvent('fileRightClick',{ detail: data })
    document.dispatchEvent(ev)
}
function handleSelect (rows) {
    emit('select-change', rows)
}


</script>

<style lang="scss" scoped>
:deep {

    .nameContainer{
        display: flex;
        flex-flow: row nowrap;
        column-gap: var(--app-padding);
        align-items: center;
    }
}
:deep(.el-checkbox.is-disabled) {
    display: none;
}
.tableContainer{
    height: 100%;
}
</style>
