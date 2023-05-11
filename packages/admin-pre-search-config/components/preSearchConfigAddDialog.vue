<template>
<el-dialog class="scroll-dialog" v-model="state.visible" :title="$t('smartFolder_create')"
    :close-on-click-modal="false"
    >
    <FromRenderer ref="FromRendererRef" :form-json="formJson" />
    <template #footer>
        <el-button :loading="state.loading" @click="handleSubmit">{{$t('common_submit')}}</el-button>
    </template>
</el-dialog>
</template>
<script lang="ts" setup>
import { UpdatePreSearchApi, getJsonApi } from 'dp-api'

const emits = defineEmits([
    'refresh'
])
const state = reactive({
    loading: false,
    visible: false,
})
const FromRendererRef = ref()
const formJson = getJsonApi('admin/adminPreSearch.json')
async function handleSubmit () {
    const data = await FromRendererRef.value.vFormRenderRef.getFormData()
    const param = deepCopy(data)
    const name = param.name
    if (!param.paramsInTextSearch) delete param.paramsInTextSearch
    delete param.name
    const res = await UpdatePreSearchApi({ name, json_value: JSON.stringify(param)})
    emits('refresh', name)
    state.visible = false
}
function handleOpen() {
    state.visible = true
    setTimeout(() => {
        FromRendererRef.value.vFormRenderRef.resetForm()
    })
}
defineExpose({ handleOpen })
</script>
<style lang="scss" scoped>

</style>
