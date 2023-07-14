<template>
<el-dialog 
    style="--scroll-dialog-height: 80vh"
    v-model="state.visible" :title="$t('folderCabinet.newItem')"
    :close-on-click-modal="false"
    class="scroll-dialog"
    >
    <main>
        <FolderCabinetCreateUploadTree ref="FolderCabinetUploadTreeRef"
             :treeData="state.treeData"
             v-loading="state.treeLoading"></FolderCabinetCreateUploadTree>
    </main>
    <template #footer>
        <el-button :loading="state.loading" @click="handleSubmit">{{$t('common_submit')}}</el-button>
    </template>
</el-dialog>
<MetaEditForm v-show="false" ref="MetaFormRef2"></MetaEditForm>
</template>
<script lang="ts" setup>
import { ElMessage, ElMessageBox } from 'element-plus'
import { 
    GetCabinetTemplateApi,
    GetDocDetail,
    CreateFoldersApi,
    CreateDocumentApi } from 'dp-api'
const uploadListAdd = inject('uploadListAdd')
const emits = defineEmits([
    'refresh'
])
const state = reactive({
    loading: false,
    treeLoading: false,
    visible: false,
    cabinetTemplate: {},
    treeData: [],
    rootDetail: {}
})
const route = useRoute()
// #region module: handleSubmit
    const FolderCabinetUploadTreeRef = ref()
    async function handleSubmit () {
        state.loading = true
        try {
            const uploadList = FolderCabinetUploadTreeRef.value.getData(true)
            if(!uploadList) {
                throw new Error("");
            } 
            uploadListAdd({
                name: state.cabinetTemplate.rootName,
                startDate: new Date(), 
                treeData:uploadList
            })
            // 后端folder-cabinet有延时，立即上传folder-cabinet不起作用
            setTimeout(() => {
                uploadHandler(uploadList, state.rootDetail.idOrPath)
            }, 2000)
            
            state.visible = false
            setTimeout(()=> {
                emits('refresh')
            }, 500)
        } catch (error) {
            
        }
        state.loading = false
    }
    function uploadHandler (children: any, parentPath: string = '', parentStatus) {
        children.forEach(async(item) => {
            item.path = parentPath + '/' + item.label
            try {
                if (parentStatus === 'skip' || parentStatus === 'fail') throw new Error("skip");
                if (item.folder) {
                    item.status = 'loading'
                    await CreateFoldersApi({
                        name: item.label,
                        type: item.documentType,
                        idOrPath: item.path,
                        properties: item.properties
                    })
                } else {
                    const document = {
                        name: item.label,
                        idOrPath: item.path,
                        type: item.documentType,
                        properties: item.properties
                        // languages: file.languages,
                        // properties: {}
                    }
                    const formData = new FormData()
                    formData.append('files', item.raw)
                    formData.append('document', JSON.stringify(document))
                    await CreateDocumentApi(formData)
                }
                item.status = 'finish'
            } catch (error) {
                item.status = 'skip'
            }
            setTimeout(() => {
                if(item.children) uploadHandler(item.children, item.path, item.status)
            }, 300)
        })
    }
// #endregion

// #region module: init
    async function handleOpen(cabinetTemplate, idOrPath) {
        state.cabinetTemplate = cabinetTemplate
        state.rootDetail.idOrPath = idOrPath
        state.visible = true
        state.treeLoading = true
        try {
            initTreeData(state.cabinetTemplate.children)
            state.treeData = state.cabinetTemplate.children
        } catch (error) {
            
        }
        state.treeLoading = false
    }
    const MetaFormRef2 = ref()
    function initTreeData (children, parentId: string = '') {
        children.forEach(async(item) => {
            item.isLack = false
            if(parentId) item.parentId = parentId
            if (item.folder === true) {
                item.properties = {}
                item.metaList = await MetaFormRef2.value.metaListGet(item.documentType, {})
            }
            if (item.children) initTreeData(item.children, item.id)
            else item.children = []
        })
    }
// #endregion

defineExpose({ handleOpen })
</script>
<style lang="scss" scoped>
main {
}
</style>
