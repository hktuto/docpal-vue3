<template>
<el-dialog v-model="state.visible" :title="$t('dpDocument_acl_addLocal')"
    close-on-click-modal="false"
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
import { getJsonApi, getUserListApi, getGroupListApi } from 'dp-api'
import { addACLApi } from 'dp-api/src/endpoint/admin-acl'
const props = defineProps<{
    doc: object,
    exitList: Array,
}>()
const emits = defineEmits([
    'refresh'
])
const state = reactive({
    loading: false,
    visible: false,

    userList: [],
    groupList: []
})
const FromRendererRef = ref()
const formJson = getJsonApi('adminAclForm.json')
async function handleSubmit () {
    const data = await FromRendererRef.value.vFormRenderRef.getFormData()
    const params = {
        idOrPath: props.doc.id,
        userId: data.userId,
        permission: data.permission
    }
    if(data.time === 'dateBase') {
        params.startDate = data.dateRange[0]
        params.endDate = data.dateRange[1]
    }
    state.loading = true
    await addACLApi(params)
    state.loading = false
    state.visible = false
    emits('refresh')
}
function handleOpen() {
    state.visible = true
    setTimeout(() => {
        handleOptions()
    })
}
function handleOptions () {
    const userIdRef = FromRendererRef.value.vFormRenderRef.getWidgetRef('userId')
    const options = [
        { value: 'user_groups', label: $i18n.t('user_groups'), options: groupListFilter() },
        { value: 'user_users', label: $i18n.t('user_users'), options: userListFilter() }
    ]
    userIdRef.loadOptions(options)
    function userListFilter() {
        return state.userList.filter((allItem:any) => 
              !props.exitList.some((exitItem:any) => exitItem.userId === allItem.userId))
    }
    function groupListFilter() {
        return state.groupList.filter((allItem:any) => 
              !props.exitList.some((exitItem:any) => exitItem.userId === allItem.id))
    }
}
onMounted(async() => {
    state.userList = await getUserListApi()
    state.userList.forEach(item => {
        item.value = item.userId
        item.label = item.username
    });
    state.groupList= await getGroupListApi()
    state.groupList.forEach(item => {
        item.value = item.id
        item.label = item.name
    });
})
defineExpose({ handleOpen })
</script>
<style lang="scss" scoped>

</style>
