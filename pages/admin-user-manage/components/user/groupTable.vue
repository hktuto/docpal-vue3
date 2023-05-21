<template>
<el-card>
    <template #header>
        <div class="flex-x-between">
            <span>{{$t('user_groups')}}</span>
            <el-button class="button" type="primary"
                @click="handleGroupAddMemberFormShow()">{{$t('user_addGroups')}}</el-button>
        </div>
    </template>
    <!-- TODO slot item.isCanModified disabled actions -->
    <Table :columns="tableSetting.columns" :table-data="state.groupList"
        @row-dblclick="handleUserDblclick"
        @command="handleAction"></Table>
    <UserAddGroupDialog ref="UserAddGroupDialogRef" :user="user" @refresh="getMemberGroupList"></UserAddGroupDialog>
</el-card>
</template>


<script lang="ts" setup>
import { ElMessage, ElMessageBox } from 'element-plus'
// import { getLoggersApi, setLoggersApi } from 'dp-api/src/endpoint/admin-log'
import { 
    MemberGroupGetApi,
    MembershipDeleteApi,
    TABLE, defaultTableSetting
} from 'dp-api'
const props = defineProps<{
    user: obj
}>()
const state = reactive({
    groupList: [],
})
const router = useRouter()
const tableKey = TABLE.ADMIN_USER_GROUP_MANAGE
const tableSetting = defaultTableSetting[tableKey]

const UserAddGroupDialogRef = ref()
function handleGroupAddMemberFormShow() {
    UserAddGroupDialogRef.value.handleOpen(state.groupList)
}
async function getMemberGroupList() {
    state.groupList = await MemberGroupGetApi({
        userId: props.user.userId
    })
}
function handleUserDblclick () {}
function handleAction (command, row: any, index: number) {
    switch (command) {
      case 'delete':
        handleDelete(row)
        break
      default:
        break
    }
}
function handleDelete (row) {
    ElMessageBox.confirm(`${$i18n.t('msg_confirmWhetherToDelete')}`)
        .then(async() => {
            const res = await MembershipDeleteApi({
                groupId: row.id, 
                userId: props.user.userId 
            })
            getMemberGroupList()
        })
}
watch( () => props.user, async(newValue) => {
    if (newValue) getMemberGroupList()
},{
    immediate:true 
})
</script>

<style lang="scss" scoped>

</style>