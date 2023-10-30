<template>
    <el-dialog v-model="state.dialogVisible" :title="$t('workflow_GenerateDocument')"
        destroy-on-close append-to-body :close-on-click-modal="false">
        <el-select v-model="form.templatePath" clearable filterable
            @change="templateParamGet">
            <el-option v-for="(item,index) in state.templateList" :key="index" :label="item.name" :value="item.path" />
        </el-select>
        <div style="min-height: 50px" v-loading="state.variableLoading">
            <FromVariablesRenderer ref="FromVariablesRendererRef"/>
        </div>
        <template #footer>
            <el-button @click="state.dialogVisible = false">{{$t('cancel')}}</el-button>
            <el-button v-if="state.canDownload" :loading="state.loading" @click="handleSubmit">{{$t('common_download')}}</el-button>
        </template>
    </el-dialog>
</template>

<script lang="ts" setup>
import { ElMessage, ElMessageBox } from 'element-plus'
import { CopyDocument } from '@element-plus/icons-vue'
import {
    getJsonApi,
    GetTemplateListApi,
    GetTemplateParamsApi,
    DownloadTemplateApi } from 'dp-api'
import type { FormInstance } from 'element-plus'
const { externalEndpoint } = toRefs(useSetting())
const route = useRoute()
const state = reactive({
    dialogVisible: false,
    loading: false,
    variableLoading: false,
    templateList: [],
    canSubmit: false,
    params: {
        fileType: '',
        templatePath: '',
        name: ''
    },
    canDownload: false
})
const FormRef = ref()
const form = reactive({
    templatePath: '',
    paramList: []
})
// #region module: dialog
    function handleOpen(shareInfo) {
        state.dialogVisible = true
    }
// #endregion
async function handleSubmit() {
    state.loading = true
    try {
        const data = await FromVariablesRendererRef.value.getData()
        const res = await DownloadTemplateApi({
            templatePath: form.templatePath,
            paramsMap: data
        })
        if(!res || res.errorCode) throw new Error(`${$i18n.t('responseMsg_errorCode_2')}`);
        downloadBlob(res, 'template')
        state.dialogVisible = false
    } catch (error) {
    }
    state.loading = false
}
const FromVariablesRendererRef = ref()
async function templateParamGet (templatePath: string) {
    state.canDownload = false
    state.variableLoading = true
    try {
        const res = await GetTemplateParamsApi({
            templatePath
        })
        form.paramList = [...new Set(res.paramsList)].map(item => ({ 
            name: item,
            type: 'string',
            required: true
         }))
        FromVariablesRendererRef.value.createJson(form.paramList)
        state.canDownload = true
    } catch (error) {
        // ElMessage.error(error?.response?.data?.message || error.message)
    }
    state.variableLoading = false
}
onMounted(async () => {
    state.templateList = await GetTemplateListApi() || []
})
defineExpose({ handleOpen })
</script>

<style scoped lang="scss">

</style>
