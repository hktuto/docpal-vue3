<template>
<el-dialog v-model="state.visible" class="scroll-dialog" :title="state.isEdit ? $t('docType_editDocumentSchema') : $t('docType_createDocumentSchema')"
    :close-on-click-modal="false"
    >
    <el-form :model="formData" ref="FormRef" label-position="top" @submit.native.prevent>
        <el-row :gutter="20">
            <el-col :span="12">
                <el-form-item :label="$t('docType_featureId')"
                        prop="id"
                        :rules="[{ required: true, message: $t('form_common_requird')}]"
                >
                    <el-input type="text" v-model="formData.id" :disabled="state.isEdit"/>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item :label="$t('docType_schemaPrefix')"
                        prop="prefix"
                        :rules="[{ required: true, message: $t('form_common_requird')}]"
                >
                    <el-input v-model="formData.prefix" :disabled="!state.canEdit"></el-input>
                </el-form-item>
            </el-col>
        </el-row>
    </el-form>
    <SchemaFieldsTableForm ref="SchemaFieldsTableFormRef" :canEdit="state.canEdit"></SchemaFieldsTableForm>
    <template #footer>
        <el-button v-if="state.canEdit" :loading="state.loading" @click="handleSubmit()">{{$t('common_submit')}}</el-button>
    </template>
</el-dialog>
</template>
<script lang="ts" setup>
import { ElMessage, ElMessageBox } from 'element-plus'
import { CreateSchemasApi, UpdateSchemasApi, GetSchemaApi, fieldTypeRelatedList,
    TABLE, defaultTableSetting, deepCopy } from 'dp-api'
const props = defineProps<{
    docType: any
}>()
const emits = defineEmits([
    'refresh'
])
const FormRef = ref()
const SchemaFieldsTableFormRef = ref()
const tableKey = TABLE.ADMIN_BULK_IMPORT_CONFIG_FORM
const tableSetting = defaultTableSetting[tableKey]
const state = reactive({
    loading: false,
    visible: false,
    isEdit: false,
    canEdit: true
})
const formData = reactive({
    id: '',
    prefix: ''
})
async function handleSubmit () {
    state.loading = true
    const configTree = await SchemaFieldsTableFormRef.value.TreeTableFormRef.getFormData()
    const configData = await getFormData()
    if (!configTree || !configData) {
        state.loading = false
        return false
    }
    const params = {
        fields: fieldsFilter(configTree),
        id: configData.id,
        prefix: configData.prefix
    }
    
    try {
        let blob
        if (state.isEdit) blob = await UpdateSchemasApi([params])
        else blob = await CreateSchemasApi([params])
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
async function getFormData () {
    const valid = await FormRef.value.validate((valid, fields) => {
        return valid
    })
    if (!valid) return false
    else return deepCopy(formData)
}

function handleOpen(data) {
    state.visible = true
    state.canEdit = data ? data.canEdit : true
    setTimeout(async () => {
        if(!!data) {
            state.isEdit = true
            const schemaDetail = await GetSchemaApi(data.keyword)
            SchemaFieldsTableFormRef.value.TreeTableFormRef.initTable(revertFields(schemaDetail.fields))
            formData.id = schemaDetail.id
            formData.prefix = schemaDetail.prefix
            FormRef.value.clearValidate()
        }
        else {
            state.isEdit = false
            SchemaFieldsTableFormRef.value.TreeTableFormRef.initTable()
            FormRef.value.resetFields()
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
