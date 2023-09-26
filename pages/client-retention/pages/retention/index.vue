<template>
<NuxtLayout class="fit-height withPadding">
    <el-tabs v-model="activeTab" class="tag-container grid-layout" @tab-change="tabChange">
        <el-tab-pane :label="$t('retention_done')" name="done">
            <RetentionDoneTable v-if="activeTab === 'done'" />
        </el-tab-pane>
        <el-tab-pane :label="$t('retention_pending')" name="pending">
            <RetentionPendingTable v-if="activeTab === 'pending'" />
        </el-tab-pane>
        <!-- <el-tab-pane :label="$t('retention_pendingApproval')" name="pendingApproval">
            <RetentionPendingApprovalTable v-if="activeTab === 'pendingApproval'" />
        </el-tab-pane>
         -->
    </el-tabs>
</NuxtLayout>
</template>


<script lang="ts" setup>
const route = useRoute()
const router = useRouter()
const state = reactive({
    activeTab: 'pending',
    loading: false
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
    if(!q.tab) q.tab = 'done'
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

      .el-tab-pane{
        height: 100%;
      }
    }
}
.tag-container {
  :deep {
    .el-tabs__content {
      height: 100%;
    }
  }
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
