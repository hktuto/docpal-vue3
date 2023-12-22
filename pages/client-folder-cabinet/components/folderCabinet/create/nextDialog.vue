<template>
<el-dialog
    style="--scroll-dialog-height: 80vh"
    v-model="state.visible" :title="$t('folderCabinet.newItem')"
    :close-on-click-modal="false"
    class="scroll-dialog"
    append-to-body
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
</template>
<script lang="ts" setup>
import { ElMessage, ElMessageBox } from 'element-plus'
import {
    GetCabinetTemplateApi,
    GetDocDetail,
    CreateFoldersApi,
    CreateDocumentApi } from 'dp-api'
const setUploading = inject('setUploading')
const emits = defineEmits([
    'refresh'
])
const state = reactive({
    loading: false,
    treeLoading: false,
    visible: false,
    cabinetTemplate: {},
    treeData: [],
    rootDetail: {},

    uploadLength: 0,
    uploadedLength: 0
})
const route = useRoute()
// #region module: handleSubmit
    const FolderCabinetUploadTreeRef = ref()
    async function handleSubmit () {
        // state.loading = true
        try {
            const uploadList = await FolderCabinetUploadTreeRef.value.getData(true)
            console.log(uploadList);
            
            state.uploadLength = getUploadLength()
            state.uploadedLength = 0
            if(!uploadList) {
                throw new Error("");
            }
            setUploading(true)
            state.visible = false
            // 后端folder-cabinet有延时，立即上传folder-cabinet不起作用
            setTimeout(() => {
                uploadHandler(uploadList, state.rootDetail.idOrPath)
            }, 2000)

        } catch (error) {

        }
        state.loading = false
    }
    function getUploadLength () {
        const nodesMap = FolderCabinetUploadTreeRef.value.treeRef.store.nodesMap
        return Object.keys(nodesMap).reduce((prev, key) => {
            const item = nodesMap[key].data
            if(item.folder !== false) prev++
            return prev
        }, 0)
    }
    watch(()=> state.uploadedLength, newValue => {
        if(newValue === state.uploadLength) setUploading(false)
    } )
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
                    state.uploadedLength ++
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
                    state.uploadedLength ++
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
    function initTreeData (children, parentId: string = '') {
        children.forEach(async(item) => {
            item.isLack = false
            if(parentId) item.parentId = parentId
            if (item.folder === true) {
                item.properties = {}
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
