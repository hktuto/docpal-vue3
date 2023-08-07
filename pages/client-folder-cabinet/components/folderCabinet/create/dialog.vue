<template>
<el-dialog v-model="state.visible" :title="$t('folderCabinet.newItem')"
    :close-on-click-modal="false"
    class="scroll-dialog"
           append-to-body
    >
    <FromRenderer ref="FromRendererRef" :form-json="formJson" v-loading="state.initLoading">
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
    CreateCabinetApi,
    CreateDocumentApi,
    getJsonApi } from 'dp-api'

const uploadListAdd = inject('uploadListAdd')
const emits = defineEmits([
    'refresh'
])
const state = reactive({
    initLoading: false,
    loading: false,
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
        // 后端多个用户用同一个email
        formData.tos = formData.tos.reduce((prev, item) => {
            const _to = item.split('&&&&')
            prev.push(_to[0])
            return prev
        }, [])
        formData.ccs = formData.ccs.reduce((prev, item) => {
            const _to = item.split('&&&&')
            prev.push(_to[0])
            return prev
        }, [])
        const metaFormData = MetaFormRef.value.getData()
        if(!formData || !metaFormData) return
        state.loading = true
        try {
            let fileName = getMetaName(metaFormData)
            const _fileName = await getUniqueName({ goPath: state.cabinetTemplate.rootPath, fileName } )
            if (fileName !== _fileName) {
                const check = await ElMessageBox.confirm(`${$i18n.t('dpTip_duplicateFileNameNext')}`, {
                    confirmButtonText: `${$i18n.t('dpButtom_confirm')}`,
                    cancelButtonText: `${$i18n.t('dpButtom_cancel')}`
                }).catch((action) => { return action })
                if(check !== 'confirm') {
                    state.loading = false
                    return
                } else {
                    fileName = _fileName
                }
            }
            const idOrPath = `${state.cabinetTemplate.rootPath}/${fileName}`
            // 上传最上层数据
            const res = await CreateCabinetApi({
                ...formData,
                type: state.cabinetTemplate.documentType,
                idOrPath,
                properties: metaFormData,
                templateId: route.query.tab
            })
            if(res.path) {
                NextDialogRef.value.handleOpen(state.cabinetTemplate, res.path)
            }
            await new Promise(resolve => setTimeout(() => {
                state.visible = false
                emits('refresh')
                resolve
            }, 1000));
        } catch (error) {

        }
        state.loading = false
    }
    function getMetaName(metaFormData) {
        const date = new Date()
        try {
           const labelRule = state.cabinetTemplate.labelRule ? JSON.parse(state.cabinetTemplate.labelRule) : ''
            if (!labelRule) throw new Error("no labelRule");
            else {
                return labelRule.reduce((prev, rule, index) => {
                    const joiner = index === 0 ? '' : '-'
                    if(rule.metaData === 'fc:createDate') {
                        prev += joiner + formatDate(date,'YYYY-MM-DD')
                    }
                    else if(rule.metaData === 'fc:label'){
                        prev += joiner + state.cabinetTemplate.label
                    }
                    else if(rule.metaData === 'fc:creator'){
                        prev += joiner + userId
                    }
                    else if(rule.dataType === 'date') {
                        if(!metaFormData[rule.metaData]) throw new Error("no metaData");
                        prev += joiner + formatDate(metaFormData[rule.metaData])
                    } 
                    else {
                        if(!metaFormData[rule.metaData]) throw new Error("no metaData");
                        prev += joiner + metaFormData[rule.metaData]
                    }
                    return prev
                }, '')
            } 
        } catch (error) {
            return state.cabinetTemplate.label + '-' + formatDate(date,'YYYY-MM-DD')
        }
    }
// #endregion

// #region module: init
    async function handleOpen(setting) {
        state.initLoading = true
        state.loading = false
        state.visible = true
        try {
            state.cabinetTemplate = await GetCabinetTemplateApi(setting.id)

            const rootDetail = await GetDocDetail(state.cabinetTemplate.rootId, false)
            state.cabinetTemplate.rootPath = rootDetail.path
            state.cabinetTemplate.rootName = rootDetail.name
        } catch (error) {
            ElMessage.error(`${$i18n.t('dpMsg_error')}`)
            state.visible = false
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
        state.initLoading = false
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
