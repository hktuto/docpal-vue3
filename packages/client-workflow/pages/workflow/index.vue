<template>
<NuxtLayout class="fit-height withPadding">
    <el-tabs v-model="activeTab" class="grid-layout" @tab-change="tabChange">
        <el-tab-pane :label="$t('workflow_allTask')" name="allTask">
            <div>allTask
                <WorkflowDetailDiscussionChannel/>
            </div>
        </el-tab-pane>
        <el-tab-pane :label="$t('workflow_myTask')" name="myTask">
            <div>myTask</div>
        </el-tab-pane>
        <el-tab-pane :label="$t('workflow_completedTask')" name="completeTask">
            <WorkflowCompleteTask></WorkflowCompleteTask>
        </el-tab-pane>
        <el-tab-pane :label="$t('workflow_ActiveTask')" name="ActiveTask">
            <div>ActiveTask</div>
        </el-tab-pane>
        <el-tab-pane :label="$t('workflow_adhocTask')" name="adhocTask">
            <div>adhocTask</div>
        </el-tab-pane>
    </el-tabs>
</NuxtLayout>
</template>


<script lang="ts" setup>
const route = useRoute()
const router = useRouter()
const state = reactive({
    activeTab: 'completeTask'
})
const { activeTab } = toRefs(state)
function tabChange (tab) {
    router.push({query: { tab }})
}
watch(() => route.query.tab, (newTab) => {
    state.activeTab = newTab
})
</script>

<style lang="scss" scoped>
.grid-layout {
    display: grid;
    grid-template-rows: min-content 1fr;
    height: 100%;
    overflow: hidden;
    :deep(.el-tab-pane) {
        height: 100%;
    }
}
</style>
