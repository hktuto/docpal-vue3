<template>
<NuxtLayout class="fit-height withPadding">
    <Table :columns="userTableSetting.columns" :table-data="state._userList"
        @row-dblclick="handleUserDblclick">
        <template #preSortButton>
            <KeywordFilter :list="state.userList" attr="username"
                        @filter="handleUserFilter"></KeywordFilter>
            <el-button class="el-icon--right button" type="primary"
                @click="handleUserDialogShow()">{{$t('user_newUser')}}</el-button>
        </template>  
    </Table>

       <UserDialog ref="UserDialogRef" @refresh="getUser"></UserDialog>
</NuxtLayout>
</template>


<script lang="ts" setup>
// import { getLoggersApi, setLoggersApi } from 'dp-api/src/endpoint/admin-log'
import {
    getUserListApi,
    TABLE, defaultTableSetting
} from 'dp-api'
const state = reactive({
    userList: [],
    _userList: [],
})
const router = useRouter()
const userTableKey = TABLE.ADMIN_USER_MANAGE
const userTableSetting = defaultTableSetting[userTableKey]
function handleUserDblclick (row) {
    router.push(`/user/detail?id=${row.userId}`)
}
const UserDialogRef = ref()
function handleUserDialogShow() {
    UserDialogRef.value.handleOpen()
}
async function handleSubmit (shareInfo) {
}
function handleUserFilter(data) {
    state._userList = data
}
async function getUser() {
    state.userList = await getUserListApi(true)
    state._userList = state.userList
}
onMounted(async() => {
    getUser()
})
</script>

<style lang="scss" scoped>
.pageContainer{
  height: 100%;
  padding: calc( var(--app-padding) * 2);
  position: relative;
}
.main {
    height: 100%;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: calc(var(--app-padding) * 2);
    overflow: hidden;
}
:deep(.el-autocomplete) {
    width: 100%;
    margin: var(--app-padding) 0;
}
.el-card {
    display: grid;
    grid-template-rows: min-content 1fr;
    :deep(.el-card__body) {
        overflow: auto;
    }
    .card-header {
        display: flex;
        justify-content: space-between;
    }
}
</style>
