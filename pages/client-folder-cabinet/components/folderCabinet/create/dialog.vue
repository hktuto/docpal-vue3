<template>
<el-dialog v-model="state.visible" :title="$t('folderCabinet.newItem')"
    :close-on-click-modal="false"
    class="scroll-dialog"
    >
    <FromRenderer ref="FromRendererRef" :form-json="formJson">
        <template v-slot:metaForm>
            <MetaEditForm ref="MetaFormRef"></MetaEditForm>
        </template>
    </FromRenderer>
    <template #footer>
        <el-button :loading="state.loading" @click="handleSubmit">{{$t('button.next')}}</el-button>
    </template>
</el-dialog>
<FolderCabinetCreateNextDialog ref="NextDialogRef" />
</template>
<script lang="ts" setup>
import { ElMessage, ElMessageBox } from 'element-plus'
import { 
    GetCabinetTemplateApi,
    GetDocDetail,
    CreateFoldersApi,
    CreateDocumentApi,
    getJsonApi } from 'dp-api'
const uploadListAdd = inject('uploadListAdd')
const emits = defineEmits([
    'refresh'
])
const state = reactive({
    loading: false,
    treeLoading: false,
    visible: false,
    cabinetTemplate: {},
})
const userId:string = useUser().getUserId()
const route = useRoute()
const NextDialogRef = ref()
const FromRendererRef = ref()
const formJson = getJsonApi('client/folderCabinetNew.json')
// #region module: handleSubmit
    const MetaFormRef = ref()
    async function handleSubmit () {
        const formData = await FromRendererRef.value.vFormRenderRef.getFormData()
        const metaFormData = MetaFormRef.value.getData()
        if(!formData || !metaFormData) return
        state.loading = true
        try {
            const idOrPath = `${state.cabinetTemplate.rootPath}/${formData.name}`
            // 上传最上层数据
            await CreateFoldersApi({
                ...formData,
                type: state.cabinetTemplate.documentType,
                idOrPath,
                properties: metaFormData,
                templateId: route.query.tab
            })
            
            NextDialogRef.value.handleOpen(state.cabinetTemplate, idOrPath)
            await new Promise(resolve => setTimeout(() => {
                state.visible = false
                emits('refresh')
                resolve
            }, 1000));
        } catch (error) {
            
        }
        state.loading = false
    }
// #endregion

// #region module: init
    async function handleOpen(setting) {
        state.visible = true
        state.treeLoading = true
        try {
            state.cabinetTemplate = await GetCabinetTemplateApi(setting.id)

            const rootDetail = await GetDocDetail(state.cabinetTemplate.rootId, false)
            state.cabinetTemplate.rootPath = rootDetail.path
            state.cabinetTemplate.rootName = rootDetail.name
        } catch (error) {
            
        }
        setTimeout(()=> {
            MetaFormRef.value.initMeta(setting.documentType)
            // userId
            if (!state.cabinetTemplate.tos) state.cabinetTemplate.tos = []
            if (!state.cabinetTemplate.ccs) state.cabinetTemplate.ccs = []
            const createByIndex = state.cabinetTemplate.tos.findIndex(item => item === 'createBy')
            if (createByIndex !== -1) state.cabinetTemplate.tos[createByIndex] = userId
            const params = {
                tos: [...new Set(state.cabinetTemplate.tos)],
                ccs: [...new Set(state.cabinetTemplate.ccs)]
            }
            FromRendererRef.value.vFormRenderRef.setFormData(params)
        })
        state.treeLoading = false
    }
// #endregion

defineExpose({ handleOpen })
</script>
<style lang="scss" scoped>
main {
    display: grid;
    gap: var(--app-padding);
}
.row-item {
    &-top {
        padding: var(--app-padding) 0;
    }
}
</style>
