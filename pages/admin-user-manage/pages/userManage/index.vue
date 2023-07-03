<template>
    <NuxtLayout class="fit-height withPadding">
        <div class="main">
            <el-card>
                <template #header>
                    <div class="card-header">
                        <span>{{$t('user_users')}}</span>
                        <el-button class="button" type="primary"
                            @click="handleUserDialogShow()">{{$t('user_newUser')}}</el-button>
                    </div>
                    <KeywordFilter :list="state.userList" attr="username"
                        @filter="handleUserFilter"></KeywordFilter>
                </template>
                <Table :columns="userTableSetting.columns" :table-data="state._userList"
                    @row-dblclick="handleUserDblclick"></Table>
            </el-card>
            <el-card>
                <template #header>
                    <div class="card-header">
                        <span>{{$t('user_groups')}}</span>
                        <el-button class="button" type="primary"
                            @click="handleGroupDialogShow()">{{$t('user_newGroup')}}</el-button>
                    </div>
                    <KeywordFilter :list="state.groupList" attr="name"
                        @filter="handleGroupFilter"></KeywordFilter>
                </template>
                <Table :columns="groupTableSetting.columns" :table-data="state._groupList"
                    @row-dblclick="handleGroupDblclick"></Table>
            </el-card>
       </div>
       <UserDialog ref="UserDialogRef" @refresh="getUser"></UserDialog>
       <GroupDialog ref="GroupDialogRef" @refresh="getGroup"></GroupDialog>
    </NuxtLayout>
</template>


<script lang="ts" setup>
// import { getLoggersApi, setLoggersApi } from 'dp-api/src/endpoint/admin-log'
import {
    getUserListApi,
    GetGroupListApi,
    TABLE, defaultTableSetting
} from 'dp-api'
const state = reactive({
    userList: [],
    _userList: [],
    groupList: [],
    _groupList: []
})
const router = useRouter()
const userTableKey = TABLE.ADMIN_USER_MANAGE
const userTableSetting = defaultTableSetting[userTableKey]
const groupTableKey = TABLE.ADMIN_GROUP_MANAGE
const groupTableSetting = defaultTableSetting[groupTableKey]
function handleUserDblclick (row) {
    router.push(`/userManage/user?id=${row.userId}`)
}
function handleGroupDblclick (row) {
    router.push(`/userManage/group?id=${row.id}`)
}
const UserDialogRef = ref()
const GroupDialogRef = ref()
function handleUserDialogShow() {
    UserDialogRef.value.handleOpen()
}
function handleGroupDialogShow() {
    GroupDialogRef.value.handleOpen()
}
async function handleSubmit (shareInfo) {
}
function handleUserFilter(data) {
    state._userList = data
}
function handleGroupFilter(data) {
    state._groupList = data
}
async function getUser() {
    state.userList = await getUserListApi(true)
    state._userList = state.userList
}
async function getGroup() {
    state.groupList = await GetGroupListApi(true)
    state._groupList = state.groupList
}
onMounted(async() => {
    getUser()
    getGroup()
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
