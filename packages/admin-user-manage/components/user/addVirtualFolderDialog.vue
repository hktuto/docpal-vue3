<template>
<el-dialog v-model="state.visible" :title="$t('VirtualFolder_add')"
    close-on-click-modal="false"
    >
    <FromRenderer ref="FromRendererRef" :form-json="formJson" />
    <template #footer>
        <el-button :loading="state.loading" @click="handleSubmit">{{$t('common_submit')}}</el-button>
    </template>
</el-dialog>
</template>
<script lang="ts" setup>
import { getJsonApi, saveAdminVirtualfolder } from 'dp-api'

const props = defineProps<{
    userOrGroup: object,
    mode: vMode,
}>()
const emits = defineEmits([
    'refresh'
])
const state = reactive({
    loading: false,
    visible: false,
    vList: []
})
const FromRendererRef = ref()
const formJson = getJsonApi('adminUserVFAddForm.json')
async function handleSubmit () {
    const data = await FromRendererRef.value.vFormRenderRef.getFormData()
    dpLog({data});
    
    state.loading = true
    dpLog(props.mode);
    
    const id = props.mode === 'userAllowList' ? props.userOrGroup.userId : props.userOrGroup.id
    const vItem = state.vList.find(item => item.id === data.id)
    const _vItem = deepCopy(vItem)
    dpLog({vItem},_vItem[props.mode], id);
    _vItem[props.mode].push(id)
    const param = {
        id: vItem.id,
        jsonValue: JSON.stringify(_vItem),
        usr: id,
        userAllowList: _vItem.userAllowList,
        groupAllowList: _vItem.groupAllowList,
        type: 'applyToUser'
    }
    
    await saveAdminVirtualfolder(param)
    state.loading = false
    state.visible = false
    FromRendererRef.value.vFormRenderRef.resetForm()
    emits('refresh', vItem, id)
}
function handleOpen(selectableList) {
    state.visible = true
    state.vList = selectableList
    setTimeout(() => {
        handleOptions(selectableList)
    })
}
function handleOptions (selectableList) {
    dpLog({selectableList});
    
    const idRef = FromRendererRef.value.vFormRenderRef.getWidgetRef('id')
    const options = selectableList.map(item => ({ label: item.name, value: item.id }))
    idRef.loadOptions(options)
}
defineExpose({ handleOpen })
</script>
<style lang="scss" scoped>

</style>
