<template>
<div class="tableContainer"  >


    <Table v-if="tableData" v-loading="loading" :columns="tableSetting.columns" :table-data="tableData" :options="options"
            @pagination-change="handlePaginationChange"
            @command="handleAction"
            @row-dblclick="handleDblclick"
            @row-contextmenu="handleRightClick"
            @selection-change="handleSelect">
            <template #docName="{ row, index }">
                <div class="nameContainer">
                    <BrowseItemIcon :type="row.isFolder ? 'folder' : 'file'"/>
                    <div class="label">{{row.name}}</div>
                </div>
            </template>
    </Table>
</div>
</template>


<script lang="ts" setup>
import { GetChildThumbnail, TABLE, defaultTableSetting } from 'dp-api'
const emit = defineEmits([
    'right-click',
    'select-change'
])
const props = defineProps<{doc: any}>();
// #region module: page
    const route = useRoute()
    const router = useRouter()
    const pageParams = {
        pageIndex: 1,
        pageSize: 50,
        idOrPath: '/'
    }
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
            selectable: (row, index) => {
                return !row.isFolder
            } 
        }
    })
    const tableKey = TABLE.CLIENT_BROWSE
    const tableSetting = defaultTableSetting[tableKey]

    async function getList (param) {
        state.loading = true
        const res = await GetChildThumbnail(param)
        state.tableData = res.entryList
        state.options.paginationConfig.total = res.totalSize
        state.options.paginationConfig.pageSize = param.pageSize
        state.options.paginationConfig.currentPage = param.pageNumber + 1
        state.loading = false
    }
    function handlePaginationChange (page: number, pageSize: number, path?: string, isFolder?: boolean) {
        if(!pageSize) pageSize = pageParams.pageSize
        const time = new Date().valueOf().toString()
        
        router.push({ 
            query: { page, pageSize, time, path: path || pageParams.idOrPath, isFolder} 
        })
    }
    function handleAction (command:sting, row: any, rowIndex: number) {
        switch (command) {
            case 'disabled':
                handleDisabled(row)
                break
        }
    }
    function handleDisabled (row) {
        console.log({row});
    }
    watch(
        () => route.query,
        async (newval) => {
            const { page, pageSize, path, isFolder } = newval
            // 点击导航头时，isFolder 为 undefined,需要排除 undefined 的情况
            if (isFolder === 'false') return
            pageParams.idOrPath = path || pageParams.idOrPath
            pageParams.pageIndex = page ? (Number(page) - 1) : 0
            pageParams.pageSize = Number(pageSize) || pageParams.pageSize
            getList({pageNumber: pageParams.pageIndex, pageSize: pageParams.pageSize, idOrPath:  pageParams.idOrPath})
        },
        { immediate: true }
    )
    const { tableData, options, loading } = toRefs(state)
// #endregion

function handleDblclick (row) {
    handlePaginationChange(1, pageParams.pageSize, row.path, row.isFolder)
}
function handleRightClick (row: any, column: any, event: MouseEvent) {
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
    console.log(rows);
    emit('select-change', rows)
}

function handleRootRightClick (item, event) {
    event.preventDefault();
    event.stopPropagation();
    const data = {
        isFolder: true,
        idOrPath: item.path,
        pageX: event.pageX,
        pageY: event.pageY,
        doc: item
    }
    const ev = new CustomEvent('fileRightClick',{ detail: data })
    document.dispatchEvent(ev)
}
</script>

<style lang="scss" scoped>
.nameContainer{
    display: flex;
    flex-flow: row nowrap;
    column-gap: var(--app-padding);
    align-items: center;
}
:deep(.el-checkbox.is-disabled) {
    display: none;
}
.tableContainer{
    height: 100%;
}
</style>
