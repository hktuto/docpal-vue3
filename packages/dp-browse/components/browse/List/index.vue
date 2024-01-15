<template>
    <div class="listContainer">
        <div class="left">
          <DropzoneContainer v-if="!isMobile" class="backgroundDrop rootDrop" :doc="doc" 
            @contextmenu="handleEmptyRightClick"/>
            <el-tabs v-model="modelProps" @tab-click="tabChange">
            <el-tab-pane :label="$t('browse_list_table')" name="table" class="h100" >
                <browse-list-table v-if="modelProps === 'table'" id="browseTable" :list="children" :loading="pending" 
                    @select-change="handleSelectionChange" />
            </el-tab-pane>
            <el-tab-pane :label="$t('browse_list_preview')" name="preview" class="h100" >
                <browse-list-preview v-if="modelProps === 'preview'" id="browsePreview" :list="children"  :permission="permission" />
            </el-tab-pane>
            </el-tabs>
        </div>
        <div class="right">
            <slot :doc="doc" :permission="permission" />
        </div>
    </div>
</template>

<script lang="ts" setup>
import {GetChild, GetChildThumbnail} from 'dp-api'
import { ViewType } from "../../browseType";
const { isMobile } = useLayout()
const pageParams = ref({
  idOrPath: '/',
  pageNumber: 0,
  pageSize: 1000
})
const children = ref<any[]>([]);

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

async function getList (param:any):Promise<any> {
  const res = await GetChildThumbnail(param)
  if(res.totalSize === 0 || res.entryList.length === 0){
    return;
  }
  children.value.push(...res.entryList)
  if(children.value.length < res.totalSize ) {
    param.pageNumber++;
    return getList(param)
  }else {
    return
  }
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
async function cleanList () {
  children.value = []
}

watch( doc, () => {
  cleanList()
  pageParams.value = {
    idOrPath: doc.value.path || '/',
    pageNumber: 0,
    pageSize: 100
  }
  getList(pageParams.value)
},{
  immediate:true
})
</script>
<style lang="scss" scoped>
.h100 {
    height: 100%;
}
.listContainer{
    display: grid;
    grid-template-columns: 1fr min-content;
    overflow: hidden;
    @media (max-width: 640px) {
      grid-template-columns: 1fr;
      .right {
        z-index: 2;
        position: absolute;
        left: 0;
        top: var(--app-padding);
        
      }
    }
}
.left, .right{
    height: 100%;
    overflow: hidden;
    position: relative;
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

.backgroundDrop{
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}
</style>