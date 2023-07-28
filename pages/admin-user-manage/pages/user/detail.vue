<template>
    <NuxtLayout class="fit-height withPadding" backPath="/user">
       <template v-if="state.curUser" #headerLeft>{{state.curUser.username}}</template>
       <div class="userDetailSection" v-if="state.curUser">
            <UserInfo class="info" :user="state.curUser" :isLdapMode="isLdapMode"
                @refresh="getUser"></UserInfo>
            <UserGroupTable class="group" :user="state.curUser">group</UserGroupTable>
            <!-- <UserVirtualFolder v-if="state.curUser" class="virtualFolder" :userOrGroup="state.curUser" mode="userAllowList">virtualFolder</UserVirtualFolder> -->
        </div>
    </NuxtLayout>
</template>


<script lang="ts" setup>
import { ElNotification, ElMessageBox } from 'element-plus'
import {
    GetUserDetailApi,
    TABLE, defaultTableSetting
} from 'dp-api'
import { toRefs } from '@vueuse/core'
const { isLdapMode } = toRefs(useSetting())
const router = useRouter()
const route = useRoute()
const state = reactive({
    curUser: null
})

async function getUser() {
    const userId = route.query.id
    state.curUser = await GetUserDetailApi(userId)
}
onMounted(async() => {
    getUser()
})
</script>

<style lang="scss" scoped>

.userDetailSection{
  display : grid;
  grid-template-columns: minmax(min-content, 450px) 1fr;
  grid-template-rows: min-content min-content 1fr;
  gap: var(--app-padding);
  grid-template-areas:
    'topArea topArea'
    'info group'
    'info group';
    // 'virtualFolder group';
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
  justify-content: flex-end;
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
