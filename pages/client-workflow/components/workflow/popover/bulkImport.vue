<template>
    <el-dialog v-model="state.dialogVisible" :title="$t('workflow_bulkImport')"
        destroy-on-close append-to-body :close-on-click-modal="false">
        <WorkflowDetailFormRender ref="vFormRef" />
        <template #footer>
            <el-button @click="state.dialogVisible = false">{{$t('cancel')}}</el-button>
            <el-button @click="handleSubmit">{{$t('submit')}}</el-button>
        </template>
    </el-dialog>
</template>

<script lang="ts" setup>
import { ElMessage, ElMessageBox } from 'element-plus'
import { CopyDocument } from '@element-plus/icons-vue'
import { getJsonApi, workflowProcessStartApi } from 'dp-api'
import type { FormInstance } from 'element-plus'
import { useI18n } from "vue-i18n";
const { externalEndpoint } = toRefs(useSetting())
const { t } = useI18n();
const route = useRoute()
const state = reactive({
    dialogVisible: false
})
const vFormRef = ref()
const formJson = getJsonApi('personalBulkImport.json')
// #region module: dialog
    function handleOpen(shareInfo) {
        state.dialogVisible = true
        setTimeout(() => {
            vFormRef.value.setForm(formJson)
        })
    }
// #endregion
// #region module: handleSubmit
    async function handleSubmit() {
        try {
            const data = await vFormRef.value.getFormData()
            if(!data) throw new Error(`${$i18n.t('incompleteData')}`);
            const param = {
                processKey: data.processKey,
                businessKey: data.businessKey,
                properties: {
                    user_creator_id: data.user_creator_id,
                    abbyyCVSFile: data.abbyyCVSFile,
                    bulkDocumentsUploadSupplementaryFiles: data.bulkDocumentsUploadSupplementaryFiles,
                    // docTypeToProFileId: handelDocTypeToProFileId(data.docTypeToProFileId)
                    docTypeToProFileId: data.docTypeToProFileId
                }
            }
            const res = await workflowProcessStartApi(param)
            if(res.errorCode) throw new Error(res.message);
            state.dialogVisible = false
        } catch (error) {
            // ElMessage.error(error.message)
        }
    }
// #endregion
// #region module: search json
    function handleFormChange (data) {
    }
// #endregion
defineExpose({ handleOpen })
</script>

<style scoped lang="scss">

</style>
