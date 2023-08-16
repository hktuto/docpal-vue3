<template>
<div class="infoSection vertical-top">
    <div class="infoTitle">
        {{ $t('workflow_holdPolicy') }}
    </div>
    <div class="infoContetn">
        <div class="block">
            <template v-if="state.canApproval">
                <el-button type="primary" size="mini" :loading="state.loading" @click="handelAudit('A')">{{ $t('workflow_startAdhocWorkflow_approve') }}</el-button>
                <el-button type="danger" size="mini" :loading="state.loading" @click="handelAudit('D')">{{ $t('workflow_startAdhocWorkflow_reject') }}</el-button>
            </template>
        </div>
        <small>
            44
        </small>
    </div>
</div> 

</template>

<script lang="ts" setup>
import { SetDocumentHoldApi }from 'dp-api'
import { ElMessage } from 'element-plus'
const props = defineProps<{ doc: any}>()
const userId:string = useUser().getUserId()
const state = reactive({
    loading: false,
    canApproval: false
})

// #region module: audit
    async function handelAudit (approved:'A' | 'D' | 'R') {
        state.loading = true
        const result = await SetDocumentHoldApi(props.doc.holdDetail.id, approved)
        state.loading = false
    }
// #endregion

watch(()=>props.doc, async(newValue) => {
    if(newValue.holdDetail && newValue.holdDetail.applyApprovedBy === userId) state.canApproval = true
    else state.canApproval = true
}, { immediate: true })

onMounted(() => {})
</script>