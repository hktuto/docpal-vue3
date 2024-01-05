<template>
<el-card v-if="user">
    <template #header>
        <div class="flex-x-between">
            {{ $t('common_info') }}
            <div class="flex-x-end" v-if="!isLdapMode">
                <SvgIcon class="el-icon--right" src="/icons/file/edit.svg" round
                    @click="handleEdit"></SvgIcon>
                <SvgIcon v-if="!isLdapMode" class="el-icon--right" src="/icons/password-change.svg" round
                    @click="openDialog"></SvgIcon>
                <SvgIcon class="el-icon--right" src="/icons/file/delete.svg" round
                    @click="handleDelete"></SvgIcon>
            </div>
        </div>
    </template>
    <div class="row">
        <div class="rowTitle">{{ $t('user_firstName') }}</div>
        <div class="rowValue" :title="user.firstName">{{ user.firstName }}</div>
    </div>
    <div class="row">
        <div class="rowTitle">{{ $t('user_lastName') }}</div>
        <div class="rowValue" :title="user.lastName">{{ user.lastName }}</div>
    </div>
    <div class="row">
        <div class="rowTitle">{{ $t('user_email') }}</div>
        <div class="rowValue" :title="user.email">{{ user.email }}</div>
    </div>
    <div class="row">
        <div class="rowTitle">{{ $t('user_company') }}</div>
        <div class="rowValue" :title="user.company">{{ user.company }}</div>
    </div>
    <div class="row">
        <div class="rowTitle">{{ $t('user_SecurityProperty') }}</div>
        <div class="rowValue" :title="state.clearanceLevel">
            <el-select v-model="state.clearanceLevel" clearable
                @change="updateMeta">
                <el-option v-for="item in state.options" :key="item" :label="item" :value="item"></el-option>
            </el-select>
        </div>
    </div>
    <div class="row">
        <div class="rowTitle">{{ $t('user_active') }}</div>
        <div class="rowValue">
            <el-switch v-model="user.status" 
                active-value="A" inactive-value="D"
                :loading="user.loading" :disabled="user.loading"
                @change="(value) => handleSetStatus(value, user)" />
        </div>
    </div>
    <UserEditDialog ref="UserEditDialogRef" :user="user" @refresh="emits('refresh')"></UserEditDialog>
    <UserPasswordDialog ref="UserPasswordDialogRef" :user="user"></UserPasswordDialog>
</el-card>
</template>


<script lang="ts" setup>
import { ElNotification, ElMessage, ElMessageBox } from 'element-plus'
import { GetUserDetailApi, PatchUserApi, SetUserStatusApi, DeleteUserApi } from 'dp-api'
const props = defineProps<{
    user: object,
    isLdapMode: boolean,
}>()
const emits = defineEmits([
    'refresh'
])
const state = reactive({
    ready: false,
    clearanceLevel: '',
    options: ['classified', 'confidential','normal']
})
const router = useRouter()
async function updateMeta (value) {
    try {
        const res = await PatchUserApi({
            // ...props.user,
            // userId: props.user.userId,
            // properties: {  ...props.user.properties, clearanceLevel: value || null }
            userId: props.user.userId,
            properties: {  clearanceLevel: value || null }
        })
        if (!!res) ElMessage.success('success')
    } catch (error) {
        emits('refresh')
        // ElMessage.error('error')
    }
}
async function handleDelete() {
    const action = await ElMessageBox.confirm(`${$i18n.t('msg_confirmWhetherToDelete')}`)
    if (action !== 'confirm') return
    const res = await DeleteUserApi({ userId: props.user.userId })
    if (!!res) router.push('/user')
}

const UserEditDialogRef = ref()
function handleEdit () {
    UserEditDialogRef.value.handleOpen()
}

const UserPasswordDialogRef = ref()
function openDialog() {
    UserPasswordDialogRef.value.handleOpen()
}
async function handleSetStatus (status, row) {
    row.loading = true
    row.properties = null
    const res = await SetUserStatusApi(row)
    if (!res) {
        row.status = row.status = 'A' ? 'D' : 'A'
    } else {
        // await getAllUserAndActiveCount()
    }
    row.loading = false
}
watch(() =>props.user, () => {
    if(props.user && props.user.properties) state.clearanceLevel = props.user.properties.clearanceLevel
}, {
    deep: true,
    immediate: true
})
</script>

<style lang="scss" scoped>
.row {
    display: grid;
    grid-template-columns: 8rem 1fr;
    gap: var(--app-padding);
    align-items: center;
    padding: 0.25rem 0;
    color: var(--color-grey-500);
    .rowTitle {
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
    }
    .rowValue {
        max-width: 200px;
        font-weight: bold;
        @extend .rowTitle;
    }
}
</style>