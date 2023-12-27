<template>
<el-dialog v-model="state.visible" class="scroll-dialog" :title="state.isEdit ? $t('docType_editDocumentType') : $t('docType_createDocumentType')"
    :close-on-click-modal="false" append-to-body
    >
    <FromRenderer ref="FromRendererRef" :form-json="formJson" >
        <template v-slot:tableForm>
            <SchemaFieldsTableForm ref="SchemaFieldsTableFormRef" :canEdit="state.canEdit"></SchemaFieldsTableForm>
        </template>
    </FromRenderer>
    <template #footer>
        <el-button v-if="state.canEdit" :loading="state.loading" @click="handleSubmit()">{{$t('common_submit')}}</el-button>
    </template>
</el-dialog>
</template>
<script lang="ts" setup>
import { ElMessage, ElMessageBox } from 'element-plus'
import { CreateDocTypesApi, UpdateDocTypesApi, GetDocTypeApi, fieldTypeRelatedList,
    getJsonApi,
    TABLE, defaultTableSetting, deepCopy } from 'dp-api'
const props = defineProps<{
    docType: any
}>()
const emits = defineEmits([
    'refresh'
])
const FromRendererRef = ref()
const formJson = getJsonApi('admin/adminDocTypeForm.json')
const SchemaFieldsTableFormRef = ref()
const tableKey = TABLE.ADMIN_BULK_IMPORT_CONFIG_FORM
const tableSetting = defaultTableSetting[tableKey]
const state = reactive({
    loading: false,
    visible: false,
    isEdit: false,
    canEdit: true
})
async function handleSubmit () {
    state.loading = true
    const customSchemaFields = await SchemaFieldsTableFormRef.value.TreeTableFormRef.getFormData()
    const configData = await FromRendererRef.value.vFormRenderRef.getFormData()
    if (!customSchemaFields || !configData) {
        state.loading = false
        return false
    }
    
    const params = {
        customSchema: fieldsFilter(customSchemaFields),
        ...deepCopy(configData)
    }
    try {
        let blob
        if (state.isEdit) blob = await UpdateDocTypesApi([params])
        else blob = await CreateDocTypesApi([params])
        ElMessageBox.confirm(`${$t('msg_confirmWhetherToDownloadJar')}`)
        .then(async() => {
            downloadBlob(blob, 'wcl-custom-schema-doctype-vocabulary.jar')
        })
        state.visible = false
        emits('refresh')
    } catch (error) {
        // ElMessage.error(error.response.data.message || 'error')
    }
    state.loading = false
}
function fieldsFilter (fields) {
    return fields.reduce((prev, item) => {
        prev[item.id] = {
            ...item,
            fieldType: {
                type: fieldTypeRelatedList[item.type] ? fieldTypeRelatedList[item.type] : fieldTypeRelatedList.default,
                fieldTypeId: item.type
            }
        }
        if(item.type === 'directory') prev[item.id].fieldType.directoryName = item.directoryName
        else if(item.type === 'document') prev[item.id].fieldType.valueStored = item.valueStored
        else if(item.type === 'user/group') prev[item.id].fieldType.canContain = item.canContain
        return prev
    }, {})
}
function revertFields (fields) {
    return Object.keys(fields).reduce((prev, key) => {
        prev.push({...fields[key].type, ...fields[key], id: key, type: fields[key].type.id })
        return prev
    }, [])
}
function handleOpen(data) {
    state.visible = true
    state.canEdit = data ? data.canEdit : true
    setTimeout(async () => {
        if(!!data) {
            state.isEdit = true
            const docTypeDetail = await GetDocTypeApi(data.docTypeId)
            docTypeDetail.extraSchemas = docTypeDetail.extraSchemas.map(item => (item.id))
            console.log(docTypeDetail.extraSchemas);
            docTypeDetail.canEdit = data.canEdit
      
            SchemaFieldsTableFormRef.value.TreeTableFormRef.initTable(revertFields(docTypeDetail.customSchema))
            FromRendererRef.value.vFormRenderRef.setFormData(docTypeDetail)
            // FormRef.value.clearValidate()
        }
        else {
            state.isEdit = false
            SchemaFieldsTableFormRef.value.TreeTableFormRef.initTable()
            // FormRef.value.resetFields()
            FromRendererRef.value.vFormRenderRef.resetForm()
        }
    })
}


onMounted(async() => {
})
defineExpose({ handleOpen })
</script>
<style lang="scss" scoped>
:deep(.el-cascader){
    width: 100%
}
</style>
