<template>
    <div>
        <div>{{$t('upload')}}</div>
        <el-timeline>
             <el-timeline-item v-for="item in uploadStore.uploadState.uploadRequestList" :key="item.id"
                :timestamp="formatDate(item.startDate)" placement="top">
                {{item.count}}
                <el-tree ref="treeRef" :data="item.tree"
                    nodeKey="id" :expand-on-click-node="false">
                    <template #default="{ node, data }">
                        <div class="flex-x-between tree-item">
                            <span class="flex-x-start">
                                <BrowseItemIcon class="el-icon--left" :type="data.isFolder ? 'folder' : 'file'" />
                                {{data.name}}
                            </span>
                            <div>
                                <el-button :type="getType(data.status)" text
                                    :loading="data.status === 'loading'">
                                    {{ data.status === 'loading' ? '' : data.status || 'pending' }}
                                </el-button>
                            </div>
                        </div>
                    </template>
                </el-tree>
             </el-timeline-item>
        </el-timeline>
        
    </div>
</template>

<script lang="ts" setup>
import { useEventListener } from '@vueuse/core'
const props = defineProps<{
    drawerOpen: boolean
}>();
const uploadStore = useUploadStore()
function getType(status) {
    switch(status){
        case 'finish':
            return 'success'
        case 'skip':
            return 'info'
        case 'fail':
            return 'danger'
        default:
            return 'primary'
    }
}
</script>

<style lang="scss" scoped>
.tree-item {
    width: 100%;
    padding-right: var(--app-padding);
}
</style>
