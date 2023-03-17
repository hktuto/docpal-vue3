<template>
<NuxtLayout class="fit-height withPadding">
    <div class="buttons--absolute">
        <WorkflowPopoverNewTask />
    </div>
    <el-tabs v-model="activeTab" class="grid-layout" @tab-change="tabChange">
        <el-tab-pane :label="$t('workflow_allTask')" name="allTask">
            <div>allTask
            </div>
        </el-tab-pane>
        <el-tab-pane :label="$t('workflow_myTask')" name="myTask">
            <div>myTask</div>
        </el-tab-pane>
        <el-tab-pane :label="$t('workflow_completedTask')" name="completeTask">
            <WorkflowCompleteTask v-if="activeTab === 'completeTask'"/>
        </el-tab-pane>
        <el-tab-pane :label="$t('workflow_ActiveTask')" name="activeTask">
            <WorkflowActiveTask v-if="activeTab === 'activeTask'"/>
        </el-tab-pane>
        <el-tab-pane :label="$t('workflow_adhocTask')" name="adhocTask">
            <WorkflowAdhocTask v-if="activeTab === 'adhocTask'"/>
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
}, { immediate: true })
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
.buttons--absolute {
    position: absolute;
    right: calc(var(--app-padding) * 2);
    top: calc(var(--app-padding) * 2);
    z-index: 2;
}
</style>
