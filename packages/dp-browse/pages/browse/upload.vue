<template>
    <NuxtLayout class="fit-height withPadding" :backPath="state.backPath" :pageTitle="$t('browse.uploadText')">
        <!-- <template #headerLeft>{{state.rootDoc.logicPath}}</template> -->
        <main class="upload-main" v-loading="state.loading">
            <!-- <div class="upload-header">
                <el-input v-model="state.filterText" clearable placeholder="Filter keyword" />
            </div> -->
          <div class="main">
            <div class="main-left">
              
            
              <div class="upload-main-left-header">
                <el-button @click="resetChecked">{{$t('reset')}}</el-button>
              </div>
              <div class="upload-main-left-main">
              <el-tree ref="treeRef" :data="state.fileList" :props="state.defaultProps"
                       default-expand-all
                       nodeKey="id" show-checkbox check-strictly :expand-on-click-node="false"
                       :filter-node-method="filterNode"
                       @node-click="handleNodeClick"
                       @check="handleCheck">
                <template #default="{ node, data }">
                  <div class="flex-x-between tree-item">
                            <span class="flex-x-start">
                                 <BrowseItemIcon class="el-icon--left" :type="data.isFolder ? 'folder' : 'file'" />
                                {{data.name}}
                            </span>
                    <div>{{data.documentType}}</div>
                  </div>
                </template>
              </el-tree>
            </div>
            </div>
            <div class="main-right">
              <div class="upload-main-center" >
                <UploadStructureMetaForm ref="UploadMetaFormRef" @apply-to-selected="handleApplyToSelected"></UploadStructureMetaForm>
              </div>
              <div class="upload-main-right">
                <UploadStructurePreview ref="previewRef" />
              </div>
            </div>
          </div>
           <div class="upload-footer flex-x-between">
                <div>{{$t('browse.uploadPosition')}}: {{state.rootDoc.name}}</div>
              <div class="space"></div>
                <div>
                    <el-button @click.native="handleDiscard">{{$t('discard')}}</el-button>
                    <el-button @click.native="handleSubmit">{{$t('confirm')}}</el-button>
                </div>
            </div>
        </main>
    </NuxtLayout>
</template>


<script lang="ts" setup>
import { ElMessage, ElNotification } from 'element-plus'
import { deepCopy, GetBreadcrumb } from 'dp-api';
const { setUploadFiles, getUploadFiles, updateUploadRequestList, getBackPath, getRootDoc } = useUploadStore()
const route = useRoute()
const router = useRouter()
const treeRef = ref()
const previewRef = ref();
const state = reactive({
    loading: false,
    fileList: [],
    defaultProps: {
        children: 'children',
        label: 'name',
    },
    checkList: [],
    backPath: '',
    rootDoc: {},
    filterText: ''
})
function handleSelect (row) {
    console.log(row.file);
}
const UploadMetaFormRef = ref()
// #region module: filter
    watch(() => state.filterText, (val) => {
        treeRef.value!.filter(val)
    })
    const filterNode = (value: string, data: Tree) => {
        if (!value) return true
        return data.name.includes(value)
    }
// #endregion
function handleNodeClick(row) {
    UploadMetaFormRef.value.init(row)
    previewRef.value.init(row)
}
function handleApplyToSelected({documentType, metaList, isFolder}) {
    if(state.checkList.length === 0) {
        ElMessage.warning($t('dpTip_noSelection'))
        return
    }
    if(state.checkList[0].isFolder !== isFolder) {
        ElMessage.warning($t('Folder type and file type cannot be set at the same time.'))
        return
    }
    state.checkList.forEach(item => {
        item.documentType = documentType
        item.metaList = metaList
    })
    ElMessage.success($t('dpMsg_success'))
}
function handleCheck(curCheckData, { checkedNodes, checkedKeys }) {
    if(state.checkList.length > checkedNodes.length) {
        state.checkList = checkedNodes
        return
    }
    if(state.checkList.length > 0 && state.checkList[0].isFolder !== curCheckData.isFolder) {
        ElMessage({
            showClose: true,
            message: `${$t('Folder type and file type cannot be set at the same time.')}`,
            type: 'warning',
        })
        treeRef.value!.setCheckedNodes(state.checkList, false)
    } else {
        state.checkList = checkedNodes
    }
}
function resetChecked(){
    state.checkList = []
    treeRef.value!.setCheckedKeys([], false)
}
function handleDiscard () {
    setUploadFiles([])
    router.push(state.backPath)
}
function handleSubmit () {
    const nodeMap = treeRef.value!.store.nodesMap
    const data = Object.keys(nodeMap).reduce((prev,key) => {
        prev[key] = { ...nodeMap[key].data }
        if (prev[key].metaList) {
            prev[key].properties = getPropertiesFromMetaList(prev[key].metaList)
            delete prev[key].metaList
        }
        delete prev[key].children
        return prev
    }, {})
    updateUploadRequestList(data)
    router.push(state.backPath)
    function getPropertiesFromMetaList(metaList) {
        return metaList.reduce((prev, item) => {
            if (item.value) prev[item.metaData] = deepCopy(item.value) 
            return prev
        }, {})
    }
}
async function handleBreadcrumb() {
    state.rootDoc = getRootDoc()
    try {
        const data = await GetBreadcrumb(state.rootDoc.path)
        state.rootDoc.logicPath = data.reduce((prev,item) => {
            prev += '/' + item.name
            return prev
        }, '')
    } catch (error) {
        
    }
}
onMounted(async() => {
    state.checkList = []
    state.fileList = getUploadFiles()
    state.backPath = getBackPath()
    state.rootDoc = getRootDoc()
    if(state.fileList.length === 0) {
        const path = route.query.backPath || '/browse'
        router.push(path)
    }
})
</script>

<style lang="scss" scoped>
.upload-main {
    height: 100%;
    display: grid;
    grid-template-rows: 1fr min-content;
    grid-column-gap: var(--app-padding);
    grid-row-gap: var(--app-padding);
    position: relative;
    overflow: hidden;
    .main{
      display: grid;
        grid-template-columns: min-content 1fr;
        grid-column-gap: var(--app-padding);
        grid-row-gap: var(--app-padding);
        height: 100%;
      @media (max-width : 1024px) {
        grid-template-columns: 1fr;
        grid-template-rows: 1fr 1fr;
      }
        .main-left {
            height: 100%;
            overflow: auto;
            .el-tree {
                height: 100%;
                overflow: auto;
            }
        }
        .main-right {
            height: 100%;
            display: grid;
            grid-template-columns: 1fr min-content ;
            grid-column-gap: var(--app-padding);
            grid-row-gap: var(--app-padding);
            .upload-main-center {
                height: 100%;
                overflow: auto;
            }
            
            .upload-main-right {
                height: 100%;
                overflow: auto;
              @media(max-width: 1024px) {
                display: none;
              }
            }
        }
    }
}
.tree-item {
    width: 100%;
    padding-right: var(--app-padding);
    display: flex;
  gap: var(--app-padding);
}
:deep(.el-tree-node.is-current > .el-tree-node__content) {
    background-color: var(--el-tree-node-hover-bg-color);
} 
.upload-footer{
  display: flex;
  flex-flow: row wrap;
  gap: var(--app-padding);
}
</style>
