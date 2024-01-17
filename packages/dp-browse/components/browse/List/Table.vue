<template>
<div :class="['tableContainer']" 
    >
    
        <Table
            ref="TableRef"
            v-if="list"
            v-loading="loading"
            :class="{ dragActive: state.dragActive }"
            :columns="tableSetting.columns"
            :table-data="filterList"
            :options="options"
                @command="handleAction"
                @row-dblclick="handleDblclick"
                @row-contextmenu="handleRightClick"
                @selection-change="handleSelect">
                <template #nameFilter="{column, index}">
                    <el-input
                        v-model="keywords"
                        size="mini"
                        :placeholder="$t(column.label)"
                        class="searchInput"
                        clearable
                        @clear="keywords = ''"
                    />
                </template>
                <template #docName="{ row, index }">
                    <div class="nameContainer" :data-row-name="row.name">
                        <div :class="{selectContainer:true, checked: isSelected(row)}">
                            <div v-if="options.selectable(row, index)" class="rowCheckbox">
                                <SvgIcon class="checkIcon" src="/icons/white_check.svg" />
                            </div>
                            <BrowseItemIcon class="icon" :type="row.isFolder ? 'folder' : 'file'" :mimeType="row.mimeType" status="general"/>
                        </div>
                        <div class="label">{{row.name}}</div>
                        <DropzoneContainer v-if="row.isFolder" :doc="row" class="folderDropzone backgroundDrop"></DropzoneContainer>
                    </div>
                </template>
                <template #mimeType="{ row, index }">
                    <template v-if="!row.isFolder && row.mimeType">{{ mime.extension(row.mimeType) }}</template>
                    <template v-else>-</template>
                </template>
                <template #tags="{ row, index }">
                    <el-tag class="el-icon--left" v-for="tag in row.tags">{{ tag }}</el-tag>
                </template>
                <template #contributors="{ row, index }">
                    <el-tag class="el-icon--left" v-for="tag in row.contributors">{{ tag }}</el-tag>
                </template>
        </Table>
        
</div>

</template>


<script lang="tsx" setup>
import { GetDocDetail, TABLE, defaultTableSetting } from 'dp-api'
import {openFileDetail} from "~/utils/browseHelper";
import { useEventListener } from '@vueuse/core'
import * as mime from 'mime-types'
const emit = defineEmits([
    'right-click',
    'select-change',
])
const selectedItems = ref<any>([])
const props = defineProps<{list: any}>();
const TableRef = ref()

const { list } = toRefs(props) 
const keywords = ref('')
const filterList = computed(() => {
    return list.value.filter((item:any) => {
        return !keywords.value || item.name.toLowerCase().includes(keywords.value.toLowerCase())
    })
})

// #region module: page
const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const pageParams = ref({
    idOrPath: '/',
    pageNumber: 0,
    pageSize: 100
})

const tableKey = TABLE.CLIENT_BROWSE
const tableSetting = defaultTableSetting[tableKey]

const state = reactive<State>({
    loading: false,
    options: {
        multiSelect: true,
        showPagination: false,
        selectable: (row, index) => {
            return !row.isFolder
        },
      sortKey: tableKey
    },
    curDoc: {},

    dragActive: false
})




function handleAction (command:string, row: any, rowIndex: number, evt:MouseEvent) {
    switch (command) {
        case 'disabled':
            handleDisabled(row)
            break
      case 'rightClick':
        handleRightClick(row, null, evt)
    }
}

function handleDisabled (_row:any) {

}

const { tableData, options, loading } = toRefs(state)
// #endregion


function handleDblclick (row:any, column: any, event: any) {
    if (event.ctrlKey) {
        const url = router.resolve({  path: '/browse', query: { path: row.path } })
        window.open(url.href, '_blank');
        return
    }
    state.curDoc = row;
    router.push({
      query: {
        ...route.query,
        path: row.path,
        isFolder: row.isFolder
      }
    });
    
    // openFileDetail(row.path, {
    //   showInfo:true,
    //   showHeaderAction:true
    // })
}


function handleRightClick (row: any, column: any, event: MouseEvent) {
    event.preventDefault()
    event.stopPropagation();
    // handleSelect([])
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
function toggleSelection (rows:any[]) {
    console.log(TableRef.value, rows);
    TableRef.value.toggleSelection(rows)
}
onMounted(() => {
    useEventListener(document, 'setTableSelection', (event) => toggleSelection(event.detail?.rows || undefined))
})

watch(list, (val) => {
    keywords.value = "";
})
defineExpose({ TableRef })
</script>

<style lang="scss" scoped>
:deep {

    .nameContainer{
        display: flex;
        flex-flow: row nowrap;
        column-gap: var(--app-padding);
        align-items: center;
        position: relative;
      .label{
        word-break: break-all;
      }
    }
}
:deep(.el-checkbox.is-disabled) {
    display: none;
}
.tableContainer{
    height: 100%;
}
.el-tag {
    margin-bottom: calc(var(--app-padding) / 3)
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
    --icon-size: 2rem;
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
        --check-size: 32px;
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
.backgroundDrop{
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
}

.folderDropzone{
    &.isOverDropZone{
        border-left: 1px solid var(--primary-color);
        &:after{
            background: linear-gradient(90deg, var(--primary-color-03) 0%,  rgba(189, 189, 189, 0) 100%);
            outline : none;
        }
    }
}
.headerSearchContainer{
    float: left;
    display: flex;
    flex-flow:  row nowrap;
    justify-content: flex-start;
    align-items: center;
    gap: var(--app-padding);
}
.searchInput{
    width: auto;
}
</style>
<style lang="scss">
.forbidden-childe-pointer-events * {
    pointer-events: none;
}
</style>
