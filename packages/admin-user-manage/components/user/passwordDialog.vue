<template>
<el-dialog v-model="state.visible" :title="$t('user_addGroups')"
    :close-on-click-modal="false"
    >
    <FromRenderer ref="FromRendererRef" :form-json="formJson" />
    <template #footer>
        <el-button :loading="state.loading" @click="handleSubmit">{{$t('common_submit')}}</el-button>
    </template>
</el-dialog>
</template>
<script lang="ts" setup>
import { getJsonApi, PatchUserPasswordApi } from 'dp-api'
const props = defineProps<{
    user: object,
}>()
const emits = defineEmits([
    'refresh'
])
const state = reactive({
    loading: false,
    visible: false
})
const FromRendererRef = ref()
const formJson = getJsonApi('admin/adminUserPassword.json')
async function handleSubmit () {
    const data = await FromRendererRef.value.vFormRenderRef.getFormData()
    state.loading = true
    const param = {
        password: data.password,
        userId: props.user.userId,
    }
    await PatchUserPasswordApi(param)
    state.loading = false
    state.visible = false
    FromRendererRef.value.vFormRenderRef.resetForm()
    emits('refresh')
}
function handleOpen(exitList) {
    state.visible = true
}
defineExpose({ handleOpen })
</script>
<style lang="scss" scoped>

</style>
