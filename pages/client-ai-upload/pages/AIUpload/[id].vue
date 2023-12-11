<template>
<NuxtLayout class="fit-height withPadding" :backPath="state.backPath" :pageTitle="$t('browse.uploadText')">
    <main class="upload-main" v-loading="state.loading">
        <div class="main">
            <div class="main-left">
                <div class="upload-main-left-main">
                    <el-tree ref="treeRef" :data="state.fileList"
                            default-expand-all
                            nodeKey="id" :expand-on-click-node="false"
                            @node-click="handleNodeClick">
                        <template #default="{ node, data }">
                            <div class="flex-x-between tree-item">
                                <span class="flex-x-start">
                                    <BrowseItemIcon class="el-icon--left" :type="node.isLeaf ? 'file' : 'folder'" />
                                    {{data.name}}
                                </span>
                            </div>
                        </template>
                    </el-tree>
                </div>
            </div>
            <div class="main-right">
                <div class="upload-main-center" >
                    <MetaRenderForm ref="MetaFormRef" mode="ai" @formChange="handleMetaChange"></MetaRenderForm>
                </div>
                <div class="upload-main-right">
                    <UploadStructurePreview ref="previewRef" />
                </div>
            </div>
        </div>
        <div class="upload-footer flex-x-between">
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
import { UploadAIDetailApi } from 'dp-api'
const route = useRoute()
const router = useRouter()
const userId:string = useUser().getUserId()
const { arrayToTree } = useUploadAIStore()
const treeRef = ref()
const MetaFormRef = ref()
const previewRef = ref();
const state = reactive({
    loading: false,
    fileList: [],
    backPath: '',
    selectedDoc: {}
})

function handleMetaChange(data) {
    state.selectedDoc.properties = deepCopy(data.formModel)
    console.log(state.fileList);
}
function handleNodeClick(row) {
    state.selectedDoc = row
    MetaFormRef.value.init(row.fileType)
    // previewRef.value.init(row)
}
function handleDiscard () {
    router.push(state.backPath)
}
async function handleSubmit () {
    const nodeMap = treeRef.value!.store.nodesMap
    const data = Object.keys(nodeMap).reduce((prev,key) => {
        prev[key] = { ...nodeMap[key].data }
        delete prev[key].children
        return prev
    }, {})
    router.push(state.backPath)
}
onMounted(async() => {
    const docList = await UploadAIDetailApi(userId, route.params.id)
    state.fileList = arrayToTree(docList)
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
        overflow: hidden;
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
            overflow: hidden;
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
