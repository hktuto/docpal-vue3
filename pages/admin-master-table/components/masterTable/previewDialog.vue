<template>
<el-dialog v-model="state.visible" :title="state.detail.name"
    class="scroll-dialog"
    append-to-body 
    :close-on-click-modal="false"
    @close="handleClose"
    >
    <FromRenderer ref="FromRendererRef" :form-json="formJson" >
        <template v-slot:defaultFields>
            <div>
                {{ $t('masterTable.defaultFields') }}:
                <b>{{ getFields() }}</b>
            </div>
        </template>
    </FromRenderer>
</el-dialog>
</template>
<script lang="ts" setup>
import { getJsonApi, SaveMasterTablesApi, GetMasterTablesDetailApi, deepCopy } from 'dp-api'
const emits = defineEmits([
    'refresh', 'delete'
])
const state = reactive({
    loading: false,
    visible: false,
    setting: {
    },
    extraFields: [ 'id', 'created_date', 'modified_date', 'modified_by'],
    edit: false,
    detail: {},
    fieldNameMap: {
        created_date: $t('workflow_createDate'),
        id:  $t('docType_id'),
        modified_date:  $t('tableHeader_modifiedDate'),
        modified_by:  $t('modified_by')
    }
})
const FromRendererRef = ref()
const formJson = getJsonApi('admin/masterPreviewTable.json')
const router = useRouter()

async function handleOpen(row) {
    state.visible = true
    state.detail = await GetMasterTablesDetailApi(row.id)
    state.detail.fields = state.detail.fields.filter(item => !state.extraFields.includes(item.columnName))
    setTimeout(async () => {
        FromRendererRef.value.vFormRenderRef.resetForm()
        await FromRendererRef.value.vFormRenderRef.setFormData({ fields: state.detail.fields })
        state.loading = false
    })
}
function getFields () {
    return state.extraFields.reduce((prev, item, index) => {
        prev += state.fieldNameMap[item]
        if(index !== state.extraFields.length - 1) prev += ', '
        return prev
    }, '')
}
defineExpose({ handleOpen })
</script>
<style lang="scss" scoped>

</style>
