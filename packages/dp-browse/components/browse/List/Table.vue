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
                    <div :class="{selectContainer:true, checked: isSelected(row)}">
                        <div v-if="options.selectable(row, index)" class="rowCheckbox">
                            <SvgIcon class="checkIcon" src="/icons/white_check.svg" />
                        </div>
                        <BrowseItemIcon class="icon" :type="row.isFolder ? 'folder' : 'file'" status="general"/>
                    </div>
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
    'select-change',
])
const selectedItems = ref<any>([])
const props = defineProps<{doc: any}>();
const { doc } = toRefs(props) 
// #region module: page
const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const pageParams = ref({
    idOrPath: '/',
    pageNumber: 0,
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
    if(res.totalSize === 0 || res.entryList.length === 0){
        return;
    }
    state.tableData.push(...res.entryList)
    if(state.tableData.length < res.totalSize ) {
        param.pageNumber++;
        return getList(param)
    }else {
        return
    }
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

function handleDisabled (_row:any) {

}
watch(
    doc,
    async (newVal:any) => {
        console.log('doc change', newVal)
        // 重置數據
        cleanList()
        pageParams.value = {
            idOrPath: newVal.path || '/',
            pageNumber: 0,
            pageSize: 100
        }
        getList(pageParams.value)
    },
    { immediate: true, deep:true }
)
const { tableData, options, loading } = toRefs(state)
// #endregion


function handleDblclick (row:any) {
    state.curDoc = row;
    router.push({
        query: {
            path: row.path,
            isFolder: row.isFolder
        }
    });
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
    const ev = new CustomEvent('fileRightClick',{ detail: data })
    document.dispatchEvent(ev)
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

function isSelected({rowIndex}) {
    return selectedItems.value.findIndex((item:any) => item.rowIndex === rowIndex) > -1
}

function customSelectChange(selected: boolean) {

}

function handleSelect (rows:any) {
    console.log("handleSelect")
    selectedItems.value = rows
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
:deep(.el-table__row){
    height: 100%;
    &:hover{
        .rowCheckbox {
            border: 1px solid var(--primary-color);
        }
        .iconContainer{
            transform: scale(1.2) rotate(6deg);
            z-index: 2;
        }
    }
}
.selectContainer{
    --container-size: 40px;
    --check-size: 40px;
    width: var(--container-size);
    height: var(--container-size);
    position: relative;
    display: grid;
    place-items: center;
    &.checked {
        .rowCheckbox {
            background: #fff;
            border: 1px solid var(--primary-color);
            box-shadow: 0 0 5px rgba(0,0,0,0.2);
            z-index: 1;
            --icon-color: var(--primary-color);
        }
        .iconContainer{
            z-index: 2;
            position: absolute;
            transform: scale(.5) rotate(5deg);
            top: -2px;
            left: -2px;
        }
    }
    .iconContainer{
        transition: all .2s ease-in-out;
    }
    .rowCheckbox{
        --check-size: 26px;
        --icon-color: transparent;
        --icon-size: calc(var(--check-size) - 8px);
        position: absolute;
        width: var(--check-size);
        height: var(--check-size);
        border-radius: 50%;
        left: calc( (var(--container-size) - var(--check-size))  / 2);
        top: calc( (var(--container-size) - var(--check-size))  / 2);
        z-index: 2;
        display: grid;
        place-items: center;
        .checkIcon{
            width: var(--icon-size);
            height: var(--icon-size);
        }
    }
}
</style>
