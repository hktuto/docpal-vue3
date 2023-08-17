<template>
<div>
    <el-dropdown v-if="doc.isFolder && (!doc.holdStatus || doc.holdStatus === 'R')">
        <SvgIcon class="hd-lock-img" src="/icons/file/lock.svg" round></SvgIcon>
        <template #dropdown>
            <el-dropdown-menu class="hd-list--menu">
                <el-dropdown-item v-for="item in state.holdList" 
                    :key="item.id"
                    @click="handleAdd(item)">
                    {{item.policyName}}
                </el-dropdown-item>
            </el-dropdown-menu>
        </template>
    </el-dropdown>
    
    <el-popover
        v-else-if="doc.holdStatus === 'P' || doc.holdStatus === 'L'"
        :visible="state.dVisible"
        placement="bottom"
        :width="250">   
        <div v-if="doc.holdDetail" v-click-outside="onClickOutside">
            <b>{{doc.holdDetail.removeProcessInstanceId ? $t('hp.pendingRemoveApproval') : $t('hp.pendingAddApproval')}}</b>
            <el-row :gutter="10">
                <el-col :span="10"><small>{{$t('tableHeader_applyDate')}}</small></el-col>
                <el-col :span="14">{{doc.holdStatus === 'P' ? formatDate(doc.holdDetail.createdDate) : formatDate(doc.holdDetail.removeDate)}}</el-col>
            </el-row>
            <el-row :gutter="10">
                <el-col :span="10"><small>{{$t('tableHeader_applyBy')}}</small></el-col>
                <el-col :span="14">{{doc.holdStatus === 'P' ? doc.holdDetail.applyBy : doc.holdDetail.removeBy}}</el-col>
            </el-row>
            <el-row :gutter="10">
                <el-col :span="10"><small>{{$t('tableHeader_applyReason')}}</small></el-col>
                <el-col :span="14" v-html="doc.holdStatus === 'P' ? doc.holdDetail.applyReason : doc.holdDetail.removeReason"></el-col>
            </el-row>
            <el-row :gutter="10" v-if="(doc.holdStatus === 'P' && userId !== doc.holdDetail.applyApprovedBy) || 
                (doc.holdStatus === 'L' && userId !== doc.holdDetail.removeApprovedBy)">
                <el-col :span="10"><small>{{$t('approvedBy')}}</small></el-col>
                <el-col :span="14">{{doc.holdStatus === 'P' ? doc.holdDetail.applyApprovedBy : doc.holdDetail.removeApprovedBy}}</el-col>
            </el-row>
            <template v-else>
                <el-button type="primary" size="small" :loading="state.loading" @click="handelAudit(true)">{{ $t('workflow_startAdhocWorkflow_approve') }}</el-button>
                <el-button type="danger" size="small" :loading="state.loading" @click="handelAudit(false)">{{ $t('workflow_startAdhocWorkflow_reject') }}</el-button>
            </template>
        </div>
        <template #reference>
            <SvgIcon class="hd-pending-approval-img" disabled :src="doc.holdDetail.removeProcessInstanceId ? '/icons/file/lock.svg' : '/icons/file/unlock.svg'" round
                @click="state.dVisible = !state.dVisible"
                ></SvgIcon>
        </template>
    </el-popover>
    <SvgIcon v-else-if="doc.holdStatus === 'A'" class="hd-unlock-img" src="/icons/file/unlock.svg" round 
        :content="$t('hp.removeHold')"
        @click="handleRemoveHold"></SvgIcon>
    
    <BrowseActionsHoldAddDialog ref="BrowseActionsHoldAddDialogRef" 
        @submit="addHold"
        @remove="removeHold"/>
</div>
</template>

<script lang="ts" setup>
import { ClickOutside as vClickOutside } from 'element-plus'
import { AddHoldApi,GetDocumentHoldApi, GetHoldPoliciesApi, SetDocumentHoldApi, DeleteHoldApi, deepCopy } from 'dp-api'
const status = ref('D')
const props = defineProps<{
    doc: any
}>()
const state = reactive({
    holdList: [],
    dVisible: false,
    loading: false
})
const userId:string = useUser().getUserId()
// #region module: status: R || ''
    const BrowseActionsHoldAddDialogRef = ref()
    function handleAdd(holdDetail) {
        holdDetail.operation = 'ADD'
        holdDetail.approvedBy = holdDetail.holdApprovalId
        if(!holdDetail.isHoldAuto) BrowseActionsHoldAddDialogRef.value.handleOpen(holdDetail)
        else addHold({ holdPolicyId: holdDetail.id })
    }
    async function addHold (params, cb?) {
        params.documentId = props.doc.id
        const res = await AddHoldApi(params)
        await refreshHold()
        if(cb) cb()
    }
// #endregion
// #region module: status: A
    function handleRemoveHold() {
        const holdDetail = state.holdList.find(item => item.id === props.doc.holdDetail.policyHoldId) 
        if(!holdDetail) return
        holdDetail.operation = 'REMOVE'
        holdDetail.isRemoveReasonReq = holdDetail.isRemoveReasonReq
        holdDetail.approvedBy = holdDetail.removeApprovalId
        if(!holdDetail.isRemoveAuto) BrowseActionsHoldAddDialogRef.value.handleOpen(holdDetail)
        else removeHold({})
    }
    async function removeHold (params?, cb?) {
        params.id = props.doc.holdDetail.id
        const res = await DeleteHoldApi(params)
        if(res) await refreshHold()
        if(cb) cb()
    }
// #endregion

// #region module: status: P/L
    function onClickOutside () {
        state.dVisible = false
    }
    async function handelAudit (approved: boolean) {
        state.loading = true
        const result = await SetDocumentHoldApi(props.doc.holdDetail.id, approved)
        if (result) await refreshHold()
        state.dVisible = false
        state.loading = false
    }
// #endregion
async function refreshHold () {
    const res = await GetDocumentHoldApi(props.doc.id)
    props.doc.holdStatus = res?.status || ''
    props.doc.holdDetail = res
}
async function getHoldPolicies () {
    state.holdList = await GetHoldPoliciesApi()
}

onMounted(() => {
    getHoldPolicies()
})
</script>
