<template>
    <NuxtLayout class="fit-height withPadding" backPath="/userManage">
       <div class="userDetailSection">
            <div class="list">
                <UserFilter :list="state.userList" attr="username"
                        @filter="handleUserFilter"></UserFilter>
                <div class="list-user">
                    <template v-for="item in state._userList" >
                        <!-- TODO 自动滚动 -->
                        <div v-if="item.userId && item.username" :class="['user-item','cursorPointer', {'current': state.curUser?.userId === item.userId}]" @click="handleTabClick(item)">
                            <span class="ellipsis" :title="item.name">{{item.username}}</span>
                        </div>
                    </template>
                </div>
                <el-button @click="handleUserDialogShow">{{$t('user_newUser')}}</el-button>
            </div>
            <div class="topArea" v-if="state.curUser">
                <div class="flex-x-center">
                    {{state.curUser.username}}
                    <SvgIcon class="el-icon--right" src="/icons/file/edit.svg" round
                        @click="handleEdit"></SvgIcon>
                </div>
                <SvgIcon src="/icons/file/delete.svg" round
                    @click="handleDelete"></SvgIcon>
            </div>
            <UserInfo class="info" :user="state.curUser" :isLdapMode="isLdapMode"></UserInfo>
            <UserGroupTable class="group" :user="state.curUser">group</UserGroupTable>
            <UserVirtualFolder v-if="state.curUser" class="virtualFolder" :userOrGroup="state.curUser" mode="userAllowList">virtualFolder</UserVirtualFolder>
        </div>
        <UserDialog ref="UserDialogRef" @refresh="getUser(true)"></UserDialog>
        <UserEditDialog ref="UserEditDialogRef" :user="state.curUser" @refresh="handleEditRefresh"></UserEditDialog>
    </NuxtLayout>
</template>


<script lang="ts" setup>
import { ElNotification, ElMessageBox } from 'element-plus'
import { 
    getUserListApi,
    DeleteUserApi,
    TABLE, defaultTableSetting
} from 'dp-api'
import { toRefs } from '@vueuse/core'
const { isLdapMode } = toRefs(useSetting())
// import { getLoggersApi, setLoggersApi } from 'dp-api/src/endpoint/admin-log'

const router = useRouter()
const route = useRoute()
const state = reactive({
    userList: [],
    _userList: [],
    curUser: null
})
function handleTabClick (row) {
    console.log(row, 'handleTabClick');
    
    router.push({query: { id: row.userId }})
    state.curUser = row
}
async function handleSubmit (shareInfo) {
}
const UserDialogRef = ref()
function handleUserDialogShow() {
    UserDialogRef.value.handleOpen()
}
async function getUser(refresh: boolean = false) {
    state.userList = await getUserListApi(refresh)
    state._userList = state.userList
}
function handleUserFilter(data) {
    state._userList = data
}
const UserEditDialogRef = ref()
function handleEdit () {
    UserEditDialogRef.value.handleOpen()
}
async function handleEditRefresh() {
    await getUser(true)
    const queryId = route.query.id
    const user = state.userList.find(item => item.userId === queryId)
    handleTabClick(user)
}

function handleDelete() {
    ElMessageBox.confirm(`${$i18n.t('msg_confirmWhetherToDelete')}`)
        .then(async() => {
            const res = await DeleteUserApi({ userId: state.curUser.userId })
            await getUser(true)
            if(state.userList.length > 0) handleTabClick(state.userList[0])
        })
}
onMounted(async() => {
    await getUser()
    const queryId = route.query.id
    const user = state.userList.find(item => item.userId === queryId)
    handleTabClick(user)
})
</script>

<style lang="scss" scoped>
.userDetailSection{
  padding: 0 1rem 1rem 1rem;
  display : grid;
  grid-template-columns: minmax(min-content, 220px) minmax(min-content, 350px) 1fr;
  grid-template-rows: min-content min-content 1fr;
  gap: var(--app-padding);
  grid-template-areas:
    'list topArea topArea'
    'list info group'
    'list virtualFolder group';
  height: 100%;
  overflow: hidden;
}
.list{
    display: grid;
    grid-template-rows: min-content 1fr min-content;
    grid-area: list;
    overflow: hidden;
    gap: var(--app-padding);
    &-user {
        overflow: auto;
    }
    .user-item {
        padding: var(--app-padding);
    }
    .current {
        background-color: var(--el-menu-active-color);
        color: var(--el-menu-text-color);
    }
}
.topArea{
  grid-area: topArea;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.info{
  grid-area: info;
}
.group{
  grid-area: group;
}
.virtualFolder{
  grid-area: virtualFolder;
}
:deep(.el-card) {
    display: grid;
    grid-template-rows: min-content 1fr;
    .el-card__body {
        overflow: hidden;
    }
}

</style>