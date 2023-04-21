<template>
<el-card>
    <template #header>
        <div class="flex-x-between">
            {{ $t('admin_Virtual Folder') }}
            <SvgIcon src="/icons/add.svg" round
                @click="openDialog"></SvgIcon>
        </div>
    </template>
    <div class="flex-x-between item" v-for="(item, index) in state.selectedVList" :key="index">
        {{item.name}}
        <SvgIcon src="/icons/menu/trash.svg" round
                @click="handleDelete(item)"></SvgIcon>
    </div>
    <UserAddVirtualFolderDialog ref="AddVirtualFolderDialogRef" v-bind="props" 
        @refresh="handleAdd"></UserAddVirtualFolderDialog>
</el-card>
</template>


<script lang="ts" setup>
import { ElNotification, ElMessageBox } from 'element-plus'
import { GetVirtualfolderApi, saveAdminVirtualfolder, vMode } from 'dp-api'
const props = defineProps<{
    userOrGroup: object,
    mode: vMode,
}>()
const state = reactive({
    allVirtualFolder: [],
    selectedVList: [],
    selectableVList: []
})
function initSelectData() {
    const VList = state.allVirtualFolder
    state.selectedVList = []
    state.selectableVList = []
    const id = props.mode === 'userAllowList' ? props.userOrGroup.userId : props.userOrGroup.id
    VList.forEach(item => {
        // 如果userList || groupList存在id，selectedList添加以便显示，否则selectableList添加以便选择
        if(!!item[props.mode]) {
            const index = item[props.mode].findIndex((item) => item === id)
            if (index === -1) state.selectableVList.push(item)
            else state.selectedVList.push(item)
        }
    })
}
function handleAdd(row, usrId) {
    const selectableListIndex = state.selectableVList.findIndex((item) => item.id === row.id)
    const allListIndex = state.allVirtualFolder.findIndex((item) => item.id === row.id)
    state.selectedVList.push(row)
    state.selectableVList.splice(selectableListIndex, 1)
    state.allVirtualFolder[allListIndex][props.mode].push(usrId)
}
function handleDelete(row) {
    ElMessageBox.confirm(`${$i18n.t('msg_confirmWhetherToDelete')}`)
        .then(async() => {
            const _row = deepCopy(row)
            const id = props.mode === 'userAllowList' ? props.userOrGroup.userId : props.userOrGroup.id
            const userListIndex = _row[props.mode].findIndex((item) => item === id)
			_row[props.mode].splice(userListIndex, 1)
            const param = {
				id: row.id,
				type: 'deleteToUser',
				usr: id,
        		jsonValue: JSON.stringify(_row),
				userAllowList: _row.userAllowList,
				groupAllowList: _row.groupAllowList
			}
            const res = await saveAdminVirtualfolder(param)
            if(res.errorCode) return
            const selectedVListIndex = state.selectedVList.findIndex((item) => item.id === row.id)
            const allListIndex = state.allVirtualFolder.findIndex((item) => item.id === row.id)
            state.selectableVList.push(row)
            state.selectedVList.splice(selectedVListIndex, 1)
            state.allVirtualFolder[allListIndex][props.mode] = _row[props.mode]
        })
}
const AddVirtualFolderDialogRef = ref()
function openDialog () {
    AddVirtualFolderDialogRef.value.handleOpen(state.selectableVList)
}
onMounted(async () => {
    state.allVirtualFolder = await GetVirtualfolderApi()
    initSelectData()
}),
watch(() => props.userOrGroup.id, (_newValue) => {
    initSelectData()
})
</script>

<style lang="scss" scoped>
.item {
    padding: calc(var(--app-padding) / 2);
    &:hover {
        background-color: var(--el-menu-hover-bg-color);
    }
}
</style>