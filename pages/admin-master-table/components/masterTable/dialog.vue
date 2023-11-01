<template>
<el-dialog v-model="state.visible" :title="$t('dashboard.setting')"
    class="scroll-dialog"
    append-to-body 
    :close-on-click-modal="false"
    @close="handleClose"
    >
    <FromRenderer ref="FromRendererRef" :form-json="formJson" />
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
        { dataType: "LOCALDATETIME", fieldName: "created_date", nullable: false, unique: false },
        { dataType: "VARCHAR:255", fieldName: "id", primaryKey: true, nullable: false, unique: true },
        { dataType: "LOCALDATETIME", fieldName: "modified_date", nullable: false, unique: false },
        { dataType: "VARCHAR:255", fieldName: "modified_by", nullable: false, unique: false }
    ],
    edit: false
})
const FromRendererRef = ref()
const formJson = getJsonApi('admin/masterTable.json')
const router = useRouter()
async function handleSubmit () {
    const data = await FromRendererRef.value.vFormRenderRef.getFormData()
    state.loading = true
    const _data = {
        ...state.setting,
        name: data.table,
        fields: [ ...data.fields, ...data.extraFields ]
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
        await FromRendererRef.value.vFormRenderRef.setFormData({ extraFields: state.extraFields })
        state.loading = false
    })
}
defineExpose({ handleOpen })
</script>
<style lang="scss" scoped>

</style>
