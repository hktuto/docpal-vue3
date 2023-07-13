<template>
<NuxtLayout class="fit-height withPadding">

    <div class="buttons--absolute">
        <el-button v-if="activeTab !== 'adhocTask'" class="el-icon--left" type="info" @click="handleDownload">{{$t('export')}}</el-button>
        <WorkflowPopoverPersonal />
        <WorkflowPopoverNewTask @created="tabChange(activeTab)"/>
    </div>
    <el-tabs v-model="activeTab" class="tag-container grid-layout" @tab-change="tabChange">
        <el-tab-pane :label="$t('workflow_allTask')" name="allTask">
            <WorkflowAllTask v-if="activeTab === 'allTask'" ref="WorkflowRef"/>
        </el-tab-pane>
        <el-tab-pane :label="$t('workflow_myTask')" name="myTask">
            <WorkflowMyTask v-if="activeTab === 'myTask'" ref="WorkflowRef"/>
        </el-tab-pane>
        <el-tab-pane :label="$t('workflow_completedTask')" name="completeTask">
            <WorkflowCompleteTask v-if="activeTab === 'completeTask'" ref="WorkflowRef"/>
        </el-tab-pane>
        <el-tab-pane :label="$t('workflow_ActiveTask')" name="activeTask">
            <WorkflowActiveTask v-if="activeTab === 'activeTask'" ref="WorkflowRef"/>
        </el-tab-pane>
        <el-tab-pane :label="$t('workflow_adhocTask')" name="adhocTask">
            <WorkflowAdhocTask v-if="activeTab === 'adhocTask'" ref="WorkflowRef"/>
        </el-tab-pane>
    </el-tabs>
    <WorkflowPopoverDownload ref="WorkflowPopoverDownloadRef"/>
</NuxtLayout>
</template>


<script lang="ts" setup>
import { exportProcessHistoryApi, exportTasksUserApi } from 'dp-api'
const route = useRoute()
const router = useRouter()
const state = reactive({
    activeTab: 'completeTask',
    loading: false
})
const { activeTab } = toRefs(state)
const WorkflowRef = ref()
function tabChange (tab) {
    const refreshList = ['allTask', 'myTask', 'activeTask']
    if(refreshList.includes(tab)) {
        const time = new Date().valueOf().toString()
        router.push({query: { tab, time }})
    } else {
        router.push({query: { tab }})
    }
}
const WorkflowPopoverDownloadRef = ref()

async function handleDownload () {
    const params = WorkflowRef.value.getDownloadParams()
    WorkflowPopoverDownloadRef.value.handleOpen(params)
}
watch(() => route.query, (q) => {
    if(!q.tab) q.tab = 'myTask'
    state.activeTab = q.tab
}, { immediate: true })
</script>

<style lang="scss" scoped>
.pageContainer {
  padding: calc(var(--app-padding) * 2 );
  position: relative;
  height: 100%;
}
.grid-layout {
    display: flex;
    flex-flow: column nowrap;
    width:100%;
    height: 100%;
    overflow: hidden;

    :deep {
      .el-tabs__content{
        flex: 1 0 auto;
      }
      .el-tab-pane{
        height: 100%;
      }
    }
}
.buttons--absolute {
    position: absolute;
    right: calc(var(--app-padding) * 2);
    top: calc(var(--app-padding) * 2);
    z-index: 2;
  @media  (max-width : 1024px) {
    top: initial;
    bottom: 0;
    left:0;
    width: 100%;
    margin-bottom: 8px;
    display: flex;
    justify-content: center
  }
}
.tag-container {
    :deep .el-tabs__nav-wrap:first {
        width: calc(100% - 338px);
        &::after {
            display: none;
        }
    }
    :deep .el-tabs__header:first {
        &::after {
            content: "";
            position: absolute;
            left: 0;
            bottom: 0;
            width: 100%;
            height: 2px;
            background-color: var(--el-border-color-light);
            z-index: var(--el-index-normal);
        }
    }
  @media  (max-width : 1024px) {
    padding-bottom : 40px;
  }
}

</style>
