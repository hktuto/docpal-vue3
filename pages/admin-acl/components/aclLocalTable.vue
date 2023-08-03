<template>
<div class="card">
    <div class="tableTopContainer">
        <h3>{{$t('Local')}}</h3>
        <el-button size="small" type="primary" round @click="handleAclLocalDialogShow" >{{$t('Add')}}</el-button>
    </div>
    <div>
        <el-table :data="tableData" style="width: 100%">
            <el-table-column prop="userId" :label="$t('dpTable_name')"> </el-table-column>
            <el-table-column :label="$t('dpTable_validityPeriod')">
                <template #default="{ row }">
                    <div @dblclick="timeDialogOpen(row)">
                        {{!row.startDate && !row.endDate ? 'Permanent' : formatDate(row.startDate) + " ~ " + formatDate(row.endDate) }}
                    </div>
                </template>
            </el-table-column>
            <el-table-column v-for="item in ['read', 'write', 'manage', 'print']" :key="item"
                :label="$t(`permission.${item}`)" align="center" header-align="center">
                <template #default="{ row }">
                    <el-switch v-model="row[item]" :loading="row.loading"
                        @change="(value) => handlePermissionChange(value, item, row)"></el-switch>
                </template>
            </el-table-column>
            <el-table-column :label="$t('dpTable_actions')">
                <template #default="{ row }">
                    <el-button size="small" :loading="row.loading" @click="removeLocalAcl(row)">{{$t('dpButtom_remove')}}</el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
    <AclAddDialog ref="AclAddDialogRef" :doc="doc" :exit-list="tableData"
        @refresh="emits('refresh')"></AclAddDialog>
    <AclEditTimeDialog ref="AclEditTimeDialogRef" :doc="doc"
        @refresh="emits('refresh')"></AclEditTimeDialog>
</div>
</template>
<script lang="ts" setup>
import { ElMessage, ElMessageBox } from 'element-plus'
import { addACLApi, removeACLApi, replaceACLApi } from 'dp-api/src/endpoint/admin-acl'
import { CheckShareInternalApi } from 'dp-api'
const props = defineProps<{
    tableData: Array,
    doc: object
}>()
const emits = defineEmits([
    'refresh'
])

async function handlePermissionChange (open:boolean, permission: string, row: any) {
    try {
        row.loading = true
        let res: any
        if (!open && permission === 'print') res = await removeACLApi({ idOrPath: props.doc.id, userId: row.userId, permission: 'Print'})
        else if (open && permission === 'print') {
            const _data = {
                ...row,
                permission: 'Print',
                idOrPath: props.doc.id
            }
            res = await addACLApi(_data)
        }
        else if (open && !row.acePermission) {
            const _data = {
                ...row,
                permission: permissionRevert(open, permission),
                idOrPath: props.doc.id
            }
            res = await addACLApi(_data)
        }
        else {
            const _permission = permissionRevert(open,permission)
            if (!_permission) {
                const action = await removeLocalAcl(row)
                if(action === 'cancel') row.read = true
                row.loading = false
                return
                // res = await removeACLApi({ idOrPath: props.doc.id, userId: row.userId, permission: row.acePermission})
            } else {
                const _data:any = {
                    idOrPath: props.doc.id,
                    aceId: row.aceId,
                    permission: _permission,
                    userId: row.userId,
                }
                if (row.startDate) _data.startDate = row.startDate
                if (row.endDate) _data.endDate = row.endDate
                await replaceACLApi(_data)
            }
        }
        if (res && res.errorCode)  throw new Error(res.message || 'error');
    } catch (error) {
        // ElMessage.error(error.message || 'error')
    }
    setTimeout(async() => {
        row.loading = false
        emits('refresh')
    }, 500);
}
const AclAddDialogRef = ref()
function handleAclLocalDialogShow () {
    AclAddDialogRef.value.handleOpen()
}
const AclEditTimeDialogRef = ref()
function timeDialogOpen (row) {
    AclEditTimeDialogRef.value.handleOpen(row)
}
function permissionRevert (open: boolean, permission) {
    switch (permission) {
        case 'read':
            return open ? 'Read' : ''
        case 'write':
            return open ? 'ReadWrite' : 'Read'
        default:
            return open ? 'Everything' : 'ReadWrite'
    }
}
async function removeLocalAcl (row: any) {
    row.loading = true
    try {
        let msg = ''
        const isShareInternal = await CheckShareInternalApi({ documentId: props.doc.id, userId: row.userId })
        if(isShareInternal) msg += `<span class="color__danger">${$t('msg_isShareInternal')}</span>,`
        
        msg += `${$t('msg_confirmWhetherToDelete')}`
        const action = await ElMessageBox.confirm(msg , {
            dangerouslyUseHTMLString: true,
        })
        if(action !== 'confirm') throw new Error("cancel");
        await removeACLApi({ idOrPath: props.doc.id, userId: row.userId})
        emits('refresh')
    } catch (error) {
        return 'cancel'
    }
    row.loading = false
}
</script>
<style lang="scss" scoped>
.card {
    width: 100%;
    margin: 0 0 var(--app-padding) 0;
    box-shadow: var(--el-box-shadow-light);
    .tableTopContainer {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
}
</style>
