<template>
<NuxtLayout class="fit-height withPadding">
    <el-tabs v-model="activeTab" class="tag-container grid-layout" @tab-change="tabChange">
        <template v-for="item in state.tabList" :key="item.id">
            <el-tab-pane  
                :label="item.label" :name="item.id">
                <template v-if="item.id === activeTab">
                    <FolderCabinetTable @db-row-click="handleRowClick">
                        <template #suffixSortButton>
                            <el-button style="margin-bottom: 10px;" @click="handleNewItem(item)">{{$t('folderCabinet.newItem')}}</el-button>
                        </template>
                    </FolderCabinetTable>
                    <FolderCabinetTemplateMatchingResult />
                </template>
            </el-tab-pane>
        </template>
        
    </el-tabs>
    <FolderCabinetNewItemDialog ref="FolderCabinetNewItemDialogRef" />
</NuxtLayout>
</template>


<script lang="ts" setup>
import { GetCabinetLoginUserListApi } from 'dp-api'
const route = useRoute()
const router = useRouter()
const state = reactive({
    activeTab: '',
    loading: false,
    tabList: []
})
const { activeTab } = toRefs(state)
function tabChange (tab) {
    const time = new Date().valueOf().toString()
    router.push({query: { tab, time }})
}
const FolderCabinetNewItemDialogRef = ref()
function handleNewItem (activeSetting) {
    // const activeSetting = state.tabList.find(item => item.id === state.activeTab)
    FolderCabinetNewItemDialogRef.value.handleOpen(activeSetting)
}
function handleRowClick (row) {
    router.push({query: { ...route.query, id: row.id }})
}
watch(() => route.query, (q) => {
    if (q.tab) state.activeTab = q.tab
}, { immediate: true })
onMounted(async() => {
    state.tabList = await GetCabinetLoginUserListApi()
    if (!state.activeTab && state.tabList.length > 0) state.activeTab = state.tabList[0].id
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
.buttons--absolute {
    position: absolute;
    right: calc(var(--app-padding) * 2);
    top: calc(var(--app-padding) * 2);
    z-index: 2;
}
.tag-container {
    :deep .el-tab-pane {
        display: grid;
        grid-template-columns: 2fr 1fr;
        gap: var(--app-padding);
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
}
</style>
