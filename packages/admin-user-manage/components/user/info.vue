<template>
<el-card v-if="user">
    <template #header>
        <div class="flex-x-between">
            {{ $t('common_info') }}
            <el-button v-if="!isLdapMode" @click="openDialog">{{$t('user_updatePassword')}}</el-button>
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
    <UserPasswordDialog ref="UserPasswordDialogRef" :user="user"></UserPasswordDialog>
</el-card>
</template>


<script lang="ts" setup>
import { ElNotification, ElMessage } from 'element-plus'
import { GetUserDetailApi, PatchUserApi } from 'dp-api'
const props = defineProps<{
    user: object,
    isLdapMode: boolean,
}>()
const state = reactive({
    clearanceLevel: '',
    options: ['classified', 'confidential','normal']
})
async function updateMeta (value) {
    try {
        const res = await PatchUserApi({
            userId: props.user.userId,
            properties: {  clearanceLevel: value || null }
        })
        if (!!res) ElMessage.success('success')
    } catch (error) {
        // ElMessage.error('error')
    }
}
const UserPasswordDialogRef = ref()
function openDialog() {
    UserPasswordDialogRef.value.handleOpen()
}
watch(() => props.user, async(user) => {
    if(!user || !user.userId) return
    const res = await GetUserDetailApi(user.userId)
    state.clearanceLevel = res.properties.clearanceLevel
},{
    immediate:true
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