<template>
<NuxtLayout class="fit-height withPadding">
    <Table :columns="userTableSetting.columns" :table-data="state.tableData"
        :options="state.options"
        v-loading="state.loading"
        headerClass="table-responsive-header"
        @command="handleAction"
        @pagination-change="handlePaginationChange"
        @row-dblclick="handleUserDblclick">
        <template #preSortButton>
            <FromRenderer ref="FromRendererRef" :form-json="formJson" @formChange="handleFormChange"/>
            <ResponsiveFilter ref="ResponsiveFilterRef" @form-change="handleFilterFormChange"
                @clear-filter="handleClearFilter"/>
        </template>  
        <template #suffixSortButton>
            <el-button class="el-icon--right" type="primary" 
                :disabled="state.activeUsers >= state.licenseUsers"
                @click="handleUserDialogShow()">{{$t('user_newUser')}} ({{ state.activeUsers }} / {{state.licenseUsers}})</el-button>
        </template>
        <template #group="{row, index}">
            <el-tag class="el-icon--left table-tag" v-for="item in row.groupDTOList">{{item.name}}</el-tag>
        </template>
        <template #active="{row, index}">
            <el-switch v-model="row.status" 
                active-value="A" inactive-value="D"
                :loading="row.loading" :disabled="row.loading"
                @change="(value) => handleSetStatus(value, row)" />
        </template>
    </Table>

    <UserDialog ref="UserDialogRef" @refresh="handlePaginationChange(1)"></UserDialog>
</NuxtLayout>
</template>


<script lang="ts" setup>
// import { getLoggersApi, setLoggersApi } from 'dp-api/src/endpoint/admin-log'
import {
    getConditionsApi,
    getAllUsersApi,
    SetUserStatusApi,
    getAllUserAndActiveCountApi,
    TABLE, defaultTableSetting,
    getJsonApi
} from 'dp-api'
// #region module: page
    const route = useRoute()
    const router = useRouter()
    const pageParams = {
        pageNum: 0,
        pageSize: 20
    }
    const userTableKey = TABLE.ADMIN_USER_MANAGE
    const userTableSetting = defaultTableSetting[userTableKey]
    const state = reactive<State>({
        ready: false,
        loading: false,
        tableData: [],
        options: {
            showPagination: true,
            paginationConfig: {
                total: 0,
                currentPage: 1,
                pageSize: pageParams.pageSize
            },
            rowKey: 'id',
            sortKey: userTableKey
        },
        activeUsers: 10,
        licenseUsers: 50,
        extraParams: {},
        extraParamsFilter: {}
    })
    async function getList (param) {
        state.loading = true
        try {
            const res = await getAllUsersApi({ ...param, ...state.extraParams, ...state.extraParamsFilter })
            if (!state.ready) getFilter()
            state.ready = true
            state.tableData = res.entryList
            state.options.paginationConfig.total = res.totalSize
            state.options.paginationConfig.pageSize = param.pageSize
            state.options.paginationConfig.currentPage = param.pageNum + 1
        } catch (error) {

        }

        state.loading = false
    }
    function handlePaginationChange (page: number, pageSize: number) {
        if(!pageSize) pageSize = pageParams.pageSize
        if(!page) page = pageParams.page
        const time = new Date().valueOf().toString()
        // scroll top
        router.push({
            query: { page, pageSize, time }
        })
    }
    watch(
        () => route.query,
        async (newval) => {
            const { page, pageSize } = newval
            nextTick(() => {
                pageParams.pageNum = (Number(page) - 1) || 0
                pageParams.pageSize = Number(pageSize) || pageParams.pageSize
                getList(pageParams)
            })
        },
        { immediate: true }
    )
// #endregion
// #region module: 
    const formJson = getJsonApi('admin/userSearch.json')
    function handleFormChange (data) {
        const extraParams = Object.keys(data.formModel).reduce((prev,key) => {
            if(data.formModel[key] && data.formModel[key].length > 0) prev[key] = data.formModel[key]
            return prev
        }, {})
        state.extraParams = extraParams
        handlePaginationChange(1)
    }
    const ResponsiveFilterRef = ref()
    async function getFilter() {
        // const data = [
        //     { label: 'group', key: 'groupIdList', options: [] },
        //     { label: 'active', key: 'status', options: [
        //         {label: 'active', value: 'A'},
        //         {label: 'deActive', value: 'D'}
        //     ]}
        // ]
        const data = await getConditionsApi()
        ResponsiveFilterRef.value.init(data)
    }
    function handleFilterFormChange(formModel, filedData) {
        state.extraParamsFilter = formModel
        handlePaginationChange(1)
    }
// #endregion
// #region module:
    
// #endregion
function handleUserDblclick (row) {
    router.push(`/user/detail?id=${row.userId}`)
}
const UserDialogRef = ref()
function handleUserDialogShow() {
    UserDialogRef.value.handleOpen()
}
function handleAction (command, row: any, index: number) {
    switch (command) {
      case 'preview':
        handleUserDblclick(row)
        break
      default:
        break
    }
}
async function handleSetStatus (status, row) {
    if(status === row.value || !row.userId) return
    row.loading = true
    const res = await SetUserStatusApi(row)
    if (!res) {
        row.status = row.status = 'A' ? 'D' : 'A'
    } else {
        await getAllUserAndActiveCount()
    }
    row.loading = false
}
async function getAllUserAndActiveCount () {
    const { ActiveCount, licenseUserNum } = await getAllUserAndActiveCountApi()
    state.activeUsers = ActiveCount || 0
    state.licenseUsers = licenseUserNum || 0
}
onMounted(() => {
    getAllUserAndActiveCount()
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
:deep(.headerLeftExpand .el-form-item--default) {
    margin-bottom: 0;
}
.table-tag {
    margin-bottom: 5px
}
</style>
