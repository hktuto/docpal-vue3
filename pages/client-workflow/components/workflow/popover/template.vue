<template>
    <el-dialog v-model="state.dialogVisible" :title="$t('workflow_GenerateDocument')"
        destroy-on-close append-to-body :close-on-click-modal="false">
        <el-form ref="FormRef" :model="form"
            label-position="top" v-loading="state.loading" @submit.native.prevent>
            <el-form-item :label="$t('file_template')" prop="templatePath"
                :rules="[{ required: true, message: $t('form_common_requird')}]">
                <el-select v-model="form.templatePath" clearable
                    value-key="path"
                    @change="templateParamGet">
                    <el-option v-for="(item,index) in state.templateList" :key="index" :label="item.name" :value="item" />
                </el-select>
            </el-form-item>
            <el-form-item  v-for="(item,index) in form.paramList" :key="index"
                            :label="$t(item.key)" :prop="`paramList.${index}.value`"
                            :rules="[{ required: true, message: $t('form_common_requird')}]">
                <el-input type="text" v-model="item.value" />
            </el-form-item>
        </el-form>
        <template #footer>
            <el-button @click="state.dialogVisible = false">{{$t('cancel')}}</el-button>
            <el-button @click="handleSubmit">{{$t('common_download')}}</el-button>
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

    templateList: [],
    canSubmit: false,
    params: {
        fileType: '',
        templatePath: '',
        name: ''
    }
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
    try {
        const valid = await FormRef.value.validate((valid, fields) => valid)
        if (!valid) throw new Error(`${$i18n.t('incompleteData')}`);
        const params = {  ...state.params, paramsMap: {} }
        form.paramList.forEach(item => {  params.paramsMap[item.key] = item.value })
        const res = await DownloadTemplateApi(params)
        if(!res || res.errorCode) throw new Error(`${$i18n.t('responseMsg_errorCode_2')}`);
        downloadBlob(res, 'template')
    } catch (error) {
        // ElMessage.error(error?.response?.data?.message || error.message)
    }
}
async function templateParamGet (templateItem: Object) {
    dpLog({form}, 'form');
    form.templatePath = templateItem.path
    try {
        const suffix = templateItem.name.split('.').pop()
        if(['xlsx','xls','doc', 'docx','pptx', 'ppt'].includes(suffix)) {
            state.params.fileType = suffix
        } else {
            throw new Error(`${$i18n.t('responseMsg_errorCode_2')}`);
        }
        state.params.name = templateItem.name
        state.params.templatePath = templateItem.path
        const res = await GetTemplateParamsApi(state.params)
        if(!res.paramsList || res.paramsList.length === 0) throw new Error(`${$i18n.t('requestDataIsEmpty')}`);
        form.paramList = [...new Set(res.paramsList)].map(item => ({ key: item, value: '' }))
    } catch (error) {
        // ElMessage.error(error?.response?.data?.message || error.message)
    }
}
onMounted(async () => {
    state.templateList = await GetTemplateListApi() || []
})
defineExpose({ handleOpen })
</script>

<style scoped lang="scss">

</style>
