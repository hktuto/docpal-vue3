<template>
<el-card>
    <template #header>
        <div class="flex-x-between">
            <span>{{$t('user_users')}}</span>
            <el-button v-show="group && group.isCanModified" class="button" type="primary"
                @click="handleGroupAddMemberFormShow()">{{$t('user_addUser')}}</el-button>
        </div>
    </template>
    <!-- TODO slot item.isCanModified disabled actions -->
    <Table :columns="tableSetting.columns" :table-data="state.userList"
        @row-dblclick="handleUserDblclick"
        @command="handleAction"></Table>
    <GroupAddUserDialog ref="UserAddGroupDialogRef" :group="group" @refresh="getMemberGroupList"></GroupAddUserDialog>
</el-card>
</template>


<script lang="ts" setup>
import { ElMessage, ElMessageBox } from 'element-plus'
// import { getLoggersApi, setLoggersApi } from 'dp-api/src/endpoint/admin-log'
import { 
    GetMemberListApi,
    MembershipDeleteApi,
    TABLE, defaultTableSetting
} from 'dp-api'
const props = defineProps<{
    group: obj
}>()
const state = reactive({
    userList: [],
})
const router = useRouter()
const tableKey = TABLE.ADMIN_GROUP_USER_MANAGE
const tableSetting = defaultTableSetting[tableKey]

const UserAddGroupDialogRef = ref()
function handleGroupAddMemberFormShow() {
    UserAddGroupDialogRef.value.handleOpen(state.userList)
}
async function getMemberGroupList() {
    setTimeout(async() => {
        state.userList = await GetMemberListApi({
            groupName: props.group.id
        })
    })
}
function handleUserDblclick () {}
function handleAction (command, row: any, index: number) {
    switch (command) {
      case 'delete':
        if(!row.isCanModified) {
            ElMessage.warning($t('dpTip_cannotDelete'))
            return
        }
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
                userId: row.userId, 
                groupId: props.group.id 
            })
            getMemberGroupList()
        })
}
watch( () => props.group, async(newValue) => {
    if (newValue) getMemberGroupList()
},{
    immediate:true 
})
</script>

<style lang="scss" scoped>

</style>