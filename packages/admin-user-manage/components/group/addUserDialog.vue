<template>
<el-dialog v-model="state.visible" :title="$t('user_addGroups')"
    close-on-click-modal="false"
    >
    <FromRenderer ref="FromRendererRef" :form-json="formJson" />
    <template #footer>
        <el-button :loading="state.loading" @click="handleSubmit">{{$t('common_submit')}}</el-button>
    </template>
</el-dialog>
</template>
<script lang="ts" setup>
import { getJsonApi, MembershipAddApi, getUserListApi } from 'dp-api'
const props = defineProps<{
    group: object,
}>()
const emits = defineEmits([
    'refresh'
])
const state = reactive({
    loading: false,
    visible: false,
    userList: []
})
const FromRendererRef = ref()
const formJson = getJsonApi('adminGroupUserForm.json')
async function handleSubmit () {
    const data = await FromRendererRef.value.vFormRenderRef.getFormData()
    state.loading = true
    const param = {
        userId: data.id,
        groupId: props.group.id,
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
async function handleOptions (exitList) {
    dpLog({exitList});
    if(!state.userList || state.userList.length === 0) state.userList = await getUserListApi()
    const idRef = FromRendererRef.value.vFormRenderRef.getWidgetRef('id')
    dpLog({idRef});
    
    const options = userListFilter()
    dpLog({options});
    
    idRef.loadOptions(options)
    function userListFilter() {
        return state.userList.reduce((prev, item) => {
            const index = exitList.findIndex(exitItem => exitItem.userId === item.userId)
            if (index === -1 && item.userId) {
                item.value = item.userId
                item.label = item.username
                prev.push(item)
            }
            return prev
        }, []);
    }
}
defineExpose({ handleOpen })
</script>
<style lang="scss" scoped>

</style>
