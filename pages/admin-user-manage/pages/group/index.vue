<template>
<NuxtLayout class="fit-height withPadding">
    <Table :columns="groupTableSetting.columns" :table-data="state._groupList"
        @row-dblclick="handleGroupDblclick">
        <template #preSortButton>
            <KeywordFilter :list="state.groupList" attr="name"
            @filter="handleGroupFilter"></KeywordFilter>
            <el-button class="el-icon--right button" type="primary"
                @click="handleGroupDialogShow()">{{$t('user_newGroup')}}</el-button>
            
        </template>
    </Table>
    <GroupDialog ref="GroupDialogRef" @refresh="getGroup"></GroupDialog>
</NuxtLayout>
</template>


<script lang="ts" setup>
// import { getLoggersApi, setLoggersApi } from 'dp-api/src/endpoint/admin-log'
import {
    GetGroupListApi,
    TABLE, defaultTableSetting
} from 'dp-api'
const state = reactive({
    groupList: [],
    _groupList: []
})
const router = useRouter()
const groupTableKey = TABLE.ADMIN_GROUP_MANAGE
const groupTableSetting = defaultTableSetting[groupTableKey]

function handleGroupDblclick (row) {
    router.push(`/group/detail?id=${row.id}`)
}
const GroupDialogRef = ref()
function handleGroupDialogShow() {
    GroupDialogRef.value.handleOpen()
}

function handleGroupFilter(data) {
    state._groupList = data
}

async function getGroup() {
    state.groupList = await GetGroupListApi(true)
    state._groupList = state.groupList
}
onMounted(async() => {
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
