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
import { getJsonApi, MembershipAddApi, GetGroupListApi } from 'dp-api'
const props = defineProps<{
    user: object,
}>()
const emits = defineEmits([
    'refresh'
])
const state = reactive({
    loading: false,
    visible: false,
    groupList: []
})
const FromRendererRef = ref()
const formJson = getJsonApi('admin-adminUserGroupForm.json')
async function handleSubmit () {
    const data = await FromRendererRef.value.vFormRenderRef.getFormData()
    state.loading = true
    const param = {
        groupId: data.id,
        userId: props.user.userId,
    }
    await MembershipAddApi(param)
    state.loading = false
    state.visible = false
    FromRendererRef.value.vFormRenderRef.resetForm()
    emits('refresh')
}
function handleOpen(exitList) {
    state.visible = true
    setTimeout(() => {
        handleOptions(exitList)
    })
}
function handleOptions (exitList) {
    const idRef = FromRendererRef.value.vFormRenderRef.getWidgetRef('id')
    const options = userListFilter()
    idRef.loadOptions(options)
    function userListFilter() {
        return state.groupList.reduce((prev, item) => {
            const index = exitList.findIndex(exitItem => exitItem.id === item.id)
            if (index === -1 && item.isCanModified) {
                item.value = item.id
                item.label = item.name
                prev.push(item)
            }
            return prev
        }, []);
    }
}
onMounted(async() => {
    state.groupList = await GetGroupListApi()
})
defineExpose({ handleOpen })
</script>
<style lang="scss" scoped>

</style>
