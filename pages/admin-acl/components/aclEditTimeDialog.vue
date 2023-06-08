<template>
<el-dialog v-model="state.visible" :title="`${$t('dpDocument_acl_editLocal')} (${state.aclItem.userId})`"
    :close-on-click-modal="false"
    >
    <FromRenderer ref="FromRendererRef" :form-json="formJson" />
    <template #footer>
        <el-button :loading="state.loading" @click="handleSubmit">{{$t('common_submit')}}</el-button>
    </template>
</el-dialog>
</template>
<script lang="ts" setup>
import { Select, CloseBold } from '@element-plus/icons-vue'
import { formatDate } from '@vueuse/core'
import { getJsonApi } from 'dp-api'
import { replaceACLApi } from 'dp-api/src/endpoint/admin-acl'
const props = defineProps<{
    doc: object,
}>()
const emits = defineEmits([
    'refresh'
])
const state = reactive({
    loading: false,
    visible: false,
    aclItem: {}
})
const FromRendererRef = ref()
const formJson = getJsonApi('admin/adminAclTimeForm.json')
async function handleSubmit () {
    try {
        const data = await FromRendererRef.value.vFormRenderRef.getFormData()
        const params = {
            idOrPath: props.doc.id,
            userId: state.aclItem.userId
        }
        if(data.time === 'dateBase') {
            params.startDate = data.dateRange[0]
            params.endDate = data.dateRange[1]
        }
        dpLog(state.aclItem);
        
        if (state.aclItem.aceId) {
            params.aceId = state.aclItem.aceId
            params.permission = state.aclItem.acePermission
        }
        if (state.aclItem && state.aclItem.length > 0) {
            params.dpId = state.aclItem.dpId
        }
        state.loading = true
        await replaceACLApi(params)
        state.visible = false
        emits('refresh')
    } catch (error) {
        
    }
    state.loading = false
}
function handleOpen(aclItem) {
    state.visible = true
    state.aclItem = aclItem
}
defineExpose({ handleOpen })
</script>
<style lang="scss" scoped>

</style>
