<template>
<el-dialog v-model="state.visible" :title="$t('folderCabinet.newItem')"
    :close-on-click-modal="false"
    class="scroll-dialog"
    >
    <main>
        <div>
            <div>
                <div class="row-item-top">
                    <span class="color__danger">*</span>
                    {{$t('name')}}
                </div>
                <el-input  class="row-item-bottom-left" type="text" v-model="state.rootFolder.name"/>
            </div>
            <MetaEditForm ref="MetaFormRef"></MetaEditForm>
        </div>
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
const uploadListAdd = inject('uploadListAdd')
const emits = defineEmits([
    'refresh'
])
const state = reactive({
    loading: false,
    treeLoading: false,
    visible: false,
    rootFolder: {
        name: '',
    },
    cabinetTemplate: {},
    treeData: [],
    rootDetail: {}
})

// #region module: handleSubmit
    const MetaFormRef = ref()
    const FolderCabinetUploadTreeRef = ref()
    async function handleSubmit () {
        // if (!validateForm(state.rootFolder)) return
        const metaFormData = MetaFormRef.value.getData()
        const uploadList = FolderCabinetUploadTreeRef.value.getData()
        return
        if(!metaFormData) return
        state.loading = true
        try {
            const idOrPath = `${state.cabinetTemplate.rootPath}/${state.rootFolder.name}`
            // 上传最上层数据
            await CreateFoldersApi({
                name: state.rootFolder.name,
                type: state.cabinetTemplate.documentType,
                idOrPath,
                properties: metaFormData
            })
            const uploadList = FolderCabinetUploadTreeRef.value.getData()
            
            state.visible = false
            setTimeout(()=> {
                emits('refresh')
            }, 500)
        } catch (error) {
            
        }
        state.loading = false
    }
    function uploadHandler (children: any, parentPath: string = '') {
        children.forEach(item => {
            if(item.children) uploadHandler(item.children, )
        })
    }
    function validateForm (rootFolder) {
        let msg = ''
        if (!rootFolder.name)  msg += `[${$i18n.t('name')}]: ${$i18n.t('common_canNotEmpty')}<br/>`
    
        if (msg.length > 0) {
            ElMessageBox.confirm(msg, $i18n.t('dpTip_warning'), {
                dangerouslyUseHTMLString: true,
                confirmButtonText: $i18n.t('dpButtom_confirm'),
            })
        }
        return msg.length === 0
    }
// #endregion

// #region module: init
    async function handleOpen(setting) {
        state.visible = true
        state.treeLoading = true
        try {
            state.cabinetTemplate = await GetCabinetTemplateApi(setting.id)
            initTreeData(state.cabinetTemplate.children)
            state.treeData = state.cabinetTemplate.children

            const rootDetail = await GetDocDetail(state.cabinetTemplate.rootId, false)
            state.cabinetTemplate.rootPath = rootDetail.path
        } catch (error) {
            
        }
        setTimeout(()=> {
            MetaFormRef.value.initMeta(setting.documentType)
        })
        state.treeLoading = false
    }
    function initTreeData (children, parentId: string = '') {
        children.forEach(item => {
            item.isLack = false
            if(parentId) item.parentId = parentId
            if (item.children) initTreeData(item.children, item.id)
            else item.children = []
        })
    }
// #endregion

defineExpose({ handleOpen })
</script>
<style lang="scss" scoped>
main {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--app-padding);
}
.row-item {
    &-top {
        padding: var(--app-padding) 0;
    }
}
</style>
