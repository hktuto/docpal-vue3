<template>
<el-dialog v-model="state.visible" :title="$t('masterTable.newTable')"
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
    <template #footer>
        <div class="footer-grid">
            <el-button type="primary" :loading="state.loading" @click="handleSubmit">{{$t('common_submit')}}</el-button>
        </div>
    </template>
</el-dialog>
</template>
<script lang="ts" setup>
import { getJsonApi, SaveMasterTablesApi, deepCopy } from 'dp-api'
const emits = defineEmits([
    'refresh', 'delete'
])
const state = reactive({
    loading: false,
    visible: false,
    setting: {
    },
    extraFields: [
        { dataType: "timestamp", fieldName: "created_date", required: true, unique: false },
        { dataType: "varchar:255", fieldName: "id", primaryKey: true, required: true, unique: true },
        { dataType: "timestamp", fieldName: "modified_date", required: true, unique: false },
        { dataType: "varchar:255", fieldName: "modified_by", required: true, unique: false }
    ],
    edit: false
})
const FromRendererRef = ref()
const formJson = getJsonApi('admin/masterTable.json')
const router = useRouter()
function getFields () {
    return state.extraFields.reduce((prev, item, index) => {
        prev += item.fieldName
        if(index !== state.extraFields.length - 1) prev += ', '
        return prev
    }, '')
}
async function handleSubmit () {
    const data = await FromRendererRef.value.vFormRenderRef.getFormData()
    console.log({data});
    
    state.loading = true
    const _data = {
        ...state.setting,
        name: data.table,
        fields: [ ...state.extraFields, ...data.fields  ]
    }
    try {
        const res = await SaveMasterTablesApi(_data)
        state.visible = false
        emits('refresh')
    } catch (error) {
        state.loading = false
    }
    state.loading = false
}
function handleOpen() {
    state.visible = true
    setTimeout(async () => {
        FromRendererRef.value.vFormRenderRef.resetForm()
        await FromRendererRef.value.vFormRenderRef.setFormData({ extraFields: state.extraFields })
        state.loading = false
    })
}
defineExpose({ handleOpen })
</script>
<style lang="scss" scoped>

</style>
