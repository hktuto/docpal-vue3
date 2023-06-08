<template>
<NuxtLayout class="fit-height withPadding">
    <div class="buttons--absolute">
        <WorkflowPopoverPersonal />
        <WorkflowPopoverNewTask @created="tabChange(activeTab)"/>
    </div>
    <el-tabs v-model="activeTab" class="grid-layout" @tab-change="tabChange">
        <el-tab-pane :label="$t('workflow_allTask')" name="allTask">
            <WorkflowAllTask v-if="activeTab === 'allTask'"/>
        </el-tab-pane>
        <el-tab-pane :label="$t('workflow_myTask')" name="myTask">
            <WorkflowMyTask v-if="activeTab === 'myTask'"/>
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
    const refreshList = ['allTask', 'myTask', 'activeTask']
    if(refreshList.includes(tab)) {
        const time = new Date().valueOf().toString()
        router.push({query: { tab, time }})
    } else {
        router.push({query: { tab }})
    }
}
watch(() => route.query, (q) => {
    if(!q.tab) q.tab = 'myTask'
    state.activeTab = q.tab
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
