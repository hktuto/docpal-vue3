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
    </main>
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
})
const route = useRoute()
const NextDialogRef = ref()
// #region module: handleSubmit
    const MetaFormRef = ref()
    async function handleSubmit () {
        if (!validateForm(state.rootFolder)) return
        const metaFormData = MetaFormRef.value.getData()
        if(!metaFormData) return
        state.loading = true
        try {
            const idOrPath = `${state.cabinetTemplate.rootPath}/${state.rootFolder.name}`
            // 上传最上层数据
            await CreateFoldersApi({
                name: state.rootFolder.name,
                type: state.cabinetTemplate.documentType,
                idOrPath,
                properties: metaFormData,
                templateId: route.query.tab
            })
            
            NextDialogRef.value.handleOpen(state.cabinetTemplate, idOrPath)
            setTimeout(()=> {
                state.visible = false
                emits('refresh')
            }, 1000)
        } catch (error) {
            
        }
        state.loading = false
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

            const rootDetail = await GetDocDetail(state.cabinetTemplate.rootId, false)
            state.cabinetTemplate.rootPath = rootDetail.path
            state.cabinetTemplate.rootName = rootDetail.name
        } catch (error) {
            
        }
        setTimeout(()=> {
            MetaFormRef.value.initMeta(setting.documentType)
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
