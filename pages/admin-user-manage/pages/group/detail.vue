<template>
    <NuxtLayout class="fit-height withPadding" backPath="/group">
       <div class="userDetailSection">
            <div class="list">
                <KeywordFilter :list="state.groupList" attr="name"
                        @filter="handleUserFilter"></KeywordFilter>
                <div class="list-group">
                    <template v-for="item in state._groupList" >
                        <!-- TODO 自动滚动 -->
                        <div v-if="item.id && item.name" :class="['group-item','cursorPointer', {'current': state.curGroup?.id === item.id}]" @click="handleTabClick(item)">
                            <span class="ellipsis" :title="item.name">{{item.name}}</span>
                        </div>
                    </template>
                </div>
                <el-button @click="handleGroupDialogShow">{{$t('user_newGroup')}}</el-button>
            </div>
            <div class="topArea" v-if="state.curGroup">
                <div class="flex-x-center">
                    {{state.curGroup.name}}
                    <SvgIcon v-show="state.curGroup.isCanModified" class="el-icon--right" src="/icons/file/edit.svg" round
                        @click="handleEdit"></SvgIcon>
                </div>
                <SvgIcon v-show="state.curGroup.isCanModified" src="/icons/file/delete.svg" round
                    @click="handleDelete"></SvgIcon>
            </div>
            <GroupUserTable class="group" :group="state.curGroup"></GroupUserTable>
            <UserVirtualFolder v-if="state.curGroup" class="virtualFolder" :userOrGroup="state.curGroup" mode="groupAllowList">virtualFolder</UserVirtualFolder>
        </div>
        <GroupDialog ref="GroupDialogRef" @refresh="getGroup(true)"></GroupDialog>
        <GroupEditDialog ref="GroupEditDialogRef" :group="state.curGroup" @refresh="handleEditRefresh"></GroupEditDialog>
    </NuxtLayout>
</template>


<script lang="ts" setup>
import { ElNotification, ElMessageBox } from 'element-plus'
import {
    GetGroupListApi,
    DeleteGroupApi,
    TABLE, defaultTableSetting
} from 'dp-api'
import { toRefs } from '@vueuse/core'
const { isLdapMode } = toRefs(useSetting())
// import { getLoggersApi, setLoggersApi } from 'dp-api/src/endpoint/admin-log'

const router = useRouter()
const route = useRoute()
const state = reactive({
    groupList: [],
    _groupList: [],
    curGroup: null
})
function handleTabClick (row) {
    router.push({query: { id: row.id }})
    state.curGroup = row
}
async function handleSubmit (shareInfo) {
}
const GroupDialogRef = ref()
function handleGroupDialogShow() {
    GroupDialogRef.value.handleOpen()
}
async function getGroup(refresh: boolean = false) {
    state.groupList = await GetGroupListApi(refresh)
    state._groupList = state.groupList
}
function handleUserFilter(data) {
    state._groupList = data
}
const GroupEditDialogRef = ref()
function handleEdit () {
    GroupEditDialogRef.value.handleOpen()
}
async function handleEditRefresh() {
    await getGroup(true)
    const queryId = route.query.id
    const group = state.groupList.find(item => item.id === queryId)
    handleTabClick(group)
}

function handleDelete() {
    ElMessageBox.confirm(`${$i18n.t('msg_confirmWhetherToDelete')}`)
        .then(async() => {
            const res = await DeleteGroupApi({ groupId: state.curGroup.id })
            await getGroup(true)
            if(state.groupList.length > 0) handleTabClick(state.groupList[0])
        })
}
onMounted(async() => {
    await getGroup()
    const queryId = route.query.id
    const group = state.groupList.find(item => item.id === queryId)
    handleTabClick(group)
})
</script>

<style lang="scss" scoped>

.userDetailSection{
  display : grid;
  grid-template-columns: minmax(min-content, 220px) 1fr minmax(min-content, 350px);
  grid-template-rows: min-content 1fr;
  gap: var(--app-padding);
  grid-template-areas:
    'list topArea topArea'
    'list group virtualFolder';
  height: 100%;
  overflow: hidden;
}
.list{
    display: grid;
    grid-template-rows: min-content 1fr min-content;
    grid-area: list;
    overflow: hidden;
    gap: var(--app-padding);
    &-group {
        overflow: auto;
    }
    .group-item {
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
