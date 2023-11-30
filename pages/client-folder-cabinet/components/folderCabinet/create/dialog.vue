<template>
<el-dialog v-model="state.visible" :title="$t('folderCabinet.newItem')"
    :close-on-click-modal="false"
    class="scroll-dialog"
           append-to-body
    >
    <FromRenderer ref="FromRendererRef" :form-json="formJson" v-loading="state.initLoading"
        @formChange="formChange">
        <template v-slot:metaForm>
            <MetaRenderForm ref="MetaFormRef"></MetaRenderForm>
        </template>
        <template v-slot:namingRule>
            <div>{{$t('tableHeader_labelRule')}}：
                <template v-for="(item, index) in getLabelList()" :key="index">
                    <el-tag >{{$t(item.metaData)}}</el-tag>
                    <template v-if="index !== getLabelList().length - 1"> - </template>
                </template>
            </div>
        </template>
        <template v-slot:previewName>
            <div style="margin-bottom: 15px">{{$t('folderCabinet.previewName')}}: {{state.previewName}}</div>
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
    previewName: ''
})
const userId:string = useUser().getUserId()
const route = useRoute()
const NextDialogRef = ref()
const FromRendererRef = ref()
const formJson = getJsonApi('client/folderCabinetNew.json')
// #region module: handleSubmit
    const MetaFormRef = ref()
    async function handleSubmit () {
        // 获取 v-form 数据
        const formData = await FromRendererRef.value.vFormRenderRef.getFormData()
        const arr = ['notificationReminder', 'emailReminder', 'emailReport']
        arr.forEach(key => {
            formData[key] = {}
            formData[key].intervalTime = formData[`${key}.intervalTime`]
            if(formData[`${key}.tos`]) formData[key].tos = formData[`${key}.tos`]
            if(formData[`${key}.ccs`]) formData[key].ccs = formData[`${key}.ccs`]
            delete formData[`${key}.intervalTime`]
            delete formData[`${key}.tos`]
            delete formData[`${key}.ccs`]
        })
        // 获取 metaForm 数据
        const metaFormData = MetaFormRef.value.getData()
        if(!formData || !metaFormData) return
        state.loading = true
        try {
            let fileName = await getMetaName({ ...metaFormData, ...formData })
            const _fileName = await getUniqueName({ goPath: state.cabinetTemplate.rootPath, fileName } )
            if (fileName !== _fileName) {
                const check = await ElMessageBox.confirm(`${$i18n.t('dpTip_duplicateFileNameNext')}`).catch((action) => { return action })
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
    async function getMetaName(formData = {}) {
        const date = new Date()
        try {
            const data = await FromRendererRef.value.vFormRenderRef.getFormData()
            if(data) formData = { ...formData, ...data }
        } catch (error) {
        }
        const labelRule = state.cabinetTemplate.labelRule ? JSON.parse(state.cabinetTemplate.labelRule) : []
        if (!labelRule || labelRule.length === 0) throw new Error("no labelRule");
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
                else if(rule.metaData === 'fc:docTitle'){
                    if(!formData.title) prev += joiner + ''
                    else prev += joiner + formData.title
                }
                else if(rule.dataType === 'date') {
                    if(!formData[rule.metaData]) prev += joiner + ''
                    else prev += joiner + formatDate(formData[rule.metaData])
                } 
                else {
                    if(!formData[rule.metaData]) prev += joiner + ''
                    else prev += joiner + formData[rule.metaData]
                }
                return prev
            }, '')
        } 
        return state.cabinetTemplate.label + '-' + formatDate(date,'YYYY-MM-DD')
    }
    function getLabelList() {
        const labelRule = state.cabinetTemplate.labelRule ? JSON.parse(state.cabinetTemplate.labelRule) : []
        return labelRule
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
        setTimeout(async()=> {
            MetaFormRef.value.init(setting.documentType)
            const ddd = getReminder(state.cabinetTemplate, ['notificationReminder', 'emailReminder', 'emailReport'])
            FromRendererRef.value.vFormRenderRef.setFormData({...getReminder(state.cabinetTemplate, ['notificationReminder', 'emailReminder', 'emailReport'])})
            state.previewName = await getMetaName()
        })
        state.initLoading = false
        function getReminder(data, revertList) {
            return revertList.reduce((prev, item) => {
                if(!data[item].tos) data[item].tos = []
                if(!data[item].ccs) data[item].ccs = []
                const toCreateByIndex = data[item].tos.findIndex(item => item === 'createBy')
                if (toCreateByIndex !== -1) data[item].tos[toCreateByIndex] = userId
                const ccCreateByIndex = data[item].ccs.findIndex(item => item === 'createBy')
                if (ccCreateByIndex !== -1) data[item].ccs[ccCreateByIndex] = userId
                prev[`${item}.intervalTime`] = data[item].intervalTime
                prev[`${item}.tos`] = data[item].tos
                prev[`${item}.ccs`] = data[item].ccs
                return prev
            }, {})
        }
    }
// #endregion
// #region module: form change
    async function formChange ({ fieldName, formModel, newValue, oldValue}) {
        if (fieldName === 'title') state.previewName = await getMetaName()
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
