<template>
<el-dialog v-model="state.visible" :title="state.setting?.isEdit ? $t('folderCabinet.edit') : $t('folderCabinet.create')"
    :close-on-click-modal="false" append-to-body
    >
    <FromRenderer ref="FromRendererRef" :form-json="formJson" />
    <template #footer>
        <el-button type="primary" :loading="state.loading" @click="handleSubmit">{{$t('common_submit')}}</el-button>
    </template>
</el-dialog>
</template>
<script lang="ts" setup>
import { getJsonApi, GetBreadcrumb, CreateCabinetTemplateApi, PatchCabinetTemplateApi } from 'dp-api'
const emits = defineEmits([
    'update'
])
const state = reactive({
    loading: false,
    visible: false,
    setting: null
})
const FromRendererRef = ref()
const formJson = getJsonApi('admin/folderCabinet.json')

async function handleSubmit() {
    const data = await FromRendererRef.value.vFormRenderRef.getFormData()
    const params = {
        ...data,
        folder: true
    }
    if(data.rootId && data.rootId.length > 0) params.rootId = data.rootId.pop()
    params.binds = data.binds.reduce((prev, item) => {
        const _bindItems = item.split(':')
        prev.push({
            type: _bindItems[0],
            bindId: _bindItems[1]
        })
        return prev
    }, [])
    try {
        state.loading = true
        if (params.isEdit) {
            params.id = state.setting.id
            await PatchCabinetTemplateApi(params)
        } else {
            await CreateCabinetTemplateApi(params)
        }
        FromRendererRef.value.vFormRenderRef.resetForm()
        state.visible = false
        emits('update')
    } catch (error) {
    }
    state.loading = false
}
function handleOpen(setting) {
    state.visible = true
    if(setting && setting.isEdit) {
        state.setting = setting
        setTimeout(async () => {
            state.loading = true
            const data = {
                ...setting,
                isEdit: true,
                binds: revertUserGroup(setting.binds),
                rootId: await getRootIds(setting.rootId)
            }
            await FromRendererRef.value.vFormRenderRef.setFormData(data)
            state.loading = false
        })
    }
}
async function getRootIds(idOrPath: string) {
    const data = await GetBreadcrumb(idOrPath)
    return data.map(item => (item.id))
}
function revertUserGroup (binds) {
    return binds.reduce((prev, item) => {
        prev.push(`${item.type}:${item.bindId}`)
        return prev
    }, [])
}
defineExpose({ handleOpen })
</script>
<style lang="scss" scoped>

</style>
