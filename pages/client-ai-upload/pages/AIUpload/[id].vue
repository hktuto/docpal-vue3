<template>
<NuxtLayout class="fit-height withPadding" :backPath="state.backPath" :pageTitle="$t('ai.uploadText')">
    <main class="upload-main" v-loading="state.loading">
        <div class="main-left">
            <el-tree ref="treeRef" :data="state.fileList"
                    default-expand-all
                    nodeKey="id" :expand-on-click-node="false"
                    @node-click="handleNodeClick">
                <template #default="{ node, data }">
                    <div class="flex-x-between tree-item">
                        <span class="flex-x-start">
                            <BrowseItemIcon class="el-icon--left" :type="data.isFolder ? 'folder' : 'file'" />
                            {{data.name}}
                        </span>
                        <div class="flex-x-start" style="--icon-size: 16px;">
                            <!-- <el-tag v-if="Object.keys(data.aiAnalysis).length > 0" color="#FFC401" type="warning" class="mx-1" effect="dark" round >
                                <SvgIcon src="/icons/file/ai.svg" style="--icon-color: #fff;"/>
                            </el-tag> -->
                            <SvgIcon src="/icons/menu/trash.svg"  class="el-icon--right" @click.stop="handleDeleteFile(data)"/>
                        </div>
                    </div>
                </template>
            </el-tree>
        </div>
        <div class="main-center">
            <div class="flex-x-between" v-show="state.selectedDoc">{{ state.selectedDoc.name }}
                <el-button type="primary" @click="applyAllAi">{{ $t('ai.applyAll')}}</el-button>
            </div>
            <div>
                <MetaRenderForm ref="MetaFormRef" mode="ai" @formChange="handleMetaChange"></MetaRenderForm>
            </div>
        </div>
        <UploadStructurePreview class="main-right" ref="previewRef" />
        <div class="upload-footer flex-x-between">
            <div class="space"></div>
            <div>
                <el-button :loading="state.submitLoading" type="danger" @click.native="handleDiscard">{{$t('ai.cancelPatch')}}</el-button>
                <el-button :loading="state.submitLoading" type="info" @click.native="handleClose">{{$t('common_close')}}</el-button>
                <el-button :loading="state.submitLoading" type="primary" @click.native="handleSubmit">{{$t('confirm')}}</el-button>
            </div>
        </div>
    </main>
</NuxtLayout>
</template>


<script lang="ts" setup>
import { ElMessageBox } from 'element-plus'
import { UploadAIDetailApi, ConfirmUploadAIApi, CancelUploadAIApi, DeleteUploadAIApi } from 'dp-api'
import { useDebounceFn } from '@vueuse/core'
const route = useRoute()
const router = useRouter()
const userId:string = useUser().getUserId()
const { arrayToTree } = useUploadAIStore()
const treeRef = ref()
const MetaFormRef = ref()
const previewRef = ref();
const state = reactive({
    loading: false,
    submitLoading: false,
    fileList: [],
    backPath: '/AIUpload',
    selectedDoc: {}
})

const handleMetaChange = async({fieldName, formModel, newValue, oldValue}) => {
    state.selectedDoc.properties = deepCopy(formModel)
    state.selectedDoc.fileType = formModel.documentType
    if(fieldName === 'documentType' && newValue !== oldValue && !!oldValue) {
        await MetaFormRef.value.init(state.selectedDoc.fileType, {
            isFolder: state.selectedDoc.isFolder,
            aiAnalysis: state.selectedDoc.aiAnalysis,
            aiDocId: state.selectedDoc.id
        })
        setTimeout(() => {
            MetaFormRef.value.setData({ ...state.selectedDoc.properties, documentType: state.selectedDoc.fileType})
        });
    }
}
async function handleNodeClick(row) {
    state.selectedDoc = row
    if(row.aiAnalysisDocument && !row.aiAnalysis && row.aiAnalysisDocument.metaDatas) {
        row.aiAnalysis = row.aiAnalysisDocument.metaDatas.reduce((prev: any, item) => {
            if(item.label || item.value) {
                prev[item.name] = {}
                if(item.label) prev[item.name].label = item.label
                if(item.value) prev[item.name].value = item.value
            }
            return prev
        }, {})
        if(!row.aiAnalysis) row.aiAnalysis = {}
        if(row.aiAnalysisDocument.documentType) row.aiAnalysis.documentType = {
            value: row.aiAnalysisDocument.documentType
        }
    }
    await MetaFormRef.value.init(row.fileType, {
        isFolder: row.isFolder,
        aiAnalysis: row.aiAnalysis,
        aiDocId: row.id
    })
    setTimeout(() => {
        if(!row.properties) row.properties = {}
        MetaFormRef.value.setData({ ...row.properties, documentType: row.fileType})
    });
}
function applyAllAi() {
    const properties = {
        ...state.selectedDoc.properties,
        documentType: state.selectedDoc.fileType,
        // ...state.selectedDoc.aiAnalysis.
    }
    if(state.selectedDoc.aiAnalysis) {
        Object.keys(state.selectedDoc.aiAnalysis).forEach(key => {
            const aItem = state.selectedDoc.aiAnalysis[key]
            if(aItem.value) properties[key] = aItem.value
        })
    }
    MetaFormRef.value.setData(properties)
}

async function handleDeleteFile(data) {
    const action = await ElMessageBox.confirm(`${$t('msg_confirmWhetherToDelete')}`,{
        confirmButtonText: $t('dpButtom_confirm'),
        cancelButtonText: $t('dpButtom_cancel')
    }).catch((action) => { return action })
    if(action !== 'confirm') return
    await DeleteUploadAIApi(data.id)
    treeRef.value.remove(data)
}
async function handleDiscard () {
    const action = await ElMessageBox.confirm(`${$t('msg_confirmWhetherToCancel')}`,{
        confirmButtonText: $t('dpButtom_confirm'),
        cancelButtonText: $t('common_close')
    }).catch((action) => { return action })
    if(action !== 'confirm') return
    const formData = new FormData()
    formData.append('userId', userId)
    formData.append('uploadId', route.params.id)
    await CancelUploadAIApi(formData)
    router.push(state.backPath)
}
function handleClose() {
    router.push(state.backPath)
}
async function handleSubmit () {
    const nodeMap = treeRef.value!.store.nodesMap
    const docList: any = []
    const data = Object.keys(nodeMap).reduce((prev:any,key) => {
        const nodeItem = { ...nodeMap[key].data }
        if(!nodeItem.properties) nodeItem.properties = {}
        const properties = Object.keys(nodeItem.properties).reduce((prev: any, key) => {
            const pValue = nodeItem.properties[key]
            if(!!pValue && key !== 'documentType') prev[key] = pValue
            return prev
        }, {})
        prev.push({
            id: key,
            metadatas: JSON.stringify(properties),
            documentType: nodeItem.fileType
        })
        docList.push({
            name: nodeItem.name,
            documentType: nodeItem.fileType,
            properties
        })
        return prev
    }, [])
    try {
        state.submitLoading = true
        const metaValid = await MetaFormRef.value.checkMetaValidate(docList)
        if(!metaValid) {
            throw new Error("");
        }
        await ConfirmUploadAIApi({
            userId,
            uploadId: route.params.id,
            fileConfirmDTOList: data
        })
        router.push(state.backPath)
    } catch (error) {
        console.log('Validate fail')
    }
    setTimeout(() => { state.submitLoading = false }, 1000)
    
}
onMounted(async() => {
    let docList = await UploadAIDetailApi(userId, route.params.id)
    docList = docList.map(item => ({
        ...item,
        isFolder: item.fileType === 'Folder'
    }))
    state.fileList = arrayToTree(docList)
    if(state.fileList.length > 0) {
        setTimeout(() => {
            handleNodeClick(state.fileList[0])
            treeRef.value.setCurrentKey(state.fileList[0].id)
        }, 100);
    }
})
</script>

<style lang="scss" scoped>
.upload-main {
    height: 100%;
    display: grid;
    grid-template-columns: min-content 1fr min-content;
    grid-template-rows: 1fr min-content;
    grid-column-gap: var(--app-padding);
    grid-row-gap: var(--app-padding);
    position: relative;
    overflow: hidden;
    .main-left { grid-area: 1 / 1 / 2 / 2; }
    .main-center { grid-area: 1 / 2 / 2 / 3;  overflow: auto;}
    .main-right { grid-area: 1 / 3 / 2 / 4; }
    .upload-footer{
        grid-area: 2 / 1 / 3 / 4;
        display: flex;
        flex-flow: row wrap;
        gap: var(--app-padding);
    }
    @media(max-width: 1024px) {
        display: grid;
        grid-template-columns: 1fr;
        grid-template-rows: min-content 1fr repeat(2, min-content);
        overflow: hidden;
        height: calc(100vh - 108px);
        .main-left { grid-area: 1 / 1 / 2 / 2; }
        .main-center { grid-area: 2 / 1 / 3 / 2;}
        .main-right { grid-area: 3 / 1 / 4 / 2; display: none;}
        .upload-footer { grid-area: 4 / 1 / 5 / 2; }
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
</style>
